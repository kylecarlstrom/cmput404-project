import {schema} from 'normalizr';
// Schema based on normalizr https://github.com/paularmstrong/normalizr/blob/master/docs/quickstart.md (MIT)
// https://github.com/paularmstrong/normalizr/blob/master/docs/quickstart.md Paula Armstrong (https://github.com/paularmstrong) (MIT)
const user = new schema.Entity('users');
const comment = new schema.Entity('comments', {
  author: user
});
const post = new schema.Entity('posts', {
  author: user,
  comments: [comment]
});
const posts = [post];

export default posts;
