import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <Link to="/login"><h1>Login</h1></Link>
      <Link to="/register"><h1>Register</h1></Link>
      <Link to="/posts"><h1>Continue as guest</h1></Link>
    </>
  )
}
export default Home