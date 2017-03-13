from __future__ import unicode_literals
from django.contrib.auth.models import User

from django.db import models

# This model represents a post object
class Post(models.Model):

    privacyChoices = (
        ("PUBLIC", "PUBLIC"),
        ("PRIVATE", "PRIVATE"),
        ("FOAF", "FOAF"),
        ("FRIENDS", "FRIENDS"),
        ("SERVERONLY", "SERVERONLY"),
    )

    title = models.CharField(max_length=140)
    content = models.CharField(max_length=140)
    description = models.CharField(max_length=140)
    contentType = models.CharField(max_length=32)
    author = models.ForeignKey(User)
    visibility = models.CharField(max_length=20, default="PUBLIC", choices=privacyChoices)
    # visibleTo will create an intermediate table to represent a ManyToMany relationship with users
    visibleTo = models.ManyToManyField(User, related_name="visibleTo")

    def __unicode__(self):
        return self.title

# This model represents a comment object
# A Post can have many Comments
class Comment(models.Model):
    # http://www.django-rest-framework.org/api-guide/relations/#api-reference
    post = models.ForeignKey(Post, related_name='comments')
    author = models.ForeignKey(User)
    comment = models.CharField(max_length=140)

    def __unicode__(self):
        return self.comment

# The FollowingRelationship models the ManyToMany relationship for follows
# A friend exists when (UserA follows UserB) AND (UserB follows UserA)
class FollowingRelationship(models.Model):
    # Written by http://stackoverflow.com/a/13496120 user1839132 (http://stackoverflow.com/users/1839132/user1839132),
    # modified by Kyle Carlstrom
    user = models.ForeignKey(User)
    follows = models.ForeignKey(User, related_name='follows')

    def __unicode__(self):
        return str(self.user) + '_follows_' + str(self.follows)

