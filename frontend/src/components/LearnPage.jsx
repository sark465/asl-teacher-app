import React, { useState } from "react";

// 10 ASL alphabet signs (A–J)
const signs = [
  { name: "A", description: "Make a fist with thumb alongside fingers.", image: "/images/a.jpg" },
  { name: "B", description: "Extend fingers upward, thumb across the palm.", image: "/images/b.jpg" },
  { name: "C", description: "Curve your hand into a 'C' shape.", image: "/images/c.jpg" },
  { name: "D", description: "Form a circle with thumb and middle finger; index finger points up.", image: "/images/d.jpg" },
  { name: "E", description: "Curl fingers down to touch thumb loosely.", image: "/images/e.jpg" },
  { name: "F", description: "Touch tip of thumb and index finger together, others extended.", image: "/images/f.jpg" },
  { name: "G", description: "Extend index finger and thumb parallel, palm facing side.", image: "/images/g.jpg" },
  { name: "H", description: "Extend index and middle finger together sideways.", image: "/images/h.jpg" },
  { name: "I", description: "Raise pinky finger, others folded in.", image: "/images/i.jpg" },
  { name: "J", description: "Draw a 'J' in the air with your pinky finger.", image: "/images/j.jpg" },
];

const LearnPage = () => {
  const [currentSign, setCurrentSign] = useState(signs[0]);

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Learn ASL Alphabet (A–J)</h2>

      <select
        className="border border-gray-400 rounded p-2 mb-4"
        onChange={(e) => setCurrentSign(signs[e.target.value])}
      >
        {signs.map((s, idx) => (
          <option key={idx} value={idx}>
            {s.name}
          </option>
        ))}
      </select>

      <div className="bg-white shadow-lg rounded-2xl p-4 w-[420px] text-center">
        <img
          src={currentSign.image}
          alt={currentSign.name}
          width="400"
          height="300"
          className="rounded-2xl mb-3 mx-auto"
          style={{ objectFit: "contain" }}
        />
        <h3 className="text-xl font-semibold text-gray-800">{currentSign.name}</h3>
        <p className="text-gray-600 mt-2">{currentSign.description}</p>
      </div>
    </div>
  );
};

export default LearnPage;
