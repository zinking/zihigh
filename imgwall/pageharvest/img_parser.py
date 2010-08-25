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
        
    def parseImageConifgedPage( self, c, cc , pageurl):
        try: 
            htmlstring = urllib2.urlopen( pageurl ).read();
        except Exception, e: 

            error_msg = "Failed to open following image board page url %s of school: %s" % (c['usp'], c['bbs']);
            logging.error( error_msg );
            return 0;
        htmlstring = unicode(htmlstring, 'GBK', 'ignore').encode('UTF-8');#temporally ignore code settings
        imageidlist = [];
        tparsedimages = 0;

        for match in re.finditer( c['reimg'] , htmlstring):
            imageid = match.group(*c['reimggp']);
            imageidlist.append( repr( imageid ) );
            #print imageid;
            tparsedimages = tparsedimages + 1;
        imageidlist = f7(imageidlist);
        return (imageidlist,tparsedimages);
        
    def parseImageConifgedPageList( self, c, cc ):
        t1 = time.time();
        tparsedpages = 0;
        tparsedimages = 0;
        try: 
            htmlstring = urllib2.urlopen( c['usp']).read();
        except Exception, e: 
            #print e;
            error_msg = "Failed to open following image board page list url %s of school: %s" % (c['usp'], c['bbs']);
            logging.error( error_msg );
            return 0;
        htmlstring = unicode(htmlstring, 'GBK', 'ignore').encode('UTF-8');#temporally ignore code settings
        pageidlist = [];
        pagelist = [];
        pagetitlelist = [];
        #print c['repage'];
        #print htmlstring[ 0:2000 ];
        for match in re.finditer( c['repage'] , htmlstring):
            pageid,pagetitle = match.group(1,2);
            pageidlist.append( pageid );
            pagelist.append( c['pup'] %( pageid ) );
            pagetitlelist.append( pagetitle );
        for id,purl,title in zip( pageidlist, pagelist, pagetitlelist ):
            #skip some page titles like annoucements etc
            from imgboards.settings import skipedwords;
            valid_title = True;
            for word in skipedwords:
                if title.find( word ) != -1:
                    valid_title = False;
                    break;
            if not valid_title:
                skip_msg = "Page with title %s skipped parsing"%(title);
                logging.debug( skip_msg );
                #print skip_msg;
                continue;#skip current page specific title;
                
            try:
                ilp = ImgLinkPage.objects.get( config=cc, pid = id );
                #print 'this page has been parsed';
            except Exception, e:
                (imglist, tn ) = self.parseImageConifgedPage( c, cc, purl );
                if tn == 0 :
                    #print 'no image found on this page';
                    continue;
                nilp = ImgLinkPage( config=cc, pid = id , title=title, imglist = imglist );
                nilp.save();
                tparsedpages = tparsedpages + 1;
                tparsedimages = tparsedimages + tn;
        t2 = time.time();
        delta = (t2-t1)*1000;
        timingmsg = "Successfully parsing school:%s costing %d milliseconds;" % (c['bbs'], delta )
        logging.debug( timingmsg );
        msg = "PARSE PIC BORAD OF %s FINISHED, PARSING %d pages %d images"%(c['bbs'], tparsedpages, tparsedimages );
        logging.info( msg );
                
        