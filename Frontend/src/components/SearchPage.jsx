import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import VibeCard from "../components/VibeCard";

const SearchPage = () => {
  const location = useLocation();
  const [vibes, setVibes] = useState([]);
  const [error, setError] = useState("");

  // Extract query params
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get("city");
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchVibes = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/vibes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city, category }),
        });

        const data = await res.json();
        console.log("Data received:", data);

        if (res.ok) {
          setVibes(data);
        } else {
          console.error("API Error:", data.error);
          setError(data.error || "Failed to fetch vibes");
        }
      } catch (error) {
        console.error("Error fetching vibes:", error);
        setError("Error connecting to server");
      }
    };

    if (city && category) {
      fetchVibes();
    }
  }, [city, category]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Search Results</h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <div className="flex flex-wrap justify-center">
        {vibes.length > 0 ? (
          vibes.map((vibe, index) => (
            <VibeCard
              key={index}
              name={vibe.locationName}
              summary={vibe.summary}
              emojis={vibe.emojis || ""}
              tags={vibe.tags || []}
              citations={vibe.citations || []}
            />
          ))
        ) : (
          !error && (
            <p className="text-gray-600">
              No vibes found for {category} in {city}.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default SearchPage;
