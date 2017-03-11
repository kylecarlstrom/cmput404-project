import React, {Component, PropTypes} from 'react';
import {FormControl, ButtonToolbar, ButtonGroup, Button, Glyphicon, Radio} from 'react-bootstrap';
import {PERMISSIONS} from '../constants';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleContentTypeChange = this.handleContentTypeChange.bind(this);
    this.handlePost = this.handlePost.bind(this);
    this.handlePermissionChange = this.handlePermissionChange.bind(this);
  }

  getInitialState() {
    return {
      permission: PERMISSIONS.FRIENDS.value,
      title: '',
      contentType: 'plaintext'
    };
  }

  handleTextChange(event) {
    this.setState({
      title: event.target.value
    });
  }

  handleImageUpload() {
    // handle image upload
  }

  handleContentTypeChange(event) {
    this.setState({
      contentType: event.target.value
    });
  }

  handlePost() {
    if (this.state.title) {
      this.props.addPost({
        title: this.state.title,
        format: this.state.contentType,
        permission: this.state.permission,
        user_with_permission: this.state.user_with_permission
      });

      this.setState(this.getInitialState());
    }
  }

  handlePermissionChange(event) {
    this.setState({
      permission: event.value,
      user_with_permission: event.user
    });
  }

  render() {
    const staticOptions = [
      {
        value: PERMISSIONS.FRIENDS.value,
        label: PERMISSIONS.FRIENDS.label
      }, {
        value: PERMISSIONS.PUBLIC.value,
        label: PERMISSIONS.PUBLIC.label,
      }, {
        value: PERMISSIONS.FRIENDS_OF_FRIENDS.value,
        label: PERMISSIONS.FRIENDS_OF_FRIENDS.label
      }, {
        value: PERMISSIONS.SELF.value,
        label: PERMISSIONS.SELF.label
      }
    ];
    const options = [
      ...staticOptions,
      ...this.props.users.map(user => ({
        label: user.name,
        value: PERMISSIONS.USER.value,
        user: user.id
      }))
    ];
    return (
      <div className='create-post'>
        <FormControl
          type='text'
          value={this.state.title}
          placeholder='Whats on your mind?'
          onChange={this.handleTextChange}/>
        <ButtonToolbar className='post-options'>
          <ButtonGroup className='post-formats'>
            <Radio
              checked={this.state.contentType === 'plaintext'}
              inline={true}
              onChange={this.handleContentTypeChange}
              value='plaintext'>
              Plain Text
            </Radio>
            <Radio
              checked={this.state.contentType === 'markdown'}
              inline={true}
              onChange={this.handleContentTypeChange}
              value='markdown'>
              Markdown
            </Radio>
          </ButtonGroup>
          <div className='buttons'>
            <Select
            name='permissions'
            onChange={this.handlePermissionChange}
            options={options}
            value={this.state.permission}
            />
            <Button
              onClick={this.handleImageUpload}>
              <Glyphicon glyph='picture'/>
            </Button>
            <Button
              onClick={this.handlePost}>
              Post
            </Button>
          </div>
        </ButtonToolbar>
      </div>
    );
  }
}

CreatePost.propTypes = {
  addPost: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired
};

export default CreatePost;