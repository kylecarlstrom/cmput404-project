# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-10 01:04
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('quickstart', '0003_post_author'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=140)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='quickstart.Post')),
            ],
        ),
        migrations.CreateModel(
            name='FollowingRelationship',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('followingUserB', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='followingUserB', to=settings.AUTH_USER_MODEL)),
                ('userAis', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userAis', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
