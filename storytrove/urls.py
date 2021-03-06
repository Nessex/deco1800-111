"""storytrove URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth.views import login
from django.contrib.auth.views import logout
from . import views

urlpatterns = [
    url(r'^admin/?', admin.site.urls),
    url(r'^api/prompts/?', views.api.prompts),
    url(r'^api/stories/?', views.api.stories),
    url(r'^api/comments/?', views.api.comments),
    url(r'^api/achievements/?', views.api.achievements),
    url(r'^api/prompt/?', views.api.prompt),
    url(r'^api/story/?', views.api.story),
    url(r'^api/comment/?', views.api.comment),
    url(r'^api/respond/?', views.api.respond),
    url(r'^api/react/?', views.api.react),
    url(r'^scratch/?', views.test.scratch),
    url(r'^read/?', views.home.read),
    url(r'^write/(?P<prompt_id>[0-9]{1,11})/?', views.home.write),
    url(r'^prompt/(?P<prompt_id>[0-9]{1,11})/?', views.home.prompt),
    url(r'^account/register/?', views.home.register),
    url(r'^account/achievements/?', views.home.achievements),
    url(r'^account/stories/?', views.home.account_stories),
    url(r'^account/comments/?', views.home.account_comments),
    url(r'^account/password_change/send/?', views.home.password_change),
    url(r'^account/password_change/?', views.home.password_change_render),
    url(r'^account/?', views.home.account),
    url(r'^browse/?', views.home.browse),
    url(r'^prompt/example/?', views.home.prompt_example),
    url(r'^story/example/?', views.home.story_example),
    url(r'^story/(?P<story_id>[0-9]{1,11})/?', views.home.story),
    url(r'^login/?', login, name='login'),
    url(r'^logout/?', logout,{'next_page': '/login'}),
    url(r'^', views.home.index),
]
