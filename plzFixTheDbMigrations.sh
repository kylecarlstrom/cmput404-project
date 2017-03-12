#!/usr/bin/env bash
echo "Running pip install"
pip install -r requirements.txt

echo "Removing the database"
rm db.sqlite3

echo "Removing old migration files"
rm server/quickstart/migrations/*

echo "Creating the migration files"
python manage.py makemigrations
python manage.py makemigrations quickstart

echo "Migrating the database"
python manage.py migrate

echo "Creating the superuser..."
python manage.py createsuperuser
