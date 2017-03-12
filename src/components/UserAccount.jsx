import React, {Component, PropTypes} from 'react';
import {Panel, Button, FormControl} from 'react-bootstrap';

class UserAccount extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
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

  handleLogin() {
    if (this.state.username && this.state.password) {
      console.log('called');
      this.props.attemptLogin(this.state.username, this.state.password);
    }
  }

  render() {
    return (
      <Panel className="wrapper">
        <form >       
          <h2>Please login</h2>
          <FormControl
            type="text"
            name="username"
            onChange={this.handleUsernameChange}
            placeholder="Email Address"
            required
            autoFocus />
          <FormControl
            type="password"
            name="password"
            onChange={this.handlePasswordChange}
            placeholder="Password"
            required />      
          <a >need an account?</a>
          <Button
            className="btn btn-lg btn-primary btn-block user-button-login"
            onClick={this.handleLogin}
          >Login</Button>   
        </form>
      </Panel>
    );
  }
}

UserAccount.propTypes = {
  attemptLogin: PropTypes.func.isRequired
};


export default UserAccount;