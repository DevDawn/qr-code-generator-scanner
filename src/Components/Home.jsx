import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";

const Home = () => {
  const [url, setUrl] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const qrCodeRef = useRef(null);

  const generateQRCode = () => {
    if (url.trim()) {
      setQrCodeValue(url);
    } else {
      alert("Please enter a valid URL.");
    }
  };

  const saveQRCode = () => {
    if (qrCodeRef.current) {
      toPng(qrCodeRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          const fileName = url.replace(/[^a-zA-Z0-9]/g, "_") || "qr-code"; // Sanitize filename
          link.href = dataUrl;
          link.download = `${fileName}.png`;
          link.click();
        })
        .catch((error) => {
          console.error("Error capturing QR code:", error);
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8">QR Code Generator</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
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
            <div
              id="qrCode"
              ref={qrCodeRef}
              className="p-2 border border-gray-300 rounded bg-white"
            >
              <QRCodeCanvas value={qrCodeValue} size={200} />
            </div>
            <button
              onClick={saveQRCode}
              className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Save QR Code as Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
