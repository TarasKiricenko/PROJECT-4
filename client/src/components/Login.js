import React, { useState } from 'react'
import { useHistory } from 'react-router'
import axios from 'axios'

const Login = () => {
  const history = useHistory()

  const [formdata, setFormdata] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState(null)

  const setTokenToLocalStorage = (token) => {
    window.localStorage.setItem('token', token)
  }

  const handleChange = (event) => {
    const newFormdata = { ...formdata, [event.target.name]: event.target.value }

    setFormdata(newFormdata)

    console.log(newFormdata)

  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const { data } = await axios.post('api/jwt_auth/login/', formdata)
      setTokenToLocalStorage(data.token)
      window.alert('Welcome back!')
      setTimeout(function () {
        history.push('/posts')
      }, 500)
    } catch (err) {
      console.log(err)
      setErrors(err)
    }
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email address</label>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formdata.email}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formdata.password}
            required
          />
        </div>
        <button type="submit" className="commentbutton">Log in</button>
        {!errors ? <p></p> : <p style={{ color: 'red' }}>Something went wrong, double check your credentials.</p>}
      </form>
    </>
  )
}

export default Login