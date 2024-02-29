import React from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import './Navbar.css'



const NavBar = ({updateUser}) => {
    const navigate = useNavigate()


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
            <button className="logout-button" onClick={handleLogout}>
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
                    to="/groups"
                    className="nav-link"
                >
                    All Groups 
                </NavLink>
            </nav>
        </div> 
    )
}

export default NavBar

