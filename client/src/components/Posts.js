import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { userIsAuthenticated } from './authentication/authentication'
import { getTokenFromLocalStorage } from './authentication/authentication'


const Posts = () => {

  const [count, setCount] = useState(0)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/posts')
      console.log(data)
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
    console.log(id.sub)
    setUserId(id.sub)
    return JSON.parse(atob(parts[1]))
  } 
  console.log(userId)

  const deletePost = async (event) => {
    console.log('deleting')
    console.log(event.target.id)
    
    try {
      await axios.delete(`api/posts/${event.target.id}/`)
      console.log('deleted post, now need to rerender')
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
        <div key={item.id}>
          <h1>{item.title}</h1>
          <p>{item.text}</p>
          <p className="hidden">{item.owner.id}</p>
          <Link to="/posts" onClick={openInNewTab}><img src={item.image} /></Link>
          <div>
            {console.log(item.owner.id)}
            {(item.owner.id === userId) ? <button className="bigred" onClick={deletePost} id={item.id}>delete</button> : null}
          </div>
          <div>
            {item.comments.map(comment =>
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
              </div>
            )}
          </div>
          <div>
            {item.hashtags.map(hashtag =>
              <div key={hashtag.id}>
                <p>{hashtag.name}</p>
              </div>
            )}
          </div>
          {userIsAuthenticated() ?
            <button>Comment on this</button>
            :
            <Link to="/login"><button>Login to comment</button></Link>
          }
        </div>
      )}
    </>
  )

}
export default Posts