"use client";
import React, { useState } from "react";
import Header from "@/components/ui/header";
import FrontPageButton from "@/components/ui/studentfrontpagebutton";
import PomodoroModal from "./components/pomodoro-modal";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Header text={"Welcome"}>
        <div className="flex">
          <div>
            <h1 className="">&nbsp;</h1>
            <h2 className="">Begin a study session</h2>
          </div>
          <div className="ml-auto flex">
            <FrontPageButton
              imageSource="/images/add-user.png"
              imageHeight={58}
              imageWidth={58}
              altText="add user button"
              link="student"
            />
            <FrontPageButton
              imageSource="/images/menu.png"
              imageHeight={58}
              imageWidth={58}
              altText="options menu"
              link="student"
            />
          </div>
        </div>
      </Header>

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
