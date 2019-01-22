import React from 'react'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import ColorPanel from './ColorPanel/ColorPanel'
import SidePanel from './SidePanel/SidePanel'
import Messages from './Messages/Messages'
import MetaPanel from './MetaPanel/MetaPanel'
import './App.css'

const App = ({ currentUser, currentChannel, isPrivateChannel }) => (
  <Grid className="app" columns="equal">
    <ColorPanel/>
    <SidePanel
      key={currentUser && currentUser.uid}
      currentUser={currentUser}
    />

    <Grid.Column style={{ marginLeft: 320 }}>
      {currentChannel && (
        <Messages
          key={currentChannel && currentChannel.id}
          currentUser={currentUser}
          currentChannel={currentChannel}
          isPrivateChannel={isPrivateChannel}
        />
      )}
    </Grid.Column>

    <Grid.Column width={4}>
      <MetaPanel/>
    </Grid.Column>
  </Grid>
)

export default connect(
  ({ user, channel }) => ({
    currentUser: user.currentUser,
    currentChannel: channel.currentChannel,
    isPrivateChannel: channel.isPrivateChannel,
  })
)(App)
