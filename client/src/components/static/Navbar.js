import React from 'react'
import { NavLink } from "react-router-dom"


const NavBar = () => {
    return (
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
    )
}

export default NavBar