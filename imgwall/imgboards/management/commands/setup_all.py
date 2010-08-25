# coding=utf-8
"""
A management command which deletes expired accounts (e.g.,
accounts which signed up but never activated) from the database.

Calls ``RegistrationProfile.objects.delete_expired_users()``, which
contains the actual logic for determining which accounts are deleted.

"""

from django.core.management.base import NoArgsCommand

from imgboards.models         import *;
from imgboards.settings       import *;

import datetime;


class Command(NoArgsCommand):
    help = "Setup Initial bbs data into the database"

    def handle_noargs(self, **options):
        for bc in BbsBoardParseConfig :
            bc['config'] = repr( bc['config'] );
            ImgParseConfig( **bc ).save();
        print 'All ImageParseConfig data setup successfully';
           
        
