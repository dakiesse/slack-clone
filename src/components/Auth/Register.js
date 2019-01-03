import React, { Component } from 'react'
import { Button, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class Register extends Component {
  state = {}

  handlerChange = () => {}

  render () {
    return (
      <Grid className="app" textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange"/>
            Register for DevChat
          </Header>

          <Form size="large">
            <Segment stacked>
              <Form.Input name="username"
                          placeholder="Username"
                          fluid
                          icon="user"
                          iconPosition="left"
                          onChange={this.handlerChange}/>

              <Form.Input type="email"
                          name="email"
                          placeholder="Email Address"
                          fluid icon="mail"
                          iconPosition="left"
                          onChange={this.handlerChange}/>

              <Form.Input type="password"
                          name="password"
                          placeholder="Password"
                          fluid icon="lock"
                          iconPosition="left"
                          onChange={this.handlerChange}/>

              <Form.Input type="password"
                          name="passwordConfirmation"
                          placeholder="Password Confirmation"
                          fluid icon="repeat"
                          iconPosition="left"
                          onChange={this.handlerChange}/>

              <Button color="orange" fluid size="large">Submit</Button>
            </Segment>

            <Message>Already a user? <Link to="/login">Login</Link></Message>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}
