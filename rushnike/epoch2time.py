#!/bin/python
import sys
import datetime
import time

if __name__ == '__main__':
    s = int(sys.argv[1])/1000.0
    print datetime.datetime.fromtimestamp(s).strftime('%Y-%m-%d %H:%M:%S.%f')

    print  'current epoch:', int( time.time() * 1000 ) 

