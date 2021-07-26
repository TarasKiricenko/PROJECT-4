import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { userIsAuthenticated } from './authentication/authentication'
import { getTokenFromLocalStorage } from './authentication/authentication'


const Posts = () => {

  const history = useHistory()
  const [count, setCount] = useState(0)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/posts')
      console.log(data)
      data.sort().reverse()
      setPosts(data)
    }
    getData()
    getPayload()
  }, [count])

  const openInNewTab = (e) => {
    console.log('hello')
    console.log(e.target.src)
    window.open(e.target.src, '_blank')
  }

  const [userId, setUserId] = useState(null)

  const getPayload = () => {
    const token = getTokenFromLocalStorage()
    if (!token) return false
    const parts = token.split('.')
    if (parts.length < 3) return false
    const id = (JSON.parse(atob(parts[1])))
    setUserId(id.sub)
    return JSON.parse(atob(parts[1]))
  }

  const deleteConfirm = async (event) => {
    const confirm = window.confirm('Are you sure?')
    if (confirm) {
      try {
        await axios.delete(`api/posts/${event.target.id}/`)
        setCount(count => count + 1)
      } catch (error) {
        console.log(error.message)
      }
    } else {
      null
      console.log('cancelled deleting')
    }
  }


  const editPost = async (event) => {
    console.log('editing')
    console.log(event.target)
    window.localStorage.setItem('postToEditId', event.target.id)
    history.push('/editpost')
  }

  const addComment = async (event) => {
    event.preventDefault()
    try {
      await axios.post('api/comments/',
        comment
        // {
        //   headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
        // }
      )
      history.push('/posts')
      setCount(count => count - 1)
    } catch (error) {
      console.log(error)
    }

  }

  const setToStorage = (event) => {
    window.localStorage.setItem('id', event.target.id)
  }
  const postId = window.localStorage.getItem('id')

  const handleChange = (event) => {
    event.preventDefault()
    const newComment = { ...comment, [event.target.name]: event.target.value, owner: userId, post: parseFloat(postId) }
    console.log(event.target.name)
    console.log(newComment)
    setComment(newComment)
  }

  const [comment, setComment] = useState({
    post: '',
    text: '',
    image: '',
    owner: '',
  })

  const deleteComment = async (event) => {
    console.log(event.target.id)
    event.preventDefault()
    try {
      await axios.delete(`api/comments/${event.target.id}`)
      setCount(count => count + 1)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Link to='/'><h1>Go back to homepage</h1></Link>
      <Link to='/addpost'><h1>Add post</h1></Link>
      {posts.map(item =>
        <div key={item.id} id={item.id}>
          <h1>{item.title}</h1>
          <p>{item.text}</p>
          <p className="hidden">{item.owner.id}</p>
          <Link to="/posts" onClick={openInNewTab}><img src={item.image} /></Link>
          <div>
            {item.hashtags.map(hashtag =>
              <div key={hashtag.id}>
                <p>{hashtag.name}</p>
              </div>
            )}
          </div>
          <div>
            {(item.owner.id === userId) ? <button className="bigred" onClick={deleteConfirm} id={item.id}>delete</button> : null}
            {(item.owner.id === userId) ? <button className="bigred" onClick={editPost} id={item.id + ',' + item.owner.id}>edit</button> : null}
          </div>
          <div>
            {item.comments.reverse().map(comment =>
              <div key={comment.id}>
                <h3>{comment.owner.username}:</h3>
                <img src={comment.owner.profile_image} className='profile_image'></img>
                <h4>commented on {comment.created_at.replace('T', ' at ').slice(0, 22)}:</h4>
                <p>{comment.text}</p>
                <div>
                  {comment.image.length === 0 ?
                    <br></br>
                    :
                    <>
                      <p>Attached image:</p>
                      <img src={comment.image} />
                    </>
                  }
                </div>
                <div>
                  {(comment.owner.id === userId) ? <button onClick={deleteComment} id={comment.id}>Delete this comment</button> : null}
                </div>
              </div>
            )}
          </div>
          {userIsAuthenticated() ?
            <>
              <div>
                <form onSubmit={addComment} onMouseOver={setToStorage} id={item.id}>
                  <div>
                    <label onMouseOver={setToStorage} id={item.id}>Type in your comment</label>
                    <input onMouseOver={setToStorage} id={item.id}
                      onChange={handleChange}
                      type="text"
                      name="text"
                      placeholder="Enter your comment"
                      value={comment.text}
                      required
                    />
                  </div>
                  <div>
                    <label onMouseOver={setToStorage} id={item.id}>Add an image, if you prefer.</label>
                    <input onMouseOver={setToStorage} id={item.id}
                      onChange={handleChange}
                      type="url"
                      name="image"
                      placeholder="Optional"
                      value={comment.image}
                    />
                  </div>
                  <button type="submit" onMouseOver={setToStorage} id={item.id}>Leave your comment</button>
                </form>
              </div>
            </>
            :
            <Link to="/login"><button>Login to comment</button></Link>
          }
        </div>
      )}
    </>
  )

}
export default Posts