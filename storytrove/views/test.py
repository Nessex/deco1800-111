from django.http import HttpResponse
from django.template import loader
import datetime

def search(request):
    return 1

def scratch(request):
    now = [datetime.datetime.now()]
    html = "<html><body>It is nowoo %s.</body></html>" % now
    template = loader.get_template('scratch/scratch.html')
    context = {
        'latest_question_list': now,
    }
    return HttpResponse(template.render(context, request))
