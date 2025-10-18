import React, { useRef, useEffect, useState } from "react";
import { useResults } from "./ResultContext";
import TTSFeedback from "./TTSFeedback";

// ✅ List of signs
const signs = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

// ✅ Sign-specific instructions
const signInstructions = {
  A: "Make a fist with your thumb alongside your fingers. This is the sign for A. Please show it now.",
  B: "Hold your hand flat with fingers together and thumb across the palm. This is the sign for B. Please show it now.",
  C: "Curve your hand into the shape of the letter C. This is the sign for C. Please show it now.",
  D: "Hold your hand up, make a circle with thumb and middle finger, and raise your index finger. This is the sign for D. Please show it now.",
  E: "Curl your fingers down to touch your thumb lightly. This is the sign for E. Please show it now.",
  F: "Touch your thumb and index finger to form a small circle, with other fingers extended. This is the sign for F. Please show it now.",
  G: "Hold your index finger and thumb parallel, pointing sideways. This is the sign for G. Please show it now.",
  H: "Extend your index and middle fingers together, palm facing down. This is the sign for H. Please show it now.",
  I: "Raise your pinky finger, keeping all others closed. This is the sign for I. Please show it now.",
  J: "Draw the letter J in the air using your pinky finger. This is the sign for J. Please show it now.",
};

const TestFlow = ({ onComplete }) => {
  const videoRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [capturedFrame, setCapturedFrame] = useState(null);
  const { saveResults } = useResults();

  // 🎥 Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    };
    initCamera();
  }, []);

  // 🗣️ Automatically speak when sign changes
  useEffect(() => {
    const message = signInstructions[signs[currentIndex]];
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.cancel(); // stop any previous speech
    speechSynthesis.speak(utterance);
  }, [currentIndex]);

  // 📸 Auto capture every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      captureFrame();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = canvas.toDataURL("image/png");
    setCapturedFrame(frame);
  };

  const handleAttempt = (isCorrect) => {
    const attempt = {
      sign: signs[currentIndex],
      isCorrect,
      image: capturedFrame,
      timestamp: new Date().toISOString(),
    };

    const updatedAttempts = [...attempts, attempt];
    setAttempts(updatedAttempts);
    if (isCorrect) setScore((prev) => prev + 1);

    // 🎤 Speak feedback
    const feedbackMsg = isCorrect
      ? "Great job! You signed it correctly!"
      : "Try again! Adjust your hand position and make sure it's clear.";
    const feedbackUtterance = new SpeechSynthesisUtterance(feedbackMsg);
    feedbackUtterance.rate = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(feedbackUtterance);

    if (currentIndex + 1 < signs.length) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setCapturedFrame(null);
      }, 1500); // wait a bit before switching sign
    } else {
      const percentage = ((score + (isCorrect ? 1 : 0)) / signs.length) * 100;
      const resultData = {
        totalScore: score + (isCorrect ? 1 : 0),
        totalSigns: signs.length,
        percentage,
        attempts: updatedAttempts,
        testDate: new Date().toISOString(),
      };
      saveResults(resultData);
      onComplete();
    }
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">
        Show the sign for:{" "}
        <span className="text-purple-700">{signs[currentIndex]}</span>
      </h2>

      {/* 🎧 Listen Again Button */}
      <TTSFeedback text={signInstructions[signs[currentIndex]]} />

      {/* 📹 Video Section */}
      <div className="flex justify-center mb-8 mt-6">
        <video
          ref={videoRef}
          width="400"
          height="300"
          autoPlay
          playsInline
          className="rounded-lg shadow-lg border-4 border-pink-300"
        />
      </div>

      {/* 📸 Manual Capture Button */}
      <div className="mb-8">
        <button
          onClick={captureFrame}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-md hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all"
        >
          📸 Capture Frame
        </button>
      </div>

      {/* ✅ / ❌ Buttons */}
      <div className="flex justify-center space-x-10 mb-8">
        <button
          onClick={() => handleAttempt(true)}
          className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-full shadow-md hover:from-green-500 hover:to-green-700 transform hover:scale-105 transition-all"
        >
          ✅ Correct
        </button>
        <button
          onClick={() => handleAttempt(false)}
          className="px-8 py-3 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold rounded-full shadow-md hover:from-red-500 hover:to-red-700 transform hover:scale-105 transition-all"
        >
          ❌ Incorrect
        </button>
      </div>

      {/* 🖼️ Captured Frame Preview */}
      {capturedFrame && (
        <div className="mt-6">
          <p className="text-gray-700 font-medium mb-3">
            Captured Frame Preview:
          </p>
          <img
            src={capturedFrame}
            alt="captured"
            className="border-4 border-purple-400 rounded-lg shadow-md mx-auto"
            width="220"
          />
        </div>
      )}
    </div>
  );
};

export default TestFlow;
