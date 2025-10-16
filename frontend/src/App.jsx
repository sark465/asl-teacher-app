import React from "react";
import LearnPage from "./components/LearnPage";
import TestFlow from "./components/TestFlow";
import ResultsPage from "./components/ResultsPage";
import { ResultProvider } from "./components/ResultContext";
function App() {
  return (
    <ResultProvider>
      {/* rest of your app */}
    </ResultProvider>
  );
}

function AppInner() {
  const [view, setView] = React.useState("landing");

  return (
    <div className="app">
      <header>
        <h1>ASL Teacher</h1>
        <nav>
          <button onClick={() => setView("learn")}>Learn</button>
          <button onClick={() => setView("test")}>Test</button>
          <button onClick={() => setView("results")}>Results</button>
        </nav>
      </header>

      <main>
        {view === "landing" && (
          <div>
            <h2>Welcome — learn ASL with real-time feedback</h2>
            <button onClick={() => setView("learn")}>Start Learning</button>
          </div>
        )}
        {view === "learn" && <LearnPage />}
        {view === "test" && <TestFlow onComplete={() => setView("results")} />}
        {view === "results" && <ResultsPage />}
      </main>
    </div>
  );
}
