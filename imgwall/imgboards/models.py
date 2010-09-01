# coding=utf-8
from django.db import models
from djangotoolbox.fields import ListField,BlobField;

import re;
import logging;
import random;
from settings import *;
# Create your models here.

#class DetailedService(models.Model):
#    category = models.CharField(max_length=75)
#    service = models.CharField(max_length=75)
#    subtype = models.CharField(max_length=75)
#    description = models.TextField()
#    is_buyout = models.BooleanField()
#    editor_pay = models.FloatField()
#    limit_short = models.IntegerField()
#    limit_long = models.IntegerField()
#	detailed_service = models.ForeignKey(DetailedService)
#	finish_time = models.DateTimeField(null=True)

    #usp		= models.CharField(max_length=750);# board url section pattern  generally fixed
    #pup		= models.CharField(max_length=750);# board page url pattern, with page id floating
    #ifp		= models.CharField(max_length=750);# image file pattern with file id floating
    #repage	= models.CharField(max_length=100);
    #reimg	= models.CharField(max_length=100);
class ImgParseConfig(models.Model):
    id      = models.AutoField(primary_key=True);
    bbs     = models.CharField(max_length=75);
    schoolname 	= models.CharField(max_length=75);
    type    = models.IntegerField( default = 0 );
    config  = models.TextField( );
    lastfresh   = models.DateTimeField( auto_now=True, null=True );
    
    def toDict(self):
        cc = eval( self.config );
        cc['id'] = self.id; cc['bbs'] = self.bbs; cc['name'] = self.schoolname; cc['type'] = self.type;
        return cc;

class ImgLinkPage(models.Model):
    id          = models.AutoField(primary_key=True);
    pid         = models.CharField( max_length=75 );
    config      = models.ForeignKey(ImgParseConfig); #the up 2 property form primary key
    imglist     = ListField( models.CharField( max_length=200 ) ); #image file id list,each id to form a image url
    title       = models.CharField(max_length=750 );
    parsetime   = models.DateTimeField( auto_now=True);
    visitcount  = models.IntegerField( default = 0 );
    
    
    def getPageUrl(self ):
        try:
            cccc =  self.config.toDict();
            if cccc['type'] == 2: pup = cccc['pup2'];
            else : pup =  cccc['pup'];
            return pup % self.pid;
        except Exception,e:
            logging.info( e );
            logging.info("invalid ilp encountered %s"%(self.id) );
            return;
    #no need to consider the type 1         
    def getPageInfo(self):
        try:
            cccc =  self.config.toDict();
            if cccc['type'] == 2: pup = cccc['pup2'];
            else : pup =  cccc['pup'];
            result = {
                'url':pup%self.pid,
                'sn':cccc['name'],
                'title':self.title,
                'createtime':self.parsetime,
            };
            return result;
        except Exception,e:
            logging.info( e );
            logging.info("invalid ilp encountered %s"%(self.id) );
            return;
            
    def getRandomImgUrl(self):
        try:
            cccc =  self.config.toDict();
            ifp  = cccc['ifp'];
            rid = random.randint( 0, len( self.imglist)-1 );
            return ifp % eval(self.imglist[rid]);
        except Exception,e:
            self.delete();
            logging.info("invalid ilp encountered %s"%(self.id) );
            return;
            
            
    def getAgentImgInfo(self):
        if( self.visitcount < 0 ): raise Exception('Agent Image not Crond');
        try:
            ilpa = ILPAgent.objects.get( ilp = self );
        except Exception,e:
            logging.error( e );
            raise Exception('Agent Image not Crond'); 
        #img_url_pattern = "http://localhost:8000/m/f?fid=%s";
        
        return {
            'url':img_url_pattern%(ilpa.id),
            'title':self.title,
            #'purl':self.getPageUrl(),
            'purl':fpage_url_pattern%self.id,
        }
    
    def sample_image( self,  n ):
        try:
            cccc =  self.config.toDict();
            if( cccc['type'] == 1 ): return [ self.getAgentImgInfo() ];
            iup =  cccc['ifp'];
            pup =  cccc['pup'];
            if cccc['type'] == 2: pup = cccc['pup2'];
        except Exception,e:
            logging.info( e );
            logging.info("invalid ilp encountered %s"%(self.id) );
            return [];
        pics = [];
        ic = len( self.imglist );
        if( n > ic ): n = ic-1;
        samlist = random.sample(xrange(ic), int( n *0.5 ) );
        for cc in samlist:
            fid = self.imglist[ cc ];
            url = eval(fid);
            if( cccc['type'] == 2 ):url=(self.pid,url);
            pconfig = {
                'url' : iup%(url),
                'title':self.title ,
                'purl':fpage_url_pattern%self.id,
                #'purl':pup%self.pid,
            };
            pics.append( pconfig );
        return pics;
        
        
class ILPAgent(models.Model):
    id          = models.AutoField(primary_key=True);
    ilp         = models.ForeignKey(ImgLinkPage);
    data        = BlobField();
    parsetime   = models.DateTimeField( null=True,auto_now=True);
            
    
            
            
        
    
    
