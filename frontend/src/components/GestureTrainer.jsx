import React, { useRef, useEffect } from "react";
import * as mpHands from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

const GestureTrainer = ({ onGestureDetected }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const hands = new mpHands.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      if (results.multiHandLandmarks) {
        onGestureDetected(results.multiHandLandmarks[0]);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => await hands.send({ image: videoRef.current }),
      width: 640,
      height: 480,
    });
    camera.start();
  }, []);

  return <video ref={videoRef} width="640" height="480" />;
};

export default GestureTrainer;
