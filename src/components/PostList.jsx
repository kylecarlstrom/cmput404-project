import React, {Component, PropTypes} from 'react';
import Post from './Post';

class PostList extends Component {
  componentDidMount() {
    this.props.loadPosts();
  }
  render() {
    return (
      <div className='post-list'>
        {this.props.posts.map(post => (
          <Post key={post.id}
            addComment={this.props.addComment}
            author={post.author}
            contentType = {post.contentType}
            user = {this.props.user}
            deletePost = {this.props.deletePost}
            {...post}
          />
        ))}
      </div>
    );
  }
}

PostList.propTypes = {
  addComment: PropTypes.func.isRequired,
  loadPosts: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired
};

export default PostList;