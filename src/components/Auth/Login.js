import React, { Component } from 'react'
import { Button, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  }

  isFormValid = () => {
    let error
    const { email, password } = this.state

    if (!email && !password) {
      error = { message: 'Fill in all fields' }
    }

    if (error) {
      this.setState({ errors: [error] })
      return false
    }

    this.setState({ errors: [] })
    return true
  }

  handlerChange = (e) => {
    const { name, value } = e.target

    this.setState({ [name]: value })
  }

  handleSubmit = async (e) => {
    const { email, password } = this.state

    e.preventDefault()

    if (!this.isFormValid()) return false

    this.setState({ loading: true })

    try {
      const signedInUser = await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (e) {
      this.setState({ errors: [{ message: e.message }], loading: false })
    }
  }

  renderInput = ({ type = 'text', name, placeholder, icon, errorWordRef = null }) => {
    const { errors } = this.state

    return (
      <Form.Input type={type}
                  name={name}
                  placeholder={placeholder}
                  icon={icon}
                  iconPosition="left"
                  value={this.state[name]}
                  error={errors.some(error => error.message.toLowerCase().includes(errorWordRef || name))}
                  fluid required
                  onChange={this.handlerChange}/>
    )
  }

  render () {
    const { errors, loading } = this.state

    return (
      <Grid className="app" textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet"/>
            Login to DevChat
          </Header>

          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              {this.renderInput({
                type: 'email',
                name: 'email',
                placeholder: 'Email Address',
                icon: 'mail',
                errorWordRef: 'user'
              })}
              {this.renderInput({ type: 'password', name: 'password', placeholder: 'Password', icon: 'lock' })}

              <Button color="violet" size="large" loading={loading} disabled={loading} fluid>Submit</Button>
            </Segment>

            <Message error
                     visible={errors.length > 0}
                     header="There was some errors with your submission"
                     list={errors.map((error) => error.message)}/>

            <Message>Don't have an account? <Link to="/register">Register</Link></Message>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}
