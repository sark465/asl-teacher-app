import React, { useRef } from "react";
import { useResults } from "./ResultContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ResultsPage = ({ user, onBack }) => {
  const { results } = useResults();
  const pageRef = useRef(null);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-center text-gray-700 text-lg">No results available.</p>
      </div>
    );
  }

  const correctSigns = results.attempts.filter(a => a.isCorrect).map(a => a.sign);
  const incorrectSigns = results.attempts.filter(a => !a.isCorrect).map(a => a.sign);

  const recommendations = incorrectSigns.length
    ? `Practice sign(s): "${incorrectSigns.join(", ")}". Review hand and finger positions carefully.`
    : "Excellent work! You mastered all signs 🎉";

  // Generate a unique test_id for this session
  const testId = `ASL_${String(Math.floor(Math.random() * 900 + 100))}`;

  // Download PDF function
  const downloadPDF = async () => {
    const canvas = await html2canvas(pageRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("ASL_Test_Results.pdf");
  };

  // Upload results to backend
  const uploadResults = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user,
          testId,
          totalScore: results.totalScore,
          totalSigns: results.totalSigns,
          percentage: results.percentage,
          attempts: results.attempts.map((a, i) => ({
            attemptId: i + 1,
            sign: a.sign,
            isCorrect: a.isCorrect,
            timestamp: a.timestamp,
          })),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Results uploaded successfully!");
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div
        ref={pageRef}
        className="relative bg-white shadow-2xl rounded-2xl p-8 w-full max-w-5xl"
      >
        {/* Top-right Buttons */}
        <div className="absolute top-4 right-4 flex gap-3">
          <button
            className="upload-button px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
            onClick={uploadResults}
          >
            ⬆ Upload
          </button>
          <button
            className="download-button px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
            onClick={downloadPDF}
          >
            ⬇ Download PDF
          </button>
          <button
            className="back-button px-4 py-2 bg-pink-500 text-white font-bold rounded hover:bg-pink-600 transition"
            onClick={onBack}
          >
            Back
          </button>
        </div>

        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-purple-700 mb-2">ASL Teacher</h1>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Test Results Summary</h2>

        {/* User Info */}
        <div className="mb-8 text-center space-y-1">
          <p className="text-gray-700"><strong>User:</strong> {user.username}</p>
          <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
          <p className="text-gray-700">
            <strong>Login Time:</strong> {user.loginTime ? new Date(user.loginTime).toLocaleString() : "N/A"}
          </p>
          <p className="text-gray-700"><strong>Test ID:</strong> {testId}</p>
        </div>

        {/* Score Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4 gap-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-700">✅ Correct Signs</h3>
            <p className="text-gray-600">{correctSigns.join(", ") || "None"}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-lg font-medium text-gray-700">
              <strong>Total Score:</strong> {results.totalScore} / {results.totalSigns}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>Percentage:</strong> {results.percentage.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Attempt Details */}
        <div className="mb-8">
          <h3 className="font-semibold text-xl text-gray-800 mb-3">Attempt Details</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
            <table className="min-w-full border-collapse">
              <thead className="bg-purple-100 text-gray-800">
                <tr>
                  <th className="px-4 py-2 border">Attempt ID</th>
                  <th className="px-4 py-2 border">Test ID</th>
                  <th className="px-4 py-2 border">Sign</th>
                  <th className="px-4 py-2 border">Correct</th>
                  <th className="px-4 py-2 border">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {results.attempts.map((a, i) => (
                  <tr key={i} className={`${a.isCorrect ? "bg-green-50" : "bg-red-50"} hover:bg-gray-100`}>
                    <td className="px-4 py-2 border text-center font-medium">{i + 1}</td>
                    <td className="px-4 py-2 border text-center font-medium">{testId}</td>
                    <td className="px-4 py-2 border text-center font-medium">{a.sign}</td>
                    <td className={`px-4 py-2 border text-center font-semibold ${a.isCorrect ? "text-green-700" : "text-red-600"}`}>
                      {a.isCorrect ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2 border text-center text-gray-700">
                      {new Date(a.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
          <h3 className="font-semibold text-lg text-purple-800 mb-2">Recommendations</h3>
          <p className="text-gray-700">{recommendations}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
