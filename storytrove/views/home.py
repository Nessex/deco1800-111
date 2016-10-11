from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
import datetime

from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.contrib.auth.forms import UserCreationForm
from django.core.context_processors import csrf

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

def account_stories(request):
    return std_page(request, 'storytrove/account/account_stories.js')

def account_comments(request):
    return std_page(request, 'storytrove/account/account_comments.js')

def achievements(request):
    return std_page(request, 'storytrove/account/achievements.js')

def edit(request):
    return std_page(request, 'storytrove/account/edit.js')

def register(request):
     if request.method == 'POST':
         form = UserCreationForm(request.POST)
         if form.is_valid():
             form.save()
             return HttpResponseRedirect('/accounts/register/complete')

     else:
         form = UserCreationForm()
     token = {}
     token.update(csrf(request))
     token['form'] = form

     return render_to_response('registration/registration_form.html', token)

 def registration_complete(request):
     return render_to_response('registration/registration_complete.html')
