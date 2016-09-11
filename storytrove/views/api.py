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
