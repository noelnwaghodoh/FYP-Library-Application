import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import Header from "../components/ui/header";

import { Link } from "react-router-dom";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "KU-Lib",
  description: "A library system for Kingston University",
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json'
};

function defHeader() {
  return (
    <header className="bg-slate-500 py-4">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between"></nav>
      </div>
    </header>
  );
}

import { PomodoroProvider } from "../context/pomodoro-context";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Safely  */}
        <PomodoroProvider>
          {children}
        </PomodoroProvider>
      </body>
    </html>
  );
}
