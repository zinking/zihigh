# coding=utf-8
from django.db import models
from djangotoolbox.fields import ListField;

import re;
import logging;
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
    
    def sample_image( self,  n ):
        pics = [];
        ic = len( self.imglist );
        if( n > ic ):
            n = ic-1;
        import random;
        samlist = random.sample(xrange(ic), int( n *0.5 ) );
        try:
            cccc =  self.config.toDict();
            iup =  cccc['ifp'];
            pup =  cccc['pup'];
            if cccc['type'] == 2: pup = cccc['pup2'];
        except Exception,e:
            self.delete();
            logging.info("invalid ilp encountered %s"%(self.id) );
            return [];
        for cc in samlist:
            fid = self.imglist[ cc ];
            url = eval(fid);
            if( cccc['type'] == 2 ):url=(self.pid,url[0]);
            pconfig = {
                'url' : iup%(url),
                'title':self.title ,
                'purl':pup%self.pid,
            };
            pics.append( pconfig );
        return pics;
            
    
            
            
        
    
    
