"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

import { useUserState } from "@/context/UserState";

export default function EmotionCamera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { emotion, setEmotion, stressLevel, setStressLevel } = useUserState();
  const [confidence, setConfidence] = useState(0);
  const [stressScore, setStressScore] = useState(0);

  useEffect(() => {
    let stream;
    let interval;

    async function start() {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        interval = setInterval(detectEmotion, 1500);
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
      .withFaceLandmarks()
      .withFaceExpressions();

    if (!detection) return;

    // Draw face detection box
    if (canvasRef.current) {
      const displaySize = { 
        width: videoRef.current.width || videoRef.current.videoWidth, 
        height: videoRef.current.height || videoRef.current.videoHeight 
      };
      faceapi.matchDimensions(canvasRef.current, displaySize);
      
      const resizedDetection = faceapi.resizeResults(detection, displaySize);
      canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetection);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetection);
    }

    const expressions = detection.expressions;
    const topEmotionEntry = Object.entries(expressions)
      .sort((a, b) => b[1] - a[1])[0];
    
    const topEmotion = topEmotionEntry[0];
    const confidenceValue = topEmotionEntry[1];
    
    setEmotion(topEmotion);
    setConfidence(Math.round(confidenceValue * 100));

    // Enhanced stress calculation algorithm
    let stress = "Low Stress";
    let score = 0;

    // Calculate stress score based on multiple factors
    if (topEmotion === "angry") {
      score = 90 + (confidenceValue * 10);
      stress = "High Stress";
    } else if (topEmotion === "fearful") {
      score = 85 + (confidenceValue * 10);
      stress = "High Stress";
    } else if (topEmotion === "sad") {
      score = 75 + (confidenceValue * 10);
      stress = "Moderate-High Stress";
    } else if (topEmotion === "disgusted") {
      score = 70 + (confidenceValue * 10);
      stress = "Moderate Stress";
    } else if (topEmotion === "surprised") {
      score = 50 + (confidenceValue * 10);
      stress = "Moderate Stress";
    } else if (topEmotion === "neutral") {
      score = 40 + (confidenceValue * 10);
      stress = "Low-Moderate Stress";
    } else if (topEmotion === "happy") {
      score = 20 - (confidenceValue * 10);
      stress = "Low Stress";
    }

    // Ensure score is between 0-100
    score = Math.min(100, Math.max(0, Math.round(score)));
    
    setStressScore(score);
    setStressLevel(stress);
  };

  // Get stress level color based on score
  const getStressColor = () => {
    if (stressScore < 30) return "text-green-400";
    if (stressScore < 60) return "text-yellow-400";
    if (stressScore < 80) return "text-orange-400";
    return "text-red-400";
  };

  // Get stress bar width based on score
  const getStressBarWidth = () => {
    return `${stressScore}%`;
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl relative">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="rounded-lg w-full"
        />
        <canvas 
          ref={canvasRef} 
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        />
      </div>

      <div className="mt-4 text-white space-y-2">
        <div>
          <p className="font-medium">Facial Expression Analysis</p>
          <div className="flex justify-between items-center mt-1">
            <span><b>Emotion:</b> {emotion || 'Detecting...'}</span>
            <span className="text-sm text-gray-400">Confidence: {confidence}%</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center">
            <span><b>Stress Level:</b> <span className={getStressColor()}>{stressLevel || 'Analyzing...'}</span></span>
            <span className="text-sm text-gray-400">Score: {stressScore}/100</span>
          </div>
          <div className="mt-1 w-full bg-slate-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getStressColor().replace('text-', 'bg-')}`} 
              style={{ width: getStressBarWidth() }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <button 
            onClick={() => alert('Breathing exercise started! Inhale for 4 seconds, hold for 4, exhale for 6.')}
            className="text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded transition"
          >
            🧘 Breathing Exercise
          </button>
          <button 
            onClick={() => alert('Stress tips: Take breaks, stay hydrated, and talk to someone you trust.')}
            className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-2 py-1 rounded transition"
          >
            💡 Stress Tips
          </button>
          <button 
            onClick={() => {
              setStressScore(0);
              setStressLevel('Low Stress');
              alert('Stress level reset!');
            }}
            className="text-xs bg-slate-600/50 hover:bg-slate-600/70 text-gray-300 px-2 py-1 rounded transition"
          >
            🔄 Reset
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Tip: Try to maintain a relaxed expression for better stress relief
        </div>
      </div>
    </div>
  );
}
