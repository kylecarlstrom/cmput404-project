import * as types from '../types';
import uuid from 'uuid/v1';

let URL_PREFIX = 'http://' + window.location.hostname + ':8000';
/*eslint-disable */
if(process.env.NODE_ENV === 'production') {
  URL_PREFIX = 'https://' + window.location.hostname;
}
/*eslint-enable */

export function addComment(comment, postId, user) {
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
  return function(dispatch,user) {
   
    fetch(URL_PREFIX + `/posts/${String(postId)}/comments/`, {
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

export function addPost(post, user) {

  return function(dispatch) {

   

    fetch(URL_PREFIX + '/posts/', {
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
        author: user.id,
        comments: post.comments,
        visibility:post.permission,
        visibleTo: []
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
    return fetch(URL_PREFIX + "/authors/posts/",{
      method: 'GET',
      headers: {
        // Written by unyo (http://stackoverflow.com/users/2077884/unyo http://stackoverflow.com/a/35780539
        'Authorization': 'Basic '+btoa(user.username+":"+user.password), 
        'Content-Type': 'application/x-www-form-urlencoded'
      }

    })
      .then(res => res.json())
      .then(res => {
        dispatch(finishLoadingPosts(res.results));
      });
  };
}

function logIn(user) {
  return {
    type: types.LOGGED_IN,
    user
  };
}

function logInFail(user) {
  return {
    type: types.LOGGED_IN_FAILED,
    user
  };
}

export function attempLogin(username, password) {
  return function(dispatch) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    return fetch(URL_PREFIX + '/login/', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic '+btoa(username + ":" + password)
      }
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(res);
      }
      return res;
    })
    .then(res => res.json())
    .then(res => {
      dispatch(logIn({
        ...res,
        password
      }));
    })
    .catch(err => {
      console.log(err);
      return dispatch(logInFail({
        ...err,
        password
      }));
    });
  };
}

export function attemptRegister(username, password) {
  return function(dispatch) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    return fetch(URL_PREFIX + '/register/', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic '+btoa(username + ":" + password),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      }),
    }).then(res => {
      if (!res.ok) {
        return Promise.reject();
      }
      return res;
    })
    .catch(err => {
      console.log('Could not register user');
    });
    // TODO: Do something when successfully registered
  };
}


export function switchTabs(tab) {
  return {
    type: types.SWITCH_TABS,
    tab
  };
}

export function finishedGettingUsers(users) {
  return {
    type: types.LOADED_USERS,
    users
  };
}

export function getUsers(user) {
  return function(dispatch) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    return Promise.all([
      fetch(URL_PREFIX + "/authors/" + user.id + "/friends/", {
        method: 'GET',
        headers: {
          'Authorization': 'Basic '+btoa(user.username + ":" + user.password)
        }
      }),
      fetch(URL_PREFIX + "/authors/", {
        method: 'GET',
        headers: {
          'Authorization': 'Basic '+btoa(user.username + ":" + user.password)
        }
      }),
      fetch(URL_PREFIX + "/authors/" + user.id + "/following/", {
        method: 'GET',
        headers: {
          'Authorization': 'Basic '+btoa(user.username + ":" + user.password)
        }
      })
    ])
    .then(responses => {
      for (let i = 0; i < responses.length; i++) {
        if (!responses[i].ok) {
          return Promise.reject();
        }
        return responses;
      }
    })
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(responses => {
      const users = responses[1].results;
      const friends = responses[0].results;
      const following = responses[2].results;

      const usersWithFriendStatus = users.map(user => ({
        ...user,
        isFriend: friends.filter(friend => user.id === friend.id).length !== 0,
        isFollowing: following.filter(follow => user.id === follow.id).length !== 0
      }));
      return dispatch(finishedGettingUsers(usersWithFriendStatus));
    })
    .catch(err => {
      console.log(err, 'Could not get friends');
    });
  };
}

function addFollower(currentUser, userToFollow) {
  return {
    type: types.FOLLOW_USER,
    currentUser,
    userToFollow
  };
}

export function changeFollowStatus(follow, currentUser, userToFollow) {
  return function(dispatch) {
    if (!follow) {
      return; // Uncomment when delete works
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    return fetch(URL_PREFIX + '/friendrequest/', {
      method: follow ? 'POST' : 'DELETE',
      headers: {
        'Authorization': 'Basic '+btoa(currentUser.username + ":" + currentUser.password),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: currentUser.id,
        follows: userToFollow
      }),
    }).then(res => {
      if (!res.ok) {
        return Promise.reject();
      }
      return res;
    })
    .then(res => res.json())
    .then(res => {
      dispatch(getUsers(currentUser)); // Ideally we ould be smarter about this
    })
    .catch(err => {
      console.log('Could not register user');
    });
  };
}


export function deletePost(post,user){
  return function(dispatch) {

   
    fetch(URL_PREFIX+'/posts/'+String(post.id)+'/', {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${btoa(`${user.username}:${user.password}`)}`, 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
    // .then(res => res.json())
    .then((res) => {
      dispatch({type:types.DELETE_POST,post:post});
     // location.reload();
    })
    .catch((err) => {

    });
  };
}

