import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function Authentication({ updateUser }) {
  const [signUp, setSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  // const handleCallbackResponse = (response) => {
  //   console.log(response);
  //   console.log("Handle Google Auth Callback Here");
  //   // Handle Google Auth Callback Here
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const stateParam = urlParams.get("state");

  //   // Validate state parameter
  //   if (stateParam !== googleState) {
  //     console.error("CSRF Warning! State mismatch.");
  //     return;
  //   }

  //   window.location.href = "http://localhost:5555/google";
  // };

  // useEffect(() => {
  //   const google = window.google;
  //   // if (!google) {
  //   //   console.error("Google API not loaded");
  //   //   return;
  //   // }

  //   google.accounts.id.initialize({
  //     client_id: "876300808012-jl6se3g2i8qrk3f20gmg765ia8tcgq1m.apps.googleusercontent.com",
  //     callback: handleCallbackResponse,
  //   });
  // }, []);

  const handleClick = () => {
    // event.preventDefault();
    // Generate a random state parameter
    // const stateParam = generateRandomState();
    // setGoogleState(stateParam);

    // Redirect to backend Google OAuth route with state parameter
    window.location.href = 'http://localhost:5555/google'
  }

  const handleSignUpClick = () => {
    setSignUp((signUp) => !signUp)
  }

  const formSchema = yup.object().shape({
    username: yup.string().required("Please enter a username"),
    password: yup.string().required("Please enter a password"),
    email: signUp ? yup.string().email("Invalid email address") : yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch(signUp ? "/api/signup" : "/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      })
        .then((res) => {
          if (res.ok) {
            res.json().then((user) => {
              updateUser(user);
              navigate("/");
            });
          } else {
            res.json()
            .then(res => setErrorMessage(res.error))
          }
        });
    },
  });


  return (
    <div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {formik.errors &&
        Object.values(formik.errors).map((error, index) => (
          <p key={index} style={{ color: "red" }}>
            {error}
          </p>
        ))}
      <h2>Please log in or sign up</h2>
      <h2>{signUp ? "Already a member?" : "Not a member?"}</h2>

      <button type="button" onClick={handleSignUpClick}>
          {signUp ? "Log In!" : "Register now!"}
        </button>

      <button
        onClick={handleClick}
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #dcdcdc",
          borderRadius: "5px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
          alt="Google Logo"
          style={{ marginRight: "10px", width: "20px", height: "20px" }}
        />
        Sign in with Google
      </button>

      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            placeholder="username"
          />
          <label>Password</label>
          <input
            type="text"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="password"
          />
        </div>

        {signUp && (
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="email"
            />
          </div>
        )}

        <button type="submit">{signUp ? "Sign up" : "Log in"}</button>
      </form>
    </div>
  );
}

export default Authentication;
