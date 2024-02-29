import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, useFormikContext } from "formik";
import * as yup from "yup";

const ErrorMessage = ({ name }) => {
  const { errors, touched } = useFormikContext()
  return touched[name] && errors[name] ? (
    <div className="error">{errors[name]}</div>
  ) : null
}

function Authentication({ updateUser }) {
  const [signUp, setSignUp] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    setSignUp((signUp) => !signUp)
  }

  const formSchema = yup.object().shape({
    username: yup.string().required("Please enter a username"),
    email: yup.string().email(),
  })

  const initialValues = {
    username: "",
    email: "",
  }

  const handleSubmit = (values) => {
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
  }

  return (
    <div>
      <h2>Please log in or sign up</h2>
      <h2>{signUp ? "Already a member?" : "Not a member?"}</h2>
      <button onClick={handleClick}>
        {signUp ? "Log In!" : "Register now!"}
      </button>
      <Formik
        initialValues={initialValues}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <label htmlFor="username">Username</label>
            <Field type="text" name="username" />
          </div>
          {signUp && (
            <div>
              <label htmlFor="email">Email</label>
              <Field type="text" name="email" />
              <ErrorMessage name="email" />
            </div>
          )}
          <button type="submit">{signUp ? "Sign up" : "Log in"}</button>
        </Form>
      </Formik>
    </div>
  )
}

export default Authentication;
