from django.http import HttpResponse
from django.template import loader
import datetime
from storytrove.models import *

def search(request):
    return 1

def scratch(request):
    template = loader.get_template('page.html')
    context = {
        'reactscript': 'storytrove/search/search.js',
    }
    return HttpResponse(template.render(context, request))


def set_up_sample_data(request):
    UserAccount.objects.create_user_account('admin', '1234', 'image.jpg', 'admin@mailinator.com')
    UserAccount.objects.create_user_account('user1', '1234', 'image.jpg', 'user1@mailinator.com')
    UserAccount.objects.create_user_account('user2', '1234', 'image.jpg', 'user2@mailinator.com')
    template = loader.get_template('page.html')
    context = {
        'reactscript': 'storytrove/search/search.js',
    }
    return HttpResponse(template.render(context, request))
