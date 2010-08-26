# coding=utf-8

__author__ = "zinking3@gmail.com"
__version__ = "0.1"
__license__ = "GPL"
import sys
default_encoding = 'utf-8'
if sys.getdefaultencoding() != default_encoding:
    reload(sys)
    sys.setdefaultencoding(default_encoding)


from google.appengine.api import urlfetch
from BeautifulSoup      import BeautifulSoup;
from bsoupxpath         import Path;
from customized_soup    import CustomizedSoup;
from scraper            import Scraper;
from datetime import *;

from imgboards.models import *;

import time;
import logging;
import re;

import urllib,urllib2;


def f7(seq): #for unique a list
    seen = set() 
    seen_add = seen.add 
    return [ x for x in seq if x not in seen and not seen_add(x)] 



class ImageParser(object):
    def __init__(self): 
        pass;
        
    def getPageHTML(self, url ):
        try: 
            htmlstring = urllib2.urlopen( url ).read();
        except Exception, e: 
            print e;
            error_msg = "Failed to open following image board page list url %s" % (url);
            logging.error( error_msg );
            raise Exception(error_msg);
        htmlstring = unicode(htmlstring, 'GBK', 'ignore').encode('UTF-8');#temporally ignore code settings
        return htmlstring;
        
    def parseImageConifgedPage( self, c, cc , pageurl):
        try:
            htmlstring = self.getPageHTML( pageurl );
        except Exception, e:
            return 0;
        imageidlist = [];
        tparsedimages = 0;

        for match in re.finditer( c['reimg'] , htmlstring):
            imageid = match.group(*c['reimggp']);
            imageidlist.append( repr( imageid ) );
            #print imageid;
            tparsedimages = tparsedimages + 1;
        imageidlist = f7(imageidlist);
        return (imageidlist,tparsedimages);
        
    def saveParsedImagePage(self,id,purl,title,c,cc):#returning pages parsed on this page
        from imgboards.settings import skipedwords;
        valid_title = True;
        for word in skipedwords:
            if title.find( word ) != -1:
                valid_title = False;
                break;
        if not valid_title:
            skip_msg = "Page with title %s skipped parsing"%(title);
            logging.info( skip_msg );
            #print skip_msg;
            raise Exception( skip_msg );#skip current page specific title;
        tn = 0;
        try:
            ilp = ImgLinkPage.objects.get( config=cc, pid = id );
            #print 'this page has been parsed';
        except Exception, e:
            (imglist, tn ) = self.parseImageConifgedPage( c, cc, purl );
            if tn == 0 :
                msg = 'no image found on this page with url:%s'%(purl);
                #print msg;
                raise Exception( msg );
            nilp = ImgLinkPage( config=cc, pid = id , title=title, imglist = imglist );
            nilp.save();
        return tn;
        
        
    def parseImageConfig( self, c, cc ):
        if ( c['type'] == 3 ): self.parseICPL_P2(c,cc);
        else: self.parseICPL(c,cc);
        
    def parseICPL( self, c, cc ):#parseImageConifgedPageList
        t1 = time.time();
        tparsedpages = 0;
        tparsedimages = 0;
        try:
            htmlstring = self.getPageHTML( c['usp'] );
        except Exception, e:
            return 0;
        pageidlist = [];
        pagelist = [];
        pagetitlelist = [];
        for match in re.finditer( c['repage'] , htmlstring):
            pageid,pagetitle = match.group(1,2);
            pageidlist.append( pageid );
            pagelist.append( c['pup'] %( pageid ) );
            pagetitlelist.append( pagetitle );
        for id,purl,title in zip( pageidlist, pagelist, pagetitlelist ):
            try:
                tn = self.saveParsedImagePage( id,purl,title,c,cc);
            except Exception,e:
                logging.info( e );
                continue;
            tparsedpages = tparsedpages + 1;
            tparsedimages = tparsedimages + tn;
        t2 = time.time();
        delta = (t2-t1)*1000;
        timingmsg = "Successfully parsing school:%s costing %d milliseconds;" % (c['bbs'], delta )
        logging.info( timingmsg );
        msg = "PARSE PIC BORAD OF %s FINISHED, PARSING %d pages %d images"%(c['bbs'], tparsedpages, tparsedimages );
        logging.info( msg );
        
    def parseICPL_P2( self, c, cc ):#parseImageConifgedPageList
        pass;
        
        
    
                
        