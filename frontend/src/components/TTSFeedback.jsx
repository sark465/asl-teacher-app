import React from "react";

const TTSFeedback = ({ text }) => {
  const speak = (msg) => {
    const utterance = new SpeechSynthesisUtterance(msg);
    speechSynthesis.speak(utterance);
  };

  return <button onClick={() => speak(text)}>Listen</button>;
};

export default TTSFeedback;
