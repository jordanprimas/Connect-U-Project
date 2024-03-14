import React from "react";
import PostCard from "./PostCard"

const PostList = ({ posts, likes, handleAddLike, user }) => {

  const postElementList = posts.map((post) => {
    const postLikes = likes.filter(like => like.post_id === post.id)
    return(
      <PostCard key={post.id} post={post} postLikes={postLikes} handleAddLike={handleAddLike} user={user} />
    )
})

  return (
    <div className="cards">
      {postElementList}
    </div>
    
  )
}

export default PostList;
