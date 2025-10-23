import React from 'react'
import { Link } from 'react-router-dom'
import UserPostList from '../posts/UserPostList'


const Home = ({ user, posts, handleEditClick, handleDeleteClick }) => {

  const userPosts = posts.filter(post => post.user_id === user.id)
  
  return (
    <div className="flex flex-col">
      {/* Header - create new post */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-semibold">My Posts</h2>
        <Link 
          to={`/posts/new`} 
          className="bg-[#3d7e9f] text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-[#357187] focus:outline-none focus:ring-2 focus:ring-[#357187] transition-colors"
        >
            Create Post
        </Link>
      </div>

      {/* Posts grid */}
      <UserPostList postList={userPosts} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />
    </div>
  )
}

export default Home