import React, { Component } from 'react'
import { Button, Input, Segment } from 'semantic-ui-react'
import firebase from '../../firebase'

class MessageForm extends Component {
  state = {
    message: '',
    isLoading: false,
    errors: [],
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value })
  }

  sendMessage = async () => {
    const { currentChannel, dbMessagesRef } = this.props
    const { message } = this.state

    if (!message) {
      return this.setState({ errors: [{ message: 'Add a message' }] })
    }

    this.setState({ isLoading: true })

    try {
      await dbMessagesRef.child(currentChannel.id).push().set(this.createMessage())
      this.setState({ isLoading: false, message: '', errors: [] })
    } catch (e) {
      this.setState({ isLoading: false, errors: [e] })
    }
  }

  createMessage = () => {
    const { uid: id, displayName: name, photoURL: avatar } = this.props.currentUser
    const { message } = this.state

    return {
      content: message,
      user: { id, name, avatar },
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    }
  }

  render () {
    const { errors } = this.state

    return (
      <Segment className="message__form">
        <Input name="message"
               label={<Button icon="add"/>}
               labelPosition="left"
               placeholder="Write your message"
               error={errors.length > 0}
               fluid
               style={{ marginBottom: '.7em' }}
               onChange={this.handleChange}/>

        <Button.Group icon widths="2">
          <Button color="orange" content="Add Reply" labelPosition="left" icon="edit" onClick={this.sendMessage}/>
          <Button color="teal" content="Upload Media" labelPosition="right" icon="cloud upload"/>
        </Button.Group>
      </Segment>
    )
  }
}

export default MessageForm
