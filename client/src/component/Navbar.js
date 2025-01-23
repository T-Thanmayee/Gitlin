import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'
function Navbar() {
  return (
    <div classNameName=''> 
        <nav className="navbar navbar-expand-lg bg-dark">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" href="#"></NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav text-white">
                        <NavLink className="nav-link text-white active" aria-current="page" to="/">Home</NavLink>
                        <NavLink className="nav-link text-white" to="project">Create project</NavLink>
                        <NavLink className="nav-link text-white" to="tutorials">Tutorial</NavLink>
                        <NavLink className="nav-link text-white" to="">Mentoring</NavLink>
                        <a className="nav-link text-white" href="https://mediafiles.botpress.cloud/aa76ca6f-317c-40f8-9fac-568d41b721c9/webchat/bot.html" target='_blank'>Chat</a>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2 ms-5" type="search" placeholder="Search" aria-label="Search" />
                        </form><br/>
                        <NavLink className="sign text-white" to="register">SignUp</NavLink>
                        <NavLink className="sign text-white" to="login">SignIn</NavLink>

                    </div>
                    </div>
                    
                    
                </div>
            </nav>  
    </div>
  )
}

export default Navbar