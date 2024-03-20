import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function Authentication({ updateUser }) {
  const [signUp, setSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  
  const handleClick = () => {
    window.location.href = 'http://localhost:5555/google'
      // fetch('http://localhost:5555/google', {
      //   method: 'GET'
      // })
      // .then(res => res.json())
      // .then(data => console.log(data))

  }

  const handleSignUpClick = () => {
    setSignUp((signUp) => !signUp)
  }

  const formSchema = yup.object().shape({
    username: yup.string().required("Please enter a username"),
    password: yup.string().required("Please enter a password"),
    email: signUp ? yup.string().email("Invalid email address") : yup.string(),
  })

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
              updateUser(user)
              navigate("/")
            })
          } else {
            res.json()
            .then(res => setErrorMessage(res.error))
          }
        })
    },
  })


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
      {/* Google button using react router Link */}
      {/* <Link to="http://localhost:5555/google" className="google-button">
        Sign In or Log In With Google
      </Link> */}
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
  )
}

export default Authentication;
