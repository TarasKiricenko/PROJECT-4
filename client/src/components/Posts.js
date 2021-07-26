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
      <div className="hrefclass background">
        <Link to='/'><h1>Go back to homepage</h1></Link>
        <Link to='/addpost'><h1>Add post</h1></Link>
      </div>
      <div>
        <div className="background">
          {posts.map(item =>
            <div key={item.id} id={item.id} className="separator">
              <p className="postname">{item.title}</p>
              <Link to="/posts" onClick={openInNewTab}><img src={item.image} /></Link>
              <p className="posttext">{item.text}</p>
              <p className="hidden">{item.owner.id}</p>
              <div className="hashtags">
                {item.hashtags.map(hashtag =>
                  <div className="onehashtag" key={hashtag.id}>
                    <p># {hashtag.name} </p>
                  </div>
                )}
              </div>
              {(item.owner.id === userId) ? <p className="nothappy">Not really happy about your post?</p> : null}
              <div className="pairbuttons">
                {(item.owner.id === userId) ? <button className="bigred" onClick={deleteConfirm} id={item.id}>Delete this post</button> : null}
                {(item.owner.id === userId) ? <button className="bigred" onClick={editPost} id={item.id + ',' + item.owner.id}>Edit this post</button> : null}
              </div>
              <div>
                {item.comments.reverse().map(comment =>
                  <div key={comment.id} className="commentdiv">
                    <div className="commentheader">
                      <img src={comment.owner.profile_image} className='profile_image'></img>
                      <h5>{comment.owner.username} added comment to that post on {comment.created_at.replace('T', ' at ').slice(0, 22)}</h5>
                    </div>
                    <p className="commentheader">{comment.text}</p>

                    <div>
                      {comment.image.length === 0 ?
                        null
                        :
                        <>
                          <img className="commentimage" src={comment.image} />
                        </>
                      }
                    </div>
                    <div className="pairbuttons">
                      {(comment.owner.id === userId) ? <button onClick={deleteComment} id={comment.id} className="deletecomment">Delete this comment</button> : null}
                    </div>
                  </div>
                )}
              </div>
              {userIsAuthenticated() ?
                <>
                  <div>
                    <form onSubmit={addComment} onMouseOver={setToStorage} id={item.id}>
                      <div>
                        <label onMouseOver={setToStorage} id={item.id} className="commenttextlabel">Add a comment:</label>
                        <textarea onMouseOver={setToStorage} id={item.id} className="commenttextinput"
                          onChange={handleChange}
                          type="textarea"
                          name="text"
                          placeholder="Type in your comment here"
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
                      <div className="pairbuttons">
                        <button type="submit" onMouseOver={setToStorage} id={item.id}>Leave your comment</button>
                      </div>
                    </form>
                  </div>
                </>
                :
                <Link to="/login"><button>Login to comment</button></Link>
              }
            </div>
          )}
        </div>
      </div>
    </>
  )

}
export default Posts