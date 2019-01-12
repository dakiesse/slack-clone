import React, { Component } from 'react'
import { Comment, Segment } from 'semantic-ui-react'
import MessageHeader from './MessageHeader'
import MessageForm from './MessageForm'
import firebase from '../../firebase'
import Message from './Message'

class Messages extends Component {
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

  addListeners = (channelId) => {
    this.addMessageListener(channelId)
  }

  removeListeners = () => {
    this.dbMessagesRef.off()
  }

  addMessageListener = (channelId) => {
    const loadedMessages = []

    this.dbMessagesRef.child(channelId).on('child_added', (snap) => {
      loadedMessages.push(snap.val())

      this.setState({ messages: loadedMessages, messagesLoading: false })
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
          <Comment.Group className="messages">
            {this.renderMessages()}
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
