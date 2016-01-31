#!/bin/bash
scrapy shell "http://jiaoyu.baidu.com/k12Bank/textbook/?stage=3&subject=4"
sel=response.css(".question-item")
sel0=sel[0]
sel0.xpath('div[1]/div/table/tbody/tr/td/div/text()').extract() #question
sel0.xpath('div[1]/div/table/tbody/tr/td/div/table/tr/td/text()').extract() #options
sel0.xpath('div[2]/span/text()').extract() #physics-singlechoice easy
sel0.xpath('div[1]/a/@href').extract() #answer link
alink = sel0.xpath('div[1]/a/@href').extract()[0]
fetch(alink)
answer_sel = response.css(".answer-content")
answers = answer_sel.xpath('div[1]/table[1]/tbody/tr/td/div/text()').extract()
dlink = answer_sel.xpath('div[2]/a/@href').extract()[0]
fetch(dlink)
danswer_sel = response.css('#q_indexkuai321')
danswers = danswer_sel.xpath('table[2]/tbody/tr/td/div/text()').extract()
outline_sel = response.css("#secinfoPanel")
outline_name = outline_sel.xpath('div[1]/div/span/text()').extract()[0]
outline_text = outline_sel.xpath('div[1]/ul').extract()


url='http://jiaoyu.baidu.com/K12BankBws/searchPoint?textbookType=&textbookId=568+&chapterId=33985&outlineId=&pointId=&stage=3&subject=4&quesOrder=1&quesType=&page=2&pageType=1'
fetch(url)
import json
jsondata = json.loads(response.body_as_unicode())
questions = jsondata['data']['tpl']['question_list']
from scrapy.selector import HtmlXPathSelector
from scrapy import Selector
s1=Selector(h5)
sel=s1.css(".question-item")
sel0=sel[0]


/var/tmp/hxkimg/questions/15d7f093c77695f1dffeb341ede12131df819bcf.jpg
/var/tmp/hxkimg/questions/15d7f093c77695f1dffeb341ede12131df819bcf.jpg

url='http://jiaoyu.baidu.com/K12BankBws/searchPoint?textbookType=&textbookId=568+&chapterId=33984&outlineId=&pointId=33984&stage=3&subject=4&quesOrder=1&quesType=&page=168&pageType=1'


scrapy shell "http://jiaoyu.baidu.com/K12BankBws/searchPoint?textbookType=&textbookId=568+&chapterId=33984&outlineId=&pointId=33984&stage=3&subject=4&quesOrder=1&quesType=&page=168&pageType=1"
import json
from scrapy import Selector
jsondata = json.loads(response.body_as_unicode())
questions = jsondata['data']['tpl']['question_list']
selection = Selector(text=questions)
qsels = selection.css(".question-item")
qsel = qsels[0]

#In [43]: import codecs
#In [44]: f=codecs.open('/tmp/a1','w+','utf-8')
#In [45]: f.write(question_content[0])
#In [46]: f.close()

def pstr1(content):
    import codecs
    f=codecs.open('/tmp/a1','w+','utf-8')
    f.write(content)
    f.close()
scrapy shell "http://jiaoyu.baidu.com/K12BankBws/searchPoint?textbookType=&textbookId=568+&chapterId=33984&outlineId=&pointId=33984&stage=3&subject=4&quesOrder=1&quesType=&page=17&pageType=1"
import json
from scrapy import Selector
jsondata = json.loads(response.body_as_unicode())
questions = jsondata['data']['tpl']['question_list']
selection = Selector(text=questions)
qsels = selection.css(".question-item")
xpath_content1 = 'div[1]/div/table/tbody/tr/td/div'
xpath_content2 = 'div[1]/div/table/tbody/tr/td'
xpath_meta1 = 'div[2]/span/text()'
qsel = qsels[0]
sel0 = qsel

HTML5_EMPTY = """
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>The HTML5 Herald</title>
</head>
<body>
    %s
</body>
</html>
"""

