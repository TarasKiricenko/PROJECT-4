import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Posts from './components/Posts'
import Register from './components/Register'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/posts' component={Posts}/>
        <Route exact path='/register' component={Register}/>
      </Switch>
    </Router>
  )
}

export default App
