import React, { Component } from 'react'
import { Comment, Segment } from 'semantic-ui-react'
import MessageHeader from './MessageHeader'
import MessageForm from './MessageForm'
import firebase from '../../firebase'
import Message from './Message'

class Messages extends Component {
  messagesRef = React.createRef()
  dbMessagesRef = firebase.database().ref('messages')

  state = {
    messages: [],
    messagesLoading: true,
  }

  componentDidMount () {
    const { currentUser, currentChannel } = this.props

    if (currentUser && currentChannel) {
      this.addListeners(currentChannel.id)
    }
  }

  componentWillUnmount () {
    this.removeListeners()
  }

  componentDidUpdate () {
    this.scrollToBottom()
  }

  addListeners = (channelId) => {
    this.addMessageListener(channelId)
  }

  removeListeners = () => {
    this.dbMessagesRef.off()
  }

  addMessageListener = (channelId) => {
    let { messages } = this.state
    /* eslint-disable no-unused-vars */
    let ignoredKeyAfterAdding = null

    this.dbMessagesRef.child(channelId).once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        messages.push({ ...childSnapshot.val(), key: childSnapshot.key })
      })

      this.setState({ messages })

      const lastMessage = messages[messages.length - 1]
      const lastTimestamp = lastMessage ? lastMessage.timestamp + 1 : null

      let ignoredKeyAfterAdding = null

      this.dbMessagesRef
        .child(channelId)
        .orderByChild('timestamp')
        .startAt(lastTimestamp)
        .on('child_added', (snap) => {
          const message = snap.val()
          message.key = ignoredKeyAfterAdding = snap.key
          messages.push(message)

          this.setState({ messages, messagesLoading: false })
        })

      this.dbMessagesRef.child(channelId).on('child_changed', (snap) => {
        if (snap.key === ignoredKeyAfterAdding) {
          ignoredKeyAfterAdding = null
          return
        }

        const changedMessage = snap.val()
        const index = messages.findIndex(message => message.key === snap.key)
        messages[index] = { ...changedMessage, key: snap.key, edited: true }

        this.setState({ messages })
      })

      this.dbMessagesRef.child(channelId).on('child_removed', (snap) => {
        const deletedKeyMessage = snap.key
        messages = messages.filter(message => message.key !== deletedKeyMessage)

        this.setState({ messages })
      })
    })
  }

  getCountUniqueUsers () {
    return this.state.messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name)
      }

      return acc
    }, []).length
  }

  scrollToBottom () {
    this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight
  }

  renderMessages () {
    const { currentUser } = this.props

    return this.state.messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={currentUser}
      />
    ))
  }

  render () {
    const { currentUser, currentChannel } = this.props

    return (
      <React.Fragment>
        <MessageHeader
          channelName={currentChannel.name}
          countUniqueUsers={this.getCountUniqueUsers()}
        />

        <Segment>
          <Comment.Group>
            <div className="messages" ref={this.messagesRef}>
              {this.renderMessages()}
            </div>
          </Comment.Group>
        </Segment>

        <MessageForm
          currentUser={currentUser}
          currentChannel={currentChannel}
          dbMessagesRef={this.dbMessagesRef}
        />
      </React.Fragment>
    )
  }
}

export default Messages
