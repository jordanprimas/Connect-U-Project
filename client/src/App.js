import React, { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import NavBar from "./components/pages/Navbar";
import PostList from "./components/posts/PostList";
import PostForm from "./components/posts/PostForm";
import Home from "./components/pages/Home";
import Authentication from "./components/pages/Authentication"

const App = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPost()
    fetchUser()
  }, [])

  const fetchPost = () => {
    fetch('/api/posts')
    .then(res => res.json())
    .then(data => setPosts(data))
  }

  const fetchUser = () =>{
    fetch('/api/authorized')
    .then(res => {
      if(res.ok){
        res.json().then(user => setUser(user))
      }else{
        setUser(null)
      }
    })
  }

  const updateUser = (user) => setUser(user)
  const addPost = (post) => {
    setPosts([...posts, post])
  }

  if(!user)return(
    <>
    <Authentication updateUser={updateUser}/>
    </>
  )
  

  return (
    <>
      <header>
        <NavBar updateUser={updateUser} />
      </header>
      <Routes>
        <Route path="/" element={<Home user={user} posts={posts} />} />
        <Route path="/posts" element={<PostList posts={posts} />} />
        <Route path="/posts/new" element={<PostForm addPost={addPost} />} />
        <Route path="/Authentication" element={<Authentication updateUser={updateUser} />} />
      </Routes>
    </>
  );
}

export default App;
