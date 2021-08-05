import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { userIsAuthenticated } from './authentication/authentication'
import { getTokenFromLocalStorage } from './authentication/authentication'


const Posts2 = () => {

  const [posts, setPosts] = useState([])
  const [postsBackup, setPostsBackup] = useState([])
  const [count, setCount] = useState(0)
  const [userId, setUserId] = useState(null)
  const history = useHistory()

  const openInNewTab = (event) => {
    window.open(event.target.src, '_blank')
  }

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

  const getPayload = () => {
    const token = getTokenFromLocalStorage()
    if (!token) return false
    const parts = token.split('.')
    if (parts.length < 3) return false
    const id = (JSON.parse(atob(parts[1])))
    setUserId(id.sub)
    return JSON.parse(atob(parts[1]))
  }
  console.log(userId)

  const handleLogout = () => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('posts')
    history.push('/')
  }

  const [displayingSaved, setDisplayingSaved] = useState(false)
  console.log('currently displaying saved is', displayingSaved)
  const seeAllPosts = () => {

    setDisplayingSaved(!displayingSaved)
    console.log('currently displaying saved is', displayingSaved)
    // setCount(count => count + 1)
    setPosts(postsBackup)
  }

  // console.log(savedPosts)
  // if (editedPostId) {
  //   console.log(savedPosts)
  //   const postToAddBack = posts.find(item => item.id === parseInt(editedPostId))
  //   console.log(postToAddBack)
  //   // savedPosts.push(postToAddBack)
  //   // console.log(savedPosts)
  // } else {
  //   console.log('bye')
  // }

  // const postToAddBackId = window.localStorage.getItem('idOfUpdatedPost')
  // console.log(postToAddBackId)
  // const postToAddBack = posts.find(item => item.id === parseInt(postToAddBackId))
  // console.log(postToAddBack)
  // if (postToAddBack.liked === true) {
  //   console.log('hi')
  // }

  const seeSavedPosts = () => {
    console.log('currently displaying saved is', displayingSaved)
    setFilteredPosts([])
    console.log('displaying saved')
    const postsFromStorage = JSON.parse(window.localStorage.getItem('posts'))
    console.log('post from local storage', postsFromStorage)
    const arrayOfStoredIds = postsFromStorage.map(item => item.id)
    console.log('ids of posts from local storage', arrayOfStoredIds)
    const actualPosts = posts.map(item => item)
    console.log('actual posts on state', actualPosts)
    if (postsFromStorage.length > 0) {
      savedPosts.length = 0
      for (let i = 0; i < postsFromStorage.length; i++) {
        console.log(postsFromStorage[i].id)
        if (posts.some(post => post.id === postsFromStorage[i].id)) {
          console.log('yay')
          const actualPost = posts.find(item => item.id === postsFromStorage[i].id)
          console.log(actualPost)
          savedPosts.push(actualPost)
        }
      }
    }
    // posts.find(item => item.id === parseInt(postToAddBackId))
    // const updatedPostToDisplay = posts.filter(item => item.id === parseInt(arrayOfStoredIds))
    // console.log('actual posts I need', updatedPostToDisplay)
    console.log(savedPosts)
    // setSavedPosts(updatedPostToDisplay)
    // setSavedPosts(postsFromStorage)
    // savedPosts.length = 0
    // console.log(savedPosts)
    // savedPosts.push(updatedPostToDisplay[0,1,2,3,4,5,6,7,8,9,10])
    // console.log(savedPosts)
    setDisplayingSaved(!displayingSaved)
    setPosts(savedPosts)
  }

  const [savedPosts, setSavedPosts] = useState(JSON.parse(localStorage.getItem('posts')))

  const [savedCount, setSavedCount] = useState(false)

  const savePost = (event) => {
    console.log('saving post')
    if (!savedPosts.find((item => item.id === parseInt(event.target.id)))) {
      const postToSave = posts.find((item => item.id === parseInt(event.target.id)))
      console.log(postToSave)
      savedPosts.push(postToSave)
      window.localStorage.setItem('posts', JSON.stringify(savedPosts))
      setSavedCount(!savedCount)
    } else {
      console.log(('already in'))
    }
  }

  const unsavePost = (event) => {
    console.log('unsaving post')
    if (savedPosts.find((item => item.id === parseInt(event.target.id)))) {
      const storedPosts = JSON.parse(localStorage.getItem('posts'))
      console.log(storedPosts)
      const storedPostsWithoutUnsavedPost = storedPosts.filter(item => item.id !== parseInt(event.target.id))
      console.log(storedPostsWithoutUnsavedPost)
      window.localStorage.setItem('posts', JSON.stringify(storedPostsWithoutUnsavedPost))
      const savedPostsAfterDeletion = savedPosts.filter(item => item.id !== parseInt(event.target.id))
      console.log(event.target.id)
      console.log(savedPostsAfterDeletion)
      // setCount(count => count + 1)
      setSavedCount(!savedCount)
      setSavedPosts(savedPostsAfterDeletion)
      setPosts(savedPosts)
    }
  }

  const deletePost = async (event) => {
    console.log('deleting post')
    const confirm = window.confirm('Are you sure?')
    if (confirm) {
      try {
        await axios.delete(`api/posts/${event.target.id}/`)
        setCount(count => count + 1)
      } catch (error) {
        console.log(error.message)
      }
    } else {
      console.log('cancelled deletion')
    }
  }

  const editPost = (event) => {
    console.log('editing')
    window.localStorage.setItem('postToEditId', event.target.id)
    history.push('/editpost')
  }

  const deleteComment = async (event) => {
    console.log('hi')
    try {
      await axios.delete(`api/comments/${event.target.id}`)
      setCount(count => count + 1)
    } catch (error) {
      console.log(error)
    }
  }

  const [showComments, setShowComments] = useState(false)

  const displayComments = (event) => {
    console.log('displaying comments')
    // setShowComments(!showComments)
    console.log(event.target)
    if (showComments === false) {
      event.target.innerHTML = 'Close comments'
      setShowComments(!showComments)
    } else {
      event.target.innerHTML = 'See comments'
      setShowComments(!showComments)
    }
  }

  const addComment = async (event) => {
    event.preventDefault()
    console.log('adding comment')
    try {
      await axios.post('api/comments/', comment)
      setCount(count => count + 1)
      clearCommentFields()
    } catch (error) {
      console.log(error)
    }
  }

  const clearCommentFields = () => {
    setComment({
      post: '',
      text: '',
      image: '',
      owner: '',
    })
  }

  const setToStorage = (event) => {
    window.localStorage.setItem('id', event.target.id)
  }

  const postId = window.localStorage.getItem('id')

  const handleChange = (event) => {
    const newComment = { ...comment, [event.target.name]: event.target.value, owner: userId, post: parseFloat(postId) }
    setComment(newComment)
  }

  const [comment, setComment] = useState({
    post: '',
    text: '',
    image: '',
    owner: '',
  })

  const [filteredPosts, setFilteredPosts] = useState([])

  const searchForPost = (event) => {
    // console.log(event.target.value)
    const searchArray = posts.filter(item => {
      // setCount(count => count + 1)onst hashtagsArray = item.hashtags.map(item => item.name).toString().replace(/,/g, '').replace(/_/g, '')
      setSavedCount(savedCount => savedCount + 1)
      return (item.title.toLowerCase().replace(/,/g, '').replace(/_/g, '').includes((event.target.value.toLowerCase()).replace(/,/g, '').replace(/_/g, '')) || item.hashtags.map(item => item.name).toString().toLowerCase().replace(/,/g, '').replace(/_/g, '').includes((event.target.value.toLowerCase()).replace(/,/g, '').replace(/_/g, '')))
      // return (item.title.toLowerCase().replace(/_/g, '').includes(event.target.value))
    })
    console.log(searchArray)
    setFilteredPosts(searchArray)
    // setCount(count => count + 1)
  }
  const clearSearch = () => {
    setFilteredPosts([])
    document.getElementById('search').value = ''
  }

  const goToTheTop = () => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
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
            <input type="text" placeholder="Look up for post" onChange={searchForPost} className="background shadow commenturl" id="search" />
            {/* {userIsAuthenticated() ? (displayingSaved === true ? <button onClick={seeAllPosts} className="commentbutton shadow">See all posts</button> : <button className="commentbutton shadow" onClick={seeSavedPosts}>See saved posts</button>) : null} */}
          </div>
        </div>
      </div>
      <div>
        <div className="background">
          {/* {((filteredPosts.length > 0 ? filteredPosts : posts)).map(item => */}
          {(filteredPosts.length > 0 ? filteredPosts : posts).map(item => {
            return <div key={item.id} id={item.id} className="separator shadow">
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
                {savedPosts.some(post => post.id === item.id) ? <p>❤️ You saved this post</p> : null}
              </div>
              {userIsAuthenticated() ? (savedPosts.some(thing => thing.id === item.id) ? <button onClick={unsavePost} id={item.id} className="commentbutton shadow">Fed up? Dislike!</button> : <button onClick={savePost} id={item.id} className="commentbutton shadow">Like it? Save it!</button>) : null}
              {(item.owner.id === userId) ? <p className="nothappy">Not really happy about your post?</p> : null}
              <div className="pairbuttons">
                {(item.owner.id === userId) ? <button className="bigred shadow" onClick={deletePost} id={item.id}>Delete this post</button> : null}
                {(item.owner.id === userId) ? <button className="bigred shadow" onClick={editPost} id={item.id + ',' + item.owner.id}>Edit this post</button> : null}
              </div>
              <div>
                {item.comments.length > 0 ?
                  <button className="commentbutton shadow" onClick={displayComments}>See comments</button>
                  :
                  // eslint-disable-next-line 
                  <p className="commentheadertext">No one commented yet, be the first!</p>
                }
                {/* {!showComments === false ? item.comments.map(comment => */}
                {item.comments.length !== 0 && showComments === true ? item.comments.map(comment =>
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
                )
                  :
                  null
                }
              </div>
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
                        <button type="submit" className="shadow" onClick={clearSearch}>Leave your comment</button>
                      </div>
                    </form>
                  </div>
                </>
                :
                <Link to="/login"><button className="commentbutton shadow">Login to comment</button></Link>
              }
            </div>
          })}
        </div>
      </div>
      <div className="footer">
        {userIsAuthenticated() ? (displayingSaved === true ? <button onClick={seeAllPosts} className="commentbutton shadow except">See all posts</button> : <button className="commentbutton shadow except" onClick={seeSavedPosts}>See saved posts</button>) : null}
        <button className="commentbutton shadow except" onClick={goToTheTop}>Go to the top</button>
      </div>
    </>

  )

}
export default Posts2