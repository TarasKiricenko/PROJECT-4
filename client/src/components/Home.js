import React, { useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { userIsAuthenticated } from './authentication/authentication'

const Home = () => {

  const history = useHistory()

  const { pathname } = useLocation()

  const handleLogout = () => {
    window.localStorage.removeItem('token')
    history.push('/')
  }

  useEffect(() => {
    userIsAuthenticated()
  }, [pathname])
  return (
    <>
      {!userIsAuthenticated() ?
        <>
          <Link to="/login"><h1>Login</h1></Link>
          <Link to="/register"><h1>Register</h1></Link>
          <Link to="/posts"><h1>Continue as guest</h1></Link>
        </>
        :
        <Link onClick={handleLogout}><h1>Logout</h1></Link>
      }
    </>
  )
}
export default Home