import React from "react";
import PostCard from "./PostCard"

const PostList = ({ posts }) => {

  const postsList = posts.map((post) => (
    <PostCard key={post.id} post={post} />
  ))

  return (
    <div>
      {postsList}
    </div>
    
  )
}

export default PostList;
