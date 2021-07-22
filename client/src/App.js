import axios from 'axios'
import React, { useEffect, useState } from 'react'

const App = () => {
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
          
        </div>
      )}
      {posts.map(item => <div key={item.created_at}>{item.id}</div>)}
      
    </>
  )
  
}

export default App
