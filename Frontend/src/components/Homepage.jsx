import React, { useState } from "react";
import VibeCard from "../components/VibeCard";

const HomePage = () => {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [vibes, setVibes] = useState([]);
  const [activeTab, setActiveTab] = useState("vibes");
  const [selectedTags, setSelectedTags] = useState([]);

  //   const handleSearch = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await fetch("http://127.0.0.1:5000/vibes", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ city, category }),
  //     });

  //     const data = await res.json();
  //     console.log("Vibes Data received:", data);

  //     if (Array.isArray(data)) {
  //       setVibes(data);      // ✅ set vibes cards if data is an array
  //       setAnswer("");       // clear any previous messages
  //     } else if (data.message) {
  //       setAnswer(data.message); // ✅ show fallback message from Flask
  //       setVibes([]);            // clear vibes cards if no data
  //     } else {
  //       setAnswer("No vibes found."); // generic fallback
  //       setVibes([]);
  //     }

  //   } catch (error) {
  //     console.error("Error fetching vibes:", error);
  //     setAnswer("Error fetching vibes. Please try again later.");
  //     setVibes([]);
  //   }
  // };
  const [topRecommendation, setTopRecommendation] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      // Step 1. Call /scrape route first
      const scrapeRes = await fetch("https://vibe-navigator1.onrender.com/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, category }),
      });

      const scrapeData = await scrapeRes.json();
      console.log("Scrape Data:", scrapeData);

      if (scrapeData.error) {
        setAnswer("Error scraping data: " + scrapeData.error);
        return;
      }

      // Optional: Show user message that scraping is done
      setAnswer(
        `Scraped ${scrapeData.data.length} places. Generating vibes...`
      );

      // Step 2. Now call /vibes route
      const vibesRes = await fetch("https://vibe-navigator1.onrender.com/vibes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, category }),
      });

      const vibesData = await vibesRes.json();
      console.log("Vibes Data received:", vibesData);

      if (Array.isArray(vibesData.vibes) && vibesData.vibes.length > 0) {
  setVibes(vibesData.vibes);
  setTopRecommendation(vibesData.top_recommendation || null);
  setAnswer("");
} else if (vibesData.message) {
  setAnswer(vibesData.message);
  setVibes([]);
  setTopRecommendation(null);
} else {
  setAnswer("No vibes found.");
  setVibes([]);
  setTopRecommendation(null);
}

    } catch (error) {
      console.error("Error in handleSearch:", error);
      setAnswer("An error occurred while fetching vibes.");
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("https://vibe-navigator1.onrender.com/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      const data = await res.json();

      if (data.answer) {
        setAnswer2(data.answer);
        setVibes([]);
      } else {
        setAnswer2("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error calling AI:", error);
      setAnswer2("Error connecting to AI service");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-start py-6 px-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 drop-shadow">
          🌟 Vibe Navigator
        </h1>
        <p className="text-gray-700 max-w-lg mx-auto text-lg">
          Discover the vibe of cafes, parks, and social spots, etc., in your city —
          curated with real user reviews and AI magic ✨
        </p>
      </div>

      {/* Accordion tabs */}
      <div className="w-full max-w-lg bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 mb-6">
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab("vibes")}
            className={`cursor-pointer flex-1 text-center py-2 font-semibold rounded-tl-2xl ${
              activeTab === "vibes"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                : "text-gray-700 hover:bg-gray-100 cursor-pointer"
            }`}
          >
            Get Vibes
          </button>
          <button
            onClick={() => setActiveTab("query")}
            className={`cursor-pointer flex-1 text-center py-2 font-semibold rounded-tr-2xl ${
              activeTab === "query"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Personalized Queries
          </button>
        </div>

        {/* Vibes Tab Content */}
        {activeTab === "vibes" && (
          <>
            <form onSubmit={handleSearch} className="p-6 space-y-6">
              <div>
                <label
                  className="block text-gray-700 font-medium mb-1 text-lg"
                  htmlFor="city"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-lg">
                  Select Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Aesthetic",
                    "Nature",
                    "Hygienic",
                    "Cozy",
                    "Family Friendly",
                    "Good",
                    "Super",
                    "great",
                    "Friendly",
                    "Nice",
                    "Best",
                    "Experience",
                  ].map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSelectedTags((prev) =>
                            isSelected
                              ? prev.filter((t) => t !== tag)
                              : [...prev, tag]
                          );
                        }}
                        className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border
    ${
      isSelected
        ? "bg-purple-500 text-white border-purple-500"
        : "bg-white text-gray-700 border-gray-300 hover:bg-purple-100"
    } transition`}
                      >
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="inline h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  className="block text-gray-700 font-medium mb-1 text-lg"
                  htmlFor="category"
                >
                  Category
                </label>
                {/* <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                >
                  <option value="">Select category</option>
                  <option value="cafe">Cafe</option>
                  <option value="park">Park</option>
                  <option value="gym">Gym</option>
                  <option value="social spot">Social Spot</option>
                  <option value="social spot">Social Spot</option>
                  <option value="social spot">Social Spot</option>
                  <option value="social spot">Social Spot</option>
                </select> */}
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter category like cafe, park, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition "
              >
                Search Vibes
              </button>
            </form>
          </>
        )}

        {/* Query Tab Content */}
        {activeTab === "query" && (
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-500 text-transparent bg-clip-text mb-2 flex items-center justify-center gap-2">
                🤖 Ask AI
              </h2>
              <p className="text-gray-700  italic text-lg">
                Type your personalized question below for instant insights and
                recommendations ✨
              </p>
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AI anything..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleQuery}
              className="cursor-pointer w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition"
            >
              Ask AI
            </button>
          </div>
        )}
      </div>

      {/* AI Response */}
      {answer && (
        <div className="mt-6 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg w-full max-w-md border border-white/40">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            AI Response:
          </h2>
          <p className="text-gray-700">{answer}</p>
        </div>
      )}

      {/* AI Response for Personalized Queries */}
      {answer2 && activeTab === "query" && (
        <div className="mt-6 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg w-full max-w-md border border-white/40">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            AI Response:
          </h2>
          <p className="text-gray-700">{answer2}</p>
        </div>
      )}
      {/* Vibe Cards */}
    {vibes.length > 0 && activeTab === "vibes" && (
  <div className="mt-10 w-full max-w-5xl">
    {topRecommendation && (
      <div className="mb-8 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-green-800">🌟 Top Recommended Place</h3>
        <p className="text-green-700">
          <span className="font-bold">{topRecommendation.place}</span>: {topRecommendation.reason}
        </p>
      </div>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vibes.map((vibe, index) => (
        <VibeCard
          key={index}
          name={vibe.locationName}
          summary={vibe.summary}
          tags={vibe.tags}
        />
      ))}
    </div>
  </div>
)}

    </div>
  );
};

export default HomePage;
