"use client";
import PageHeader from "@/components/ui/pageheader";
import Header from "../../../components/ui/header";
import FrontPageButton from "../../../components/ui/studentfrontpagebutton";
import Image from "next/image";
import Form from "next/form";
import axios from "axios";
import { useState } from "react";
import { Familjen_Grotesk } from "next/font/google";

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
  const [errorMsg, setErrorMsg] = useState("");

  const [thumbnail, setThumnnail] = useState(null);
  console.log(values.bookFileName);
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
    setErrorMsg("");

    let mimeType = "";
    if (file) {
      const extension = file.name
        .slice(file.name.lastIndexOf("."))
        .toLowerCase();
      if (extension === ".epub") {
        mimeType = "application/epub+zip";
      } else if (extension === ".pdf") {
        mimeType = "application/pdf";
      } else {
        setErrorMsg("Error: Only .pdf and .epub files are allowed.");
        return;
      }

      const url = await getUploadURL(file.name, mimeType);

      console.log("url is" + url);
      const successfulUpload = await uploadFile(file, url);

      if (successfulUpload === true) {
        const tellServerofUpload = await tellServer(file.name);
      }
    }

    await axios
      .post("http://localhost:8080/catalogue", values)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    if (file) {
      /*const reader = new FileReader();

      reader.onload = async (event) => {
        const blob = new window.Blob([new Uint8Array(event.target.result)], {
          type: mimeType,
        });

        const params = new URLSearchParams();
        params.append("fileName", file.name);
        params.append("fileType", mimeType);

        const res = await fetch(`http://localhost:8080/upload?${params}`);
        console.log(`http://localhost:8080/upload?${params}`);
        const data = await res.json();
        console.log(data);
        console.log("uploading...");
        const uploadResponse = await fetch(data.signedUrl, {
          method: "PUT",
          body: blob,
        });
        await uploadResponse.text();
        return uploadResponse.ok;
      };
      reader.readAsArrayBuffer(file);
      */
    }
  };

  async function getUploadURL(fileName, fileMimeType) {
    const params = new URLSearchParams();
    params.append("fileName", fileName);
    params.append("fileType", fileMimeType);
    const response = await fetch(`http://localhost:8080/catalogue/upload?${params}`);
    const data = await response.json();

    console.log(JSON.stringify(data));
    return data.url;
  }

  async function uploadFile(filetoUpload, uploadURL) {
    console.log("uploadURL is " + uploadURL);
    const response = await fetch(uploadURL, {
      method: "PUT",
      body: filetoUpload,
    });

    await response.text();

    return response.ok;
  }

  async function tellServer(newFileKey) {
    
    const response = await fetch("http://localhost:8080/uploadcomplete", {

      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileKey: newFileKey }),
    });
    await response.text();
    return response.ok;
  }
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
      {errorMsg && <p className="text-red-500 font-bold">{errorMsg}</p>}
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
