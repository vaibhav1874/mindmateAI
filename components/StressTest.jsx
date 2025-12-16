"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function StressTest() {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState("Detecting...");
  const [stress, setStress] = useState("Analyzing...");
  const [error, setError] = useState("");

  useEffect(() => {
    let stream;
    let interval;

    async function start() {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/model"),
          faceapi.nets.faceExpressionNet.loadFromUri("/model"),
        ]);

        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        interval = setInterval(detectEmotion, 2000);
      } catch (e) {
        console.error(e);
        setError("Camera or model load failed");
      }
    }

    start();

    return () => {
      if (interval) clearInterval(interval);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const detectEmotion = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detection) return;

    const expressions = detection.expressions;

    const topEmotion = Object.entries(expressions)
      .sort((a, b) => b[1] - a[1])[0][0];

    setEmotion(topEmotion);

    let stressLevel = "Low Stress 💚";

    if (["angry", "fearful", "sad"].includes(topEmotion)) {
      stressLevel = "High Stress ❤️";
    } else if (topEmotion === "neutral") {
      stressLevel = "Medium Stress 💛";
    }

    setStress(stressLevel);
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
      <h2 className="text-cyan-300 text-xl font-semibold">
        📷 Emotion Check-In — I’m watching gently 💙
      </h2>

      {error && (
        <p className="text-red-400 mt-2">{error}</p>
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        className="mt-4 w-full rounded-xl border border-slate-600"
      />

      <div className="mt-4 text-cyan-200">
        <p>Emotion detected: <b>{emotion}</b></p>
        <p>Stress level: <b>{stress}</b></p>
      </div>
    </div>
  );
}
