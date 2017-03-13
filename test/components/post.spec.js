import React from 'react';
import { mount, shallow } from 'enzyme';
import { assert } from 'chai';
import { describe, it } from 'mocha';

import Post from '../../src/components/Post';

describe('<Post>', function () {
  const store={};
  const props = {
    addComment: function () {},
    author: { displayname: "Aaa" },
    comments: [],
    content: "",
    contentType: "",
    deletePost: function() {},
    id: 1,
    title: "Aaa",
    user: {}
  };
  it('Should render', () => {
    const wrapper = shallow(<Post {...props}/>);
    assert.equal(wrapper.find('.post').length, 1);
  });
});