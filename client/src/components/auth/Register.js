import React, { Component } from 'react';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

const initialUser = {
  username: '',
  password: '',
  department: '',
};

export default class Register extends Component {
  state = {
    user: { ...initialUser },
    message: '',
  };

  inputHandler = (event) => {
    const { name, value } = event.target; // destructuring event.target.name and event.target.value
    this.setState({
      // [name] refers to event.target.name--changes depending on target
      user: { ...this.state.user, [name]: value },
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    axios
      .post(`${url}/api/register`, this.state.user)
      .then((res) => {
        if (res.status === 201) {
          this.setState({
            message: 'Registration successful',
            user: { ...initialUser },
          });
        } else {
          // Error() just passes to the .catch()
          throw new Error();
        }
      })
      .catch((err) => {
        this.setState({
          message: 'Registration failed',
          user: { ...initialUser },
        });
      });
  };

  render() {
    return (
      <section>
        <form onSubmit={this.submitHandler}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={this.state.user.username}
            onChange={this.inputHandler}
          />
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            name="password"
            value={this.state.user.password}
            onChange={this.inputHandler}
          />
          <label htmlFor="department">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            value={this.state.user.department}
            onChange={this.inputHandler}
          />
          <button type="submit">Submit</button>
        </form>
        {this.state.message ? <h3>{this.state.message}</h3> : undefined}
      </section>
    );
  }
}
