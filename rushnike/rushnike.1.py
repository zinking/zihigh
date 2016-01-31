#! /usr/bin/env python
#-*- coding: utf-8 -*-
import requests
import cookielib
import simplejson as json
import urllib2
import time

user_agent = (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:37.0) Gecko/20100101 Firefox/37.0 FirePHP/0.7.4'
)
nikeSession = requests.session()
nikeSession.headers['User-Agent'] = user_agent

shoeUrl1 = u'http://store.nike.com/cn/zh_cn/pd/air-jordan-future-low-%E8%BF%90%E5%8A%A8%E9%9E%8B/pid-10264996/pgid-10314694'
shoeUrl2 = 'https://secure-store.nike.com/cn/checkout/html/cart.jsp'
shoeUrl3 = 'http://nod.nikecloud.com/nod/rest/intake'

sampleUserId = '23.75.23.146.123241429254282462'

required_ck1 = dict(
    CONSUMERCHOICE='cn/zh_cn',
    nike_locale='cn/zh_cn'
)

def debug_response( r ):
    print r
    print 'headers:', r.headers
    cookie_dicts = requests.utils.dict_from_cookiejar(r.cookies)
    print 'result cookies:', cookie_dicts

    session_cookie_dicts = requests.utils.dict_from_cookiejar(nikeSession.cookies)
    print 'session cookies:', session_cookie_dicts
    if cookie_dicts.has_key('CART_SUMMARY'):
	print 'CART_SUMMARY:', urllib2.unquote(cookie_dicts['CART_SUMMARY'] )
    with open('/Users/awang/Downloads/rushnike/r1.html', 'w') as f:
	f.write( r.text.encode('utf8') )

def debug_ajax_response( r ):
    print r
    print 'headers:', r.headers
    print 'result cookies:', requests.utils.dict_from_cookiejar(r.cookies)
    session_cookie_dicts = requests.utils.dict_from_cookiejar(nikeSession.cookies)
    print 'session cookies:', session_cookie_dicts

    print 'result: ', r.text.encode('utf8')


def load_cookies_from_file(filename):
    mzl_cookiejar = cookielib.MozillaCookieJar()
    mzl_cookiejar.load(filename )
    return mzl_cookiejar

    
#c1 = load_cookies_from_file('/Users/awang/Downloads/rushnike/cookies.txt')
#print 'loaded cookies:', requests.utils.dict_from_cookiejar(c1)

def viewcart_scenario( user_id = sampleUserId ):
    required_ck1['AnalysisUserId'] = user_id
    r1 = nikeSession.get(shoeUrl2, cookies=required_ck1)
    #r1 = nikeSession.get(shoeUrl2,cookies=c1)
    debug_response(r1)

def ts():
    return int( time.time() * 1000 ) 

def purchase_scenario():
    print '*************visit the product page'
    r1 = nikeSession.get(shoeUrl1, cookies=required_ck1)
    debug_response(r1)

    print '*************add to cart by jsonp'
    checkOutCartUrl = 'https://secure-store.nike.com/ap/services/jcartService?callback=nike_Cart_handleJCartResponse&action=addItem&lang_locale=zh_CN&country=CN&catalogId=4&productId=10264996&price=839&siteId=null&line1=Air+Jordan+Future+Low&line2=%E7%94%B7%E5%AD%A9%E8%BF%90%E5%8A%A8%E7%AB%A5%E9%9E%8B&passcode=null&sizeType=null&skuAndSize=11565093%3A40&qty=1&rt=json&view=3&skuId=11565093&displaySize=40&_='+str(ts())
    print 'jsonp checkOutCart:',checkOutCartUrl
    r25 = nikeSession.get(checkOutCartUrl)
    debug_ajax_response(r25)

    u1 = r1.cookies['AnalysisUserId']
    viewcart_scenario( u1 )


#viewcart_scenario()
purchase_scenario()

#import datetime
#s = 1236472051807 / 1000.0
#datetime.datetime.fromtimestamp(s).strftime('%Y-%m-%d %H:%M:%S.%f')
#"183a4212-2009-4a78-d510-1bdf43a92014"
#"183a4212-2009-4a78-d510-1bdf43a92014"

"""

"""
