import React from "react";
import { useResults } from "./ResultContext";

export default function ResultsPage() {
  const { results } = useResults();

  if (results.length === 0) return <div>No results yet. Take a test first.</div>;

  const handleDownloadAll = () => {
    results.forEach((res, idx) => {
      const a = document.createElement("a");
      a.href = res.videoUrl;
      a.download = `sign_${idx + 1}_${res.sign}.webm`;
      a.click();
    });
  };

  return (
    <div>
      <h2>Results</h2>
      <button style={{ float: "right" }} onClick={handleDownloadAll}>
        Download All
      </button>
      <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Sign</th>
            <th>Timestamp</th>
            <th>Confidence</th>
            <th>Video</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {results.map(res => (
            <tr key={res.id}>
              <td>{res.sign}</td>
              <td>{res.timestamp}</td>
              <td>{res.confidence}</td>
              <td>
                <video src={res.videoUrl} controls width="200" />
              </td>
              <td>
                <button onClick={() => {
                  const a = document.createElement("a");
                  a.href = res.videoUrl;
                  a.download = `${res.sign}_${res.id}.webm`;
                  a.click();
                }}>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
