import React, { Component } from 'react'
import { Comment, Image } from 'semantic-ui-react'
import moment from 'moment'

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
    console.log({ diff, delay })

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
            : <Comment.Text>{message.content}</Comment.Text>}
        </Comment.Content>
      </Comment>
    )
  }
}

export default Message
