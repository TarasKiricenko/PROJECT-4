import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AddPost from './components/AddPost'
import Home from './components/Home'
import Login from './components/Login'
import Posts from './components/Posts'
import Register from './components/Register'
import EditPost from './components/EditPost'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/posts' component={Posts}/>
        <Route exact path='/register' component={Register}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/addpost' component={AddPost}/>
        <Route exact path='/editpost' component={EditPost}/>
      </Switch>
    </Router>
  )
}

export default App
