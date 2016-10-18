import json

from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required

from django.shortcuts import render_to_response
from django.contrib.auth.forms import UserCreationForm
from django.template.context_processors import csrf

from hashlib import md5


def get_current_user(request):
    return request.user.id


def get_current_user_image(request):
    email_hash = md5(request.user.email.encode('utf-8')).hexdigest()
    return "https://gravatar.com/avatar/{0}".format(email_hash)


def std_page(request, script_path, props={}):
    template = loader.get_template('page.html')
    context = {
        'reactscript': script_path,
        'reactprops': json.dumps(props)
    }
    return HttpResponse(template.render(context, request))


def index(request):
    return std_page(request, 'storytrove/home/home.js')


def read(request):
    return std_page(request, 'storytrove/read/read.js')


@login_required
def write(request, prompt_id):
    props = {
        "promptId": prompt_id
    }

    return std_page(request, 'storytrove/write/write.js', props)


def browse(request):
    return std_page(request, 'storytrove/browse/browse.js')


def login(request):
    return std_page(request, 'storytrove/account/login.js')


def prompt_example(request):
    return std_page(request, 'storytrove/read/prompt.js')


def story_example(request):
    return std_page(request, 'storytrove/read/story.js')


def story(request, story_id):
    props = {
        "storyId": story_id
    }

    return std_page(request, 'storytrove/read/story.js', props)


@login_required
def account(request):
    props = {
        "user": get_current_user(request),
        "user_image": get_current_user_image(request)
    }

    return std_page(request, 'storytrove/account/account.js', props)


@login_required
def account_stories(request):
    return std_page(request, 'storytrove/account/account_stories.js')


@login_required
def account_comments(request):
    return std_page(request, 'storytrove/account/account_comments.js')


@login_required
def achievements(request):
    return std_page(request, 'storytrove/account/achievements.js')


@login_required
def edit(request):
    props = {
        "user": get_current_user(request),
        "user_image": get_current_user_image(request)
    }

    return std_page(request, 'storytrove/account/edit.js', props)


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return std_page(request, 'storytrove/home/home.js')

    else:
        form = UserCreationForm()
    token = {}
    token.update(csrf(request))
    token['form'] = form

    return render_to_response('registration/register.html', token)
