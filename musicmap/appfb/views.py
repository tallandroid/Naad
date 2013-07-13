# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect
from django.template import Context, loader
from django.shortcuts import render
import urllib, json, sys, cgi

def index(request):
    return render(request, 'appfb/index.html')

def map(request):
    return render(request, 'appfb/map.html')

APP_ID = '568249983217350'
APP_SECRET = '894d45eedede6c6fcab68263a94d5fb3'
MY_URL = 'http://127.0.0.1:8000/appfb/map/'

def fbauth(request):
    code = request.GET.get('code')
    if code is None:
        args = dict(client_id=APP_ID, redirect_uri=MY_URL, scope="user_likes,friends_likes")
        redirect_url = "https://graph.facebook.com/oauth/authorize?" + urllib.urlencode(args)
        return HttpResponseRedirect(redirect_url)
    else:
        args = dict(client_id=APP_ID, redirect_uri=MY_URL)
        args["client_secret"] = APP_SECRET  
        args["code"] = code
        token_url = "https://graph.facebook.com/oauth/access_token?"+urllib.urlencode(args)
        request.session['access_token'] = urllib.urlopen(token_url).read()[13:-1]
        return HttpResponseRedirect('/dash/likes')
