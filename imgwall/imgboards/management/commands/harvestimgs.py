# coding=utf-8
from django.core.management.base    import BaseCommand
from django.core.management.color   import no_style
from optparse import make_option
import sys
import os

import datetime;

from imgboards.models         import *;
from pageharvest.img_agent    import *;

class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option( '-c', '--schoolcount',  dest='harvest_count', 
             help='harvest school links of specified count'),
    )


    def handle(self,  **options):
        ia          =   ImageAgent();
        ia.cron_img();
        print 'image agent succesfully croned';
        
            
            

        
        
        
            

 
