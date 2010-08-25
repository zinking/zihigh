# coding=utf-8
import re;


s = """
<a href="bbstcon,board,PPPerson,reid,1282398431.html">lkjljldjflajldj </a>
<a href="bbstcon,board,PPPerson,reid,1282398ss431.html">lkjljlss板主flajldj</a>
<a href="bbstcon,board,PPPerson,reid,1282398ss431.html">lkjljlssdjflajldj </a>"""


ss= '<IMG SRC="/file/PPPerson/128211482773972.jpg" onload="if(this.width > screen.width - 200){this.width = screen.width - 200}>';
sss="""
<td>Aug 24<td><a href=bbstcon?board=Picture&file=M.1282618207.A&start=614>○                           自然，不自然 </a><td>""";


p = '<a href=bbstcon\?board=Picture\&file=M.(.*?).A\&start=.*?>(.*?)</a>';

pp = 'file';
    
msss = re.finditer( p, sss );
paramlist = [1,2];
for m in msss:
    print m.group(*paramlist);
    
print 'finishing the job';


s = """
context = {"a":1}
def helloworld():
    print 'hello world';
"""

exec(s);
helloworld();
print context



s = '.jpg .JPG .png ';
p = '.(jpg|JPG|png)';
mm  =  re.finditer( p, s);
for m in mm:
    print m.group(0,1);

