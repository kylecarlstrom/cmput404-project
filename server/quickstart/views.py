# License

# Copyright (c) 2011-2017, Tom Christie All rights reserved.

# Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

# Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

from models import Comment, Post, Author, FollowingRelationship
from serializers import CommentSerializer, PostSerializer, AuthorSerializer, FollowingRelationshipSerializer, FriendsSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework import serializers


class PostList(generics.ListCreateAPIView):
    """
    List all posts, or create a new post.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class CommentList(generics.ListCreateAPIView):
    """
    List all comments, or create a new comment.
    """
    serializer_class = CommentSerializer

    # http://www.django-rest-framework.org/api-guide/filtering/#filtering-against-the-current-user
    def get_queryset(self):
        post = self.kwargs['post']
        return Comment.objects.filter(post=post)
    
    # Written by andi (http://stackoverflow.com/users/953553/andi) http://stackoverflow.com/a/34084329, modified by Kyle Carlstrom
    def get_serializer_context(self):
        return {
            'post': self.kwargs['post']
            }

class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class AuthorList(generics.ListCreateAPIView):
    """
    List all authors, or create a new author.
    """
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class AuthorDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class CurrentFriendsList(APIView):
    def get(self, request, format=None, pk=None):
        following_pks = []
        authorPK = self.kwargs['pk']
        following = FollowingRelationship.objects.filter(user=authorPK).values('follows')
        for author in following:
            following_pks.append(author['follows'])

        followed = FollowingRelationship.objects.filter(follows=authorPK).values('user')

        stuff = followed.filter(user__in=following_pks)
        serializer = FriendsSerializer(stuff)
        return Response(serializer.data)

class FriendsList(generics.ListCreateAPIView):
    queryset = FollowingRelationship.objects.all()
    serializer_class = FollowingRelationshipSerializer


class AllPostsAvailableToCurrentUser(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        currentUser = self.request.user

        publicPosts = Post.objects.all().filter(visibility="PUBLIC")
        currentUserPosts = Post.objects.all().filter(visibility="PRIVATE", pk=currentUser.pk) # TODO: test currentUser.pk works
        friendOfAFriendPosts = None
        friendPosts = self.get_queryset_friends(currentUser)
        serverOnlyPosts = Post.objects.all().filter(visibility="SERVERONLY") # TODO: check that user is on our server
        return publicPosts | currentUserPosts | friendPosts | serverOnlyPosts

    def get_friends_of_authorPK(self, authorPK):
        following_pks = []
        following = FollowingRelationship.objects.filter(user=authorPK).values('follows') # everyone currentUser follows
        for authorFromFollowing in following:
            following_pks.append(authorFromFollowing['follows'])

        followed = FollowingRelationship.objects.filter(follows=authorPK).values('user')  # everyone that follows currentUser

        return followed.filter(user__in=following_pks)

    def get_queryset_friends(self, currentUser):
        friendsOfCurrentUser = self.get_friends_of_authorPK(currentUser.pk)

        return Post.objects.all().filter(author__in=friendsOfCurrentUser).filter(visibility="FRIENDS")

