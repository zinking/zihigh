# coding=utf-8
#the steps to get the config file
#1. get corresponding structure using firebug
#s. verify the dom with view source
#3. checking the special characters

skipedwords = [ u'公告' ];
BbsBoardParseConfig = [
{ 'bbs':'sjtu', 'schoolname':u'饮水思源', 
    'type':1,
    'config':{
	'usp':'http://bbs.sjtu.edu.cn/bbstdoc,board,PPPerson.html',
	'pup':'http://bbs.sjtu.edu.cn/bbstcon,board,PPPerson,reid,%s.html',
	'repage':'<a href=bbstcon,board,PPPerson,reid,(.*?).html>(.*?)</a>',
	'ifp':'http://bbs.sjtu.edu.cn/file/PPPerson/%s.jpg',
	'reimg':'<IMG SRC="/file/PPPerson/(.*?).jpg" onload="if\(this.width > screen.width - 200\)\{this.width = screen.width - 200\}">',
    'reimggp':[1],
    }
},

{ 'bbs':'tongji', 'schoolname':u'同舟共济', 
    'type':2,#reteving and getting using different page patterns
    'config':{
	'usp':'http://bbs.tongji.edu.cn/bbsdoc.php?board=Picture&ftype=6',
	'pup':'http://bbs.tongji.edu.cn/bbscon.php?bid=171&id=%s',
    'pup2':'http://bbs.tongji.edu.cn/bbstcon.php?board=Picture&gid=%s',
	'repage':"c.o\((.*?),.*?,'.*?',' .*?',.*?,'(.*?) ',.*?,0\);",
	'ifp':'http://bbs.tongji.edu.cn/att.php?p.171.%s.%s.jpg',
	'reimg':"attach\('.*?', .*?, (.*?)\);",
    'reimggp':[1],
    }
},

{ 'bbs':'byhh', 'schoolname':u'白云黄鹤', 
    'config':{
	'usp':'http://www.byhh.net/cgi-bin/bbstdoc?board=Picture',
	'pup':'http://www.byhh.net/cgi-bin/bbstcon?board=Picture&file=M.%s.A',
	'repage':'<a href=bbstcon\?board=Picture\&file=M.(.*?).A\&start=.*?>(.*?)</a>',
	'ifp':'http://newhost.byhh.net/f/Picture/%s/%s.jpg',
	'reimg':'http://byhh.net/f/Picture/(.*?)/(.*?).jpg',
    'reimggp':[1,2],
    }
},

{ 'bbs':'fdu', 'schoolname':u'日月光华', 
    'config':{
	'usp':'http://bbs.fudan.edu.cn/bbs/tdoc?bid=11',
	'pup':'http://bbs.fudan.edu.cn/bbs/tcon?bid=11&f=%s',
	'repage':"<po .*?m='\+' owner='.*?' time= '.*?' id='(.*?)'>(.*?)</po>",
	'ifp':'http://bbs.fudan.edu.cn/upload/PIC/%s.jpg',
	'reimg':'http://bbs.fudan.edu.cn/upload/PIC/(.*?).(jpg|JPG)',
    'reimggp':[1],
    }
},

];