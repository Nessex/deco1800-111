from django.http import JsonResponse
import datetime
import urllib.request, urllib.parse, urllib.error
import json

#TODO: Move to model
def queryTrove(inputParams):
    params = {
        'key': '',
        **inputParams #merge inputParams into this dict
    }

    paramString = urllib.parse.urlencode(params)
    url = "http://api.trove.nla.gov.au/result?" + paramString
    r = urllib.request.urlopen(url).read().decode('utf8')
    return json.loads(r)

#TODO: Move to model
def getTagString(tags):
    #TODO: Filter/Whitelist tags here
    return " AND ".join(tags)

def search(request):
    tags = request.GET.get('tags').split(',')
    reactions = request.GET.get('reactions').split(',')

    if len(tags) == 0:
        return JsonResponse({
            'failure': True
        })

    res = queryTrove({
        'q': 'publictag:(' + getTagString(tags) + ')',
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
