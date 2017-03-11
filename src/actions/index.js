import * as types from '../types';
import uuid from 'uuid/v1';

export function addComment(comment, postId, user) {
  return {
    type: types.ADD_COMMENT,
    postId,
    comment: {
      id: uuid(),
      comment,
      author: user
    }
  };
}

export function addPost(post, user) {
  return {
    type: types.ADD_POST,
    post: {
      id: uuid(),
      contentType: post.contentType,
      title: post.title,
      user_with_permission: post.user_with_permission,
      author: user,
      comments: []
    }
  };
}