import { useState } from "react";

const SIGNS = [
  { name: "Hello", description: "Wave hand near forehead outward" },
  { name: "Thank You", description: "Touch chin and move forward" },
];

export default function GestureTrainer() {
  const [results, setResults] = useState([]);

  const handleSaveResult = (signName, description) => {
    const newResult = {
      id: results.length + 1,
      sign: signName,
      description,
      timestamp: new Date().toLocaleString(),
    };
    setResults([...results, newResult]);
  };

  return (
    <div>
      <h2>ASL Teacher - Test</h2>

      {SIGNS.map((sign) => (
        <div key={sign.name}>
          <h3>{sign.name}</h3>
          <p>{sign.description}</p>
          <button onClick={() => handleSaveResult(sign.name, sign.description)}>
            Record Test
          </button>
        </div>
      ))}

      <div>
        <h3>Results:</h3>
        {results.length === 0 ? (
          <p>No results yet.</p>
        ) : (
          <ul>
            {results.map((res) => (
              <li key={res.id}>
                {res.sign}: {res.description} (Recorded at {res.timestamp})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
