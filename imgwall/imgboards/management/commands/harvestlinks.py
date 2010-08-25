# coding=utf-8
from django.core.management.base import BaseCommand
from django.core.management.color import no_style
from optparse import make_option
import sys
import os

import datetime;

from imgboards.models         import *;
from pageharvest.img_parser   import *;

class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option( '-c', '--schoolcount',  dest='harvest_count', 
             help='harvest school links of specified count'),
        make_option( '-s', '--bbsname',   dest='harvest_school', 
             help='harvest bbsboard image links of specified school'),
    )


    def handle(self,  **options):
        parser          =   ImageParser();
        if options.get('harvest_count'):
            pass;
        if options.get('harvest_school'):
            bn = options.get('harvest_school');
            try:
                c = ImgParseConfig.objects.get( bbs=bn);
            except Exception,e:
                print 'no such bbs pic board';
                return;
            parser.parseImageConifgedPageList( c.toDict() ,c );
            

        
        
        
            

 
