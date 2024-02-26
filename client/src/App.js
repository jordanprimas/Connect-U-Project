import React, { useEffect, useState } from "react";
import NavBar from "./components/static/Navbar";
import { Outlet } from "react-router-dom"


const App = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/api/posts')
    .then(res => res.json())
    .then(data => setPosts(data))
  }, [])

  return (
    <>
      <header>
        <NavBar />
      </header>
      <Outlet posts={posts}/>
    </>
  );
}

export default App;
