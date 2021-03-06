import React, { Component } from 'react'
import { Button, Form, Icon, Input, Menu, Modal } from 'semantic-ui-react'
import firebase from '../../firebase'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../store/channel/actions'

class Channels extends Component {
  dbChannelRef = firebase.database().ref('channels')

  state = {
    channels: [],
    newChannelName: '',
    newChannelDetails: '',
    isModalOpened: false,
    firstLoad: true,
  }

  componentDidMount () {
    this.addDbListeners()
  }

  componentWillUnmount () {
    this.removeListeners()
  }

  handlerCreateChannel = () => {
    if (this.isFormValid()) {
      this.addChannel()
    }
  }

  handlerChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value })
  }

  addDbListeners = () => {
    const loadedChannels = []

    this.dbChannelRef.on('child_added', (snap) => {
      loadedChannels.push(snap.val())
      this.setState({ channels: loadedChannels }, this.setFirstChannel)
    })
  }

  removeListeners = () => {
    this.dbChannelRef.off()
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

  setCurrentChannel = (channel) => {
    this.props.setCurrentChannel(channel)
    this.props.setPrivateChannel(false)
  }

  setFirstChannel = () => {
    const { firstLoad, channels } = this.state
    const firstChannel = channels[0]

    if (firstLoad && firstChannel) {
      this.props.setCurrentChannel(firstChannel)
    }

    this.setState({ firstLoad: false })
  }

  isFormValid = () => {
    const { newChannelName, newChannelDetails } = this.state

    return newChannelName && newChannelDetails
  }

  openModal = () => {
    this.setState({ isModalOpened: true })
  }

  closeModal = () => {
    this.setState({ isModalOpened: false, newChannelName: '', newChannelDetails: '' })
  }

  renderModal () {
    const { isModalOpened } = this.state

    return (
      <Modal open={isModalOpened} onClose={this.closeModal} basic>
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

  renderChannels () {
    const { currentChannel } = this.props.channel

    return this.state.channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        active={currentChannel && channel.id === currentChannel.id}
        style={{ opacity: .7 }}
        onClick={() => this.setCurrentChannel(channel)}>
        # {channel.name}
      </Menu.Item>
    ))
  }

  render () {
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span><Icon name="exchange"/> CHANNELS</span> ({0}) <Icon name="add" onClick={this.openModal}/>
          </Menu.Item>

          {this.renderChannels()}
        </Menu.Menu>

        {this.renderModal()}
      </React.Fragment>
    )
  }
}

export default connect(
  ({ channel }) => ({ channel }),
  { setCurrentChannel, setPrivateChannel },
)(Channels)
