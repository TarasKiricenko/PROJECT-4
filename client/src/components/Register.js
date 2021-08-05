import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

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
  console.log(errors)

  const handleChange = (event) => {
    const newFormData = { ...formdata, [event.target.name]: event.target.value }
    const newErrors = { ...errors, [event.target.name]: '' }
    setFormdata(newFormData)
    setErrors(newErrors)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await axios.post('/api/jwt_auth/register/', formdata)
      window.alert('Registration successful!')
      history.push('/login/')
    } catch (error) {
      console.log(error.username)
      setErrors(error.response.data.data)
    }
  }

  const goLogin = () => {
    history.push('/login/')
  }

  return (
    <>
      <div className="frontpagenav">
        <Link to='/'><h3>Go back to homepage</h3></Link>
        <Link to='/posts/'><h3>See all posts</h3></Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="commenttextlabel">Username</label>
          <input className="commenturl shadow"
            onChange={handleChange}
            type="username"
            name="username"
            placeholder="Enter your user name"
            value={formdata.username}
            required
          />
          {errors ? <p></p> : <p style={{ color: 'red' }} className="loginregistererror">This username might have been taken</p>}
        </div>
        <div>
          <label className="commenttextlabel">Email address</label>
          <input className="commenturl shadow"
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formdata.email}
            required
          />
          {errors ? <p></p> : <p style={{ color: 'red' }} className="loginregistererror">This email might have been used</p>}
        </div>
        <div>
          <label className="commenttextlabel">Fisrt name</label>
          <input className="commenturl shadow"
            onChange={handleChange}
            type="text"
            name="first_name"
            placeholder="Enter your first name"
            value={formdata.first_name}
            required
          />
        </div>
        <div>
          <label className="commenttextlabel">Last name</label>
          <input className="commenturl shadow"
            onChange={handleChange}
            type="text"
            name="last_name"
            placeholder="Enter your last name"
            value={formdata.last_name}
            required
          />
        </div>
        <div>
          <label className="commenttextlabel">Profile picture URL</label>
          <input className="commenturl shadow"
            onChange={handleChange}
            type="url"
            name="profile_image"
            placeholder="Paste a valid url for picture"
            value={formdata.profile_image}
            required
          />
        </div>
        <div>
          <label className="commenttextlabel">Password</label>
          <input className="commenturl shadow"
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formdata.password}
            required
          />
        </div>
        <div>
          <label className="commenttextlabel">Confirm passowrd</label>
          <input className="commenturl shadow"
            onChange={handleChange}
            type="password"
            name="password_confirmation"
            placeholder="Confirm your password"
            value={formdata.password_confirmation}
            required
          />
          {errors ? <p></p> : <p style={{ color: 'red' }} className="loginregistererror">Something wrong, double check your passwords</p>}
        </div>
        <div className="pairbuttons">
          <button type="submit" className="deletecomment shadow">Register</button>
          <button type="submit" className="deletecomment shadow" onClick={goLogin}>Been before? Login</button>
        </div>

      </form>
    </>
  )
}

export default Register
