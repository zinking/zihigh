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
        make_option( '-s', '--bbsname',   dest='school', 
             help='clear specified bbs parse config'),
    )


    def handle(self,  **options):

        if options.get('school'):
            bn = options.get('school');
            try:
                c = ImgParseConfig.objects.get( bbs=bn);
            except Exception,e:
                print 'no such bbs pic board';
                return;
            c.delete();
            print 'config successfully removed';
            

        
        
        
            

 
