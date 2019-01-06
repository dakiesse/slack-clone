import React, { Component } from 'react'
import { Button, Form, Icon, Input, Menu, Modal } from 'semantic-ui-react'
import firebase from '../../firebase'

class Channels extends Component {
  dbChannelRef = firebase.database().ref('channels')

  state = {
    newChannelName: '',
    newChannelDetails: '',
    isOpeningModal: false,
  }

  handlerCreateChannel = () => {
    if (this.isFormValid()) {
      this.addChannel()
    }
  }

  handlerChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value })
  }

  addChannel = async () => {
    const { newChannelName, newChannelDetails } = this.state
    const { currentUser } = this.props

    const key = this.dbChannelRef.push().key

    const newChannel = {
      id: key,
      name: newChannelName,
      details: newChannelDetails,
      createdBy: {
        user: currentUser.displayName,
        avatar: currentUser.photoURL,
      }
    }

    await this.dbChannelRef.child(key).update(newChannel)
    this.closeModal()
  }

  isFormValid = () => {
    const { newChannelName, newChannelDetails } = this.state

    return newChannelName && newChannelDetails
  }

  openModal = () => {
    this.setState({ isOpeningModal: true })
  }

  closeModal = () => {
    this.setState({ isOpeningModal: false, newChannelName: '', newChannelDetails: '' })
  }

  renderModal () {
    const { isOpeningModal } = this.state

    return (
      <Modal open={isOpeningModal} onClose={this.closeModal} basic>
        <Modal.Header>Add a Channel</Modal.Header>

        <Modal.Content>
          <Form onSubmit={this.handlerCreateChannel}>
            <Form.Field>
              <Input
                label="Name of Channel"
                name="newChannelName"
                fluid
                onChange={this.handlerChange}
              />
            </Form.Field>

            <Form.Field>
              <Input
                label="About the Channel"
                name="newChannelDetails"
                fluid
                onChange={this.handlerChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button color="green" inverted onClick={this.handlerCreateChannel}>
            <Icon name="checkmark"/> Add
          </Button>

          <Button color="red" inverted onClick={this.closeModal}>
            <Icon name="remove"/> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  render () {
    return (
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: '2em' }}>
          <Menu.Item>
            <span><Icon name="exchange"/> CHANNELS</span> ({0}) <Icon name="add" onClick={this.openModal}/>
          </Menu.Item>
        </Menu.Menu>

        {this.renderModal()}
      </React.Fragment>
    )
  }
}

export default Channels
