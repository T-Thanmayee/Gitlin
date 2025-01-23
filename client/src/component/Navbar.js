import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { GiAmpleDress } from 'react-icons/gi';
import './Navbar.css'
import { useSelector, useDispatch } from 'react-redux';
import { resetState } from '../../Redux/slices/UserFarmerLoginThunk';
import { useNavigate } from 'react-router-dom';
import Profile from '../profile/Profile';

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  let [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.userFarmer.loginStatus);
  const currentUser = useSelector((state) => state.userFarmer.currentUser);

  

  const checkLoginStatus = () => {
    if (isLoggedIn) {
      setShowProfile(true);
    }
  };

  const handleShowNavbar = () => {
    setShowNavbar((prevState) => !prevState);
  };
 
  const handleUserIconClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      setShowProfile((prevState) => !prevState);
      console.log('showProfile', showProfile);
    }
  };
  const handleRemoveProfile = () => {
    setShowProfile(false);
    console.log('Profile removed, showProfile:', false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    dispatch(resetState());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="first-icons d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
          <div className="logo m-2">
            <GiAmpleDress size={50} />
          </div>
        </div>

        <div className={`nav-elements ${showNavbar ? 'active' : ''}`}>
          <ul>
            <li>
              <NavLink to="/home">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/new-arrivals">New Arrivals</NavLink>
             
            </li>
            <li>
              <NavLink to="/clothing">Clothing</NavLink>
              
            </li>
          </ul>
        </div>

        <div className="actions d-flex" style={{ marginLeft: 'auto' }}>
          <div className="cart m-3">
            <FaShoppingCart style={{ fontSize: '24px' }} />
          </div>
          <div className="profile m-3" >
            <FaUser style={{ fontSize: '24px', cursor: 'pointer' }} onClick={checkLoginStatus} />
            {isLoggedIn && showProfile && (
              <div className={`profile-container ${showProfile ? 'show' : ''}`}>
                <FaTimes
                  className='d-block mx-auto mb-2'
                  size={25}
                  style={{ cursor: 'pointer', color: '#28a745', marginTop: '10px' }}
                  onClick={ handleRemoveProfile}
                />
                <Profile />
                <div className='d-flex justify-content-around'>
                  <FaSignOutAlt
                    size={25}
                    style={{ cursor: 'pointer', color: '#28a745', marginTop: '10px' }}
                    onClick={handleLogout}
                  />
                  <p style={{ marginTop: '10px' }}>LogOut</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="menu-icon m-3" onClick={handleShowNavbar}>
          {showNavbar ? <FaTimes size={30} /> : <FaBars size={30} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;