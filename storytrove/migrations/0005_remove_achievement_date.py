# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-21 10:22
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('storytrove', '0004_auto_20161021_2021'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='achievement',
            name='date',
        ),
    ]