import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function Authentication({ updateUser }) {
  const [signUp, setSignUp] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate()

  const handleClick = () => {
    setSignUp((signUp) => !signUp)
  }

  const formSchema = yup.object().shape({
    username: yup.string().required("Please enter a username"),
    password: yup.string().required("Please enter a password"),
    email: signUp ? yup.string().email("Invalid email address") : yup.string()
  })

  const formik = useFormik({
    initialValues:{
      username: "",
      password:"",
      email: ""
    },
    validationSchema:formSchema,
    onSubmit:(values) => {
      fetch(signUp ? "/api/signup" : "/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      })
        .then((res) => {
          if (res.ok){
            res.json().then(user => {
              updateUser(user)
              navigate("/")
            })
          } else {
            res.json().then(errorMessage => setErrorMessage(errorMessage.message))
          }
            })
          }
        })

  

  return (
    <div>
      {errorMessage && <p style={{ color:"red" }}>{errorMessage}</p>}
      {formik.errors && Object.values(formik.errors).map((error, index) => <p key={index} style={{ color:"red" }}>{error}</p>)}
      <h2>Please log in or sign up</h2>
        <h2>{signUp ? "Already a member?" : "Not a member?"}</h2>
        
        <button type="button" onClick={handleClick}>
          {signUp ? "Log In!" : "Register now!"}
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
          
          <button type="submit">
            {signUp ? "Sign up" : "Log in"}
          </button>
        </form>
      </div>
  )
}

export default Authentication;
