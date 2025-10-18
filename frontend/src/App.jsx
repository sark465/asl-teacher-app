import React from "react";
import LearnPage from "./components/LearnPage";
import TestFlow from "./components/TestFlow";
import ResultsPage from "./components/ResultsPage";
import Login from "./components/Login";
import { ResultProvider } from "./components/ResultContext";

function AppInner() {
  const [view, setView] = React.useState("login");
  const [history, setHistory] = React.useState([]);
  const [user, setUser] = React.useState(null);

  const changeView = (newView) => {
    setHistory((prev) => [...prev, view]);
    setView(newView);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const lastView = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setView(lastView);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setView("landing");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-400 via-pink-300 to-yellow-200">
      <header className="bg-white shadow-md py-4 relative">
        <>
          <h1 className="text-3xl font-bold text-center text-gray-800">ASL Teacher</h1>

          {view !== "login" && (
            <nav className="flex justify-center mt-2 space-x-4">
              <button
                onClick={() => changeView("learn")}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Learn
              </button>
              <button
                onClick={() => changeView("test")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Test
              </button>
              <button
                onClick={() => changeView("results")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Results
              </button>
            </nav>
          )}

          {view !== "login" && view !== "landing" && (
            <button onClick={goBack} className="back-button">
              Back
            </button>
          )}
        </>
      </header>


      <main className="flex-grow flex items-center justify-center">
        {view === "login" && <Login onLogin={handleLogin} />}
        {view === "landing" && (
          <div className="text-center bg-white bg-opacity-70 p-10 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Welcome, {user.username} — learn ASL with real-time feedback
            </h2>
            <p className="text-gray-700">
              Click the <strong>Learn</strong> button above to start learning.
            </p>
          </div>
        )}
        {view === "learn" && <LearnPage />}
        {view === "test" && <TestFlow onComplete={() => changeView("results")} />}
        {view === "results" && <ResultsPage user={user} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ResultProvider>
      <AppInner />
    </ResultProvider>
  );
}
