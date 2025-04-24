import React from 'react'
import Navbar from './FooterAndNav/Navbar'
import Footer from './FooterAndNav/Footer'
import {Outlet} from 'react-router-dom'
import RecipeReviewCard from './Home/HomeCard'
import { toast } from 'sonner'

function RouteLayout() {
  return (
    <div className=''>
        <Navbar  />
        <div style={{minHeight:'95vh'}}>
        <Outlet />
        </div>
        
        <Footer />
    </div>
  )
}

export default RouteLayout