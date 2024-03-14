import React, {useState} from 'react'


const PostCard = ({ post, postLikes, handleAddLike, user }) => {
  const [liked, setLiked] = useState(false)
  console.log(user.id)

  const handleLikeClick = () => {
    setLiked(!liked)
    fetch("/api/likes", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.id,
        post_id: post.id,
      }),
    })
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error("Failed to like post")
      }
    })
    .then(data => handleAddLike(data))
  }

  return (
    <div className="card" key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>Posted by: {post.user.username}</p>
      Likes: {postLikes.length}
      <br/>
      <p onClick={handleLikeClick}>{liked ? "💖" : "♡"}</p>
    </div>
  )
}

export default PostCard