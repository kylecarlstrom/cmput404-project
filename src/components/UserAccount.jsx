import React, {Component, PropTypes} from 'react';
import {Panel, Button, FormControl} from 'react-bootstrap';

class UserAccount extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      displayName: '',
      username: '',
      password: '',
      isLoginPage: true,
      waitForAdmin: false
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleDisplayNameChange = this.handleDisplayNameChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.toggleLoginOrRegister = this.toggleLoginOrRegister.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.target.value
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    });
  }

  handleDisplayNameChange(event) {
    this.setState({
      displayName: event.target.value
    });
  }

  handleLogin() {
    if (this.state.username && this.state.password) {
      this.props.attemptLogin(this.state.username, this.state.password);
    }
  }

  handleRegister() {
    if (this.state.username && this.state.password && this.state.displayName) {
      this.props.attemptRegister(this.state.username, this.state.password, this.state.displayName);
      this.setState({
        waitForAdmin: true
      });
    }
  }

  toggleLoginOrRegister() {
    this.setState({
      isLoginPage: !this.state.isLoginPage
    });
  }

  render() {
    const displayNameComponent = this.state.isLoginPage ? <noscript/> : (
      <FormControl
        type="text"
        name="displayName"
        onChange={this.handleDisplayNameChange}
        placeholder="Display Name"
        required
        autoFocus />
    );
    return (
      <div className="login-page">
        <Panel className="wrapper">
          <form >       
            <h2>{this.state.isLoginPage ? "Please login" : "Please register"}</h2>
            {displayNameComponent}
            <FormControl
              type="text"
              name="username"
              onChange={this.handleUsernameChange}
              placeholder="Username"
              required
              autoFocus />
            <FormControl
              type="password"
              name="password"
              onChange={this.handlePasswordChange}
              placeholder="Password"
              required />      
            <a onClick={this.toggleLoginOrRegister}>
              {this.state.isLoginPage ? "Need an account?" : "I have an account"}
            </a>
            <div className="login-status">{this.props.loggedInFail && this.state.isLoginPage ? "Login Failed" : ""}</div>
            <div className="login-status">{this.state.waitForAdmin && !this.state.isLoginPage ? "Please Wait for Admin Approval" : ""}</div>
            <Button
              className="btn btn-lg btn-primary btn-block user-button-login"
              onClick={this.state.isLoginPage ? this.handleLogin : this.handleRegister}>
              {this.state.isLoginPage ? "Login" : "Register"}
            </Button>   
          </form>
        </Panel>
        <a className="admin-login" 
        href="/admin">Admin Login</a>
      </div>
    );
  }
}

UserAccount.propTypes = {
  attemptLogin: PropTypes.func.isRequired,
  attemptRegister: PropTypes.func.isRequired,
  loggedInFail: PropTypes.bool
};


export default UserAccount;