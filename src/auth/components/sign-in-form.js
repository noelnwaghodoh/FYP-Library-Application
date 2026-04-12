"use client";
import Form from "next/form";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export function SignInForm() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  
  // State to track and display authentication/network errors to the user
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleInput = (event) => {
    // Note: Removed the enclosing array '[' ']' around event.target.value as it normally causes typing bugs
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value, 
    }));
    // Clear error message when user starts typing again
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // clear previous errors
    
    axios.
      post("http://localhost:8080/login", values, { withCredentials: true })
      .then((res) => {
        if (res.data.Login) {
          // Safely check if finalUser array exists and has an element, otherwise fallback to root usertype
          console.log(res.data);
          const userType = res.data.user.usertype
          
          if (userType == 3) {
            console.log("MOVING TO THE STUDENT ROUTE");
           router.push("/student");
          }
        } else {
          setErrorMessage("Invalid credentials or no record found.");
        }
      })
      .catch((err) => {
        console.log(err);
        // Specifically handle network errors (e.g. server is down/connection refused)
        if (err.code === "ERR_NETWORK" || err.message.includes("Network Error")) {
          setErrorMessage("Unable to connect to the server. Please check your connection or try again later.");
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="w-full max-w-[340px]">
      <Form className="flex flex-col gap-5 w-full bg-white p-6 rounded-lg shadow-sm" onSubmit={handleSubmit}>
        
        {errorMessage && (
          <div className="bg-red-50 text-red-600 text-[14px] p-3 border border-red-200 rounded-md">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[16px] font-medium text-gray-800 tracking-tight">
            Email/K Number
          </label>
          <input 
            name="email" 
            type="text"
            required
            onChange={handleInput} 
            className="border border-gray-300 rounded-md w-full outline-none focus:border-[#2ba5c7] focus:ring-1 focus:ring-[#2ba5c7] text-black bg-white h-[42px] px-3 transition-colors"
          />
        </div>
        
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[16px] font-medium text-gray-800 tracking-tight mt-1">
            Password
          </label>
          <input 
            name="password" 
            type="password"
            required
            onChange={handleInput} 
            className="border border-gray-300 rounded-md w-full outline-none focus:border-[#2ba5c7] focus:ring-1 focus:ring-[#2ba5c7] text-black bg-white h-[42px] px-3 transition-colors"
          />
        </div>

        <div className="flex justify-center mt-6">
          <button 
            type="submit"
            className="bg-[#2ba5c7] hover:bg-[#208bb0] active:scale-[0.98] text-white py-[9px] rounded-md text-[16px] font-medium shadow-sm w-full transition-all"
          >
            Log In
          </button>
        </div>

      </Form>
    </div>
  );
}
