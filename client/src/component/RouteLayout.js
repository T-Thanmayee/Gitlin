import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import {Outlet} from 'react-router-dom'
import RecipeReviewCard from './HomeCard'

function RouteLayout() {
  return (
    <div>
        <Navbar  />
        <div style={{minHeight:'95vh'}}>
        <Outlet />
        </div>
        
        <Footer />
    </div>
  )
}

export default RouteLayout