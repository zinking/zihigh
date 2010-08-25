# -*- coding: utf-8 -*-
from functools import wraps;
from ragendja.auth.decorators import *;
from google.appengine.api import users;
from django.template import RequestContext;
from django.shortcuts import render_to_response as rtr;

def bt_user_only(view):
    """
    Decorator that requires user.is_staff. Otherwise renders no_access.html.

    @google_login_required
    def wrapped(request, *args, **kwargs):
        uea = request.META['USER_EMAIL'];
        q = UserAccount.all().filter('email =',uea );
        if q.count() > 0 or users.is_current_user_admin():
            return view(request, *args, **kwargs)
        context = RequestContext(request);
        return rtr( 'access_limited.html', context,None )
    return wraps(view)(wrapped)    """
    pass;

"""
great effort spent to make rjauth work with current 
not fully transfered, but some what understand
django.contrib.auth.contextprocessor is modified """
def admin_user_only(view):
    """
    Decorator that requires user.is_staff. Otherwise renders no_access.html.
    """
    @google_login_required
    def wrapped(request, *args, **kwargs):
        if users.is_current_user_admin():
            return view(request, *args, **kwargs)
        context = RequestContext(request);
        return rtr( 'limit.html', context,None )
    return wraps(view)(wrapped)

def is_bt_user( request ):
    email = request.META['USER_EMAIL'];
    if( email == None ): return False;
    if users.is_current_user_admin(): return True;
    q = UserAccount.all().filter('email =',email );
    return q.count() > 0;