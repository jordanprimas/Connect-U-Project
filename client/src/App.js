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
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const updateUser = (user) => setUser(user)

  return (
    <>
      <header>
        <NavBar updateUser={updateUser} />
      </header>
      <Routes>
        <Route path="/" element={<Home posts={posts} />} />
        <Route path="/posts" element={<PostList posts={posts} />} />
        <Route path="/posts/new" element={<PostForm />} />
        <Route path="/Authentication" element={<Authentication updateUser={updateUser} />} />
      </Routes>
    </>
  );
}

export default App;
