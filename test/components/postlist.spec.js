import React from 'react';
import { mount, shallow } from 'enzyme';
import { assert } from 'chai';
import { describe, it } from 'mocha';

import PostList from '../../src/components/PostList';

describe('<PostList>', function () {
  const store={};
  const props = {
    addComment: function() {},
    deletePost: function() {},
    loadPosts: function() {},
    posts: [],
    user: {}
  };
  it('Should render', () => {
    const wrapper = shallow(<PostList {...props}/>);
    assert.equal(wrapper.find('.post-list').length, 1);
  });
});