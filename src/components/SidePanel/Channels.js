import React, { Component } from 'react'
import { Icon, Menu } from 'semantic-ui-react'

class Channels extends Component {
  render () {
    return (
      <Menu.Menu style={{ paddingBottom: '2em' }}>
        <Menu.Item>
          <span><Icon name="exchange"/> CHANNELS</span> ({0}) <Icon name="add"/>
        </Menu.Item>
      </Menu.Menu>
    )
  }
}

export default Channels
