from django.conf.urls import patterns, include, url

from appfb import views

urlpatterns = patterns('',
    url(r'check', views.check),
    url(r'fbauth', views.fbauth),
    url(r'^$', views.index, name='index'),
)
