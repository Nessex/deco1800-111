#!/bin/sh

uwsgi-3.5 --socket :8001 --wsgi-file storytrove/wsgi.py --ini uwsgi.ini
