from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
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

def browse(request):
    return std_page(request, 'storytrove/browse/browse.js')

def login(request):
    return std_page(request, 'storytrove/account/login.js')

def prompt_example(request):
    return std_page(request, 'storytrove/read/prompt.js')

def story_example(request):
    return std_page(request, 'storytrove/read/story.js')

def account(request):
    return std_page(request, 'storytrove/account/account.js')

@login_required
def account_stories(request):
    return std_page(request, 'storytrove/account/account_stories.js')

def account_comments(request):
    return std_page(request, 'storytrove/account/account_comments.js')

@login_required
def achievements(request):
    return std_page(request, 'storytrove/account/achievements.js')

@login_required
def edit(request):
    return std_page(request, 'storytrove/account/edit.js')
