"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const PomodoroContext = createContext();

export function PomodoroProvider({ children }) {
  const [timerMode, setTimerMode] = useState("IDLE"); // 'IDLE' | 'WORK' | 'BREAK'
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);

  const [sessionMin, setSessionMin] = useState(0);
  const [breakMin, setBreakMin] = useState(0);
  const [totalSessions, setTotalSessions] = useState(1);
  const [currentSession, setCurrentSession] = useState(1);

  // Modal Alert logic
  const [showOverlayAlert, setShowOverlayAlert] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState("");

  const startTimer = (sessionMinutes, breakMinutes, sessionsStr) => {
    const sMin = parseInt(sessionMinutes) || 20;
    const bMin = parseInt(breakMinutes) || 5;
    const totals = parseInt(sessionsStr) || 4;

    setSessionMin(sMin);
    setBreakMin(bMin);
    setTotalSessions(totals);
    setCurrentSession(1);
    
    // Mathematically anchor End Time to Browser Memory
    const exactEndTime = Date.now() + (sMin * 60 * 1000);
    setTimeRemainingSeconds(sMin * 60);
    setTimerMode("WORK");
    
    localStorage.setItem("pomodoroState", JSON.stringify({
      timerMode: "WORK", sessionMin: sMin, breakMin: bMin,
      totalSessions: totals, currentSession: 1, endTime: exactEndTime
    }));
  };

  const stopTimer = () => {
    setTimerMode("IDLE");
    setTimeRemainingSeconds(0);
    setCurrentSession(1);
    localStorage.removeItem("pomodoroState"); // Wipe registry
  };

  // 1) Initialize from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("pomodoroState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const remainingTicks = Math.floor((parsed.endTime - Date.now()) / 1000);
        
        if (remainingTicks > 0) {
          // Perfectly resume as if we never left!
          setSessionMin(parsed.sessionMin);
          setBreakMin(parsed.breakMin);
          setTotalSessions(parsed.totalSessions);
          setCurrentSession(parsed.currentSession);
          setTimeRemainingSeconds(remainingTicks);
          setTimerMode(parsed.timerMode);
        } else {
          // The timer expired while they were logged out/closed tab over 20 mins ago
          localStorage.removeItem("pomodoroState");
        }
      } catch (e) {
        localStorage.removeItem("pomodoroState");
      }
    }
  }, []);

  // 2) State Machine Loop
  useEffect(() => {
    let interval = null;

    if (timerMode !== "IDLE" && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerMode === "WORK" && timeRemainingSeconds === 0) {
      clearInterval(interval);
      if (currentSession < totalSessions) {
        setOverlayMessage(`Session ${currentSession} complete! Time for a short break.`);
        setShowOverlayAlert(true);
        setTimerMode("BREAK");
        
        const newBreakSeconds = breakMin * 60;
        setTimeRemainingSeconds(newBreakSeconds);
        // Anchor new Break state to disk
        localStorage.setItem("pomodoroState", JSON.stringify({
          timerMode: "BREAK", sessionMin, breakMin, totalSessions, currentSession,
          endTime: Date.now() + (newBreakSeconds * 1000)
        }));
      } else {
        setOverlayMessage("All sessions complete! Great work today.");
        setShowOverlayAlert(true);
        setTimerMode("IDLE");
        localStorage.removeItem("pomodoroState");
      }
    } else if (timerMode === "BREAK" && timeRemainingSeconds === 0) {
      clearInterval(interval);
      const nextSession = currentSession + 1;
      setCurrentSession(nextSession);
      setOverlayMessage("Break is over! Let's get back to studying.");
      setShowOverlayAlert(true);
      setTimerMode("WORK");
      
      const newWorkSeconds = sessionMin * 60;
      setTimeRemainingSeconds(newWorkSeconds);
      // Anchor returning Work state to disk
      localStorage.setItem("pomodoroState", JSON.stringify({
        timerMode: "WORK", sessionMin, breakMin, totalSessions, currentSession: nextSession,
        endTime: Date.now() + (newWorkSeconds * 1000)
      }));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerMode, timeRemainingSeconds, currentSession, totalSessions, breakMin, sessionMin]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <PomodoroContext.Provider
      value={{
        isTimerActive: timerMode !== "IDLE",
        timerMode,
        currentSession,
        totalSessions,
        timeString: formatTime(timeRemainingSeconds),
        startTimer,
        stopTimer,
      }}
    >
      {/* Absolute Master Global Alert Overlay Rendered By Context */}
      {showOverlayAlert && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-white px-10 py-8 rounded shadow-xl flex flex-col items-center max-w-sm w-full outline outline-1 outline-gray-300">
            <h2 className="text-xl text-gray-800 font-semibold text-center mb-6">{overlayMessage}</h2>
            <button 
              onClick={() => setShowOverlayAlert(false)}
              className="bg-[#2ba5c7] hover:bg-[#238ca9] text-white text-md px-10 py-2 rounded-sm"
            >
              Okay
            </button>
          </div>
        </div>
      )}
      
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  return useContext(PomodoroContext);
}
