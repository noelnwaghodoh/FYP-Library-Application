"use client";
import React, { useState } from "react";
import FrontPageButton from "@/components/ui/studentfrontpagebutton";
import PageHeader from "@/components/ui/pageheader";
import PomodoroModal from "./components/pomodoro-modal";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <PageHeader title="Begin a study session" backRoute="/student" />

      <div className=" flex flex-row min-h-screen justify-center items-center">
        {/* We explicitly strip the link routing mechanism out, dropping into pure interactive mode! */}
        <FrontPageButton
          text="Study Alone"
          handleClick={() => setIsModalOpen(true)}
          imageSource="/images/user (1).png"
          imageHeight={150}
          imageWidth={150}
          altText="Study Alone"
        />
        <FrontPageButton
          text="Study with Peers"
          imageSource="/images/people.png"
          imageHeight={203}
          imageWidth={203}
          altText="Study With Peers"
          link="student"
        />
      </div>

      <PomodoroModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
