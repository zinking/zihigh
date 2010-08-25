# coding=utf-8
"""
A management command which deletes expired accounts (e.g.,
accounts which signed up but never activated) from the database.

Calls ``RegistrationProfile.objects.delete_expired_users()``, which
contains the actual logic for determining which accounts are deleted.

"""

from django.core.management.base import NoArgsCommand

from imgboards.models         import *;

import datetime;


class Command(NoArgsCommand):
    help = "Clear all the config and links in the db"

    def handle_noargs(self, **options):
        imglist = ImgLinkPage.objects.all();
        for img in imglist:
            img.delete();
        clist = ImgParseConfig.objects.all();
        for c in clist:
            c.delete();
        print 'All data cleared';
            
           
        
