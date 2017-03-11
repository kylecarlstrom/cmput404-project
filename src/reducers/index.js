import { combineReducers } from 'redux';
import * as types from '../types';
import schema from '../schema';
import {normalize} from 'normalizr';

// Schema based on normalizr https://github.com/paularmstrong/normalizr/blob/master/docs/quickstart.md (MIT)
const mockposts = [
  {
    id: '20525',
    author: {
      id: '43231',
      displayName: 'Ken Adams'
    },
    title: 'I can see clearly now',
    comments: [
      {
        id: '1232',
        author: {
          id: '96853',
          displayName: 'James Bond'
        },
        comment: 'You wot?'
      }, {
        id: '7653',
        author: {
          id: '73841',
          displayName: 'Moriarty'
        },
        comment: 'yeah wot'
      }
    ]
  },
  {
    id: '10241',
    author: {
      id: '96853',
      displayName: 'James Bond'
    },
    title: 'UofA is better than UofC',
    comments: []
  }
];

const mockFriends = [
  {
    id: '121212',
    username: 'Sad Frog',
    isFollower: true
  },
  {
    id: '23232323',
    username: 'Feelsbadman',
    isFollower: true
  }
];

const mockFriendRequests = [
  {
    id: '121212',
    username: 'Happy Frog?',
    isFollower: false
  },
  {
    id: '23232323',
    username: 'Feelsgoodman?',
    isFollower: false
  }
];

const mockState = normalize(mockposts, schema).entities;

function posts(state=mockState.posts, action) {
  switch (action.type) {
  case types.ADD_COMMENT:
    const post = state[action.postId];
    return {
      ...state,
      [action.postId]: {
        ...post,
        comments: [
          ...post.comments,
          action.comment.id
        ]
      }
    };
  case types.ADD_POST:
    return {
      [action.post.id]: action.post,
      ...state
    };
  default:
    return state;
  }
}

function comments(state=mockState.comments, action) {
  switch (action.type) {
  case types.ADD_COMMENT:
    return {
      ...state,
      [action.comment.id]: action.comment
    };
  default:
    return state;
  }
}

function users(state=mockState.users, action) {
  switch (action.type) {
  default:
    return state;
  }
}

function friends(state ={
  friendList: mockFriends,
  friendRequests: mockFriendRequests
},action){
  switch (action.type) {
  default:
    return state;
  }
}


export default combineReducers({posts, comments, users, friends});
