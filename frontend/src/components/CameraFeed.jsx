import React, { useRef, useEffect } from "react";

export default function CameraFeed({ onVideoReady, mirrored = true }) {
  const videoRef = useRef(null);

  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        onVideoReady && onVideoReady(videoRef.current);
      } catch (err) {
        console.error("Camera error:", err);
        alert("Camera access is required. Check permissions.");
      }
    }
    initCamera();
    return () => {
      const s = videoRef.current?.srcObject;
      if (s) {
        s.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      style={{ transform: mirrored ? "scaleX(-1)" : "none" }}
      width="640"
      height="480"
      playsInline
      muted
    />
  );
}
