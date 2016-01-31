__author__ = 'awang'
import scrapy
import json
from scrapy import Selector

from mofangge.models import *
from mofangge.bot.items import *

import pdb
import re



class MfgSpider(scrapy.Spider):
    name = "mfg"
    allowed_domains = ["baidu.com", "mofangge.com"]
    start_urls = [
        "http://jiaoyu.baidu.com/K12BankBws/searchPoint?textbookType=&textbookId=568+&chapterId=33985\
            &outlineId=&pointId=&stage=3&subject=4&quesOrder=1&quesType=&page=1&pageType=1"
    ]
    def start_requests1(self):
        url_template = "http://jiaoyu.baidu.com/K12BankBws/searchPoint?textbookType=&textbookId=568+&chapterId=33985&outlineId=&pointId=&stage=3&subject=4&quesOrder=1&quesType=&page=%d&pageType=1"
        url_template = "http://jiaoyu.baidu.com/K12BankBws/searchPoint?textbookType=&textbookId=568+&chapterId=33984&outlineId=&pointId=33984&stage=3&subject=4&quesOrder=1&quesType=&page=%d&pageType=1"
        url_template = "http://jiaoyu.baidu.com/K12BankBws/searchPoint?textbookType=&textbookId=568+&chapterId=33989&outlineId=&pointId=33989&stage=3&subject=4&quesOrder=1&quesType=0&page=%d&pageType=1"
        url_template = "http://jiaoyu.baidu.com/K12BankBws/searchPoint?textbookType=&textbookId=568+&chapterId=33993&outlineId=&pointId=33993&stage=3&subject=4&quesOrder=1&quesType=0&page=1&pageType=1"
        for i in range(1,200):
            yield scrapy.Request(url_template%(i), self.parse)

    def start_requests2(self):
        url_template = "http://jiaoyu.baidu.com/K12BankBws/searchPoint?textbookType=&textbookId=568+&chapterId=%d&outlineId=&pointId=%d&stage=3&subject=4&quesOrder=1&quesType=0&page=%d&pageType=1"
        for chap in range(33990,34100):
            for page in range(1,200):
                yield scrapy.Request(url_template%(chap,chap,page), self.parse)

    def start_requests(self):
        url_template = "http://jiaoyu.baidu.com/K12BankBws/searchPoint?textbookType=&textbookId=568+&chapterId=%d&outlineId=&pointId=%d&stage=3&subject=4&quesOrder=1&quesType=0&page=%d&pageType=1"
        url_template = "http://jiaoyu.baidu.com/K12BankBws/searchPoint?textbookType=&textbookId=569&chapterId=%d&outlineId=&pointId=%d&stage=3&subject=4&quesOrder=1&quesType=&page=1&pageType=1"
        url_template = "http://jiaoyu.baidu.com/K12BankBws/searchPoint?textbookType=&textbookId=&chapterId=%d&outlineId=+17+&pointId=%d&stage=3&subject=4&quesOrder=1&quesType=&page=%d&pageType=2"
        print 'spider start'
        for chap in range(2714,4000):
            for page in range(1,200):
                yield scrapy.Request(url_template%(chap,chap,page), self.parse)


    def clean_content(self,questions):
        questions = re.sub(r'</body>','',questions,flags=re.IGNORECASE)
        return questions

    def parse(self, response):
        jsondata = json.loads(response.body_as_unicode())
        if not jsondata.has_key('data'):
            print 'skip invalid request', response._url
        questions = jsondata['data']['tpl']['question_list']

        questions = self.clean_content(questions)
        selection = Selector(text=questions)
        qsels = selection.css('.question-item')
        for sel0 in qsels:
            def extract_qcontent(sel0):
                xpath_content1 = 'div[1]/div/table/tbody/tr/td/div'
                try:
                    question_content = sel0.xpath(xpath_content1).extract()[0]
                    return question_content
                except IndexError as e:
                    pass
                xpath_content2 = 'div[1]/div/table/tbody/tr/td'
                question_content2 = sel0.xpath(xpath_content2).extract()[0]
                return question_content2

            #question_content = sel0.xpath('div[1]/div/table/tbody/tr/td/div').extract()[0]  # question
            question_content = extract_qcontent(sel0)
            question_options = sel0.xpath('div[1]/div/table/tbody/tr/td/div/table/tr/td').extract()  # options

            def extract_meta(sel0):
                xpath_meta1 = 'div[2]/span/text()'
                def content2tupple(question_meta):
                    qm1 = question_meta.split(' ')
                    qm2 = qm1[0].split('-')
                    difficulty = qm1[1]
                    course = qm2[0]
                    question_type = qm2[1]
                    return difficulty,course,question_type
                try:
                    question_meta = sel0.xpath(xpath_meta1).extract()[0]  # physics-singlechoice easy
                    return content2tupple(question_meta)
                except IndexError as e:
                    raise e

            difficulty,course,question_type = extract_meta(sel0)
            question_imgs = sel0.xpath('//img/@src').extract()
            answer_link = sel0.xpath('div[1]/a/@href').extract()[0]
            question = Question(
                course=course,
                content=json.dumps(question_content, ensure_ascii=False),
                level=difficulty,
                type=question_type,
                options=json.dumps(question_options, ensure_ascii=False),
            )

            qitem = QuestionItem()
            qitem['question'] = question
            qitem['image_urls'] = question_imgs
            
            request = scrapy.Request(answer_link, callback=self.parse_answer)
            request.meta['item'] = qitem
            #yield qitem
            yield request

    def parse_answer(self, response):
        qitem = response.meta['item']
        question = qitem['question']
        answer_sel = response.css(".answer-content")
        answers = answer_sel.xpath('div[1]/table[1]/tbody/tr/td/div/text()').extract()
        question.answer = json.dumps(answers, ensure_ascii=False)
        detail_link = answer_sel.xpath('div[2]/a/@href').extract()[0]
        request = scrapy.Request(detail_link, callback=self.parse_answerdetails)
        request.meta['item'] = qitem
        yield request

    def parse_answerdetails(self, response):
        qitem = response.meta['item']
        question = qitem['question']
        danswer_sel = response.css('#q_indexkuai321')
        danswers = danswer_sel.xpath('table[2]/tbody/tr/td/div/text()').extract()
        outline_sel = response.css("#secinfoPanel")
        outline_name = outline_sel.xpath('div[1]/div/span/text()').extract()
        outline_text = outline_sel.xpath('div[1]/ul').extract()
        oname = json.dumps(outline_name, ensure_ascii=False)
        ocontent = json.dumps(outline_text, ensure_ascii=False)
        question.explain = json.dumps(danswers, ensure_ascii=False)
        question.oname = oname
        question.save()
        print '1 question saved'
        outline, created = Outline.objects.get_or_create(
            name = oname,
            content = ocontent,
        )
        if created:
            print '1 outline saved'

        yield qitem
