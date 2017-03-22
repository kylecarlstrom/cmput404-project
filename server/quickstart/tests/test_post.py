from django.urls import reverse
from django.contrib.auth.models import User
from django.test import Client
from server.quickstart.models import Post, Comment, FollowingRelationship
from rest_framework import status
from rest_framework.test import APITestCase

class PostTests(APITestCase):
    """ This is the home of all of our tests relating to the post url """

    def setUp(self):
        """ Set up is run before each test """
        # accessed on March 12, 2017
        # from http://www.django-rest-framework.org/api-guide/testing/
        self.authorUser = User.objects.create_user('nixy', 'nixy@nixy.com','tester123')
        self.authorUser.set_password('tester123')
        self.authorUser.save()

        self.client.login(username='nixy', password='tester123')
        self.client.force_authenticate(user=self.authorUser)

    def test_post_good_post(self):
        """ POST a valid post expecting a 4XX (is_client_error) """
        url = reverse("post")
        obj = {}
        response = self.client.post(url, obj, format='json')
        self.assertTrue(status.is_client_error(response.status_code))
