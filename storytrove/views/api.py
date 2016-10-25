import json
import urllib.error
import urllib.parse
import urllib.request
from datetime import *
import operator
import functools

from django.db.models import Count
from django.db.models import Q
from django.http import HttpResponse
from django.http import JsonResponse

from storytrove.models import *

API_KEY = ''  # TODO: How to move this somewhere better, like settings or environment variables

if API_KEY == '':
    print("\033[95m\033[91m\033[1m\033[4m--> You're forgetting the API key (/views/api.py) <--\033[0m")

if API_KEY != '':
    print("\033[95m\033[93m\033[1m\033[4m--> Remove API key before commit (/views/api.py) <--\033[0m")


def standard_failure():
    return JsonResponse({
        'failure': True
    })


def get_reactions_for_response(response_id):
    reactions = EmojiResponseOnResponse.objects.filter(response_id=response_id)
    out = {}

    for r in reactions:
        if out.get(r.emoji) is None:
            out[r.emoji] = 0

        out[r.emoji] += 1

    return out


def get_reactions_for_user(user_id):
    reactions = EmojiResponseOnResponse.objects.filter(user_id=user_id)
    out = {}

    for r in reactions:
        if out.get(r.emoji) is None:
            out[r.emoji] = 0

        if r.emoji == '-':
            out[r.emoji] -= 1
        else:
            out[r.emoji] += 1

    return out


def get_votes_for_comment(comment_id):
    vote_objects = EmojiResponseOnComment.objects.filter(comment_id=comment_id)
    out = 0

    for v in vote_objects:
        if v.emoji == '+':
            out += 1
        elif v.emoji == '-':
            out -= 1

    return out


def get_username(id):
    user = User.objects.get(pk=id)

    if user is not None:
        return user.username

    return None


def query_trove_image_url(work_id):
    params = {
        'key': API_KEY,
        'encoding': 'json',
        'reclevel': 'full'
    }

    paramString = urllib.parse.urlencode(params)
    url = "http://api.trove.nla.gov.au/work/{0}?{1}".format(work_id, paramString)

    try:
        r = urllib.request.urlopen(url).read().decode('utf8')

        for i in json.loads(r)['work']['identifier']:
            if i['linktype'] == "thumbnail" and i['type'] == "url":
                return i['value']

        return None

    except urllib.error.HTTPError:
        return None


def prepare_story_dict_object(s, truncated=False):
    out = {k: s.get(k) for k in ('id', 'title', 'is_draft', 'is_private', 'user_id', 'prompt_id')}

    # Add in any values that need to be transformed
    out['date'] = s['date'].isoformat()

    # Truncate text to 300 characters
    out['text'] = s['text'][:300] if (len(s['text']) > 300 and truncated) else s['text']
    out['reactions'] = get_reactions_for_response(out['id'])
    return out


def prepare_story_object(s, truncated=False):
    # Start with values we want as-is
    out = {k: getattr(s, k) for k in ('id', 'title', 'is_draft', 'is_private', 'user_id', 'prompt_id')}

    # Add in any values that need to be transformed
    out['date'] = s.date.isoformat()

    # Truncate text to 300 characters
    out['text'] = s.text[:300] if (len(s.text) > 300 and truncated) else s.text
    out['reactions'] = get_reactions_for_response(out['id'])
    return out


def prepare_user_object(u):
    out = {k: getattr(u, k) for k in ('id', 'username')}
    out['reactions'] = get_reactions_for_user(out['id'])
    return out


def prepare_prompt_object(p):
    out = {
        'id': p.id,
        'tags': p.tags.split(',')
    }

    trove_objects = [t for t in p.trove_objects.values()]
    trove_objects = list(map(prepare_trove_object, trove_objects))
    out['trove_objects'] = trove_objects
    return out


def prepare_trove_object(t):
    out = {k: t.get(k) for k in ('id', 'trove_id', 'description')}
    out['image_url'] = query_trove_image_url(out['trove_id'])
    return out


def prepare_comment_object(c):
    out = {k: getattr(c, k) for k in ('id', 'text', 'user_id')}
    out['votes'] = get_votes_for_comment(out['id'])
    return out


def prepare_reaction_object(r):
    return r.get('id')


def query_trove(inputParams):
    params = {
        'key': API_KEY,
        **inputParams  # merge inputParams into this dict
    }

    paramString = urllib.parse.urlencode(params)
    url = "http://api.trove.nla.gov.au/result?" + paramString

    try:
        r = urllib.request.urlopen(url).read().decode('utf8')
        return json.loads(r)
    except urllib.error.HTTPError:
        return None


