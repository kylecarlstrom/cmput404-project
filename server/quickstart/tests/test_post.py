from django.urls import reverse
from django.contrib.auth.models import User
from django.test import Client
from server.quickstart.models import Post, Author
from rest_framework import status
from rest_framework.test import APITestCase
from requests.auth import HTTPBasicAuth
import base64

class PostTests(APITestCase):
    """ This is the home of all of our tests relating to the post url """

    def setUp(self):
        """ Set up is run before each test """
        # accessed on March 12, 2017
        # from http://www.django-rest-framework.org/api-guide/testing/
        self.authorUser = User.objects.create_user('nixy', 'nixy@nixy.com','tester123')
        self.authorUser.set_password('tester123')
        self.authorUser.save()
        author = Author.objects.create(displayName="Nixy Disp Name", user=self.authorUser)
        author.save()

        self.unAuthorizedUser = User.objects.create_user("unauth", "unauth@unauth.com", "tester123")
        self.unAuthorizedUser.is_active = False  # this is crucial to make an unAuthorizedUser
        self.unAuthorizedUser.save()
        unAuthAuthor = Author.objects.create(displayName="Unauth", user=self.unAuthorizedUser)
        unAuthAuthor.save()

    def setUpAuthorLogin(self):
        self.client.login(username='nixy', password='tester123')
        self.client.force_authenticate(user=self.authorUser)

    def setUpNotActiveLogin(self):
        self.client.login(username="unauth", password="tester123")
        self.client.force_authenticate(user=self.unAuthorizedUser)

    def getBasicAuthHeader(self, us, pw):
        """ Returns the b64encoded string created for a user and password to be used in the header """
        return "Basic %s" % base64.b64encode("%s:%s" % (us, pw))

    # def test_post_unauth_403(self):
    #     """ POSTing to post unauthenticated will result in a 403 """
    #     # self.setUpNotActiveLogin()
    #     url = reverse("post")
    #     obj = {}
    #     # TODO: get basic auth working
    #     response = self.client.post(url, obj, format='json', AUTH_TYPE="Basic", AUTHORIZATION=self.getBasicAuthHeader("nixy", "tester123"))
    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_unauth_401(self):
        """ GETing the public posts w/o any auth will result in a 401 """
        url = reverse("post")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_unactivated_401(self):
        """ GETing the public posts w/o being active will result in a 401 """
        self.setUpNotActiveLogin()
        url = reverse("post")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_as_author_2XX(self):
        """ GETing the public posts when logged in as an author will result in a 2XX and data """
        self.setUpAuthorLogin()
        url = reverse("post")
        response = self.client.get(url)
        self.assertTrue(status.is_success(response.status_code))
        self.assertTrue(response.data)

    def test_post_bad_4XX(self):
        """ POST an empty post expecting a 4XX (is_client_error) """
        self.setUpAuthorLogin()
        url = reverse("post")
        obj = {}
        response = self.client.post(url, obj, format='json')
        self.assertTrue(status.is_client_error(response.status_code))
        self.assertNotEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_good_2XX(self):
        """ POST a good post expecting a 2XX (is_success) """
        self.setUpAuthorLogin()
        url = reverse("post")
        obj = {
            "title": "some title",
            "content": "this is a post dude",
            "description": "im not sure how to describe my post",
            "contentType": "markdown",
            "author": "",
            "comments": [],
            "visibility": "PUBLIC",
            "visibleTo": []
        }
        response = self.client.post(url, obj, format='json')
        self.assertTrue(status.is_success(response.status_code))
