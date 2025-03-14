import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { QRCode } from "react-qr-code";
import html2canvas from "html2canvas";
import jsQR from "jsqr";

function Home() {
  const [url, setUrl] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");

  const generateQRCode = () => {
    if (url) {
      setQrCodeValue(url);
    } else {
      alert("Please enter a valid URL.");
    }
  };

  const saveQRCode = () => {
    const qrCodeElement = document.getElementById("qrCode");
    if (qrCodeElement) {
      html2canvas(qrCodeElement).then((canvas) => {
        const link = document.createElement("a");
        link.download = "qr-code.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">QR Code Generator</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Generate QR Code</h2>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={generateQRCode}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Generate QR Code
        </button>
        {qrCodeValue && (
          <div className="mt-4 flex flex-col items-center">
            <div id="qrCode" className="p-2 border border-gray-300 rounded">
              <QRCode value={qrCodeValue} size={200} />
            </div>
            <button
              onClick={saveQRCode}
              className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Save QR Code
            </button>
          </div>
        )}
      </div>
      <Link to="/scan" className="text-blue-500 hover:text-blue-700">
        Go to QR Code Scanner
      </Link>
    </div>
  );
}

function Scan() {
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">QR Code Scanner</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
        <video ref={videoRef} className="w-full mb-4 rounded" muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        <button
          onClick={scanQRCode}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Start Scanning
        </button>
        {scannedResult && (
          <div className="mt-4">
            <p className="text-green-600">Scanned Result: {scannedResult}</p>
          </div>
        )}
      </div>
      <Link to="/" className="text-blue-500 hover:text-blue-700 mt-4">
        Go to QR Code Generator
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
      </Routes>
    </Router>
  );
}

export default App;