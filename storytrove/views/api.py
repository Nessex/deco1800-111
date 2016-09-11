from django.http import JsonResponse
import datetime
import urllib.request, urllib.parse, urllib.error
import json

API_KEY = '' #TODO: How to move this somewhere better, like settings or environment variables

if API_KEY == '':
    print("\033[95m\033[91m\033[1m\033[4m--> You're forgetting the API key (/views/api.py) <--\033[0m")

if API_KEY != '':
    print("\033[95m\033[93m\033[1m\033[4m--> Remove API key before commit (/views/api.py) <--\033[0m")

#TODO: Move to model
def queryTrove(inputParams):
    params = {
        'key': API_KEY,
        **inputParams #merge inputParams into this dict
    }

    paramString = urllib.parse.urlencode(params)
    url = "http://api.trove.nla.gov.au/result?" + paramString
    r = urllib.request.urlopen(url).read().decode('utf8')
    return json.loads(r)

#TODO: Move to model
def getTagString(tags):
    #TODO: Filter/Whitelist tags here
    whitelist = [
        'brisbane',
        'royal',
        'death', # for Jono
        'world war 2'
    ]

    filtered_tags = [t for t in tags if t in whitelist]

    return " AND ".join(filtered_tags)

'''
TODO: Move to model, this functionality will be sort-of replaced by a
set of functions, primarily prompts()

This will still be used internally to build up new sets of prompts from trove.
'''
def search(request):
    tags = request.GET.get('tags').split(',')
    reactions = request.GET.get('reactions').split(',')

    tag_string = getTagString(tags)

    if len(tag_string) == 0:
        return JsonResponse({
            'failure': True
        })

    res = queryTrove({
        #'q': 'publictag:(' + getTagString(tags) + ')', # These proper tags suck, use tags as keywords...
        'q': tag_string,
        'encoding': 'json',
        'zone': 'picture',
        'sortby': 'relevance',
        'n': '10',
        'reclevel': 'full',
        'l-availability': 'y',
        'include': 'links'
    })

    return JsonResponse({
        'success': True,
        'response': res
    })

'''
Get the current set of prompts
By default this should return a set of featured prompts for each of a few tags
Results can also be filtered by providing an array of tags or reactions
'''
def prompts(request):
    return JsonResponse({
        'failure': True
    })

'''
Get a list of recently written stories
This is intended to be used to get a list of stories for the reading section
Optional filters:
tag
reaction
'''
def recently_written(request):
    return JsonResponse({
        'failure': True
    })

'''
Get a list of the most recent stories written by a particular user
Requires a username
'''
def recent_by_author(request):
    return JsonResponse({
        'failure': True
    })

'''
Get details for a prompt including image links, metadata, stories, votes and reactions
Requires a prompt id
'''
def prompt(request):
    return JsonResponse({
        'failure': True
    })

'''
Get details required to display a story including the story text, author details,
prompt details, and comment metadata.
Requires a story id
'''
def story(request):
    return JsonResponse({
        'failure': True
    })

'''
Get an array of comments for a given story id
'''
def comments(request):
    return JsonResponse({
        'failure': True
    })

'''
Add a reaction (by id) to a given story id
'''
def add_story_reaction(request):
    return JsonResponse({
        'failure': True
    })

'''
Add a reaction (by id) to a given comment id
'''
def add_comment_reaction(request):
    return JsonResponse({
        'failure': True
    })
