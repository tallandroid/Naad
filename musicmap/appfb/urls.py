from django.conf.urls import patterns, include, url

from appfb import views

urlpatterns = patterns('',
    url(r'map', views.map),
    url(r'fbauth', views.fbauth),
    url(r'^$', views.index, name='index'),
)
