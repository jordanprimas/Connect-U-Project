import React from "react"
import UserPostCard from "./UserPostCard"

const UserPostList = ( {postList} ) => {
    
    const post = postList.map(post => (
        <UserPostCard key={post.id} post={post} />
    ))

  return (
    <div>
        {post}
    </div>
  )
}

export default UserPostList