from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os
import pymongo
from collections import defaultdict
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import StaleElementReferenceException
from selenium.webdriver.chrome.options import Options
import time

# Load .env
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Create Flask app
app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# Simple health check route
@app.route('/')
def home():
    return 'Backend is running!'

# AI endpoint
@app.route('/ask-ai', methods=['POST'])
def ask_ai():
    try:
        data = request.get_json()
        question = data.get('question')

        if not question:
            return jsonify({'error': 'No question provided'}), 400

        # Call Gemini
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(question)

        return jsonify({'answer': response.text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# to get vibes based on city and category
# MongoDB setup
# Connect MongoDB
client = pymongo.MongoClient(os.getenv("MONGO_URI"))
db = client["vibe_navigator"]
locations_col = db["reviews"]  # your collection name

#To Scrape the reviews and save them to MongoDB
@app.route('/scrape', methods=['POST'])
def scrape_reviews():
    try:
        data = request.get_json()
        city = data.get('city')
        category = data.get('category')

        if not city or not category:
            return jsonify({'error': 'City and category are required'}), 400

        # Delete ALL existing reviews from collection
        delete_result = locations_col.delete_many({})
        print(f"🗑️ Deleted ALL {delete_result.deleted_count} previous records from reviews collection")

        # Setup Selenium Chrome driver
        driver = webdriver.Chrome()
        driver.maximize_window()

        query = f"{category} in {city}"
        url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
        print(f"🔍 Opening {url}")
        driver.get(url)
        time.sleep(5)

        results = []

        # Fetch cards fresh each iteration to avoid stale element errors
        scraped_count = 0
        index = 0

        while scraped_count < 10:
            cards = driver.find_elements(By.CLASS_NAME, "Nv2PK")
            if index >= len(cards):
                print("⚠️ No more cards found.")
                break

            card = cards[index]

            try:
                name = card.find_element(By.CLASS_NAME, "qBF1Pd").text
                snippet = card.find_element(By.CLASS_NAME, "W4Efsd").text

                # Scroll element into view and click
                driver.execute_script("arguments[0].scrollIntoView(true);", card)
                time.sleep(1)
                card.click()
                time.sleep(3)

                # Scrape reviews
                reviews = []
                review_elements = driver.find_elements(By.CLASS_NAME, "wiI7pd")
                for r in review_elements[:3]:
                    reviews.append(r.text)

                place_data = {
                    "locationName": name,
                    "city": city,
                    "category": category,
                    "reviews": reviews
                }

                # Insert into MongoDB
                insert_result = locations_col.insert_one(place_data)

                # Add inserted_id to place_data as string if needed
                place_data["_id"] = str(insert_result.inserted_id)

                results.append(place_data)
                print(f"✅ Scraped & inserted: {name} | Reviews: {len(reviews)}")

                driver.back()
                time.sleep(3)
                scraped_count += 1
                index += 1

            except Exception as e:
                print(f"⚠️ Skipped place {index+1} due to error:", e)
                index += 1
                continue

        driver.quit()

        # return jsonify({
        #     "message": f"Scraping completed for {city} {category}.",
        #     "deleted": delete_result.deleted_count,
        #     "inserted": len(results),
        #     "data": results
        # }), 200
        return jsonify({
            "message": f"Scraping completed for {city} {category}.",
            "deleted": delete_result.deleted_count,
            "inserted": len(results),
            # ✅ Only return basic safe fields
            "data": [
                {
                    "locationName": p["locationName"],
                    "city": p["city"],
                    "category": p["category"],
                    "reviews": p["reviews"]
                }
                for p in results
           ]
        }), 200


    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to get vibes for city and category
# @app.route('/vibes', methods=['POST'])
# def get_vibes():
#     try:
#         data = request.get_json()
#         city = data.get('city')
#         category = data.get('category')
#         print(f"Received request for city: {city}, category: {category}")

#         if not city or not category:
#             return jsonify({'error': 'City and category are required'}), 400

#         # Fetch all matching locations from MongoDB
#         locations = list(locations_col.find({'city': city, 'category': category}))
#         print(f"Found {len(locations)} locations for city: {city}, category: {category}")

#         if not locations:
#             return jsonify({'message': f'No reviews found for {category} in {city}.'}), 200

#         # Group reviews by unique location name
#         location_dict = {}
#         for loc in locations:
#             loc_name = loc['locationName']
#             if loc_name not in location_dict:
#                 location_dict[loc_name] = []
#             location_dict[loc_name].extend(loc.get('reviews', []))

#         print(f"Unique locations found: {len(location_dict)}")

#         vibe_results = []
#         model = genai.GenerativeModel('gemini-1.5-flash')

#         for loc_name, reviews_list in location_dict.items():
#             if not reviews_list:
#                 continue  # skip if no reviews for this location

#             combined_reviews = " ".join(reviews_list)
#             prompt = f"""
# You are a vibe summariser AI. Return ONLY a raw JSON object (no markdown, no explanation) with:

# - "summary": a short vibe summary with emojis.
# - "tags": a list of up to 5 keywords describing the vibe (no hashtags).

# Example:
# {{
#   "summary": "Your short summary here",
#   "tags": ["tag1", "tag2", "tag3"]
# }}

# Reviews: {combined_reviews}
# """

#             response = model.generate_content(prompt)

#             # Debug raw response
#             print("Raw Gemini response:", response.text)

#             try:
#                 cleaned_text = response.text.strip()
#                 if cleaned_text.startswith("```"):
#                     cleaned_text = cleaned_text.split("```")[1].strip()
#                     if cleaned_text.startswith("json"):
#                         cleaned_text = cleaned_text[4:].strip()
#                 vibe_data = json.loads(cleaned_text)
#                 summary = vibe_data.get('summary', '')
#                 tags = vibe_data.get('tags', [])
#             except json.JSONDecodeError:
#                 summary = response.text  # fallback
#                 tags = []

#             vibe_results.append({
#                 "locationName": loc_name,
#                 "summary": summary,
#                 "tags": tags
#             })

#         if not vibe_results:
#             return jsonify({'message': f'No reviews found to generate vibes for {category} in {city}.'}), 200

#         return jsonify(vibe_results), 200

#     except Exception as e:
#         print("Error in /vibes route:", str(e))
#         return jsonify({'error': str(e)}), 500

@app.route('/vibes', methods=['POST'])
def get_vibes():
    try:
        data = request.get_json()
        city = data.get('city')
        category = data.get('category')
        print(f"Received request for city: {city}, category: {category}")

        if not city or not category:
            return jsonify({'error': 'City and category are required'}), 400

        # Fetch all matching locations from MongoDB
        locations = list(locations_col.find({'city': city, 'category': category}))
        print(f"Found {len(locations)} locations for city: {city}, category: {category}")

        if not locations:
            return jsonify({'message': f'No reviews found for {category} in {city}.'}), 200

        # Group reviews by unique location name
        location_dict = {}
        for loc in locations:
            loc_name = loc['locationName']
            if loc_name not in location_dict:
                location_dict[loc_name] = []
            location_dict[loc_name].extend(loc.get('reviews', []))

        print(f"Unique locations found: {len(location_dict)}")

        vibe_results = []
        model = genai.GenerativeModel('gemini-1.5-flash')

        for loc_name, reviews_list in location_dict.items():
            if not reviews_list:
                continue  # skip if no reviews for this location

            combined_reviews = " ".join(reviews_list)
            prompt = f"""
You are a vibe summariser AI. Return ONLY a raw JSON object (no markdown, no explanation) with:

- "summary": a short vibe summary with emojis.
- "tags": a list of up to 5 keywords describing the vibe (no hashtags).

Example:
{{
  "summary": "Your short summary here",
  "tags": ["tag1", "tag2", "tag3"]
}}

Reviews: {combined_reviews}
"""

            response = model.generate_content(prompt)
            print("Raw Gemini response:", response.text)

            try:
                cleaned_text = response.text.strip()
                if cleaned_text.startswith("```"):
                    cleaned_text = cleaned_text.split("```")[1].strip()
                    if cleaned_text.startswith("json"):
                        cleaned_text = cleaned_text[4:].strip()
                vibe_data = json.loads(cleaned_text)
                summary = vibe_data.get('summary', '')
                tags = vibe_data.get('tags', [])
            except json.JSONDecodeError:
                summary = response.text  # fallback if JSON parsing fails
                tags = []

            vibe_results.append({
                "locationName": loc_name,
                "summary": summary,
                "tags": tags
            })

        if not vibe_results:
            return jsonify({'message': f'No reviews found to generate vibes for {category} in {city}.'}), 200

        # ✅ Generate top recommended place using Gemini
        combined_place_summaries = "\n".join([
            f"{vibe['locationName']}: {vibe['summary']}" for vibe in vibe_results
        ])

        recommendation_prompt = f"""
You are a city vibe recommendation AI.

Based on the following place summaries for category '{category}' in city '{city}', identify:

1. The **single best recommended place** overall.
2. A short reason why it is the top recommended.

Return ONLY a raw JSON object with:

{{
  "top_place": "best place name",
  "reason": "short reason with emojis"
}}

Place Summaries:
{combined_place_summaries}
"""

        recommendation_response = model.generate_content(recommendation_prompt)
        print("Top Recommendation Gemini response:", recommendation_response.text)

        try:
            cleaned_rec_text = recommendation_response.text.strip()
            if cleaned_rec_text.startswith("```"):
                cleaned_rec_text = cleaned_rec_text.split("```")[1].strip()
                if cleaned_rec_text.startswith("json"):
                    cleaned_rec_text = cleaned_rec_text[4:].strip()
            rec_data = json.loads(cleaned_rec_text)
            top_place = rec_data.get('top_place', '')
            reason = rec_data.get('reason', '')
        except json.JSONDecodeError:
            top_place = ""
            reason = recommendation_response.text

        # ✅ Return both vibes and top recommendation
        return jsonify({
            "vibes": vibe_results,
            "top_recommendation": {
                "place": top_place,
                "reason": reason
            }
        }), 200

    except Exception as e:
        print("Error in /vibes route:", str(e))
        return jsonify({'error': str(e)}), 500




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
