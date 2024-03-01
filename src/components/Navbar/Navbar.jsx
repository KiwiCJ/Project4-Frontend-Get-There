import './Navbar.css'
import React, { useState, useEffect }  from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SignupModal from '../LoggedUser/SignupModal'
import LoginModal from '../LoggedUser/LoginModal'
import AddTripModal from '../Trips/AddTripModal'


export default function NavBar() {
  const [isAuth, setIsAuth] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showTripModal, setShowTripModal] = useState(false)

  useEffect(() => {
    if(localStorage.getItem('access_token') !== null) {
      setIsAuth(true)
    }
    // eslint-disable-next-line
  }, [isAuth])

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/logout/`,
          {
              refresh_token: localStorage.getItem('refresh_token')
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
      )
      localStorage.clear()
      axios.defaults.headers.common['Authorization'] = null
      window.location.href = '/'
    } catch (e) {
      console.log('Logout Error', e)
    }
  }


  const openLoginModal = () => {
    setShowLoginModal(true)
  }

  const closeLoginModal= () => {
    setShowLoginModal(false)
  }

  const openSignUpModal = () => {
    setShowSignUpModal(true)
  }

  const closeSignUpModal= () => {
    setShowSignUpModal(false)
  }

  const openTripModal = () => {
    setShowTripModal(true)
  }

  const closeTripModal = () =>{
    setShowTripModal(false)
  }



  return (

<div className="navbar">
  <div className="navbar-start">
      <Link  id='nav-btn' to='/converter' className="btn btn-outline btn-accent">Convert</Link> 
      {isAuth ? (
      <Link id='nav-btn' to='/trips' className="btn btn-outline btn-accent">Your Trips</Link>
      ) : (
      null
      )}
  </div>
  <div className="navbar-center">
    <h2 className="text-xl"> <strong>GET THERE</strong></h2>
    <img src="" alt="" />
  </div>
  <div className="navbar-end">
    {isAuth ? (
      <div>
        <button id='nav-btn' className="btn btn-outline btn-accent" onClick={handleLogout}>Log Out</button> 
        <button id='nav-btn' className="btn btn-outline btn-accent" onClick={openTripModal}>Add Trip</button>
      </div>
    ) : ( 
      <div>
        <button id='nav-btn' className="btn btn-outline btn-accent" onClick={openSignUpModal}>Sign Up</button>   
        <button id='nav-btn' className="btn btn-outline btn-accent" onClick={openLoginModal}>Login</button> 
      </div>
    )}
  </div>
  <AddTripModal show={showTripModal} onClose={closeTripModal}  />
  <SignupModal  show={showSignUpModal} onClose={closeSignUpModal} />
  <LoginModal show={showLoginModal} onClose={closeLoginModal} />
</div>
  )
}


