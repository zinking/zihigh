from django.conf.urls.defaults import *;
from django.views.generic.simple import direct_to_template;
from django.contrib.auth import views as auth_views;

from imgboards.views import *;

urlpatterns = patterns('',
    url(r'^$', vpics, 
        {'template': 'main.html'},       name='pindex'),
    url(r'^pics/$', vpics, 
        {'template': 'main.html'},       name='vpics'),
    url(r'^xml/$', vpics, 
        {'template': 'gallery.xml'},       name='gxml'),
    url(r'^xml2/$', vpics, 
        {'template': 'photos.xml'},       name='pxml'),
    url(r'^t/$', direct_to_template, 
        {'template': 'fs.html'},       name='anotherviewer'),
        
    url(r'^sda/$', sda, 
        {'template': 'default.html'},       name='sda'),
    url(r'^mc/$', gae_pic_cron, 
        {'template': 'default.html'},       name='gae_pic_cron'),

    
)
