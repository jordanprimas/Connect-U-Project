import React, { useContext } from "react";
import { Routes, Route } from 'react-router-dom';
import NavBar from "./components/pages/Navbar";
import PostList from "./components/posts/PostList";
import PostForm from "./components/posts/PostForm";
import Home from "./components/pages/Home";
import Authentication from "./components/pages/Authentication"
import GroupList from "./components/groups/GroupList"
import './index.css'
import { GroupContext } from "./contexts/GroupContext";
import { PostContext } from "./contexts/PostContext"
import { UserContext } from "./contexts/UserContext";

const App = () => {
  const [user, setUser] = useContext(UserContext)
  const [posts, setPosts] = useContext(PostContext)
  const [groups, setGroups] = useContext(GroupContext)
  

  const updateUser = (user) => setUser(user)
  const addPost = (post) => {
    setPosts([...posts, post])
  }


  const updateGroup = (updatedUserGroup) => {
    const group = groups.find(group => group.id === updatedUserGroup.group.id)
    console.log(updatedUserGroup)
    const updatedUserGroups = [...group.user_groups, updatedUserGroup]
    console.log(updatedUserGroups)
    const updatedGroup = {
      ...group,
      user_groups: updatedUserGroups
    }
    console.log(updatedGroup)

    const updatedGroups = groups.map(group => {
      if (group.id === updatedGroup.id) {
        return updatedGroup
      } else {
        return group
      }
    })
    setGroups(updatedGroups)
  }
  

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
        return post.id === id ? { ...post, ...updatedPost } : post
      })
      setPosts(updatedPosts)
    })
  }

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
        <Route path="/" element={<Home user={user} posts={posts} handleDeleteClick={handleDeleteClick} handleEditClick={handleEditClick} />} />
        <Route path="/posts" element={<PostList posts={posts} />} />
        <Route path="/posts/new" element={<PostForm addPost={addPost} />} />
        <Route path="/Authentication" element={<Authentication updateUser={updateUser} />} />
        <Route path="/groups" element={<GroupList groups={groups} updateGroup={updateGroup} />} />
      </Routes>
    </>
  );
}

export default App;
