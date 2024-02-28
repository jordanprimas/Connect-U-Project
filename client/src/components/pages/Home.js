import React from 'react'
import { Link } from 'react-router-dom'
import UserPostList from '../posts/UserPostList'


const Home = ({ user, posts }) => {

  const userPosts = posts.filter(post => post.user_id === user.id)
  
  return (
    <div>
       <Link to={`/posts/new`} >Create A New Post</Link>
       <UserPostList postList={userPosts} />
    </div>
  )
}

export default Home