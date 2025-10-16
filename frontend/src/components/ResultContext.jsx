import React, { createContext, useContext, useState } from "react";

const ResultContext = createContext();

export const ResultProvider = ({ children }) => {
  const [results, setResults] = useState([]);

  const addResult = (result) => {
    setResults((prev) => [...prev, result]);
  };

  return (
    <ResultContext.Provider value={{ results, addResult }}>
      {children}
    </ResultContext.Provider>
  );
};

export const useResults = () => useContext(ResultContext);
