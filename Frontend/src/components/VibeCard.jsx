import React from 'react';
import { FaMapMarkerAlt } from "react-icons/fa";

// const VibeCard = ({ name, summary, emojis = [], tags = [], citations = [] }) => {
//   return (
//     <div className="bg-white rounded-lg shadow p-4 w-full">
//       <h2 className="text-xl font-bold mb-2">{name}</h2>
//       <p className="text-gray-700 mb-2">{summary}</p>

//       {emojis.length > 0 && (
//         <div className="flex space-x-2 mb-2">
//           {emojis.map((emoji, index) => (
//             <span key={index}>{emoji}</span>
//           ))}
//         </div>
//       )}

//       {tags.length > 0 && (
//         <div className="flex flex-wrap gap-2 mb-2">
//           {tags.map((tag, index) => (
//             <span
//               key={index}
//               className="bg-gray-200 px-2 py-1 rounded-full text-sm"
//             >
//               {tag}
//             </span>
//           ))}
//         </div>
//       )}

//       {citations.length > 0 && (
//         <div className="text-sm text-gray-500">
//           <strong>Citations:</strong>
//           <ul className="list-disc ml-4">
//             {citations.map((cite, index) => (
//               <li key={index}>{cite}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };


// Emoji extractor function (can be moved to a utils file if reused)
// const extractEmojis = (text) => {
//   const emojiRegex =
//     /([\u2700-\u27BF]|[\u1F300-\u1F6FF]|[\u1F900-\u1F9FF]|[\u1F1E6-\u1F1FF]{2}|[\u1F600-\u1F64F]|[\u2600-\u26FF])/g;
//   return text.match(emojiRegex) || [];
// };
const VibeCard = ({ name, summary, tags }) => {
  
  // const emojis = extractEmojis(summary);

  return (
  <div className="bg-white rounded-2xl shadow-xl p-6 m-4 w-full max-w-xs border border-purple-100 hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out">
  <div className="flex items-center mb-4">
    <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full p-3 mr-3 shadow-lg">
      <FaMapMarkerAlt size={20} />
    </div>
    <h2 className="text-xl font-bold text-gray-800">{name}</h2>
  </div>

  <p className="text-gray-700 mb-4 whitespace-pre-line">{summary}</p>
<div className="flex flex-wrap gap-2">
        {/* ✅ Only render emojis */}
        {/* {emojis.map((emoji, index) => (
          <span
            key={`emoji-${index}`}
            className="bg-gradient-to-r from-yellow-200 to-pink-200 text-purple-800 text-xs font-medium px-3 py-1 rounded-full shadow hover:scale-105 transition transform duration-200"
          >
            {emoji}
          </span>
        ))} */}

    {tags && tags.map((tag, index) => (
      <span
        key={index}
        className="bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 text-xs font-medium px-3 py-1 rounded-full shadow hover:scale-105 transition transform duration-200"
      >
        #{tag}
      </span>
    ))}
  </div>
</div>

  );
};


export default VibeCard;

