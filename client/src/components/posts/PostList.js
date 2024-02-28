import React from "react";
import PostCard from "./PostCard"

const PostList = ({ posts }) => {

  const postElementList = posts.map((post) => (
    <PostCard key={post.id} post={post} />
  ))

  return (
    <div className="cards">
      {postElementList}
    </div>
    
  )
}

export default PostList;
