"use client";
import React, { useState } from "react";
import { usePomodoro } from "@/context/pomodoro-context"; 

export default function PomodoroModal({ isOpen, onClose }) {
  const [sessionLength, setSessionLength] = useState("20");
  const [breakLength, setBreakLength] = useState("5");
  const [totalSessions, setTotalSessions] = useState("4");
  
  // New State for defensive validation
  const [errorMsg, setErrorMsg] = useState("");
  
  // Expose the global control functions
  const { startTimer } = usePomodoro();

  if (!isOpen) return null;

  const handleBegin = (e) => {
    e.preventDefault();
    setErrorMsg(""); // Clear errors
    
    // Strict Input Validation: Verify they only contain numeric digits greater than 0
    const isNum = (val) => /^\d+$/.test(val) && parseInt(val, 10) > 0;

    if (!isNum(sessionLength) || !isNum(breakLength) || !isNum(totalSessions)) {
      setErrorMsg("Please enter strictly valid positive numbers.");
      return; 
    }
    
    // Jumpstart the global context background polling!
    startTimer(sessionLength, breakLength, totalSessions);
    
    // Drop the modal allowing the user to seamlessly use the rest of the application
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm p-4">
      
      {/* Background click to close defensively */}
      <div className="absolute inset-0 z-40" onClick={onClose}></div>

      {/* Main Form Box matching Wireframe completely */}
      <div className="relative z-50 bg-white border border-gray-400 w-full max-w-lg pt-10 pb-8 px-12 shadow-sm rounded-sm">
        
        <h2 className="text-[26px] font-medium text-black text-center mb-6">
          Start a Pomodoro Session
        </h2>

        {/* Dynamic Error Rendering */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-sm px-4 py-2 mb-6 rounded-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleBegin}>
          <div className="mb-6">
            <label className="block text-[#333333] text-sm mb-1.5">
              Pomodoro Session Length
            </label>
            <input
              type="text"
              value={sessionLength}
              onChange={(e) => setSessionLength(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-gray-600 transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#333333] text-sm mb-1.5">
              Break Length
            </label>
            <input
              type="text"
              value={breakLength}
              onChange={(e) => setBreakLength(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-gray-600 transition-colors"
            />
          </div>
          
          <div className="mb-10">
            <label className="block text-[#333333] text-sm mb-1.5">
              Total Sessions
            </label>
            <input
              type="text"
              value={totalSessions}
              onChange={(e) => setTotalSessions(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-gray-600 transition-colors"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#2ba5c7] hover:bg-[#238ca9] text-white text-[15px] font-medium px-16 py-2.5 transition-colors"
            >
              Begin
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
