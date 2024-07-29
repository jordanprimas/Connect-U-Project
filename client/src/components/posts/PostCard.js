import React, { useState, useEffect } from 'react';

const PostCard = ({ post, postLikes, handleAddLike, user, handleDeleteLike }) => {
  const [liked, setLiked] = useState(false);

  const like = postLikes.find(like => like.user_id === user.id)

  useEffect(() => {
    if (like) {
      setLiked(true)
    } else {
      setLiked(false)
    }
  }, [postLikes, user.id])

  

  const handleLikeClick = () => {
    if (!liked) {
      setLiked(true);
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
      .catch(error => {
        console.error("Error liking post:", error)
        setLiked(false)
      });
    } else {
      setLiked(false)
      fetch(`/api/likes/${like.id}`, {
        method: "DELETE",
      })
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error("Failed to unlike post")
        }
      })
      .then((deletedLike) => handleDeleteLike(deletedLike))
      .catch(error => {
        console.error("Error unliking post:", error)
        setLiked(true)
      })
    }
  };

  return (
    <div className="card" key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>Posted by: {post.user.username}</p>
      Likes: {postLikes.length}
      <br />
      <p onClick={handleLikeClick}>{liked ? "💖" : "♡"}</p>
    </div>
  );
};

export default PostCard;