def get_tag_string(tags):
    # TODO: Filter/Whitelist tags here
    whitelist = [
        'brisbane',
        'royal',
        'death',  # for Jono
        'world war 2'
    ]

    filtered_tags = [t for t in tags if t in whitelist]

    return " AND ".join(filtered_tags)


'''
TODO: Move to model, this functionality will be sort-of replaced by a
set of functions, primarily prompts()

This will still be used internally to build up new sets of prompts from trove.
'''


def search(tags, reactions, offset):
    tag_string = get_tag_string(tags)

    if len(tag_string) == 0:
        return None

    res = query_trove({
        # 'q': 'publictag:(' + get_tag_string(tags) + ')', # These proper tags suck, use tags as keywords...
        'q': tag_string,
        'encoding': 'json',
        'zone': 'picture',
        'sortby': 'relevance',
        'n': '16',
        's': offset,
        'reclevel': 'full',
        'l-availability': 'y',
        'include': 'links'
    })

    return res


'''
Get the current set of prompts
By default this should return a set of featured prompts for each of a few tags
Results can also be filtered by providing an array of tags or reactions
'''


def prompts(request):
    tags = request.GET.get('tags').split(',')
    reactions = request.GET.get('reactions').split(',')
    offset = request.GET.get('offset')

    query = functools.reduce(operator.and_, (Q(tags__contains=t) for t in tags))
    res = Prompt.objects.filter(query)
    res = [prepare_prompt_object(r) for r in res]

    if res is None:
        return standard_failure()

    return JsonResponse({
        'success': True,
        'response': res
    })


'''
Get a list of recently written stories
This is intended to be used to get a list of stories for the reading section
Optional filters:
tag
reaction
author
prompt
'''


def stories(request):
    tag = request.GET.get('tag')
    reaction = request.GET.get('reaction')
    author = request.GET.get('author')
    prompt_id = request.GET.get('prompt_id')

    # start with all recent stories (past week)
    # end_date = datetime.today()
    # start_date = end_date - timedelta(days=6)
    responses = Response.objects.all()  # filter(date__range=[start_date, end_date])

    # then initially filter by the broadest option - the tag
    if tag is not None and tag != "":
        responses = responses.filter(prompt=Prompt.objects.filter(tags__contains=tag))

    # further filter by reaction and author if necessary
    if reaction is not None and reaction != "":
        responses = responses.annotate(
            num_emojis=Count('emojiresponseonresponse')).filter(
            emojiresponseonresponse__emoji=reaction).order_by('num_emojis')

    if author is not None and author != "":
        if author == 'current':
            responses = responses.filter(user=request.user)
        else:
            responses = responses.filter(user=UserAccount.objects.filter(username__exact=author))

    if prompt_id is not None and prompt_id != "":
        responses = responses.filter(prompt=Prompt.objects.get(pk=prompt_id))

    if responses is None:
        return standard_failure()

    stories = [r for r in responses.values()]
    stories = list(map(lambda s: prepare_story_dict_object(s, True), stories))

    story_authors = {s.get('user_id'): get_username(s.get('user_id')) for s in stories}

    return HttpResponse(json.dumps({
        'success': True,
        'stories': stories,
        'story_authors': story_authors
    }), content_type='application/json')


'''
Get details for a prompt including image links, metadata, stories, votes and reactions
Requires a prompt id
'''


def prompt(request):
    id = request.GET.get('id')

    # TODO: limit the size of the try catch block for converting the int
    try:
        id = int(id)
        prompt = Prompt.objects.get(pk=id)
        prompt = prepare_prompt_object(prompt)

        return JsonResponse({
            'success': True,
            'prompt': prompt
        })

    except:
        return standard_failure()


'''
Get details required to display a story including the story text, author details,
prompt details, and comment metadata.
Requires a story id
'''


