import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getTokenFromLocalStorage } from './authentication/authentication'
import { Link, useHistory } from 'react-router-dom'

const EditPost = () => {

  const idOfPostAndOwner = window.localStorage.getItem('postToEditId')
  const idOfPost = parseFloat(idOfPostAndOwner)
  const ownerOfPost = (idOfPostAndOwner.split(','))
  const ownerOfPostId = parseFloat(ownerOfPost[1])

  useEffect(() => {
    const getPostToEditById = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${idOfPost}`)
        setFormdata(data)
      } catch (error) {
        console.log(error)
      }
    }
    getPostToEditById()
  }, [idOfPost])

  const history = useHistory()

  const [hashtags, setHashtags] = useState([])

  useEffect(() => {
    console.log('getting hashtags')
    const getHashtags = async () => {
      try {
        const { data } = await axios.get('/api/hashtags/')
        setHashtags(data)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
    getHashtags()
  }, [])

  const handleChange = (event) => {
    console.log('change')
    const newFormdata = { ...formdata, [event.target.name]: event.target.value }
    setFormdata(newFormdata)
    console.log(newFormdata)
    console.log(formdata)
  }

  const handleSubmit = async (event) => {
    console.log(formdata.hashtags)
    console.log('submit')
    event.preventDefault()
    try {
      await axios.put(`/api/posts/${idOfPost}/`,
        formdata,
        {
          headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
        }
      )
      history.push('/posts')
      console.log(formdata)
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
  delete formdata['owner']
  delete formdata['created_at']
  delete formdata['comments']
  delete formdata['id']
  formdata.owner = ownerOfPostId
  console.log(formdata)

  const [search, setSearch] = useState('')
  const [noSearch] = useState([])
  const [formdataHashtags, setFormdataHashtags] = useState([])

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const addHashtagToFormdata = (event) => {
    event.preventDefault()
    formdata.hashtags.push(parseFloat(event.target.id))
    for (let i = 0; i < formdata.hashtags.length; i++) {
      if ((typeof formdata.hashtags[i]) !== 'number') {
        formdata.hashtags.splice(i, 1); i--
      }
    }
    formdataHashtags.push(event.target.innerText)
    clearSearchField()
    document.getElementById('hashtag-input-id').value = ' '
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
    event.target.parentElement.classList.add('hidden')
    console.log(formdata)
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
      <form onSubmit={handleSubmit}>
        <div>
          <label className="commenttextlabel">Give it another name:</label>
          <input className="commenttextinput shadow commenturl"
            onChange={handleChange}
            type="text"
            name="title"
            placeholder="Enter a name for your post"
            value={formdata.title}
            required
          />
        </div>
        <div>
          <label className="commenttextlabel">Would you like to change picture? Add another url:</label>
          <input className="commenttextinput shadow commenturl"
            onChange={handleChange}
            type="url"
            name="image"
            placeholder="Optional"
            value={formdata.image}
          />
        </div>
        <div>
          <label className="commenttextlabel">What is it you would like to change?</label>
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
          <input type="text" placeholder="Search for hashtags" onChange={handleSearch} id="hashtag-input-id" required className="commenturl shadow speciallist"  />
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
          <button type="submit" className="deletecomment shadow">Save and post</button>
          <button type="button" className="deletecomment shadow" onClick={goBack}>Go back</button>
        </div>
      </form>
    </>
  )
}

export default EditPost