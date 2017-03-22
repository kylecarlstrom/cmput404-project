from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

class RootTests(APITestCase):
    """ This is the home of all of our tests relating to the root url """

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

    def test_get_no_auth(self):
        """ Ensure we can get the homepage un-authenticated """
        url = reverse("root")
        response = self.client.get(url)
        self.assertTrue(status.is_success(response.status_code))

    def test_get_auth(self):
        """ Ensure we can get the homepage authenticated """
        self.setUpLogin()
        url = reverse("root")
        response = self.client.get(url)
        self.assertTrue(status.is_success(response.status_code))

