import React from 'react'
import * as yup from 'yup'
import { Formik, useFormikContext } from "formik";

const ErrorMessage = ({ name }) => {
  const { errors, touched } = useFormikContext();
  return touched[name] && errors[name] ? (
    <div className="error">{errors[name]}</div>
  ) : null;
};

const PostForm = ({ addPost }) => {

  const initialValues = {
    title: "",
    content: ""
  }

  const formSchema = yup.object().shape({
    title: yup.string().min(1).required("Please enter at least 1 character"),
    content: yup.string().min(10).required("Please enter at least 10 characters"),
  })

  const handleSubmit = (values, { resetForm }) => {
    fetch("/api/posts", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })
    .then(res => res.json())
    .then(data => {
      addPost(data);
      resetForm();
    });
  }

  return (
    <div>
      <h3 className='add-post-title'>Create a new post</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
      >
        {formik => (
          <form className="add-post-form" onSubmit={formik.handleSubmit}>
            <label>
              Title:
              <input 
                type='text'
                className='name-input'
                name='title'
                value={formik.values.title} 
                placeholder='Enter post title'
                onChange={formik.handleChange}               
              />
              <ErrorMessage name="title" />
            </label>

            <label>
              Content:
              <textarea 
                className='content-input'
                name='content'
                value={formik.values.content} 
                placeholder='Write post' 
                onChange={formik.handleChange}               
              />
              <ErrorMessage name="content" />
            </label>

            <button type="submit" className='submit-new-button'>Create Post</button>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default PostForm
