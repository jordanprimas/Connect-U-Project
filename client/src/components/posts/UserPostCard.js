import React, { useState } from 'react';
import * as yup from 'yup';
import { Formik, useFormikContext } from 'formik';
import { FiMoreHorizontal } from "react-icons/fi";


const ErrorMessage = ({ name }) => {
  const { errors, touched } = useFormikContext()
  return touched[name] && errors[name] ? (
    <div className="error">{errors[name]}</div>
  ) : null
}

const UserPostCard = ({ post, handleEditClick, handleDeleteClick }) => {
  const [editIsClicked, setEditIsClicked] = useState(false)
  const initialValues = {
    title: post.title,
    content: post.content,
  }
 

  const formSchema = yup.object().shape({
    title: yup.string().min(1).required('Please enter at least 1 character'),
    content: yup.string().min(10).required('Please enter at least 10 characters'),
  })

  const handleSubmit = (values) => {
    handleEditClick(post.id, values)
    setEditIsClicked(false)
  }



  return (
    <div key={post.id}>

      {/* Editing post form */}
      {editIsClicked ? (
        <div>
          <h3 className="add-post-title">Edit Post</h3>
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
                    type="text"
                    className="name-input"
                    name="title"
                    value={formik.values.title}
                    placeholder="Enter post title"
                    onChange={formik.handleChange}
                  />
                  <ErrorMessage name="title" />
                </label>

                <label>
                  Content:
                  <textarea
                    className="content-input"
                    name="content"
                    value={formik.values.content}
                    placeholder="Write post"
                    onChange={formik.handleChange}
                  />
                  <ErrorMessage name="content" />
                </label>
                <button onClick={() => setEditIsClicked(false)}>Back</button>

                <button type="submit" className="submit-new-button">
                  Save Post
                </button>
              </form>
            )}
          </Formik>
        </div>
      ) : (

        // Post Card
        <div className="flex flex-col gap-2 bg-white rounded-xl border border-slate-200">
          <div className="flex flex-row justify-between items-center mt-2 mx-4">
            {/* Card Header */}
            <div className="flex flex-row items-center gap-4">
              <span>Posted by: {post.user.username}</span>
            </div>
            <FiMoreHorizontal 
              className="w-6 h-6"
              onClick={() => setEditIsClicked(true)} 
            /> 

            {/* Card Contenet */}
            <div>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
            

            <button onClick={() => handleDeleteClick(post.id)}>Delete Post</button>


          </div>
        </div>
      )}
    </div>
  )
}

export default UserPostCard;
