# -*- coding: utf-8 -*-
from datetime import *;
import time;
import random;
from django.conf import settings
from django.core.urlresolvers import reverse
from django.http import *
from django.template import RequestContext
from django.template.loader import render_to_string
from django.utils.translation import ugettext as _
from django.utils import simplejson
from django.shortcuts import render_to_response as rtr;
from django.contrib.auth.decorators import login_required


from models import *;
from decorators import *;
from pageharvest.img_parser   import *;  
from imgboards.settings       import *;
import random;
import logging;
  

def vpics( request,  template='bbs-template.html', extra_context=None):
    context = RequestContext(request);
    ilps = ImgLinkPage.objects.all();
    total_img_count = len( ilps );
    tgc = 100;
    chosen_list = random.sample(xrange( total_img_count ), int ( total_img_count * 0.8 ) );
    pics = [];
    collected_img = 0;
    for c in chosen_list:
        if collected_img > tgc:
            break;
        ilp = ilps[c];
        ic = len( ilp.imglist );
        sample_n = random.randint( 0, ic-1);
        pics.extend( ilp.sample_image( sample_n ) );
        collected_img = collected_img + sample_n;
        
    context['pics'] = pics;
    return rtr( template, context, context_instance=extra_context)

    
def vpicos( request,  template='bbs-template.html', extra_context=None):
    context = RequestContext(request);
    ilps = ImgLinkPage.objects.all();
    imglist = [];
    for ilp in ilps:
        imglist.extend( ilp.imglist );
    iup = ilps[0].config.ifp;
    pics = [];
    
    for fid in imglist:
        purl = iup%(fid);
        pics.append( purl );
    context['pics'] = pics[0:100];
    return rtr( template, context, context_instance=extra_context)
    
def vpa( request,  template='bbs-template.html', extra_context=None):
    context = RequestContext(request);
    return rtr( template, context, context_instance=extra_context)
    
@admin_user_only
def sda( request,  template='default.html', extra_context=None):
    context = RequestContext(request);

    for bc in BbsBoardParseConfig :
        try:
            bbsname = bc['bbs'];
            ipc = ImgParseConfig.objects.get( bbs = bbsname );
        except Exception,e:
            bc['config'] = repr( bc['config'] );
            ImgParseConfig( **bc ).save();
    context['msg'] = 'All data successfully initiated';
    return rtr( template, context, context_instance=extra_context)


def gae_pic_cron( request,  template='default.html', extra_context=None):
    context = RequestContext(request);
    parser  = ImageParser();
    try:
        c = ImgParseConfig.objects.get( bbs='byhh');
    except Exception,e:
        msg = 'No such bbs config named %d exist'%('byhh');
        logging.info(msg);
        context['msg'] = msg;
        return rtr( template, context, context_instance=extra_context);
    parser.parseImageConifgedPageList( c.toDict() ,c );
    context['msg'] = 'successfully parsed';
    return rtr( template, context, context_instance=extra_context)
