from django.conf.urls.defaults import *;
from django.views.generic.simple import direct_to_template;
from django.contrib.auth import views as auth_views;

from imgboards.views import *;

urlpatterns = patterns('',
    url(r'^$', vpics, 
        {'template': 'main.html'},          name='pindex'),
    url(r'^pics/$', vpics, 
        {'template': 'main.html'},          name='vpics'),
    url(r'^xml/$', vpics, 
        {'template': 'gallery.xml'},        name='gxml'),
    url(r'^xml2/$', vpics, 
        {'template': 'photos.xml'},         name='pxml'),
    url(r'^t/$', direct_to_template, 
        {'template': 'fs.html'},            name='anotherviewer'),
    url(r'^src$', view_src_page, 
        {'template': 'ilf.html'},            name='view_pic_src'),
        
    url(r'^management/setup/$', sda, 
        {'template': 'default.html'},       name='sda'),
    url(r'^management$', admin_db_op, 
        {'template': 'default.html'},       name='admin_op'),
    url(r'^management/cron/link/$',  gae_piclink_cron, 
        {'template': 'default.html'},       name='gae_piclink_cron'),
    url(r'^management/cron/agent/$', gae_picagent_cron, 
        {'template': 'default.html'},       name='gae_picagent_cron'),

    
)
