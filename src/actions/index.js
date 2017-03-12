import * as types from '../types';
import uuid from 'uuid/v1';

export function addComment(comment, postId, user) {
 //call api
 

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

  return function(dispatch) {

    dispatch({type:types.ADD_POST,post: {
      id: -1,
      content: post.title,
      title: post.title,
      description: post.description,
      contentType: post.contentType,
      author:user,
      visibility:post.permission,
      comments: post.comments,
    }});
    fetch('http://localhost:8000/posts/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({
        title: post.title,
        content: post.content,
        description: post.description,
        contentType: post.contentType,
        author:user.id,
        comments: post.comments,
        visibility:post.permission
      }),
    })
    .then((res) => {
      location.reload();
    })
    .catch((err) => {

    });
  };
}



function finishLoadingPosts(result) {
  return {
    type: types.FINISH_LOADING_POSTS,
    posts: result
  };
}

export function loadPosts() {
  return function(dispatch) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    return fetch("http://localhost:8000/posts/")
      .then(res => res.json())
      .then(res => {
        dispatch(finishLoadingPosts(res.results));
      });
  };
}
