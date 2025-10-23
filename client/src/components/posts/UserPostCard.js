import React, { useState } from 'react';
import * as yup from 'yup';
import { Formik, useFormikContext } from 'formik';
import { FiMoreHorizontal } from "react-icons/fi";
import { GoHeartFill } from "react-icons/go";



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
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm w-full max-w-xl mx-auto">
          
          {/* Card Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-800">
              {post.user.username}
            </span>
            <FiMoreHorizontal 
              className="w-6 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => setEditIsClicked(true)} 
            /> 
          </div>
          

          {/* Card Contenet */}
          <div className="bg-[#3d7e9f] text-white rounded-lg p-4 mb-3">
            <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
            <p className="text-sm leading-relaxed">{post.content}</p>
          </div>
            
          {/* Card Footer */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2" >
              <GoHeartFill className="text-pink-500 w-5 h-5" /> 
              <span className="text-sm">
                {post.likes.length}
              </span>
            </div>
            <button 
              onClick={() => handleDeleteClick(post.id)}
              className="text-sm text-red-500 hover:text-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserPostCard;
