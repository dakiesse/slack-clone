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
import { clearUser, setUser } from './store/user/actions'
import Spinner from './components/Spinner'
import './configs/moment'

const store = createStore(rootReducer, composeWithDevTools())

class Root extends React.Component {
  componentDidMount () {
    firebase.auth().onAuthStateChanged((user) => {
      const { history, location, setUser, clearUser } = this.props

      if (user) {
        setUser(user)

        if (['login', 'register'].includes(location.pathname.slice(1))) {
          history.push('/')
        }
      } else {
        history.push('/login')
        clearUser()
      }
    })
  }

  render () {
    const { isLoading } = this.props

    return isLoading
      ? (
        <Spinner/>
      )
      : (
        <Switch>
          <Route exact path="/" component={App}/>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
          <Route component={() => (<div>Not Found</div>)}/>
        </Switch>
      )
  }
}

const RootWithRouter = withRouter(connect(
  ({ user }) => ({ isLoading: user.isLoading }),
  { setUser, clearUser }
)(Root))

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
