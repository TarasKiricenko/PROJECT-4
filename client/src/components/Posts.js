// import { Link } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Posts = () => {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/posts') // * <-- replace with your endpoint
      console.log(data)
      setPosts(data)
    }
    getData()
  }, [])
  console.log(posts)
  return (
    <>
      {posts.map(item =>
        <div key={item.id}>
          <h1>{item.title}</h1>
          <p>{item.text}</p>
          <img src={item.image} />
          <div>
            {item.comments.map(comment =>
              <div key={comment.id}>
                <h3>{comment.owner.username}:</h3>
                <img src={comment.owner.profile_image} className='profile_image'></img>
                <h4>commented on {comment.created_at.replace('T', ' at ').slice(0, 22)}:</h4>
                <p>{comment.text}</p>
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
        </div>
      )}
      <Link to='/'><h1>Go back</h1></Link>
    </>
  )

}
export default Posts