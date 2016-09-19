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

from . import views

urlpatterns = [
    url(r'^admin/?', admin.site.urls),
    url(r'^api/prompts/?', views.api.prompts),
    url(r'^scratch/?', views.test.scratch),
    url(r'^read/?', views.home.read),
    url(r'^write/?', views.home.write),
    url(r'^account/achievements/?', views.home.achievements),
    url(r'^account/edit/?', views.home.edit),
    url(r'^account/stories/?', views.home.account_stories),
    url(r'^account/?', views.home.account),
    url(r'^browse/?', views.home.browse),
    url(r'^prompt/example/?', views.home.prompt_example),
    url(r'^story/example/?', views.home.story_example),
    url(r'^login/?', views.home.login),
    url(r'^', views.home.index),
]
