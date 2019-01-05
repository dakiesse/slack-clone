import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import 'semantic-ui-css/semantic.min.css'
import firebase from './firebase'
import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer } from './store/rootReducer'
import { connect, Provider } from 'react-redux'
import { setUser } from './store/user/actions'

const store = createStore(rootReducer, composeWithDevTools())

class Root extends React.Component {
  componentDidMount () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.setUser(user)
        this.props.history.push('/')
      }
    })
  }

  render () {
    return (
      <Switch>
        <Route exact path="/" component={App}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
      </Switch>
    )
  }
}

const RootWithRouter = withRouter(connect(null, { setUser })(Root))

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithRouter/>
    </Router>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
