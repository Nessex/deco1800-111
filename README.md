# deco1800-111

## Deployment Steps
 - Pull / Checkout
 - `python3.5 manage.py makemigrations`
 - `python3.5 manage.py migrate`
 - `python3.5 manage.py collectstatic`
 - Add API key to `storytrove/views/api.py:~13`
 - Restart web server instance
