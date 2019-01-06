import React, { Component } from 'react'
import { Button, Form, Icon, Input, Menu, Modal } from 'semantic-ui-react'

class Channels extends Component {
  state = {
    newChannelName: '',
    newChannelDetails: '',
    isOpeningModal: false,
  }

  handlerChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value })
  }

  openModal = () => {
    this.setState({ isOpeningModal: true })
  }

  closeModal = () => {
    this.setState({ isOpeningModal: false })
  }

  renderModal () {
    const { isOpeningModal } = this.state

    return (
      <Modal open={isOpeningModal} onClose={this.closeModal} basic>
        <Modal.Header>Add a Channel</Modal.Header>

        <Modal.Content>
          <Form>
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
          <Button color="green" inverted>
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
