import React, { Component } from 'react'
import { Button, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'

export default class Register extends Component {
  state = {}

  handlerChange = (e) => {
    const { name, value } = e.target

    this.setState({ [name]: value })
  }

  handleSubmit = async (e) => {
    const { email, password } = this.state

    e.preventDefault()

    try {
      const createdUser = await firebase.auth().createUserWithEmailAndPassword(email, password)
      console.log(createdUser)
    } catch (e) {
      console.error(e)
    }
  }

  renderInput ({ type = 'text', name, placeholder, icon }) {
    return (
      <Form.Input type={type}
                  name={name}
                  placeholder={placeholder}
                  icon={icon}
                  iconPosition="left"
                  fluid required
                  onChange={this.handlerChange}/>
    )
  }

  render () {
    return (
      <Grid className="app" textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange"/>
            Register for DevChat
          </Header>

          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              {this.renderInput({ name: 'username', placeholder: 'Username', icon: 'user' })}
              {this.renderInput({ type: 'email', name: 'email', placeholder: 'Email Address', icon: 'mail' })}
              {this.renderInput({ type: 'password', name: 'password', placeholder: 'Password', icon: 'lock' })}
              {this.renderInput({
                type: 'password',
                name: 'passwordConfirmation',
                placeholder: 'Password Confirmation',
                icon: 'repeat'
              })}

              <Button color="orange" fluid size="large">Submit</Button>
            </Segment>

            <Message>Already a user? <Link to="/login">Login</Link></Message>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}
