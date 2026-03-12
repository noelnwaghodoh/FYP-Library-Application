"use client ";
import Form from "next/form";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export function SignInForm() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: [event.target.value],
    }));
    console.log(values);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("our value are " + values.email + values.password);
    axios
      .post("http://localhost:8080/login", values)
      .then((res) => {
        console.log(res);
        if (res.data.Login) {
          console.log("Yes");
          console.log(res);
          if ((res.data.usertype = 3)) {
            router.push("/student");
          }
        } else {
          alert("No record");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Form className="" onSubmit={handleSubmit}>
      <label>email</label>
      <input name="email" onChange={handleInput} />
      <label>Password</label>
      <input name="password" onChange={handleInput} />
      <button type="submit">Sign In</button>
    </Form>
  );
}
