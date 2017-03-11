# License

# Copyright (c) 2011-2017, Tom Christie All rights reserved.

# Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

# Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

from models import Comment, Post, Author, FollowingRelationship
from serializers import CommentSerializer, PostSerializer, AuthorSerializer, FollowingRelationshipSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics


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

class CurrentFriendsList(generics.ListCreateAPIView):
    serializer_class = FollowingRelationshipSerializer

    def get_queryset(self):

        following_pks = []
        authorPK = self.kwargs['pk']
        following = FollowingRelationship.objects.filter(user=authorPK)
        for author in following:
            following_pks.append(author.follows.pk)

        followed = FollowingRelationship.objects.filter(follows=authorPK)

        return followed.filter(pk__in=following_pks)

class FriendsList(generics.ListCreateAPIView):
    queryset = FollowingRelationship.objects.all()
    serializer_class = FollowingRelationshipSerializer
