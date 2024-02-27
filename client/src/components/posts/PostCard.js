import React from 'react'

const PostCard = ({ post }) => {

  return (
    <div className="card" key={post.id}>
    <h3>{post.title}</h3>
    <p>{post.content}</p>
    
  </div>
  )
}

export default PostCard