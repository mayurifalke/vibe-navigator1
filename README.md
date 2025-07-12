# 🌟 Vibe Navigator
**Discover the vibe of cafes, parks, gyms, and social spots in your city — curated with real user reviews and AI magic.**


## 🚀 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [Team](#team)
- [License](#license)

---

## ✨ About

Vibe Navigator is an AI-powered web application that helps users **explore the real vibe of places in their city** by summarizing user-generated reviews from Google Maps and Reddit using Gemini AI.

This project was built for **[Hackathon name, eg. Smart India Hackathon 2025]** to demonstrate:

- Real-time data scraping  
- Generative AI summarization  
- Seamless full-stack integration

---

## 🌟 Features

✅ Search places by **city and category (cafe, park, gym, social spot)**  
✅ **Scrape live user reviews** from Google Maps  
✅ Generate **vibe summaries** and **tags** using Gemini AI  
✅ Display **Top Recommended Place** for each search  
✅ **Ask AI** personalized queries about any place or general questions  
✅ Responsive and modern UI with Tailwind CSS  
✅ MongoDB Atlas backend integration for scalable data storage

---

## 🛠️ Tech Stack

| Technology | Usage |
|--|--|
| **React.js** | Frontend SPA |
| **Flask (Python)** | Backend APIs |
| **Selenium** | Scraping reviews from Google Maps |
| **Gemini AI (Google Generative AI)** | Generating vibe summaries |
| **MongoDB Atlas** | Database for storing scraped reviews |
| **Render** | Deployment of frontend and backend |
| **Tailwind CSS** | Responsive UI design |

---

## ⚙️ Setup & Installation

 1. **Clone the repository**

```bash
git clone https://github.com/mayurifalke/vibe-navigator1.git
cd vibe_navigator1


2. **Backend Setup (Flask)**

🔹 Navigate to backend directory:
   cd backend
 
 Create and activate virtual environment:
    python -m venv venv
    source venv/bin/activate   # Linux/Mac
    venv\Scripts\activate      # Windows
  
 Install dependencies:
   bash
   Copy
   Edit
   pip install -r requirements.txt

Create .env file:
   ini
   Copy
   Edit
   GOOGLE_API_KEY=your_google_api_key
   MONGO_URI=your_mongodb_connection_string
   Run backend server:

   bash
   Copy
   Edit
   python main.py

3. **Frontend Setup (React)**
Navigate to frontend directory:
   bash
   Copy
   Edit
   cd frontend

 Install dependencies:
  bash
  Copy
  Edit
  npm install

Start React development server:
  bash
  Copy
  Edit
  npm run dev

🌐 **Deployment**
The project is deployed on Render and Vercel:

🔗 Live Frontend URL:- https://vibe-navigator1.vercel.app/
🔗 Live Backend API  https://vibe-navigator1.onrender.com/

Note: Scraping functionality requires Selenium with Chrome, which is not supported on Render free tier. Currently, scraping is 
tested locally and processed data is served from MongoDB Atlas.


🗂️ **Project Structure**
vibe_navigator/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md


💡 **Future Enhancements**
✅ Replace Selenium scraping with official Google Places API for deployment compatibility
✅ Add user authentication for personalized recommendations
✅ Integrate Google Maps embed for each place card
✅ Build an admin dashboard to manage scraped data and AI prompts
✅ Deploy scraper microservice on AWS EC2 for continuous data update

👥 **Team**
Name | 	Role | 	Contact
Mayuri Falke	| Full Stack Developer, AI Integrator | 	(https://www.linkedin.com/in/mayuri-falke-7890a1291/)



