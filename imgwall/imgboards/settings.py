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
	'ifp':'http://bbs.fudan.edu.cn/upload/PIC/%s',
	'reimg':'http://bbs.fudan.edu.cn/upload/PIC/(.*?)$',
    'reimggp':[1],
    }
},


{ 'bbs':'zd', 'schoolname':u'飘渺水云间', 
    'config':{
	'usp':'http://proxy3.zju88.net/agent/board.do?name=Picture&mode=0&page=0',
	'pup':'http://proxy3.zju88.net/agent/thread.do?id=Picture-%s&page=0&bd=Picture&bp=0&m=0',
	'repage':'<a href="thread.do\?id=Picture-(.*?)\&page=0\&bd=Picture\&bp=0\&m=0" class="a01">(.*?)</a>',
	'ifp':'http://att.zju88.org/files/%s.jpg',
	'reimg':'http://att.zju88.org/files/(.*?).jpg',
    'reimggp':[1],
    }
},



{ 'bbs':'dzkj', 'schoolname':u'一网深情', 
    'config':{
	'usp':'http://bbs.uestc.edu.cn/cgi-bin/bbstdoc?board=picture',
	'pup':'http://bbs.uestc.edu.cn/cgi-bin/bbstcon?board=picture&file=M.%s.A',
	'repage':'<A HREF=bbstcon\?board=picture\&file=M.(.*?).A>(.*?)</A>',
	'ifp':'http://bbs.uestc.edu.cn/upload/picture/%s.jpg',
	'reimg':"<A HREF='http://bbs.uestc.edu.cn/upload/picture/(.*?).jpg' TARGET=_BLANK>",
    'reimggp':[1],
    }
},

{ 'bbs':'zkd', 'schoolname':u'瀚海星云', 
    'config':{
	'usp':'http://bbs.ustc.edu.cn/cgi/bbstdoc?board=Cartoon',
	'pup':'http://bbs.ustc.edu.cn/cgi/bbstcon?board=Cartoon&file=M.%s.A',
	'repage':'<td class="title"><a class="o_title" href="bbstcon\?board=Cartoon\&amp;file=M.(.*?).A">(.*?)</a></td>',
	'ifp':'http://bbs.ustc.edu.cn/cgi/sf?s=83b445cc&bn=Cartoon&fn=%s&an=%s.jpg',
	'reimg':'<img src="sf\?s=83b445cc\&bn=Cartoon\&fn=(.*?)\&an=(.*?).jpg" onload="javascript:if\(this.width>screen.width-230\)this.width=screen.width-230;" border=0 vspace=1>',
    'reimggp':[1,2],
    }
},

{ 'bbs':'xmu', 'schoolname':u'鼓浪听涛', 
    'type':2,#reteving and getting using different page patterns
    'config':{
	'usp':'http://bbs.xmu.edu.cn/bbsdoc.php?board=Photography&ftype=6',
	'pup':'http://bbs.xmu.edu.cn/bbscon.php?bid=117&id=%s',
    'pup2':'http://bbs.xmu.edu.cn/bbstcon.php?board=Photography&gid=%s',
	'repage':"c.o\((.*?),.*?,'.*?',' .*?',.*?,'(.*?) ',.*?,0\);",
	'ifp':'http://bbs.xmu.edu.cn/att.php?p.117.%s.%s.jpg',
	'reimg':"attach\('.*?', .*?, (.*?)\);",
    'reimggp':[1],
    }
},

{ 'bbs':'scu', 'schoolname':u'蓝色星空', 
    'type':2,#reteving and getting using different page patterns
    'config':{
	'usp':'http://www.lsxk.org/bbsdoc.php?board=Picture&ftype=6',
	'pup':'http://www.lsxk.org/bbscon.php?bid=290&id=%s',
    'pup2':'http://www.lsxk.org/bbstcon.php?board=Picture&gid=%s',
	'repage':"c.o\((.*?),.*?,'.*?',' .*?',.*?,'(.*?) ',.*?,0\);",
	'ifp':'http://www.lsxk.org/att.php?p.290.%s.%s.jpg',
	'reimg':"attach\('.*?', .*?, (.*?)\);",
    'reimggp':[1],
    }
},


];
