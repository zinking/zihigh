# -*- coding: utf-8 -*-
from django.contrib 	import auth
from django.contrib.auth.models import User
from django.http 		import HttpResponse, HttpResponseRedirect
from django.template 	import RequestContext, Template, Context
from django.shortcuts 	import render_to_response
from django.contrib.auth.decorators import login_required
from django.db 			import transaction
from django.utils 		import simplejson 
from django.template.loader import render_to_string		as rts;
from django.shortcuts 		import render_to_response 	as rtr;

from datetime import *;

from models import *;
def palyer2dict( pobject ):
	return {'id':pobject.id,'name':pobject.name };
def combine_pr_dict( players, records ):
	plist = [];
	for p,r in zip(players, records):
		result = {'id':p.id, 'prid':r.id,
			'name':p.name };
		plist.append( result );
	return plist;
###############################################################################################
def record_newgame(request, template='jlypxyx.html', extra_context=None):
	context = RequestContext(request); 
	context['groups'] = Group.objects.all();
	return rtr(template, context,extra_context);
	
def setup(request, template='setup.html', extra_context=None):
	context = RequestContext(request); 
	Group( name = "3303" ).save();
	Group( name = "5216" ).save();
	Player( name = u"张智勇" , groups=['3303']  ).save();
	Player( name = u"谌尧" , groups=['3303']  ).save();
	Player( name = u"赖宏辉" , groups=['3303']  ).save();
	Player( name = u"丁磊" , groups=['3303']  ).save();
	Player( name = u"张嫣蕾" , groups=['3303']  ).save();
	Player( name = u"苏弟" , groups=['3303']  ).save();
	
	return rtr(template, context,extra_context);

def start_newgame(request, template='jljs.html', extra_context=None):
	context = RequestContext(request); 
	playerlist = [];
	playeridlist = [];
	for k,v in request.POST.items():
		if len(k) <= 5:#remove the annoying form WSCR....
			playeridlist.append( v );

	for playerid in playeridlist:
		player = Player.objects.get( id=int(playerid) );
		playerlist.append( player );
	#context['playerlist'] = map( palyer2dict, playerlist );
	game = Game(createtime=datetime.now(),playerlist=playeridlist,ip = request.META['REMOTE_ADDR']);
	game.save();
	precordlist = [];
	for player in playerlist:
		precord = PlayRecord( player = player, game = game );
		precord.save();
		precordlist.append( precord );
	context['game'] = game;
	context['plist'] = combine_pr_dict( playerlist, precordlist );


	return rtr(template, context,extra_context);


################################################################################################
def getPlayersByGroup( request, template='default.html', extra_context=None):

	#simple
	context={ 'result':False };
	if 'group' in request.POST :
		
		plist = Player.objects.filter( groups = request.POST['group'] );
		if len(plist) > 0 :
			context['players'] = map( palyer2dict, plist );
			context['result']  = True;
		        
	return HttpResponse( simplejson.dumps(context,ensure_ascii = False) );
	
def getGroups( request, template='default.html', extra_context=None):
	#simple
	context={ 'result':True };
	context['groups'] = Group.objects.all();
             
	return HttpResponse( simplejson.dumps(context,ensure_ascii = False) );
	
def save_game( request, template='default.html', extra_context=None):
	#simple
	context={ 'result':False };
	if 'records' in request.POST and 'game' in request.POST :
		records = simplejson.loads ( request.POST['records'] );
		g = simplejson.loads( request.POST['game'] );
		if g['end']:
			pds = simplejson.loads( request.POST['pd'] );
		
		for index,record in records.items():
			precord = PlayRecord.objects.get( id = record['prid'] );
			precord.role = record['role'];
			precord.wujiang = record['wujiang'];
			precord.killby	= record['killby'];
			precord.srounds = record['srounds'];
			precord.result	= record['result'];
			precord.save();
		
		game = Game.objects.get( id=g['id'] );
		game.playerlist = g['playerlist'];
		game.rolelist = g['rolelist'];
		game.wujianglist = g['wujianglist'];
		game.round = g['round'];
		game.result = g['result'];
		if g['end'] :
			game.finishtime = datetime.now();
		game.save();
		
		if g['end']:
			for pd in pds.values():
				precord = PlayRecord.objects.get( id = pd['prid'] );
				pan = PandingRecord( prid = precord , name = pd['name'],
					hitcount = pd['hit'], nhitcount = pd['nhit'], rhitby=pd['rhitby'],
					rnhitby=pd['rnhitby'] );
				
				pan.save();
				#print pan.rnhitby;
		
		
		context['result'] = True;
			
	
             
	return HttpResponse( simplejson.dumps(context,ensure_ascii = False) );
	
def startGame( request, template='default.html', extra_context=None):
	#create game -- create time etc
	#return game info
	#create play record for players
	#potentiallly add wujiang
	#recover game info using ip address
	context={ 'result':False };
	P = request.POST;
	if 'createtime' in P and 'pidlist' in P and 'pwjlist' in P :
		game = Game( createtime = P['createtime'], playerlist = P['pidlist'], 
			wujianglist = P['pwjlist'], ip = request.META['REMOTE_ADDR'] ).save();#game created
		
		prlist = [];
		for pid,pwj in P['pidlist'],P['pwjlist'] :
			p = Player.object.get( id=pid );
			precord = PlayRecord( player = p, game = game, wujiang = pwj);
			precord.save();
			prlist.append( precord.id );
		request.session['gid'] = game.id;
		context['result'] = True;
		context['msg'] = 'games and play record constructed';
		context['gameid'] = game.id;
		context['prlist'] = prlist;
	else:
		context['msg'] = 'info not complete';
             
	return HttpResponse( simplejson.dumps(context,ensure_ascii = False) );
	
def endGame( request, template='default.html', extra_context=None):
	#update game result,game finish time, rolelist
	#update play record for result 
	#check valid of game and play record
	context={ 'result':False };
	P = request.POST;
	if 'finishtime' in P and 'result' in P and 'prlist' in P and 'rolelist' in P and 'gid' in P:
		try:
			game = Game.objects.get( id=P['gid'] );
		except Exception,e:
			pass;
		game.finishtime = P['finishtime'];
		game.rolelist	= P['rolelist'];
		game.result 	= P['result'];
		for prid, role in P['prlist'] , P['rolelist']:
			try:
				precord = PlayerRecord.objects.get( id = prid );
			except Exception,e:
				pass;
			if precord.role == "":
				precord.role = role;
			if precord.role == P['result']:
				precord.result = 'win';
			precord.save();
		context['result'] = True;
			
             
	return HttpResponse( simplejson.dumps(context,ensure_ascii = False) );
	
def updatePlayRecord( request, template='default.html', extra_context=None):
	#update killlist with wujiang player roles
	#update player roles
	context={ 'result':False };
	
             
	return HttpResponse( simplejson.dumps(context,ensure_ascii = False) );
	

	
	
	
#############CRUD OPERATIONS TEMPERALLY NOT CONSIDERED########################	
def addGroups( request, template='default.html', extra_context=None):
	context={ 'result':False };
             
	return HttpResponse( simplejson.dumps(context,ensure_ascii = False) );
	
def addPlayer( request, template='default.html', extra_context=None):
	context={ 'result':False };
             
	return HttpResponse( simplejson.dumps(context,ensure_ascii = False) );