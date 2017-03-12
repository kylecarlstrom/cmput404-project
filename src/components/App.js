import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import CreatePost from './CreatePost';
import FriendList from './FriendList';
import PostList from './PostList';
import Sidebar from './Sidebar';
import UserAccount from './UserAccount';
import '../../style/style.scss';
import * as actions from '../actions';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content : "posts-list"
    };
    this.updateContent=this.updateContent.bind(this);
  }

  updateContent(key){
    if (key == "posts-list"){
      this.setState({content:key});
    }
    else if (key == "friends-list"){
      this.setState({content:key});
    }
  }


  render() {
    const contentPosts = () => (
        <Col md={9}>
          <CreatePost
            addPost={this.props.addPost}
            users={[]}

          />
          <PostList
            posts={this.props.posts}
            addComment={this.props.addComment}
            loadPosts={this.props.loadPosts}
          />
        </Col>
      );
    const contentFriends = () => (
        <Col md={9}>
          <FriendList
            friends = {this.props.friends.friendList}
            friendRequests = {this.props.friends.friendRequests}
          />
        </Col>
    );
    let content=contentFriends();

    if (this.state.content == "posts-list"){
      content = contentPosts(); 
    }else if (this.state.content == "friends-list"){
      content = contentFriends();
    }else{
      content = contentPosts(); 
    }

    if (this.props.loggedIn){
      return (
        <div className='coolbears-app'>
          <Grid>
            <Row>
              <Col md={3}>
                <Sidebar updateContent ={this.updateContent} />
              </Col>
              {content}
            </Row>
          </Grid>
        </div>
      );
    }else{

      return(
        <UserAccount
          attemptLogin={this.props.attempLogin}
        />
      );
    }
  }
}

App.propTypes = {
  addComment: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  attempLogin: PropTypes.func.isRequired,
  friends: PropTypes.object.isRequired,
  loadPosts: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  posts: PropTypes.array.isRequired
};

// TODO: Temporary, get this from somewhere else
const user = {
  id: 1,
  username: 'joshdeng',
  password: 'j69pbxq9'
};
// TODO: Move this into seperate file as container
export default connect(
  function(stateProps, ownProps) {
    console.log(stateProps);
    return {
      posts: stateProps.posts,
      friends: stateProps.friends,
      loggedIn: stateProps.app.loggedIn
    };
  }, function(dispatch, ownProps) {
  return {

    addComment: function(text, postId) {
      dispatch(actions.addComment(text, postId, user));

    },
    addPost: function(post) {
      dispatch(actions.addPost(post, user));
    },
    loadPosts: function() {
      dispatch(actions.loadPosts(user));
    },
    attempLogin: function(username, password) {
      dispatch(actions.attempLogin(username, password));
    }
  };
})(App);