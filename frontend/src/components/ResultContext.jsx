import React, { createContext, useContext, useState } from "react";

const ResultContext = createContext();

export const ResultProvider = ({ children }) => {
  const [results, setResults] = useState(null);

  const saveResults = (data) => {
    setResults(data);
  };

  return (
    <ResultContext.Provider value={{ results, saveResults }}>
      {children}
    </ResultContext.Provider>
  );
};

export const useResults = () => useContext(ResultContext);
