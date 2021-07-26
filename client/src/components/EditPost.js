import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getTokenFromLocalStorage } from './authentication/authentication'
import { Link, useHistory } from 'react-router-dom'
// import AddPost from './AddPost'

const EditPost = () => {

  const idOfPostAndOwner = window.localStorage.getItem('postToEditId')
  const idOfPost = parseFloat(idOfPostAndOwner)
  const ownerOfPost = (idOfPostAndOwner.split(','))
  const ownerOfPostId = parseFloat(ownerOfPost[1])
  
  useEffect(() => {
    const getPostToEditById = async () => {
      try {
        const { data } = await axios.get(`api/posts/${idOfPost}`)
        // console.log(data)
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
        const { data } = await axios.get('api/hashtags/')
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
      await axios.put(`api/posts/${idOfPost}/`,
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
    formdataHashtags.push(event.target.id)
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
    event.target.classList.add('hidden')
    console.log(formdata)
    if (formdata.hashtags.length === 0) {
      setFormdataHashtags([])
    }
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
                    <button onClick={addHashtagToFormdata} id={item.id}>{item.name}</button>
                  </li>
                )
              }
            })}
          </ul>
        </div>
        <div>
          <ul>
            {formdataHashtags.length === 0 ? null : <div>Added hashtags (click to remove): {formdataHashtags.map((item, index) => {
              return (
                <>
                  <li key={index} onClick={removeHashtag}>{item}</li>
                </>
              )
            })}</div>}
          </ul>
        </div>
        <button type="submit">Share your post</button>
      </form>
    </>
  )
}

export default EditPost


// const postToEditId = window.localStorage.getItem('postToEditId')

// const [postToEdit, setPostToEdit] = useState({})
// useEffect(() => {
//   const getPostToEdit = async () => {
//     try {
//       const { data } = await axios.get(`api/posts/${postToEditId}`)
//       console.log(data)
//       const div = document.createElement('div')
//       div.id = 'inputvalue'
//       div.innerText = data.text
//       setPostToEdit(data)
//       setFormdata(data)
//     } catch (err) {
//       console.log(err)
//     }
//   }
//   getPostToEdit()
// }, [postToEditId])

// const history = useHistory()

// const [hashtags, setHashtags] = useState([])

// useEffect(() => {
//   console.log('getting hashtags')
//   const getHashtags = async () => {
//     try {
//       const { data } = await axios.get('api/hashtags/')
//       setHashtags(data)
//       console.log(data)
//     } catch (err) {
//       console.log(err)
//     }
//   }
//   getHashtags()
// }, [])
// // const arrayOfHashtags = hashtags
// // console.log(arrayOfHashtags)

// const handleChange = (event) => {
//   console.log('change')
//   const newFormdata = { ...formdata, [event.target.name]: event.target.value }
//   setFormdata(newFormdata)
//   console.log(newFormdata)
// }

// const handleSubmit = async (event) => {
//   console.log('submit')
//   event.preventDefault()
//   try {
//     await axios.post(`api/posts/${postToEditId}`,
//       formdata,
//       {
//         headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
//       }
//     )
//     console.log(getTokenFromLocalStorage)
//     history.push('/posts')
//   } catch (error) {
//     console.log(error.message)
//     console.log(getTokenFromLocalStorage)
//   }
// }

// const [formdata, setFormdata] = useState({
//   title: '',
//   image: '',
//   text: '',
//   hashtags: [],
// })

// const [search, setSearch] = useState('')
// const [noSearch] = useState([])
// const [formdataHashtags] = useState([])

// const handleSearch = (event) => {
//   setSearch(event.target.value)
// }

// const addHashtagToFormdata = (event) => {
//   event.preventDefault()
//   console.log(event.target)
//   console.log(event.target.innerText)
//   formdata.hashtags.push(parseFloat(event.target.id))
//   formdataHashtags.push(event.target.innerText)
//   console.log(formdataHashtags)
//   console.log(formdata)
//   console.log
//   console.log(formdata.hashtags)
//   clearSearchField()
//   document.getElementById('hashtag-input-id').value = ' '
// }
// const clearSearchField = () => {
//   setSearch('')
// }

{/* <form onSubmit={handleSubmit}>
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
  <h5>Initial name to your post:</h5>
  <p>{postToEdit.title}</p>
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
  <h5>Initial url of image, if any:</h5>
  <p>{postToEdit.image}</p>
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
  <h5>Initial text of your post:</h5>
  <p id="textforinputvalues">{postToEdit.text}</p>
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
</form> */}