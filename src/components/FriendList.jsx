import React, {Component, PropTypes} from 'react';
import FriendListItem from './FriendListItem';
import {ListGroup} from 'react-bootstrap';

/*
* Renders a list of friends in three sections: Friends, Following, and Everyone Else
*/
class FriendList extends Component {
  createUserList(people) {
    return (
      <ListGroup className='friend-list'>
        {people.map(friend => (
          <FriendListItem
            key={friend.id}
            changeFollowStatus={this.props.changeFollowStatus}
            {...friend}
          />
        ))}
      </ListGroup>
    );
  }
  render() {
    return (
      <div className='friend-page'>
        <h2>Friends</h2>
        {this.createUserList(this.props.users.filter(user => user.isFriend))}
        <h2>Following</h2>
        {this.createUserList(this.props.users.filter(user => user.isFollowing))}
        <h2>Everyone Else</h2>
        {this.createUserList(this.props.users.filter(user => !(user.isFriend || user.isFollowing)))}
      </div>
    );
  }
}

FriendList.propTypes = {
  changeFollowStatus: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired
};

export default FriendList;