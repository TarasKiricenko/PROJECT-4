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
      history.push('/posts')
    } catch (error) {
      console.log(error.message)
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
  const [formdataHashtags, setFormdataHashtags] = useState([])

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const addHashtagToFormdata = (event) => {
    event.preventDefault()
    formdata.hashtags.push(parseFloat(event.target.id))
    formdataHashtags.push(event.target.innerText)
    clearSearchField()
    document.getElementById('hashtag-input-id').value = ' '
    console.log(formdata)
  }
  const clearSearchField = () => {
    setSearch('')
  }

  const removeHashtag = (event) => {
    console.log(event.target)
    const index = formdataHashtags.indexOf(event.target.innerText)
    const indexToDelete = formdataHashtags[index + 1]
    const deleteHashtagAtIndex = formdata.hashtags.indexOf(indexToDelete)
    formdata.hashtags.splice(deleteHashtagAtIndex, 2)
    console.log(formdata)
    event.target.classList.add('hidden')
    if (formdata.hashtags.length === 0) {
      setFormdataHashtags([])
    }
  }

  const goBack = () => {
    history.goBack()
  }
  return (
    <>
      <div className="frontpagenav">
        <Link to='/'><h3>Go back to homepage</h3></Link>
        <Link to='/posts'><h3>See all posts</h3></Link>
      </div>
      <form onSubmit={handleSubmit} className="formregisterlogin2">
        <div>
          <label className="commenttextlabel">Name your post</label>
          <input className="commenttextinput shadow commenturl"
            onChange={handleChange}
            type="textarea"
            name="title"
            placeholder="Enter a name for your post"
            value={formdata.title}
            required
          />
        </div>
        <div>
          <label className="commenttextlabel">Add url for image to be attached</label>
          <input className="commenttextinput shadow commenturl"
            onChange={handleChange}
            type="url"
            name="image"
            placeholder="Optional"
            value={formdata.image}
          />
        </div>
        <div>
          <label className="commenttextlabel">What your post is about?</label>
          <textarea className="commenttextinput shadow"
            onChange={handleChange}
            type="textarea"
            name="text"
            placeholder="Tell everyone something!"
            value={formdata.text}
            required
          />
        </div>
        <div>
          <label className="commenttextlabel">Add at least one hashtag:</label>
          <input type="text" placeholder="Search for hashtags" onChange={handleSearch} id="hashtag-input-id" required className="commenturl shadow speciallist" />
          <div className="hashtags " onChange={handleSearch} >
            {(search === '' ? noSearch : hashtags).map(item => {
              if (item.name.toLowerCase().includes(search.trim().toLowerCase())) {
                return (
                  <div className="onehashtag shadow" key={item.id} id={item.id}>
                    <p onClick={addHashtagToFormdata} id={item.id}># {item.name}</p>
                  </div>
                )
              }
            })}
          </div>
        </div>
        <div>
          <div className="hashtags">
            {formdataHashtags.map(item =>
              <div className="onehashtag shadow" key={item.id}>
                <p onClick={removeHashtag}> {item} </p>
              </div>
            )}
          </div>
        </div>
        <div className="pairbuttons">
          <button type="submit" className="deletecomment shadow">Share your post</button>
          <button type="button" className="deletecomment shadow" onClick={goBack}>Go back</button>
        </div>

      </form>
    </>
  )
}

export default AddPost

//     image = models.URLField(max_length=500, default=None, blank=True)
//     created_at = models.DateTimeField(auto_now_add=True)
//     text = models.TextField(max_length=1000, default=None)