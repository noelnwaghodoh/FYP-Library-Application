"use client";
import React, { useState } from "react";
import { usePomodoro } from "@/context/pomodoro-context"; 
import { BaseModal } from "@/components/ui/modal";

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
    <BaseModal isOpen={isOpen} title="Start a Pomodoro Session" maxWidth="max-w-lg">
      
      <p className="text-[15px] text-gray-500 mb-6 leading-relaxed">
        The pomodoro technique involves taking shorter study sessions with breaks in between.
      </p>

      {/* Dynamic Error Rendering */}
      {errorMsg && (
        <div className="bg-red-50 text-red-600 border border-red-200 text-sm px-4 py-2 mb-6 rounded-sm text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleBegin} className="flex flex-col mt-2">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pomodoro Session Length (minutes)
          </label>
          <input
            type="text"
            value={sessionLength}
            onChange={(e) => setSessionLength(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2ba5c7] focus:border-transparent transition-all text-gray-800"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Break Length (minutes)
          </label>
          <input
            type="text"
            value={breakLength}
            onChange={(e) => setBreakLength(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2ba5c7] focus:border-transparent transition-all text-gray-800"
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Total Sessions
          </label>
          <input
            type="text"
            value={totalSessions}
            onChange={(e) => setTotalSessions(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2ba5c7] focus:border-transparent transition-all text-gray-800"
          />
        </div>

        <div className="mt-2 flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-bold text-white bg-[#2ba5c7] rounded-md hover:bg-[#228b9e] transition-colors shadow-sm"
          >
            Begin
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
