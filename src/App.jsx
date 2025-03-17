import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Components/Home";
import ScanQR from "./Components/ScanQR";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        {/* Navigation Bar */}
        <nav className="w-full bg-white shadow-md">
          <div className="max-w-2xl mx-auto p-4 flex justify-center space-x-6">
            <Link
              to="/"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Generate QR Code
            </Link>
            <Link
              to="/scan"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Scan QR Code
            </Link>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<ScanQR />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;