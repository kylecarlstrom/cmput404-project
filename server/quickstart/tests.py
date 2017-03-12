from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from models import Post, Comment, FollowingRelationship

class AccountTests(APITestCase):
    def test_get_root(self):
        """
        Ensure we can create a new account object.
        """
        url = reverse('root')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
