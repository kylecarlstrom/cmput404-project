#!/usr/bin/env bash
pip install -r requirements.txt
rm db.sqlite3
rm server/quickstart/migrations/*
python manage.py makemigrations
python manage.py makemigrations quickstart
python manage.py migrate
python manage.py createsuperuser
