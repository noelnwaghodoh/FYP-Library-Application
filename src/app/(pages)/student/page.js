"use client";import { API_URL } from "@/config";

import PageHeader from "@/components/ui/pageheader";
import FrontPageButton from "@/components/ui/studentfrontpagebutton";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
export default function Page() {


   const [currentUser, setCurrentUser] = useState(null);
     useEffect(() => {
      // Ping your Express server to ask "who am I?" based on the session cookie
      axios.get(`${API_URL}/me`, { withCredentials: true })
        .then(res => {
         // console.log("THE DATA IS : ",res.data);
          setCurrentUser(res.data); // Now you have the user object!
        })
        .catch(err => console.log("Not logged in or session expired"));
     }, []);
  
   const title = currentUser ? `Welcome ${currentUser?.UserFirstName} ${currentUser?.UserLastName}` : "Welcome to the Library App";
  return (
    <main>
      <div>
        <PageHeader title={title} />

        <div className=" flex flex-row min-h-screen justify-center items-center">
          <FrontPageButton
            text="Take Notes"
            imageSource="/images/pen.png"
            imageHeight={150}
            imageWidth={150}
            altText="take notes"
            link="student/notes"
          />
          <FrontPageButton
            text="Read"
            imageSource="/images/open-book.png"
            imageHeight={150}
            imageWidth={150}
            altText="read"
            link="student/catalogue/discovery"
          />

          <FrontPageButton
            text="Study Session"
            imageSource="/images/user (1).png"
            imageHeight={150}
            imageWidth={150}
            altText="study session"
            link="student/study-session"
          />
        </div>
      </div>
    </main>
  );
}
