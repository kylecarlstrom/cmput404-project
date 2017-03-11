from django.contrib import admin

# Register your models here.
from models import Post, Comment, Author, FollowingRelationship

admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Author)
admin.site.register(FollowingRelationship)