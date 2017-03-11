from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Author(models.Model):
    displayName = models.CharField(max_length=100)

    def __unicode__(self):
        return self.displayName

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
    author = models.ForeignKey(Author)
    visibility = models.CharField(max_length=20, default="PUBLIC", choices=privacyChoices)

    def __unicode__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments')
    author = models.ForeignKey(Author)
    comment = models.CharField(max_length=140)

    def __unicode__(self):
        return self.comment

class FollowingRelationship(models.Model):
    # Written by http://stackoverflow.com/a/13496120 user1839132 (http://stackoverflow.com/users/1839132/user1839132),
    # modified by Kyle Carlstrom
    user = models.ForeignKey(Author)
    follows = models.ForeignKey(Author, related_name='follows')

    def __unicode__(self):
        return str(self.user) + '_follows_' + str(self.follows)

