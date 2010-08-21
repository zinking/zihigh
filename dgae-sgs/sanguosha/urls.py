from django.conf.urls.defaults import *;
from django.views.generic.simple import direct_to_template as d2t;
from django.contrib.auth import views as auth_views;

from views import *;

urlpatterns = patterns('',
    url(r'^getPlayersByGroup/$', getPlayersByGroup, 
        {'template': 'defalut.html'},       name='getPlayersByGroup'),
	url(r'^getGroups/$', getGroups, 
        {'template': 'defalut.html'},       name='getGroups'),
		
	url(r'^startGame/$', startGame, 
        {'template': 'defalut.html'},       name='startGame'),
	url(r'^endGame/$', 	 endGame, 
        {'template': 'defalut.html'},       name='endGame'),
	url(r'^save_game/$', 	 save_game, 
        {'template': 'defalut.html'},       name='save_game'),
		
	url(r'^updatePlayRecord/$', 	 updatePlayRecord, 
        {'template': 'defalut.html'},       name='updatePlayRecord'),
		
		
	
###############admin sections###########################
    url(r'^addGroups/$', addGroups, 
        {'template': 'defalut.html'},       name='addGroups'),
	url(r'^addPlayer/$', addPlayer, 
        {'template': 'defalut.html'},       name='addPlayer'),
	url(r'^setup/$', setup, 
        {'template': 'setup.html'},       name='setup'),
	
		
###############--------------###########################
	url(r'^menu/$', d2t, 
        {'template': 'select.html'},       name='menu'),
	url(r'^record_newgame/$', record_newgame, 
        {'template': 'jlypxyx.html'},       name='record_newgame'),
	url(r'^start_newgame/$',  start_newgame, 
        {'template': 'jljs.html'},       name='start_newgame'),
)
