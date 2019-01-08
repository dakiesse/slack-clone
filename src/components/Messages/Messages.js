import React, { Component } from 'react'
import { Comment, Segment } from 'semantic-ui-react'
import MessageHeader from './MessageHeader'
import MessageForm from './MessageForm'
import firebase from '../../firebase'

class Messages extends Component {
  dbMessagesRef = firebase.database().ref('messages')

  render () {
    const { currentUser, currentChannel } = this.props

    return (
      <React.Fragment>
        <MessageHeader/>

        <Segment>
          <Comment.Group className="messages">

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
