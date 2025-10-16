import React, { useState, useRef } from "react";
import { useResults } from "./ResultContext";

export default function TestPage() {
  const { results, setResults } = useResults();
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const videoRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => setVideoChunks(prev => [...prev, e.data]);
    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
      const blob = new Blob(videoChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const newResult = {
        id: results.length + 1,
        sign: "Hello", // replace with dynamic sign
        timestamp: new Date().toISOString(),
        videoBlob: blob,
        videoUrl: url,
        confidence: Math.random().toFixed(2) // simulate confidence
      };
      setResults([...results, newResult]);
      setVideoChunks([]);
    };
    setRecording(false);
    // stop camera stream
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
  };

  const handleRecordClick = () => {
    if (!recording) startRecording();
    else stopRecording();
  };

  return (
    <div>
      <h2>ASL Teacher - Test</h2>
      <video ref={videoRef} autoPlay muted style={{ width: "400px", border: "1px solid black" }} />
      <div>
        <p>Perform the sign: <strong>Hello</strong></p>
        <ul>
          <li>Hold your hand flat.</li>
          <li>Raise near forehead.</li>
          <li>Move outward with small wave.</li>
        </ul>
        <button onClick={handleRecordClick}>
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
    </div>
  );
}
