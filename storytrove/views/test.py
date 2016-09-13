from django.http import HttpResponse
from django.template import loader
import datetime

def search(request):
    return 1

def scratch(request):
    template = loader.get_template('page.html')
    context = {
        'reactscript': 'storytrove/search/search.js',
    }
    return HttpResponse(template.render(context, request))
