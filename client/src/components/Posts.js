import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { userIsAuthenticated } from './authentication/authentication'
import { getTokenFromLocalStorage } from './authentication/authentication'


const Posts = () => {

  const history = useHistory()
  const [count, setCount] = useState(0)
  const [posts, setPosts] = useState([])
  const [postsBackup, setPostsBackup] = useState([])
  const [render, setRender] = useState(false)

  const setToStorage = (event) => {
    window.localStorage.setItem('id', event.target.id)
  }
  const postId = window.localStorage.getItem('id')

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/posts')
      data.sort().reverse()
      data.map(item => delete item.owner['email'])
      data.map(item => item.comments.map(item => delete item.owner['email']))
      console.log(data)
      setPosts(data)
      setPostsBackup(data)
    }
    getData()
    getPayload()
  }, [count])

  useEffect(() => {
    console.log('hi')
  }, [render])

  const openInNewTab = (event) => {
    window.open(event.target.src, '_blank')
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
    console.log('adding')
    try {
      await axios.post('api/comments/',
        comment
      )
      history.push('/posts')
      console.log('added')
      console.log(filteredPosts)
      clearCommentFields()
      setRender(!render)
      setCount(count => count - 1)
    } catch (error) {
      console.log(error)
    }

  }

  const handleChange = (event) => {
    // event.preventDefault()
    const newComment = { ...comment, [event.target.name]: event.target.value, owner: userId, post: parseFloat(postId) }
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
    // event.preventDefault()
    console.log('deleting')
    try {
      await axios.delete(`api/comments/${event.target.id}`)
      // console.log(filteredPosts)
      setRender(!render)
      // setCount(count => count + 1)
    } catch (error) {
      console.log(error)
    }
    setCount(count => count + 1)
  }

  const [showComments, setShowComments] = useState(false)
  const displayComments = (event) => {
    if (showComments === false) {
      event.target.innerHTML = 'Close comments'
      setShowComments(!showComments)
    } else {
      event.target.innerHTML = 'See comments'
      setShowComments(!showComments)
    }
  }

  const [filteredPosts, setFilteredPosts] = useState([])
  
  const searchForPost = (event) => {
    const searchArray = posts.filter(item => {
      const hashtagsArray = item.hashtags.map(item => item.name).toString().replace(/,/g, '').replace(/_/g, '')
      setSavedCount(savedCount => savedCount + 1)
      return (item.title.toLowerCase().replace(/,/g, '').replace(/_/g, '').includes((event.target.value.toLowerCase()).replace(/,/g, '').replace(/_/g, '')) || hashtagsArray.toLowerCase().includes(event.target.value.toLowerCase()))
    })
    setFilteredPosts(searchArray)
  }

  const [savedPosts, setSavedPosts] = useState(JSON.parse(localStorage.getItem('posts')))

  const savePost = (event) => {

    if (!savedPosts.find((item => item.id === parseInt(event.target.id)))) {
      savedPosts.push((posts.find(item => item.id === parseInt(event.target.id))))
      window.localStorage.setItem('posts', JSON.stringify(savedPosts))
      window.localStorage.setItem('postsCopy', JSON.stringify(savedPosts))
      setCount(count => count + 1)
      console.log
    } else {
      null
    }
  }

  const [savedCount, setSavedCount] = useState(0)

  const seeSaved = () => {
    setSavedPosts(JSON.parse(localStorage.getItem('posts')))
    setSavedCount(savedCount => savedCount + 1)
    setPosts(savedPosts)
  }

  const backLikeItWas = () => {
    setSavedPosts(posts)
    setPosts(postsBackup)
    setSavedCount(savedCount => savedCount - 1)
  }

  const unsavePost = (event) => {
    const storedPosts = JSON.parse(localStorage.getItem('posts'))
    console.log(storedPosts)
    const storedPostsWithoutUnsavedPost = storedPosts.filter(item => item.id !== parseInt(event.target.id))
    console.log(storedPostsWithoutUnsavedPost)
    window.localStorage.setItem('posts', JSON.stringify(storedPostsWithoutUnsavedPost))
    const storedPostsAfterUpdate = JSON.parse(localStorage.getItem('posts'))
    console.log(storedPostsAfterUpdate)
    console.log(savedPosts.filter(item => item.id !== parseInt(event.target.id)))
    setSavedPosts(savedPosts.filter(item => item.id !== parseInt(event.target.id)))
    // setSavedPosts(storedPostsAfterUpdate)
    
  }

  const handleLogout = () => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('posts')
    history.push('/')
  }

  const clearCommentFields = () => {
    setComment({
      post: '',
      text: '',
      image: '',
      owner: '',
    })
  }
  return (
    <>
      <div className="row">
        <div className="hrefclass background">
          <div className="frontpagenav">
            <Link to='/'><h3>Go back to homepage</h3></Link>
            {userIsAuthenticated() ?
              <>
                <Link to='/addpost'><h3>Add post</h3></Link>
                <Link to='/' onClick={handleLogout}><h3>Logout</h3></Link>
              </>
              :
              <Link to='/login'><h3>Login</h3></Link>
            }
          </div>
          <div className="">
            <input type="text" placeholder="Look up for post" onChange={searchForPost} className="background shadow commenturl" />
            {userIsAuthenticated() ? (savedCount > 0 ? <button onClick={backLikeItWas} className="commentbutton shadow">See all posts</button> : <button className="commentbutton shadow" onClick={seeSaved}>See saved posts</button>) : null}
          </div>
        </div>
        <div>
          <div className="background">
            {((filteredPosts.length > 0 ? filteredPosts : posts)).map(item =>
              <div key={item.id} id={item.id} className="separator shadow">
                <p className="postname">{item.title}</p>
                <p>{item.created_at.replace('T', ' at ').slice(0, 22)}</p>
                <Link to="/posts" onClick={openInNewTab}><img src={item.image} alt="imageofpost" className="shadow" /></Link>
                <p className="posttext">{item.text}</p>
                <div className="hashtags">
                  {item.hashtags.map(hashtag =>
                    <div className="onehashtag shadow" key={hashtag.id}>
                      <p ># {hashtag.name} </p>
                    </div>
                  )}
                  {savedPosts.some(thing => thing.id === item.id) ? <p>❤️ You saved this post</p> : null}
                </div>

                {userIsAuthenticated() ? (savedPosts.some(thing => thing.id === item.id) ? <button onClick={unsavePost} id={item.id} className="commentbutton shadow">Fed up? Dislike!</button> : <button onClick={savePost} id={item.id} className="commentbutton shadow">Like it? Save it!</button>) : null}
                {(item.owner.id === userId) ? <p className="nothappy">Not really happy about your post?</p> : null}
                <div className="pairbuttons">
                  {(item.owner.id === userId) ? <button className="bigred shadow" onClick={deleteConfirm} id={item.id}>Delete this post</button> : null}
                  {(item.owner.id === userId) ? <button className="bigred shadow" onClick={editPost} id={item.id + ',' + item.owner.id}>Edit this post</button> : null}
                </div>
                <div id={item.index}><button className="commentbutton shadow" onClick={displayComments}>See comments</button>{showComments === true ?
                  <div>
                    {item.comments.map(comment =>
                      <div key={comment.id} className="commentdiv shadow">
                        <div className="commentheader">
                          <img src={comment.owner.profile_image} className='profile_image shadow' alt='profileimage'></img>
                          <h5>{comment.owner.username} added comment to that post on {comment.created_at.replace('T', ' at ').slice(0, 22)}</h5>
                        </div>
                        <div className="commentheadertextwrap">
                          <p className="commentheadertext">{comment.text}</p>
                        </div>
                        <div>
                          {comment.image.length === 0 ?
                            null
                            :
                            <>
                              <img className="commentimage" src={comment.image} alt="commentimage" />
                            </>
                          }
                        </div>
                        <div className="pairbuttons">
                          {(comment.owner.id === userId) ? <button onClick={deleteComment} id={comment.id} className="deletecomment shadow">Delete this comment</button> : null}
                        </div>
                      </div>
                    )}
                    {userIsAuthenticated() ?
                      <>
                        <div>
                          <form onSubmit={addComment}>
                            <div>
                              <label className="commenttextlabel">Add a comment:</label>
                              <textarea onMouseOver={setToStorage} onClick={setToStorage} id={item.id} className="commenttextinput shadow"
                                onChange={handleChange}
                                type="textarea"
                                name="text"
                                placeholder="Type in your comment here"
                                value={comment.text}
                                required
                              />
                            </div>
                            <div>
                              <label className="commenttextlabel">Add an url for an image to be attached, if you prefer:</label>
                              <input className="shadow commenturl"
                                onChange={handleChange}
                                type="url"
                                name="image"
                                placeholder="Optional"
                                value={comment.image}
                              />
                            </div>
                            <div className="pairbuttons">
                              <button type="submit" className="shadow">Leave your comment</button>
                            </div>
                          </form>
                        </div>
                      </>
                      :
                      <Link to="/login"><button className="commentbutton shadow">Login to comment</button></Link>
                    }
                  </div>
                  :
                  null
                }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>

  )

}
export default Posts