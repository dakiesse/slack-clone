import React, { Component } from 'react'
import PropTypes from 'prop-types'
import mime from 'mime-types'
import { Button, Icon, Input, Modal } from 'semantic-ui-react'

class FileModal extends Component {
  static availableMimeTypes = ['image/jpg', 'image/png']

  state = {
    file: null,
  }

  componentDidUpdate (prevProps) {
    if (prevProps.isOpened !== this.props.isOpened) {
      this.clearFile()
    }
  }

  setFile = (e) => {
    this.setState({ file: e.target.files[0] })
  }

  sendFile = () => {
    const { file } = this.state
    const { uploadFile, closeModal } = this.props

    if (file && this.isAuthorized(file.name)) {
      const metadata = { contentType: mime.lookup(file.name) }
      uploadFile(file, metadata)
      closeModal()
      this.clearFile()
    }
  }

  isAuthorized (filename) {
    return FileModal.availableMimeTypes.includes(mime.lookup(filename))
  }

  clearFile () {
    this.setState({ file: null })
  }

  render () {
    const { isOpened, closeModal } = this.props

    return (
      <Modal basic open={isOpened} onClose={closeModal}>
        <Modal.Header>Select an Image File</Modal.Header>

        <Modal.Content>
          <Input
            fluid
            label="File type: jpg, png"
            name="file"
            type="file"
            onChange={this.setFile}
          />
        </Modal.Content>

        <Modal.Actions>
          <Button inverted color="green" onClick={this.sendFile}>
            <Icon name="checkmark"/> Send
          </Button>

          <Button inverted color="red" onClick={closeModal}>
            <Icon name="remove"/> Send
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

FileModal.propTypes = {
  isOpened: PropTypes.bool,
  closeModal: PropTypes.func,
}

FileModal.defaultProps = {
  isOpened: false,
  closeModal: () => {},
}

export default FileModal