def story(request):
    id = request.GET.get('id')

    response = ""

    try:
        id = int(id)
        response = Response.objects.get(pk=id)
    except:
        return standard_failure()

    if response != "":
        story = prepare_story_object(response)
        author = prepare_user_object(response.user)
        prompt = prepare_prompt_object(response.prompt)
        comments = [c for c in Comment.objects.filter(response=response)]
        comments = list(map(prepare_comment_object, comments))
        comment_ids = [c['id'] for c in comments]
        comment_author_ids = list(set([c['user_id'] for c in comments]))  # unique user ids

        # Change comments into an associative array, with comment id as the key
        comments = {c['id']: c for c in comments}

        # Get user objects for each comment author id
        comment_authors = [prepare_user_object(User.objects.get(pk=uid)) for uid in comment_author_ids]
        comment_authors = {ca['id']: ca for ca in comment_authors}

        return HttpResponse(json.dumps({
            'success': True,
            'story': story,
            'author': author,
            'prompt': prompt,
            'comment_ids': comment_ids,
            'comments': comments,
            'comment_authors': comment_authors
        }), content_type='application/json')

    else:
        return standard_failure()


'''
Get an array of comments for a given story id
'''
# TODO(nathan): this should be changed to get comments for a given user id (for the account_coments page)


def comments(request):
    id = request.GET.get('id')

    comments = ""

    try:
        id = int(id)
        comments = Comment.objects.filter(response__in=Response.objects.filter(prompt=Prompt.objects.get(pk=id)))
    except:
        return standard_failure()

    if comments != "":

        return JsonResponse({
            'success': True,
            'response': json.dumps({
                'comments': comments
            })
        })

    else:
        return standard_failure()


'''
Get an array of achievements for the given user id
'''


def achievements(request):
    try:
        user_achievements = Achievement.objects.get(user=request.user)
        achievements = Achievement.objects.all()
    except:
        return standard_failure()

    return JsonResponse({
        'success': True,
        'achievements': achievements,
        'user_achievements': user_achievements
    })


'''
Respond to a prompt with a piece of writing
Requires the prompt id, the user id, the title, the text,
and whether it is a private post or a draft copy
'''


def respond(request):
    if not request.user.is_authenticated:
        return standard_failure()

    prompt_id = request.GET.get('prompt_id')
    title = request.GET.get('title')
    text = request.GET.get('text')
    is_draft = request.GET.get('is_draft')
    is_private = request.GET.get('is_private')

    has_existing = False

    try:
        story_id = request.GET.get('story_id')
        story_id = int(story_id)
        has_existing = True
    except:
        pass

    if not has_existing:
        story_id = None

    try:
        prompt_id_int = int(prompt_id)
        is_draft = is_draft == 'true'
        is_private = is_private == 'true'
    except:
        return standard_failure()

    if has_existing:
        # Check this is on the correct prompt, and owned by this user
        existing = Response.objects.get(id=story_id)
        if existing.user.id != request.user.id or existing.prompt.id != prompt_id_int:
            return standard_failure()

    response = Response(
        id=story_id,
        user=request.user,
        prompt=Prompt.objects.get(pk=prompt_id_int),
        title=title,
        date=datetime.now(),  # datetime for date field ok?
        text=text,
        is_private=is_private,
        is_draft=is_draft)

    response.save()

    return JsonResponse({
        'success': True,
        'story_id': response.id
    })


'''
Add a reaction to a given resource,
needs to specify if the resource is a comment or a story,
the user id, the id of the resource and the emoji used as
a reaction in its char format
'''


def react(request):
    userId = request.GET.get('user_id')
    resourceType = request.GET.get('resource_type')
    resourceId = request.GET.get('resource_id')
    emojiChar = request.GET.get('emoji')

    # TODO add in if user id is empty to use the current user?

    userIdInt = -1
    promptIdInt = -1

    try:
        userIdInt = int(userId)
        resourceIdInt = int(resourceId)
    except:
        return standard_failure()

    if resourceType == "response":
        reaction = EmojiResponseOnResponse(
            user=UserAccount.objects.get(pk=userIdInt),
            response=Response.objects.get(pk=resourceIdInt),
            emoji=emojiChar)

        reaction.save()

    elif resourceType == "comment":
        reaction = EmojiResponseOnResponse(
            user=UserAccount.objects.get(pk=userIdInt),
            response=Response.objects.get(pk=resourceIdInt),
            emoji=emojiChar)

        reaction.save()

    return JsonResponse({
        'success': True
    })


'''
Add a comment to a given resource
'''


def comment(request):
    responseId = request.GET.get('response_id')
    text = request.GET.get('text')

    responseIdInt = -1

    try:
        responseIdInt = int(responseId)
    except:
        return standard_failure()

    comment = Comment(
        user=request.user,
        response=Response.objects.get(pk=responseIdInt),
        date=datetime.now(),  # datetime for date field ok?
        text=text)

    comment.save()

    return JsonResponse({
        'success': True
    })
