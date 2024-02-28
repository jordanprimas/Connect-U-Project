import React, { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import NavBar from "./components/pages/Navbar";
import PostList from "./components/posts/PostList";
import PostForm from "./components/posts/PostForm";
import Home from "./components/pages/Home";
import Authentication from "./components/pages/Authentication"
import GroupList from "./components/groups/GroupList"
import './index.css'

const App = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([])

  useEffect(() => {
    fetchPosts()
    fetchGroups()
    fetchUser()
  }, [])

  const fetchPosts = () => {
    fetch('/api/posts')
    .then(res => res.json())
    .then(data => setPosts(data))
  }

  const fetchGroups = () => {
    fetch('/api/groups')
    .then(res => res.json())
    .then(data => setGroups(data))
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

  const handleEditClick = (id, newPostObj) => {
    fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newPostObj.title,
        content: newPostObj.content,
      }),
    })
    .then((res) => res.json())
    .then(updatedPost => {
      const updatedPosts = posts.map(post => {
        return post.id === id ? { ...post, ...updatedPost } : post;
      });
      setPosts(updatedPosts);
    });
  };
  



  const handleDeleteClick = (id) => {
    fetch(`/api/posts/${id}`,{
      method: "DELETE",
    })
    .then((res) => res.json())
    .then((deletedPost) => onDeletePost(deletedPost))
  }

  const onDeletePost = (deletedPost) => {
    const filteredPosts = posts.filter(post => post.id !== deletedPost.id)
    setPosts(filteredPosts)
  }
  
  
  return (
    <>
      <header>
        <NavBar updateUser={updateUser} />
      </header>
      <Routes>
        <Route path="/" element={<Home user={user} posts={posts} handleDeleteClick={handleDeleteClick} handleEditClick={handleEditClick} />} />
        <Route path="/posts" element={<PostList posts={posts} />} />
        <Route path="/posts/new" element={<PostForm addPost={addPost} />} />
        <Route path="/Authentication" element={<Authentication updateUser={updateUser} />} />
        <Route path="/groups" element={<GroupList groups={groups} />} />
      </Routes>
    </>
  );
}

export default App;
