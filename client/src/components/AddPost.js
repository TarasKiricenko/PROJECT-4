import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { getTokenFromLocalStorage } from './authentication/authentication'

const AddPost = () => {

  const history = useHistory()

  const [hashtags, setHashtags] = useState([])

  useEffect(() => {
    console.log('getting hashtags')
    const getHashtags = async () => {
      try {
        const { data } = await axios.get('api/hashtags/')
        setHashtags(data)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
    getHashtags()
  }, [])
  // const arrayOfHashtags = hashtags
  // console.log(arrayOfHashtags)

  const handleChange = (event) => {
    console.log('change')
    const newFormdata = { ...formdata, [event.target.name]: event.target.value }
    setFormdata(newFormdata)
    console.log(newFormdata)
  }

  const handleSubmit = async (event) => {
    console.log('submit')
    event.preventDefault()
    try {
      await axios.post('api/posts/',
        formdata,
        {
          headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
        }
      )
      console.log(getTokenFromLocalStorage)
      history.push('/posts')
    } catch (error) {
      console.log(error.message)
      console.log(getTokenFromLocalStorage)
    }
  }

  const [formdata, setFormdata] = useState({
    title: '',
    image: '',
    text: '',
    hashtags: [],
  })

  const [search, setSearch] = useState('')
  const [noSearch] = useState([])
  const [formdataHashtags] = useState([])

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const addHashtagToFormdata = (event) => {
    event.preventDefault()
    console.log(event.target)
    console.log(event.target.innerText)
    formdata.hashtags.push(parseFloat(event.target.id))
    formdataHashtags.push(event.target.innerText)
    console.log(formdataHashtags)
    console.log(formdata)
    console.log
    console.log(formdata.hashtags)
    clearSearchField()
    document.getElementById('hashtag-input-id').value = ' '
  }
  const clearSearchField = () => {
    setSearch('')
  }
  return (
    <>
      <Link to='/'><h1>Go back to homepage</h1></Link>
      <Link to='/posts'><h1>See all posts</h1></Link>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name your post</label>
          <input
            onChange={handleChange}
            type="text"
            name="title"
            placeholder="Enter a name for your post"
            value={formdata.title}
            required
          />
        </div>
        <div>
          <label>Add url for image to be attached</label>
          <input
            onChange={handleChange}
            type="url"
            name="image"
            placeholder="Optional"
            value={formdata.image}
          />
        </div>
        <div>
          <label>What your post is about?</label>
          <input
            onChange={handleChange}
            type="textarea"
            name="text"
            placeholder="Tell everyone something!"
            value={formdata.text}
            required
          />
        </div>
        <div>
          <label>Add at least one hashtag:</label>
          <input type="text" placeholder="Search for hashtags" onChange={handleSearch} id="hashtag-input-id" required />
          <ul onChange={handleSearch}>
            {(search === '' ? noSearch : hashtags).map(item => {
              if (item.name.toLowerCase().includes(search.trim().toLowerCase())) {
                return (
                  <li key={item.id} id={item.id}>
                    <button onClick={addHashtagToFormdata}><p id={item.id}>{item.name}</p></button>
                  </li>
                )
              }
            })}
          </ul>
        </div>
        <div>
          <ul>
            {formdataHashtags.length === 0 ? null : <div>Added hashtags: {formdataHashtags.map((item, index) => {
              return <li key={index}>{item}</li>
            })}</div>}
          </ul>
        </div>
        <button type="submit">Share your post</button>
      </form>
    </>
  )
}

export default AddPost

//     image = models.URLField(max_length=500, default=None, blank=True)
//     created_at = models.DateTimeField(auto_now_add=True)
//     text = models.TextField(max_length=1000, default=None)