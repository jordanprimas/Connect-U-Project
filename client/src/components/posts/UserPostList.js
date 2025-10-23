import React from "react"
import UserPostCard from "./UserPostCard"

const UserPostList = ( {postList, handleEditClick, handleDeleteClick} ) => {
    
    const userPostElementList = postList.map(post => (
        <UserPostCard key={post.id} post={post} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />
    ))

  return (
    // Render current user's cards to page 
    <div className="grid grid-cols-3 gap-5 place-items-center">
        {userPostElementList}
    </div>
  )
}

export default UserPostList