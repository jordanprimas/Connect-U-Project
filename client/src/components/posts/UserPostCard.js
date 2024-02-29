import React, { useState } from 'react';
import * as yup from 'yup';
import { Formik, useFormikContext } from 'formik';

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
    <div className="card" key={post.id}>
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
        <div>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <button onClick={() => setEditIsClicked(true)}>Edit Post</button>
          <button onClick={() => handleDeleteClick(post.id)}>Delete Post</button>
          <p>Posted by: {post.user.username}</p>
        </div>
      )}
    </div>
  )
}

export default UserPostCard;
