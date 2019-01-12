import React, { Component } from 'react'
import { Button, Input, Segment } from 'semantic-ui-react'
import firebase from '../../firebase'
import FileModal from './FileModal'
import uuidv4 from 'uuid/v4'
import ProgressBar from './ProgressBar'

class MessageForm extends Component {
  dbStorageRef = firebase.storage().ref()

  state = {
    message: '',
    isLoading: false,
    errors: [],
    isModalOpened: false,
    uploadState: '',
    uploadTask: null,
    percentUploaded: 0,
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
      await dbMessagesRef.child(currentChannel.id).push(this.createMessage())
      this.setState({ isLoading: false, message: '', errors: [] })
    } catch (e) {
      this.setState({ isLoading: false, errors: [e] })
    }
  }

  openModal = () => {
    this.setState({ isModalOpened: true })
  }

  closeModal = () => {
    this.setState({ isModalOpened: false })
  }

  createMessage (fileUrl = null) {
    const { uid: id, displayName: name, photoURL: avatar } = this.props.currentUser
    const { message: content } = this.state

    const message = {
      user: { id, name, avatar },
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    }

    if (fileUrl !== null) {
      message.image = fileUrl
    } else {
      message.content = content
    }

    return message
  }

  uploadFile = (file, metadata) => {
    const { currentChannel } = this.props
    const { errors } = this.state

    const pathToUpload = currentChannel.id
    const filePath = `chat/public${uuidv4()}.jpg`

    const uploadTask = this.dbStorageRef.child(filePath).put(file, metadata)

    this.setState({
      uploadState: 'uploading',
    }, () => {
      uploadTask.on('state_changed',
        (snap) => {
          const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          this.setState({ percentUploaded })
        },
        (err) => {
          console.error(err)

          this.setState({
            errors: errors.concat(err),
            uploadState: 'error',
          })
        },
        async () => {
          try {
            const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL()
            this.sendFileMessage(downloadUrl, pathToUpload)
          } catch (err) {
            console.error(err)

            this.setState({
              errors: errors.concat(err),
              uploadState: 'error',
            })
          }
        })
    })
  }

  async sendFileMessage (fileUrl, pathToUpload) {
    const message = this.createMessage(fileUrl)
    await this.props.dbMessagesRef.child(pathToUpload).push().set(message)
    this.setState({ uploadState: 'done' })
  }

  render () {
    const { errors, message, isLoading, isModalOpened, uploadState, percentUploaded } = this.state

    return (
      <Segment className="message__form">
        <Input
          name="message"
          label={<Button icon="add"/>}
          labelPosition="left"
          placeholder="Write your message"
          error={errors.length > 0}
          value={message}
          fluid
          style={{ marginBottom: '.7em' }}
          onChange={this.handleChange}
        />

        <Button.Group icon widths="2">
          <Button
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            disabled={isLoading}
            onClick={this.sendMessage}
          />

          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            disabled={uploadState === 'uploading'}
            onClick={this.openModal}
          />
        </Button.Group>

        <FileModal
          isOpened={isModalOpened}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />

        <ProgressBar uploadState={uploadState} percentUploaded={percentUploaded}/>
      </Segment>
    )
  }
}

export default MessageForm
