import React, { Component } from 'react'
import { Dropdown, Grid, Header, Icon } from 'semantic-ui-react'
import firebase from '../../firebase'

class UserPanel extends Component {
  get dropdownOptions () {
    return [
      {
        key: 'user',
        text: <span>Signed in as <strong>User</strong></span>,
        disabled: true,
      },
      {
        key: 'avatar',

        text: <span>Change Avatar</span>,
      },
      {
        key: 'signout',
        text: <span onClick={this.handlerSignout}>Sign Out</span>,
      },
    ]
  }

  handlerSignout = async () => {
    await firebase.auth().signOut()
  }

  render () {
    return (
      <Grid style={{ background: '#4c3c4c' }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            <Header floated="left" as="h2" inverted>
              <Icon name="code"/>
              <Header.Content>DevChat</Header.Content>
            </Header>
          </Grid.Row>

          <Header as="h4" inverted style={{ padding: '.25em' }}>
            <Dropdown trigger={
              <span>User</span>
            } options={this.dropdownOptions}/>
          </Header>
        </Grid.Column>
      </Grid>
    )
  }
}

export default UserPanel
