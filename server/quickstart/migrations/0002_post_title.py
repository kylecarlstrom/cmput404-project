# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-10 00:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='title',
            field=models.CharField(default='No Title', max_length=140),
            preserve_default=False,
        ),
    ]
