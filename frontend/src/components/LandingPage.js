import React from 'react';
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-gray-100 font-sans min-h-screen flex flex-col relative overflow-hidden">

      {/* Inline CSS for Styling */}
      <style>{`
        /* General Styles */
        body {
          margin: 0;
          padding: 0;
        }

        /* Background 3D Shapes */
        .background-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.7;
          animation: float 10s infinite ease-in-out alternate;
        }

        .shape:nth-child(1) {
          width: 200px;
          height: 200px;
          background: rgba(30, 144, 255, 0.6); /* Dodger Blue */
          top: 10%;
          left: 20%;
          animation-duration: 8s;
        }

        .shape:nth-child(2) {
          width: 150px;
          height: 150px;
          background: rgba(255, 69, 0, 0.6); /* Orange Red */
          top: 50%;
          left: 70%;
          animation-duration: 12s;
        }

        .shape:nth-child(3) {
          width: 250px;
          height: 250px;
          background: rgba(144, 238, 144, 0.6); /* Light Green */
          top: 80%;
          left: 10%;
          animation-duration: 15s;
        }

        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(-20px) rotate(360deg);
          }
        }

        /* App Name Styling */
        .app-name {
          font-size: 4rem;
          font-weight: bold;
          color: #007bff; /* Blue */
          text-shadow: 
            2px 2px 4px rgba(0, 0, 0, 0.3), 
            4px 4px 8px rgba(0, 0, 0, 0.2);
          text-align: center;
          margin-bottom: 20px;
        }

        /* Get Started Button */
        .get-started-button {
          display: inline-block;
          padding: 15px 30px;
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          background-color: #007bff; /* Blue background */
          text-decoration: none;
          border-radius: 10px;
          box-shadow: 
            0 8px 0 #0056b3, /* Darker shadow for 3D effect */
            0 12px 10px rgba(0, 0, 0, 0.2); /* Soft shadow for depth */
          transition: all 0.2s ease-in-out;
        }

        .get-started-button:hover {
          transform: translateY(4px); /* Move button up slightly on hover */
          box-shadow: 
            0 4px 0 #0056b3, /* Adjust shadow for hover state */
            0 8px 10px rgba(0, 0, 0, 0.2); /* Reduce shadow intensity */
        }

        .get-started-button:active {
          transform: translateY(8px); /* Push button down when clicked */
          box-shadow: 
            0 2px 0 #0056b3, /* Flatten the shadow */
            0 4px 5px rgba(0, 0, 0, 0.2); /* Reduce shadow further */
        }
      `}</style>

      {/* Background 3D Shapes */}
      <div className="background-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {/* Main Content: Centered App Name and Get Started Button */}
      <div className="flex-grow flex flex-col justify-center items-center text-center">
        <h1 className="app-name">MaintAI</h1>
        <Link to="/register" className="get-started-button">
          Get Started
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-2">
        <p>&copy; 2024 MaintAI. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default LandingPage;