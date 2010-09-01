# -*- coding: utf-8 -*-

from django.conf        import settings;
from django.core.urlresolvers   import reverse;
from django.http        import *;
from django.template    import RequestContext;
from django.template.loader     import render_to_string;
from django.utils.translation   import ugettext as _;
from django.utils       import simplejson;
from django.shortcuts   import render_to_response as rtr;
from django.contrib.auth.decorators import login_required;
from django.shortcuts   import get_object_or_404;

from datetime   import *;
from models     import *;
from decorators import *;
from pageharvest.img_parser   import *;
from pageharvest.img_agent    import *;    
from imgboards.settings       import *;
import random;
import logging;
import time;

  

def vpics( request,  template='default.html', extra_context=None):
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
    return rtr( template, context, context_instance=extra_context, mimetype="application/xhtml+xml")

    
def vpicos( request,  template='default.html', extra_context=None):
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
    
def vpa( request,  template='default.html', extra_context=None):
    context = RequestContext(request);
    return rtr( template, context, context_instance=extra_context)
    
def view_src_page( request,  template='default.html', extra_context=None):
    context = RequestContext(request);
    if ( 'id' in request.GET ):
        fid = request.GET['id'];
        ilp = get_object_or_404(ImgLinkPage, id=fid);
        context['link'] = ilp.getPageInfo();
        ilp.visitcount = ilp.visitcount + 1;
        ilp.save();
      

    return rtr( template, context, context_instance=extra_context)
    
@admin_user_only
def admin_db_op( request,  template='default.html', extra_context=None):
    context = RequestContext(request);
    if ( 'op' in request.GET and 'nm' in request.GET  ):
        op = request.GET['op'];
        bn = request.GET['nm'];
        
        if op == 'add':
            try:
                cc = ImgParseConfig.objects.get( bbs=bn);
            except Exception,e:
                c  = filter( lambda x: x['bbs'] == bn , BbsBoardParseConfig);
                if len(c)>0 : c = c[0];
                else: raise Http404;
                c['config'] = repr( c['config'] );
                ImgParseConfig( **c ).save();
                msg =  'Admin add config %s from web request successfully added'%(bn);
                logging.info( msg );
                context['msg'] = msg;
                return rtr( template, context, context_instance=extra_context);
            msg =  'Admin add config %s from web request failed because record exist'%(bn);
            logging.info( msg );
            raise Http404;
        elif op == 'update':
            try:
                cc = ImgParseConfig.objects.get( bbs=bn);
                c  = filter( lambda x: x['bbs'] == bn , BbsBoardParseConfig);
                if len(c)>0 : c = c[0];
                cc.schoolname = c['schoolname'];
                cc.config = repr( c['config'] );
                cc.save();
            except Exception,e:
                msg = ' Admin Getting bbs pic board config from web request with name %s failed'%(bn)
                logging.info( msg );
                raise Http404;
            msg = 'config for %s updated from web request successfully'%(bn);
            logging.info( msg ); 
            context['msg'] = msg;
    else: raise Http404;
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


def gae_piclink_cron( request,  template='default.html', extra_context=None):
    context = RequestContext(request);
    parser  = ImageParser();
    expected_parse_time = 500;
    total_parse_time = 0;
    cs = ImgParseConfig.objects.all();
    logmsglist = '';
    for c in cs:
        if total_parse_time + expected_parse_time > parse_time_limit: break;
        (delta,msg) = parser.parseImageConfig( c.toDict() ,c );
        total_parse_time += delta;
        logmsglist += msg + '\n';
    logmsglist += 'successfully parsed';
    context['msg'] = logmsglist;
    return rtr( template, context, context_instance=extra_context)
    

def gae_picagent_cron( request,  template='default.html', extra_context=None):
    context = RequestContext(request);
    ia = ImageAgent();
    expected_parse_time = 100;
    total_parse_time = 0;
    logmsglist = '';
    ps = ImgParseConfig.objects.filter( type = 1 );
    for p in ps:
        if total_parse_time + expected_parse_time > parse_time_limit: break;
        ilps = ImgLinkPage.objects.filter( config = p, visitcount = -1 );
        for ilp in ilps:
            if total_parse_time + expected_parse_time > parse_time_limit: break;
            (delta,msg) = ia.cron_ilp_agent( ilp );
            total_parse_time += delta;
            logmsglist += msg + '\n';
    logmsglist += 'successfully parsed';
    context['msg'] = logmsglist;
    return rtr( template, context, context_instance=extra_context)

def view_pic_agents( request, template='default.html', extra_context=None):
    if ( 'id' in request.GET ):
        fid = request.GET['id'];
        try:
            ilp = ILPAgent.objects.get( id = fid );
            return HttpResponse(ilp.data, mimetype="image/jpg")
        except Exception,e:
            logging.info(e);
    context = RequestContext(request);
    context['msg'] = 'Invalid File id Passed';  
    return rtr( template, context, context_instance=extra_context);
    

