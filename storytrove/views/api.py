import datetime
import json
import urllib.error
import urllib.parse
import urllib.request
from datetime import timedelta

from django.db.models import Count
from django.http import JsonResponse
from django.core import serializers

from storytrove.models import *

API_KEY = ''  # TODO: How to move this somewhere better, like settings or environment variables

if API_KEY == '':
    print("\033[95m\033[91m\033[1m\033[4m--> You're forgetting the API key (/views/api.py) <--\033[0m")

if API_KEY != '':
    print("\033[95m\033[93m\033[1m\033[4m--> Remove API key before commit (/views/api.py) <--\033[0m")


# TODO: Move to model
def queryTrove(inputParams):
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
        return None;


# TODO: Move to model
def getTagString(tags):
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
    tag_string = getTagString(tags)

    if len(tag_string) == 0:
        return None

    res = queryTrove({
        # 'q': 'publictag:(' + getTagString(tags) + ')', # These proper tags suck, use tags as keywords...
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

    res = search(tags, reactions, offset)

    if res == None:
        return JsonResponse({
            'failure': True
        })

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
'''


def stories(request):

    tag = request.GET.get('tag')
    reaction = request.GET.get('reaction')
    author = request.GET.get('author')

    # start with all recent stories (past week)
    end_date = datetime.today()
    start_date = end_date - timedelta(days=6)
    responses = Response.objects.filter(date__range=[start_date, end_date])

    # then initially filter by the broadest option - the tag
    if tag is not None and tag != "":
        responses = responses.filter(prompt=Prompt.objects.filter(tags__contains=tag))

    # further filter by reaction and author if necessary
    if reaction is not None and reaction != "":
        responses = responses.annotate(
            num_emojis=Count('emojiresponseonresponse')).filter(
            emojiresponseonresponse__emoji=reaction).order_by('num_emojis')

    if author is not None and author != "":
        responses = responses.filter(user=UserAccount.objects.filter(username__exact=author))

    if responses is None:
        return JsonResponse({
            'failure': True
        })

    return JsonResponse({
        'success': True,
        'response': serializers.serialize('json', responses)
    })


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

        troveObjects = prompt.trove_objects
        stories = Response.objects.filter(prompt=prompt)
        reactions = EmojiResponseOnResponse.objects.filter(response__in=stories)

        return JsonResponse({
            'success': True,
            'response': json.dumps({
                'trove_objects': json.dumps(troveObjects),
                'tags': promptDetails.tags,
                'stories': json.dumps(stories),
                'reactions': json.dumps(reactions),
            })

        })

    except:
        return JsonResponse({
            'failure': True
        })


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
        return JsonResponse({
            'failure': True
        })

    if (response != ""):

        text = response.text
        author = json.dumps(response.user)
        prompt = json.dumps(response.prompt)
        # or do we only want IDs here for comments etc
        comments = json.dumps(Comment.objects.filter(response=response))

        return JsonResponse({
            'success': True,
            'response': json.dumps({
                'author': author,
                'prompt': prompt,
                'text': text,
                'comments': comments
            })
        })

    else:
        return JsonResponse({
            'failure': True
        })


'''
Get an array of comments for a given story id
'''


def comments(request):
    id = request.GET.get('id')

    comments = ""

    try:
        id = int(id)
        comments = Comment.objects.filter(response__in=Response.objects.filter(prompt=Prompt.objects.get(pk=id)))
    except:
        return JsonResponse({
            'failure': True
        })

    if (comments != ""):

        return JsonResponse({
            'success': True,
            'response': json.dumps({
                'comments': comments
            })
        })

    else:
        return JsonResponse({
            'failure': True
        })


'''
Respond to a prompt with a piece of writing
Requires the prompt id, the user id, the title, the text,
and whether it is a private post or a draft copy
'''


def respond(request):
    userId = request.GET.get('user_id')
    promptId = request.GET.get('prompt_id')
    title = request.GET.get('title')
    text = request.GET.get('text')
    is_draft = request.GET.get('is_draft')
    # For now, is_private will just be false
    is_private = False

    # TODO add in if user id is empty to use the current user?

    userIdInt = -1
    promptIdInt = -1

    try:
        userIdInt = int(userId)
        promptIdInt = int(promptId)
    except:
        return JsonResponse({
            'failure': True
        })

    response = Response(
        user=UserAccount.objects.get(pk=userIdInt),
        prompt=Prompt.objects.get(pk=promptIdInt),
        title=title,
        date=datetime.now(),  # datetime for date field ok?
        text=text,
        is_private=is_private,
        is_draft=is_draft)

    response.save()

    return JsonResponse({
        'success': True
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
        return JsonResponse({
            'failure': True
        })

    if (resourceType == "response"):
        reaction = EmojiResponseOnResponse(
            user=UserAccount.objects.get(pk=userIdInt),
            response=Response.objects.get(pk=resourceIdInt),
            emoji=emojiChar)

        reaction.save()

    elif (resourceType == "comment"):
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
    userId = request.GET.get('user_id')
    responseId = request.GET.get('response_id')
    text = request.GET.get('text')

    # TODO add in if user id is empty to use the current user?

    userIdInt = -1
    responseIdInt = -1

    try:
        userIdInt = int(userId)
        responseIdInt = int(responseId)
    except:
        return JsonResponse({
            'failure': True
        })

    comment = Comment(
        user=UserAccount.objects.get(pk=userIdInt),
        response=Response.objects.get(pk=responseIdInt),
        date=datetime.now(),  # datetime for date field ok?
        text=text)

    comment.save()

    return JsonResponse({
        'success': True
    })
