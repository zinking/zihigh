# coding=utf-8
from django.core.management.base import BaseCommand
from django.core.management.color import no_style
from optparse import make_option
import sys
import os

import datetime;

from imgboards.models         import *;
from pageharvest.img_parser   import *;
from imgboards.settings       import *;
#filter(lambda x: x.n == 5, myList)


class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option( '-u', '--update',   dest='update_school', 
             help='update specified bbs parse config'),
        make_option( '-d', '--delete',   dest='delte_school', 
             help='clear specified bbs parse config'),
    )


    def handle(self,  **options):
        if options.get('update_school'):
            bn = options.get('update_school');
            try:
                cc = ImgParseConfig.objects.get( bbs=bn);
                c  = filter( lambda x: x['bbs'] == bn , BbsBoardParseConfig);
                if len(c)>0 : c = c[0];
                cc.schoolname = c['schoolname'];
                cc.config = repr( c['config'] );
                cc.save();
            except Exception,e:
                print 'Getting bbs pic board config with name %s failed'%(bn);
                print e;
                return;
            print 'config updated successfully updated';
        if options.get('delte_school'):
            bn = options.get('delte_school');
            try:
                c = ImgParseConfig.objects.get( bbs=bn);
            except Exception,e:
                print 'Getting bbs pic board config with name %s failed'%(bn);
                print e;
                return;
            c.delete();
            print 'config updated successfully removed';
            

        
        
        
            

 
