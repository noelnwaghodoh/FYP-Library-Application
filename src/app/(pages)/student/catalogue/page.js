"use client";
import Header from "@/components/ui/header";
import PageHeader from "@/components/ui/pageheader";
import SearchBar from "@/components/ui/searchbar";
import React, { useEffect, useState } from "react";
import FrontPageButton from "@/components/ui/studentfrontpagebutton";
export default function Page() {
  const [message, setMessage] = useState("Loading");

  useEffect(() => {
    fetch("http://localhost:8080/home")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessage(data[0].UserFirstName);
      });
  });

  return (
    <>
      <PageHeader title="Catalogue" />
      <main>
        <SearchBar />

        <div>
          <p>
            You can Enter your course details to use view your suggested reading
          </p>
          <p>{message}</p>
        </div>
      </main>
    </>
  );
}
