from django.conf.urls.defaults import *;
from ragendja.urlsauto  import urlpatterns
from ragendja.auth.urls import urlpatterns as auth_patterns
from django.views.generic.simple import direct_to_template as d2t;

import settings
from imgboards.views import *;
urlpatterns = patterns('',
    #url(r'^$', vpics, 
    #    {'template': 'pa.html'},       name='index'),
    url(r'^$', d2t, {'template': 'fs.html'},name='index'),
	(r'^p/', include('imgboards.urls')),
	(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    url(r'^pa/', vpics, {'template': 'pa.html'}, name='vpa'),
    url(r'^gaebar/', include('gaebar.urls')),
    url(r'^f$',view_pic_agents,{'template':'default.html'},name="viewpics"),
) +auth_patterns+ urlpatterns;
