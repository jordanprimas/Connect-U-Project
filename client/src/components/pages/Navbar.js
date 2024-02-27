import React from 'react'
import { NavLink, useNavigate } from "react-router-dom"



const NavBar = ({updateUser}) => {
    const navigate = useNavigate();


    const handleLogout = () => {
        fetch('/api/logout',{
            method:'DELETE'
        })
        .then(res => {
            if(res.ok) {
                    updateUser(null)
                    navigate('/authentication')
            }
        })
    }

    return (
        <div>
            <button onClick={handleLogout}>
                Logout
            </button>
            <nav>
                <NavLink
                    to="/"
                    className="nav-link"
                >
                    Home
                </NavLink>
                <NavLink
                    to="/posts"
                    className="nav-link"
                >
                    All Posts
                </NavLink>
                <NavLink
                    to="/posts/new"
                    className="nav-link"
                >
                    Create New Post
                </NavLink>
            </nav>
        </div> 
    )
}

export default NavBar