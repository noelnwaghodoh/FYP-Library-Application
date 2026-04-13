"use client";
import PageHeader from "@/components/ui/pageheader";
import Header from "@/components/ui/header";
import FrontPageButton from "@/components/ui/studentfrontpagebutton";
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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
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

    // Enforce strict pre-flight validation
    if (!values.bookTitle || !values.bookAuthor || !values.bookIdentifier) {
      setErrorMsg("Error: Book Title, Author, and Identifier are required.");
      return;
    }
    if (values.bookEdition && isNaN(Number(values.bookEdition))) {
      setErrorMsg("Error: Book Edition must be a valid numerical value.");
      return;
    }
    if (values.bookReleaseDate && isNaN(Date.parse(values.bookReleaseDate))) {
      setErrorMsg("Error: Release Date must be a valid date format.");
      return;
    }

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
      .post("http://localhost:8080/catalogue", values, { withCredentials: true })
      .then(function (response) {
        console.log(response);
        setIsSuccessModalOpen(true);
      })
      .catch(function (error) {
        console.log(error);
        setErrorMsg("Error: Failed to process book upload to the server.");
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
    const response = await fetch(`http://localhost:8080/catalogue/upload?${params}`, {
      credentials: "include",
    });
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
      credentials: "include",
    });
    await response.text();
    return response.ok;
  }
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    console.log(event.target.value);
  };
  return (
    <main>
      
      {errorMsg && <p className="text-red-500 font-bold">{errorMsg}</p>}
      <div>
        <PageHeader title="Welcome , Staff" />

        <Form onSubmit={handleBookSubmit} className="max-w-2xl mt-8">
          <div className="grid grid-cols-1 gap-4">
            <label className="block font-semibold">Book Title
              <input required className="mt-1 w-full border-2 border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" name="bookTitle" onChange={handleInput} />
            </label>
            <label className="block font-semibold">Book Author
              <input required className="mt-1 w-full border-2 border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" name="bookAuthor" onChange={handleInput} />
            </label>
            <label className="block font-semibold">Book Publisher
              <input className="mt-1 w-full border-2 border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" name="bookPublisher" onChange={handleInput} />
            </label>
            <label className="block font-semibold">Book Contributors
              <input className="mt-1 w-full border-2 border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" name="bookContributors" onChange={handleInput} />
            </label>
            <label className="block font-semibold">Book Identifier(ISBN)
              <input required className="mt-1 w-full border-2 border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" name="bookIdentifier" onChange={handleInput} />
            </label>
            <label className="block font-semibold">Release Date
              <input type="date" className="mt-1 w-full border-2 border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" name="bookReleaseDate" onChange={handleInput} />
            </label>
            <label className="block font-semibold">Book Subjects
              <input className="mt-1 w-full border-2 border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" name="bookSubjects" onChange={handleInput} />
            </label>
            <label className="block font-semibold">Book Edition
              <input type="number" min="1" className="mt-1 w-full border-2 border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" name="bookEdition" onChange={handleInput} />
            </label>
            <label className="block font-semibold">Book Description
              <textarea className="mt-1 w-full border-2 border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" name="bookDescription" onChange={handleInput} rows="3" />
            </label>
            <label className="block font-semibold">Book File (PDF or EPUB)
              <input
                required
                className="mt-1 w-full text-gray-700 p-2 border-2 border-gray-300 rounded cursor-pointer"
                type="file"
                accept=".pdf,.epub"
                onChange={handleFileChange}
                name="bookFile"
              />
            </label>
            <button className="mt-4 bg-blue-600 text-white font-bold py-3 px-6 rounded hover:bg-blue-700 transition" type="submit">
              Add a book
            </button>
          </div>
        </Form>
      </div>

      {/* Tailwind Fixed Success Modal overlay */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-[0.65] flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-2xl max-w-md w-full transform transition-all text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 bg-green-100 rounded-full mb-6">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600 mb-8 font-medium">
               "<span className="text-blue-600">{values.bookTitle || 'The book'}</span>" has been securely processed and added to the official catalogue!
            </p>
            <button onClick={() => { setIsSuccessModalOpen(false); window.location.reload(); }} className="w-full px-6 py-3 bg-green-600 rounded font-bold text-lg text-white hover:bg-green-700 transition shadow-md outline-none">
               Add Another Book
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
