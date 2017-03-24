import base64
from django.urls import reverse
from django.contrib.auth.models import User
from server.quickstart.models import Post, Author
from rest_framework import status
from rest_framework.test import APITestCase
from requests.auth import HTTPBasicAuth

class AuthorPostTest(APITestCase):
    """ This is the home of all of our tests relating to the author/post url """

    AUTHOR_USER_NAME = 'aName'
    AUTHOR_USER_PASS = 'password127'
    AUTHOR_USER_MAIL = 'aName@example.com'
    NOT_ACTIVE_USER_NAME = 'notActiveName'
    NOT_ACTIVE_USER_MAIL = 'notActiveName@example.com'
    NOT_ACTIVE_USER_PASS = 'password127'

    def setUp(self):
        """ Set up is run before each test """
        self.authorUser = User.objects.create_user(self.AUTHOR_USER_NAME,
                                                   self.AUTHOR_USER_MAIL,
                                                   self.AUTHOR_USER_PASS)
        self.authorUser.save()
        author = Author.objects.create(displayName=self.AUTHOR_USER_NAME,
                                       user=self.authorUser)
        author.save()

        self.unAuthorizedUser = User.objects.create_user(self.NOT_ACTIVE_USER_NAME,
                                                         self.NOT_ACTIVE_USER_MAIL,
                                                         self.NOT_ACTIVE_USER_PASS)
        self.unAuthorizedUser.is_active = False  # this is crucial to make an unAuthorizedUser
        self.unAuthorizedUser.save()
        unAuthAuthor = Author.objects.create(displayName=self.NOT_ACTIVE_USER_NAME,
                                             user=self.unAuthorizedUser)
        unAuthAuthor.save()

    def getBasicAuthHeader(self, us, pw):
        """ Returns the b64encoded string created for a user and password to be used in the header """
        return "Basic %s" % base64.b64encode("%s:%s" % (us, pw))

    def test_authorposturl_get_unauth_401(self):
        """ GETing the posts available to an author w/o any auth will result in a 401 """
        url = reverse("authorPost")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authorposturl_get_unactivated_401(self):
        """ GETing the posts available to an unactivated user w/o any auth will result in a 401 """
        url = reverse("authorPost")
        basicAuth = self.getBasicAuthHeader(self.NOT_ACTIVE_USER_NAME, self.NOT_ACTIVE_USER_PASS)
        response = self.client.get(url, HTTP_AUTHORIZATION=basicAuth)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authorposturl_get_basic_auth(self):
        """ GETing while loggin w/ Basic Auth should return a 2XX """
        url = reverse("authorPost")
        basicAuth = self.getBasicAuthHeader(self.AUTHOR_USER_NAME, self.AUTHOR_USER_PASS)
        response = self.client.get(url, HTTP_AUTHORIZATION=basicAuth)
        self.assertTrue(status.is_success(response.status_code))
