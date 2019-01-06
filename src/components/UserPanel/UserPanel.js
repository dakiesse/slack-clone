import React, { Component } from 'react'
import { Dropdown, Grid, Header, Icon, Image } from 'semantic-ui-react'
import firebase from '../../firebase'

class UserPanel extends Component {
  get dropdownOptions () {
    const { currentUser } = this.props

    return [
      {
        key: 'user',
        text: <span>Signed in as <strong>{currentUser.displayName}</strong></span>,
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
    const { currentUser } = this.props

    return (
      <Grid style={{ background: '#4c3c4c' }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            <Header floated="left" as="h2" inverted>
              <Icon name="code"/>
              <Header.Content>DevChat</Header.Content>
            </Header>

            <Header as="h4" inverted style={{ padding: '.25em' }}>
              <Dropdown
                trigger={
                  <span>
                    <Image src={currentUser.photoURL} spaced="right" avatar/>
                    {currentUser.displayName}
                  </span>
                }
                options={this.dropdownOptions}/>
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    )
  }
}

export default UserPanel
