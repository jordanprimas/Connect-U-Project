import React from "react"
import UserPostCard from "./UserPostCard"

const UserPostList = ( {postList, handleEditClick, handleDeleteClick} ) => {
    
    const userPostElementList = postList.map(post => (
        <UserPostCard key={post.id} post={post} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />
    ))

  return (
    <div className="cards">
        {userPostElementList}
    </div>
  )
}

export default UserPostList