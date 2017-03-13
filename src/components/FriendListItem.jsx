import React, {Component, PropTypes} from 'react';
import {Panel, Button, Glyphicon} from 'react-bootstrap';
import {ListGroupItem} from 'react-bootstrap';

/*
* Renders a user with accept or delete options contextually
*/
class FriendListItem extends Component {
  constructor(props) {
    super(props);

    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);
  }

  follow() {
    this.props.changeFollowStatus(true, this.props.id);
  }

  unfollow() {
    this.props.changeFollowStatus(false, this.props.id);
  }

  createGlyphiconButton(glyph, follow) {
    return (
      <Button onClick={follow ? this.follow : this.unfollow}>
        <Glyphicon glyph={glyph}/>
      </Button>
    );
  }
  render() {
    return (
      <ListGroupItem className='friend-list-item'>
          <span >{this.props.username}</span>
          <span className="friend-list-button-group">
            {(!this.props.isFollowing && !this.props.isFriend) && this.createGlyphiconButton('ok', true)}
            {this.props.isFollowing && this.createGlyphiconButton('remove', false)}
          </span>
      </ListGroupItem>
    );
  }
}

FriendListItem.propTypes = {
  changeFollowStatus: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  isFriend: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired
};

export default FriendListItem;