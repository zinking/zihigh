# coding=utf-8

__author__ = "zinking3@gmail.com"
__version__ = "0.1"
__license__ = "GPL"
import sys
default_encoding = 'utf-8'
if sys.getdefaultencoding() != default_encoding:
    reload(sys)
    sys.setdefaultencoding(default_encoding)


from google.appengine.api import urlfetch;
from datetime import *;

from imgboards.models import *;

import time;
import logging;
import re;

import urllib,urllib2;

class ImageAgent(object):
    def __init__(self): 
        pass;
    def getImgData(self, url ):
        try: 
            imgdata = urllib2.urlopen( url ).read();
        except Exception, e: 
            print e;
            error_msg = "Failed to open following img url %s" % (url);
            logging.error( error_msg );
            raise Exception(error_msg);
        
        return imgdata;
        
        
    def cron_img(self):
        #first getting sites proventing outer links
        ps = ImgParseConfig.objects.filter( type = 1 );
        for p in ps:#cron image agents per config file
            ilps = ImgLinkPage.objects.filter( config = p, visitcount = -1 );
            for ilp in ilps:
                imgurl = ilp.getRandomImgUrl();
                imgdata = self.getImgData( imgurl );
                ilpa = ILPAgent( ilp = ilp, data = imgdata );
                ilp.visitcount = 0;
                ilp.save();
                ilpa.save();
                msg = "IMAGE AGENT FOR %s successfully saved"%(imgurl);
                logging.info(msg);