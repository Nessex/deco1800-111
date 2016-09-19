from django.http import HttpResponse
from django.template import loader
import datetime

def std_page(request, script_path):
    template = loader.get_template('page.html')
    context = {
        'reactscript': script_path,
    }
    return HttpResponse(template.render(context, request))

def index(request):
    return std_page(request, 'storytrove/home/home.js')

def read(request):
    return std_page(request, 'storytrove/read/read.js')

def write(request):
    return std_page(request, 'storytrove/write/write.js')

def account(request):
    return std_page(request, 'storytrove/account/account.js')

def browse(request):
    return std_page(request, 'storytrove/browse/browse.js')

def achievements(request):
    return std_page(request, 'storytrove/account/achievements.js')

def edit(request):
    return std_page(request, 'storytrove/account/edit.js')

def account_stories(request):
    return std_page(request, 'storytrove/account/account_stories.js')
