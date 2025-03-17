import React, { useState, useRef } from "react";
import jsQR from "jsqr";

const ScanQR = () => {
  const [scannedResult, setScannedResult] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        requestAnimationFrame(tick);
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });

    const tick = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setScannedResult(code.data);
        }
      }
      requestAnimationFrame(tick);
    };
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8">QR Code Scanner</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
        <video ref={videoRef} className="w-full mb-4 rounded" muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        <button
          onClick={scanQRCode}
          className="w-full bg-blue-500 text-white cursor-pointer p-2 rounded hover:bg-blue-600"
        >
          Start Scanning
        </button>
        {scannedResult && (
          <div className="mt-4">
            <p className="text-green-600">Scanned Result: {scannedResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQR;