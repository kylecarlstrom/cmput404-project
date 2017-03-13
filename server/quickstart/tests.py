from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from models import Post, Comment, FollowingRelationship
from django.test import Client
from django.contrib.auth.models import User
from .models import FollowingRelationship, Post, Comment


class AccountTests(APITestCase):

    def setUp(self):
        #from http://www.django-rest-framework.org/api-guide/testing/ 
        self.authorUser = User.objects.create_user('nixy', 'nixy@nixy.com','tester123')
        self.authorUser.set_password('tester123')
        self.authorUser.save()

        self.client.login(username='nixy', password='tester123')
        self.client.force_authenticate(user=self.authorUser)
    
    def test_getPost(self):
        doesNotExistYet = "10"
        getUrl = '/posts/' + doesNotExistYet + '/'
        response = self.client.get(getUrl)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_root(self):
        """
        Ensure we can create a new account object.
        """
        url = reverse('root')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

