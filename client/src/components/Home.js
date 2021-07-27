import React, { useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { userIsAuthenticated } from './authentication/authentication'
import FrontPagePart from './FrontPagePart'

const Home = () => {
  
  const posts = window.localStorage.getItem('posts')
  console.log(posts)
  if (!posts) {
    const posts = []
    window.localStorage.setItem('posts', JSON.stringify(posts))
  } else {
    null
  }

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
          <div className="frontpagenav">
            <Link to="/login"><h3>Login</h3></Link>
            <Link to="/register"><h3>Register</h3></Link>
            <Link to="/posts"><h3>Continue as guest</h3></Link>
          </div>
          <FrontPagePart/>
        </>
        :
        <>
          <div className="frontpagenav">
            <Link onClick={handleLogout}><h3>Logout</h3></Link>
            <Link to="/posts"><h3>See all posts</h3></Link>
          </div>
          <FrontPagePart/>
        </>
      }
    </>
  )
}
export default Home