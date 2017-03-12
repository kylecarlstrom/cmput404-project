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
  // return {
  //   type: types.ADD_POST,
  //   post: {
  //     id: uuid(),
  //     contentType: post.contentType,
  //     title: post.title,
  //     user_with_permission: post.user_with_permission,
  //     author: user,
  //     comments: []
  //   }
  // };
      return function(dispatch) {
    dispatch({type:types.ADD_POST,post: {
      id: uuid(),
      contentType: post.contentType,
      title: post.title,
      user_with_permission: post.user_with_permission,
      author: user,
      comments: []
    }})
    fetch('http://'+ window.location.hostname + ':8000/posts/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        title: "abc",
        content: "def",
        description:"ggg",
        contentType:"ddfs",
        author:"sdfsd",
        visibility:"PUBLIC"
      }),
    })
    .then((res) => {
       console.log(res);
    })
    .catch((err) => {
      console.log(err);
    })

  };
  }
