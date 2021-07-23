import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'

const Register = () => {

  const history = useHistory()

  const [formdata, setFormdata] = useState({
    password: '',
    password_confirmation: '',
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    profile_image: '',
  })

  const [errors, setErrors] = useState({
    password: '',
    password_confirmation: '',
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    profile_image: '',
  }, [])

  const handleChange = (event) => {
    const newFormData = { ...formdata, [event.target.name]: event.target.value }
    const newErrors = { ...errors, [event.target.name]: '' }
    setFormdata(newFormData)
    setErrors(newErrors)
    console.log(newFormData)
    console.log(newErrors)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await axios.post('/api/jwt_auth/register/', formdata)
      window.alert('Registration successful!')
      history.push('/login')
    } catch (err) {
      setErrors(err.response.data.errors)
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            onChange={handleChange}
            type="username"
            name="username"
            placeholder="Enter your user name"
            value={formdata.username}
            required
          />
        </div>
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
          <label>Fisrt name</label>
          <input
            onChange={handleChange}
            type="text"
            name="first_name"
            placeholder="Enter your first name"
            value={formdata.first_name}
            required
          />
        </div>
        <div>
          <label>Last name</label>
          <input
            onChange={handleChange}
            type="text"
            name="last_name"
            placeholder="Enter your last name"
            value={formdata.last_name}
            required
          />
        </div>
        <div>
          <label>Profile picture URL</label>
          <input
            onChange={handleChange}
            type="url"
            name="profile_image"
            placeholder="Paste a valid url for picture"
            value={formdata.profile_image}
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
        <div>
          <label>Confirm passowrd</label>
          <input
            onChange={handleChange}
            type="password"
            name="password_confirmation"
            placeholder="Confirm your password"
            value={formdata.password_confirmation}
            required
          />
          {errors ? <p></p> : <p style={{ color: 'red' }}>Something wrong, double check your passwords</p>}
        </div>
        <button type="submit">Register</button>
      </form>
    </>
  )
}

export default Register
