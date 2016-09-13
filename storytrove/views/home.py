from django.http import HttpResponse
from django.template import loader
import datetime

def index(request):
    template = loader.get_template('page.html')
    context = {
        'reactscript': 'storytrove/home/home.js',
    }
    return HttpResponse(template.render(context, request))
