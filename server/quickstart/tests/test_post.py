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

    def setUpLogin(self):
        self.client.login(username='nixy', password='tester123')
        self.client.force_authenticate(user=self.authorUser)

    def test_post_unauth_401(self):
        """ POSTing to post unauthenticated will result in a 401 """
        url = reverse("post")
        obj = {}
        response = self.client.post(url, obj, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_bad_4XX(self):
        """ POST an empty post expecting a 4XX (is_client_error) """
        self.setUpLogin()
        url = reverse("post")
        obj = {}
        response = self.client.post(url, obj, format='json')
        self.assertTrue(status.is_client_error(response.status_code))
        self.assertNotEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
