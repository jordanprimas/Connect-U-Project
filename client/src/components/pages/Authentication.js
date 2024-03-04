import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

function Authentication({ updateUser }) {
  const [signUp, setSignUp] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    setSignUp((signUp) => !signUp)
  }

  const formSchema = yup.object().shape({
    username: yup.string().required("Please enter a username"),
    email: signUp ? yup.string().email("Invalid email address") : yup.string(),
  })

  const onSubmit = (values) => {
    fetch(signUp ? "/api/users" : "/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((user) => {
        updateUser(user)
        navigate("/")
      })
      .catch((error) => {
        console.error("Error:", error);
      })
  }

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
      }}
      validationSchema={formSchema}
      onSubmit={onSubmit}
    >
    <div>
      <h2>Please log in or sign up</h2>
        <h2>{signUp ? "Already a member?" : "Not a member?"}</h2>
        
        <button type="button" onClick={handleClick}>
          {signUp ? "Log In!" : "Register now!"}
        </button>
        <Form>
          <div>
            <Field
              type="text"
              name="username"
              placeholder="username"
            />
            <ErrorMessage name="username" component="div" style={{ color: "red" }} />
          </div>
          
          {signUp && (
            <div>
              <Field
                type="email"
                name="email"
                placeholder="email"
              />
              <ErrorMessage name="email" component="div" style={{ color: "red" }} />
            </div>
          )}
          
          <button type="submit">
            {signUp ? "Sign up" : "Log in"}
          </button>
        </Form>
      </div>
    </Formik>
  )
}

export default Authentication;
