import React, { Component } from 'react'
import { Comment, Image } from 'semantic-ui-react'
import moment from 'moment'
import PropTypes from 'prop-types'

const eachMilliseconds = 1000

class Message extends Component {
  timeoutId = null

  componentDidMount () {
    this.updateRenderTime()
  }

  componentWillUnmount () {
    clearTimeout(this.timeoutId)
  }

  updateRenderTime () {
    const diff = Date.now() - this.props.message.timestamp
    const delay = diff > 60000 ? 60000 : eachMilliseconds

    this.timeoutId = setTimeout(() => {
      this.forceUpdate()
      this.updateRenderTime()
    }, delay)
  }

  isOwnMessage (message, user) {
    return message.user.id === user.uid ? 'message__self' : ''
  }

  timeFromNow (timestamp) {
    return moment(timestamp).fromNow()
  }

  isImage (message) {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content')
  }

  getContent (message) {
    if (message.edited) {
      return (
        <React.Fragment>
          {message.content} <span className="message__edited-mark">(edited)</span>
        </React.Fragment>
      )
    }

    return message.content
  }

  render () {
    const { message, user } = this.props

    return (
      <Comment>
        <Comment.Avatar src={message.user.avatar}/>
        <Comment.Content className={this.isOwnMessage(message, user)}>
          <Comment.Author as="a">{message.user.name}</Comment.Author>
          <Comment.Metadata>{this.timeFromNow(message.timestamp)}</Comment.Metadata>
          {this.isImage(message)
            ? <Image className="message__image" src={message.image}/>
            : <Comment.Text>{this.getContent(message)}</Comment.Text>}
        </Comment.Content>
      </Comment>
    )
  }
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

export default Message
