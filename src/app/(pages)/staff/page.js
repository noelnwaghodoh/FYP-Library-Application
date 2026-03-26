"use client";
import PageHeader from "@/components/ui/pageheader";
import Header from "../../../components/ui/header";
import FrontPageButton from "../../../components/ui/studentfrontpagebutton";
import Image from "next/image";
import Form from "next/form";
import axios from "axios";
import { useState } from "react";

export default function Page() {
  const [values, setValues] = useState({
    bookTitle: "",
    bookAuthor: "",
    bookPublisher: "",
    bookContributors: "",
    bookIdentifier: "",
    bookReleaseDate: "",
    bookSubjects: "",
    bookDescription: "",
    bookEdition: "",
    bookFileName: "",
  });

  // Set the file name into
  const [file, setFile] = useState(null);

  function handleFileChange(e) {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setValues({
        ...values,
        bookFileName: e.target.files[0].name,
      });
    }
  }

  const handleBookSubmit = async (event) => {
    event.preventDefault();

    await axios
      .post("http://localhost:8080/catalogue", values)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    if (file) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const blob = new window.Blob([new Uint8Array(event.target.result)], {
          type: "application/epub+zip",
        });

        const query = { fileName: file.name, fileType: "application/epub+zip" };
        const params = new URLSearchParams();
        params.append("fileName", file.name);
        params.append("fileType", "application/epub+zip");

        const res = await fetch(`http://localhost:8080/upload?${params}`);
        console.log("http://localhost:8080/upload?${params}");
        const data = await res.json();
        console.log(data);
        console.log("uploading...");
        await fetch(data.signedUrl, {
          method: "PUT",
          body: blob,
        });
        await response.text();
        return response.ok;
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: [event.target.value],
    }));
    console.log(event.target.value);
  };
  return (
    <main>
      <p>{file ? file.name : "no file"} </p>
      <div>
        <PageHeader title="Welcome , Staff" />

        <Form onSubmit={handleBookSubmit}>
          <label className="block">Book Title</label>
          <input name="bookTitle" onChange={handleInput} />
          <label className="block">Book Author</label>
          <input name="bookAuthor" onChange={handleInput} />
          <label className="block">Book Publisher</label>
          <input name="bookPublisher" onChange={handleInput} />
          <label className="block">Book Contributors</label>
          <input name="bookContributors" onChange={handleInput} />
          <label className="block">Book Identifier(ISBN) </label>
          <input name="bookIdentifier" onChange={handleInput} />
          <label className="block">Release Date</label>
          <input name="bookReleaseDate" onChange={handleInput} />
          <label className="block">Book Subjects</label>
          <input name="bookSubjects" onChange={handleInput} />
          <label className="block">Book Edition</label>
          <input name="bookEdition" onChange={handleInput} />
          <label className="block">Book Description</label>
          <input name="bookDescription" onChange={handleInput} />
          <label className="block">Book Format</label>
          <input name="bookFormat" onChange={handleInput} />
          <label className="block">Book File</label>
          <input
            type="file"
            onChange={handleFileChange}
            name="bookFile"
          ></input>
          <button type="submit">Add a book</button>
        </Form>
      </div>
    </main>
  );
}
