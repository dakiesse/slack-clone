import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Menu } from 'semantic-ui-react'
import firebase from '../../firebase'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../store/channel/actions'

class DirectMessages extends Component {
  dbUsersRef = firebase.database().ref('users')
  dbPresenceRef = firebase.database().ref('presence')
  dbConnectedRef = firebase.database().ref('.info/connected')

  state = {
    loadedUsers: [],
  }

  componentDidMount () {
    this.addListeners()
  }

  addListeners () {
    const { currentUser } = this.props
    const loadedUsers = []

    this.dbUsersRef.on('child_added', (snap) => {
      if (currentUser.uid !== snap.key) {
        const user = snap.val()
        user.key = snap.key
        user.status = 'offline'

        loadedUsers.push(user)
        this.setState({ loadedUsers })
      }
    })

    this.dbConnectedRef.on('value', (snap) => {
      if (snap.val() === true) {
        const ref = this.dbPresenceRef.child(currentUser.uid)
        ref.set(true)
        ref.onDisconnect().remove((err) => {
          if (err !== null) {
            console.error(err)
          }
        })
      }
    })

    this.dbPresenceRef.on('child_added', (snap) => {
      if (currentUser.uid !== snap.key) {
        this.addStatusToUser(snap.key, true)
      }
    })

    this.dbPresenceRef.on('child_removed', (snap) => {
      if (currentUser.uid !== snap.key) {
        this.addStatusToUser(snap.key, false)
      }
    })
  }

  addStatusToUser (userId, connected = true) {
    const updatedUsers = this.state.loadedUsers.reduce((acc, user) => {
      if (user.key === userId) {
        user.status = connected ? 'online' : 'offline'
      }

      return acc.concat(user)
    }, [])

    this.setState({ loadedUsers: updatedUsers })
  }

  isUserOnline (user) {
    return user.status === 'online'
  }

  changeChannel (user) {
    const channelId = this.getChannelId(user.key)
    const channelData = {
      id: channelId,
      name: user.name,
    }
    this.props.setCurrentChannel(channelData)
    this.props.setPrivateChannel(true)
  }

  getChannelId (userId) {
    const currentUserId = this.props.currentUser.uid

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`
  }

  render () {
    const { currentChannel } = this.props
    const { loadedUsers } = this.state

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span><Icon name="mail"/> DIRECT MESSAGES</span> ({loadedUsers.length})
        </Menu.Item>

        {loadedUsers.map((user) => (
          <Menu.Item
            key={user.key}
            active={this.getChannelId(user.key) === currentChannel.id}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: .7, fontStyle: 'italic' }}
          >
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? 'green' : 'red'}
            /> @ {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    )
  }
}

DirectMessages.propTypes = {
  currentUser: PropTypes.object.isRequired,
}

export default connect(
  ({ channel }) => ({ currentChannel: channel.currentChannel }),
  { setCurrentChannel, setPrivateChannel },
)(DirectMessages)
