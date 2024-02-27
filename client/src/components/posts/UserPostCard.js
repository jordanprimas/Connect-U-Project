import React from 'react'

const UserPostCard = ({ post }) => {
  console.log(post)

  return (
    <div className="card" key={post.id}>
    <h3>{post.title}</h3>
    <p>{post.content}</p>
    <p>Posted by: {post.user.username}</p>
  </div>
  )
}

export default UserPostCard