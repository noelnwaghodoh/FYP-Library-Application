"use client";
import React from 'react';
import Image from "next/image";
import FrontPageButton from "./studentfrontpagebutton";
import { usePomodoro } from "@/context/pomodoro-context"; 
import { usePathname } from "next/navigation";

export default function Header(props) {
  // Hook the global layout to the background tick engine unconditionally
  const { isTimerActive, timerMode, currentSession, totalSessions, timeString } = usePomodoro();
  const pathname = usePathname();

  return (
    <header className={`text-white p-1 relative transition-colors duration-500 ${timerMode === 'BREAK' ? 'bg-[#5CB85C]' : 'bg-[#2596BE]'}`}>
      {/* Standard children mapping mapped behind the timer */}
      <div className="relative z-10 w-full">
        {props.children}
      </div>

      {/* Floating Timer exactly clamped into the center of the viewport header */}
      {isTimerActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <span className="text-[17px] font-medium tracking-wide drop-shadow-sm">
            {timerMode === "WORK" && `Time Left before break (Session ${currentSession}/${totalSessions}): ${timeString}`}
            {timerMode === "BREAK" && `Time Left of break: ${timeString}`}
          </span>
        </div>
      )}
    </header>
  );
}


