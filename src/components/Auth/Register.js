import React, { Component } from 'react'
import { Button, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import md5 from 'md5'

export default class Register extends Component {
  dbUserRef = firebase.database().ref('users')

  state = {
    username: '123',
    email: 'dakiesse@gmail.com',
    password: '111111',
    passwordConfirmation: '111111',
    errors: [],
    loading: false,
  }

  isFormValid = () => {
    let error

    if (this.isFormEmpty()) {
      error = { message: 'Fill in all fields' }
    } else if (!this.isPasswordValid()) {
      error = { message: 'Password is invalid' }
    }

    if (error) {
      this.setState({ errors: [error] })
      return false
    }

    this.setState({ errors: [] })
    return true
  }

  isFormEmpty = () => {
    const { username, email, password, passwordConfirmation } = this.state

    return !username.length || !email.length || !password.length || !passwordConfirmation.length
  }

  isPasswordValid = () => {
    const { password, passwordConfirmation } = this.state

    return password.length < 6 ? false : password === passwordConfirmation
  }

  handlerChange = (e) => {
    const { name, value } = e.target

    this.setState({ [name]: value })
  }

  handleSubmit = async (e) => {
    const { username, email, password } = this.state

    e.preventDefault()

    if (!this.isFormValid()) return false

    this.setState({ loading: true })

    try {
      const createdUser = await firebase.auth().createUserWithEmailAndPassword(email, password)

      await createdUser.user.updateProfile({
        displayName: username,
        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`,
      })

      this.saveUser(createdUser)
    } catch (e) {
      this.setState({ errors: [{ message: e.message }] })
    } finally {
      this.setState({ loading: false })
    }
  }

  saveUser = (createdUser) => {
    const user = createdUser.user

    this.dbUserRef.child(user.uid).set({
      name: user.displayName,
      avatar: user.photoURL,
    })
  }

  renderInput = ({ type = 'text', name, placeholder, icon }) => {
    const { errors } = this.state

    return (
      <Form.Input type={type}
                  name={name}
                  placeholder={placeholder}
                  icon={icon}
                  iconPosition="left"
                  value={this.state[name]}
                  error={errors.some(error => error.message.toLowerCase().includes(type))}
                  fluid required
                  onChange={this.handlerChange}/>
    )
  }

  render () {
    const { errors, loading } = this.state

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

              <Button color="orange" size="large" loading={loading} disabled={loading} fluid>Submit</Button>
            </Segment>

            <Message error
                     visible={errors.length > 0}
                     header="There was some errors with your submission"
                     list={errors.map((error) => error.message)}/>

            <Message>Already a user? <Link to="/login">Login</Link></Message>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}
