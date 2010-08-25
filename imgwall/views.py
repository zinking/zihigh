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

from models import *;

	
