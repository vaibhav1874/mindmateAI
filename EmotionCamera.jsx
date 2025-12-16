"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

import { useUserState } from "@/context/UserState";

export default function EmotionCamera() {
  const videoRef = useRef(null);
  const { emotion, setEmotion, stressLevel, setStressLevel } = useUserState();

  useEffect(() => {
    let stream;
    let interval;

    async function start() {
      try {
        const MODEL_URL = "/model";
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        interval = setInterval(detectEmotion, 2000);
      } catch (e) {
        console.error(e);
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

    // Stress logic
    let stress = "Low Stress";

    if (["angry", "fearful", "sad"].includes(topEmotion)) {
      stress = "High Stress";
    } else if (topEmotion === "neutral") {
      stress = "Medium Stress";
    }

    setStressLevel(stress);
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="rounded-lg w-full"
      />

      <div className="mt-4 text-white">
        <p><b>Emotion:</b> {emotion || 'Detecting...'}</p>
        <p><b>Stress:</b> {stressLevel || 'Analyzing...'}</p>
      </div>
    </div>
  );
}
