import * as types from '../types';
import uuid from 'uuid/v1';

export function addComment(comment, postId, user, commentsLength) {
 //call api
 

  // return {
  //   type: types.ADD_COMMENT,
  //   postId,
  //   comment: {
  //     id: uuid(),
  //     comment,
  //     author: user
  //   }
  // };
  return function(dispatch) {
   
    fetch(`http://localhost:8000/posts/${String(postId)}/comments/`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${user.username}:${user.password}`)}`, 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        comment:comment
      }),
    })
    .then(res => res.json())
    .then((res) => {
      dispatch({type:types.ADD_COMMENT,
        postId: postId,
        comment: res
      });
     // location.reload();
    })
    .catch((err) => {

    });
  };
}

export function addPost(post, user,postsLength) {

  return function(dispatch) {

   
    fetch('http://localhost:8000/posts/', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${user.username}:${user.password}`)}`, 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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
    .then(res => res.json())
    .then((res) => {
      dispatch({type:types.ADD_POST,post: res});
     // location.reload();
    })
    .catch((err) => {

    });
  };
}



function finishLoadingPosts(result) {
  return {
    type: types.FINISH_LOADING_POSTS,
    posts: result || []
  };
}

export function loadPosts(user) {
  return function(dispatch) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    return fetch("http://localhost:8000/authors/posts/",{
      method: 'GET',
      headers: {
        // http://stackoverflow.com/questions/30203044/using-an-authorization-header-with-fetch-in-react-native
        'Authorization': `Basic ${btoa(`${user.username}:${user.password}`)}`, 
        'Content-Type': 'application/x-www-form-urlencoded'
      }

    })
      .then(res => res.json())
      .then(res => {
        dispatch(finishLoadingPosts(res.results));
      });
  };
}
