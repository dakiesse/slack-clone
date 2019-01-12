import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Header, Icon, Input, Segment } from 'semantic-ui-react'

class MessageHeader extends Component {
  get countUniqueUsers () {
    const { countUniqueUsers } = this.props
    const isPlural = countUniqueUsers > 1 || countUniqueUsers === 0

    return `${countUniqueUsers} user${isPlural ? 's' : ''}`
  }

  render () {
    const { channelName } = this.props

    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            #{channelName} <Icon name="star outline" color="black"/>
          </span>
          <Header.Subheader>{this.countUniqueUsers}</Header.Subheader>
        </Header>

        {/* Channel Search Input */}
        <Header floated="right">
          <Input size="mini"
                 icon="search"
                 name="searchTerm"
                 placeholder="Search Messages"/>
        </Header>
      </Segment>
    )
  }
}

MessageHeader.propTypes = {
  channelName: PropTypes.string.isRequired,
  countUniqueUsers: PropTypes.number.isRequired,
}

export default MessageHeader
