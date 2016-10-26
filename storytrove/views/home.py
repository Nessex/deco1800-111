import json
from hashlib import md5

from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required

from django.shortcuts import redirect
from django.shortcuts import render_to_response
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate
from django.contrib.auth import login as djlogin
from django.views.generic import FormView
from django.template.context_processors import csrf
from django.template.defaulttags import register
from django.contrib.auth.hashers import check_password

from storytrove.models import *
from storytrove.views.api import *


# Source: http://stackoverflow.com/a/8000091
@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


def get_current_user(request):
    if not request.user.is_authenticated:
        return None

    out = {k: getattr(request.user, k) for k in ('id', 'username', 'email')}
    out['image'] = get_user_image(request.user)
    out['reactions'] = get_reactions_for_user(out['id'])
    return out


def get_user_image(user):
    email_hash = md5(user.email.encode('utf-8')).hexdigest()
    return "https://gravatar.com/avatar/{0}".format(email_hash)


def get_achievement_object(a):
    out = {k: a.get(k) for k in ('id', 'name', 'rank', 'description', 'date')}
    return out


def get_user_annotated_achievements_list(user):
    achievements = [a for a in Achievement.objects.all().values()]
    achievements = list(map(lambda a: get_achievement_object(a), achievements))
    # Convert into dictionary, with id as key
    achievements = {a['id']: a for a in achievements}

    user_achievements = [a for a in user.achievement_set.values()]
    user_achievements = list(map(lambda a: get_achievement_object(a), user_achievements))

    for ua in user_achievements:
        a_id = ua['id']
        achievements[a_id]['earned'] = True # TODO(nathan): Change to date of user achievement

    return achievements


def std_page(request, script_path, props={}):
    template = loader.get_template('page.html')

    context = {
        'reactscript': script_path,
        'reactprops': json.dumps(props),
        'logged_in': request.user.is_authenticated,
    }

    if request.user.is_authenticated:
        context['user'] = get_current_user(request)

    return HttpResponse(template.render(context, request))


def index(request):
    return std_page(request, 'storytrove/home/home.js')


def read(request):
    return std_page(request, 'storytrove/read/read.js')


@login_required
def write(request, prompt_id):
    prompt = Prompt.objects.get(pk=prompt_id)

    if prompt is None:
        return index(request)

    props = {
        "promptId": prompt_id,
        "prompt": prepare_prompt_object(prompt)
    }

    return std_page(request, 'storytrove/write/write.js', props)


def browse(request):
    return std_page(request, 'storytrove/browse/browse.js')


def login(request):
    return std_page(request, 'storytrove/account/login.js')


def prompt(request, prompt_id):
    prompt = Prompt.objects.get(pk=prompt_id)

    if prompt is None:
        return index(request)

    props = {
        "promptId": prompt_id,
        "prompt": prepare_prompt_object(prompt)
    }

    return std_page(request, 'storytrove/read/prompt.js', props)


def prompt_example(request):
    return std_page(request, 'storytrove/read/prompt.js')


def story_example(request):
    return std_page(request, 'storytrove/read/story.js')


def story(request, story_id):
    props = {
        "storyId": story_id,
        "user": get_current_user(request)
    }

    return std_page(request, 'storytrove/read/story.js', props)


@login_required
def account(request):
    props = {
        "user": get_current_user(request)
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
    props = {
        "achievements": get_user_annotated_achievements_list(request.user)
    }

    return std_page(request, 'storytrove/account/achievements.js', props)


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = request.POST['username']
            password = request.POST['password1']
            #authenticate user then login
            user = authenticate(username=username, password=password)
            djlogin(request, user)
            return std_page(request, 'storytrove/home/home.js')

    else:
        form = UserCreationForm()
    token = {}
    token.update(csrf(request))
    token['form'] = form

    return render_to_response('registration/register.html', token)


@login_required
def password_change_render(request):
    template = loader.get_template('account/password_change.html')

    context = {
        'logged_in': request.user.is_authenticated,
    }

    if request.user.is_authenticated:
        context['user'] = get_current_user(request)

    return HttpResponse(template.render(context, request))


@login_required
def password_change(request):
    if request.method == 'POST':
        passwordOld = request.POST['old_password']
        password = request.POST['new_password1']
        passwordConfirm = request.POST['new_password2']
        
        current_user = request.user
        username = current_user.username

        if(check_password(passwordOld, current_user.password)):
            current_user.set_password(password)
            current_user.save()
            user = authenticate(username=username, password=password)
            djlogin(request, user)
            return redirect('/account')

    token = {}
    token.update(csrf(request))
    token['error'] = "Either your old password was not correct or your new passwords did not match."

    return render_to_response('account/password_change.html', token)
