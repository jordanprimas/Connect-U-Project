import React from "react"
import UserPostCard from "./UserPostCard"

const UserPostList = ( {postList} ) => {
    
    const userPostElementList = postList.map(post => (
        <UserPostCard key={post.id} post={post} />
    ))

  return (
    <div className="cards">
        {userPostElementList}
    </div>
  )
}

export default UserPostList