from django.conf.urls.defaults import *;
from django.views.generic.simple import direct_to_template as d2t;

import settings
urlpatterns = patterns('',
    ('^$', d2t,   {'template': 'main.html'} ),
	(r'^sgs/', include('sanguosha.urls')),
	(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
)
