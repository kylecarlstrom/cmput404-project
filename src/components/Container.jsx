import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import CreatePost from './CreatePost';
import FriendList from './FriendList';
import PostList from './PostList';
import Sidebar from './Sidebar';


class Container extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getUsers();
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
            changeFollowStatus={this.props.changeFollowStatus}
            users={this.props.users}
          />
        </Col>
    );
    return (
    <div className='coolbears-app'>
      <Grid>
        <Row>
            <Col md={3}>
            <Sidebar
                activeTab={this.props.activeTab}
                switchTabs={this.props.switchTabs} />
            </Col>
            {this.props.activeTab === 'stream' ? contentPosts(): contentFriends()}
        </Row>
      </Grid>
    </div>
    );
  }
}

Container.propTypes = {
  activeTab: PropTypes.string.isRequired,
  addComment: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  changeFollowStatus: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  loadPosts: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  switchTabs: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired
};

export default Container;