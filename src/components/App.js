import React from 'react'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import ColorPanel from './ColorPanel/ColorPanel'
import SidePanel from './SidePanel/SidePanel'
import Messages from './Messages/Messages'
import MetaPanel from './MetaPanel/MetaPanel'
import './App.css'

const App = ({ currentUser }) => (
  <Grid className="app" columns="equal">
    <ColorPanel/>
    <SidePanel currentUser={currentUser}/>

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages/>
    </Grid.Column>

    <Grid.Column width={4}>
      <MetaPanel/>
    </Grid.Column>
  </Grid>
)

export default connect(
  ({ user }) => ({ currentUser: user.currentUser })
)(App)
