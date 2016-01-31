__author__ = 'awang'

from twisted.internet import reactor

from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging
from mofangge.bot.spiders.mfgspider import MfgSpider
from mofangge.bot.settings import crawler_setting
from scrapy.utils.project import get_project_settings



from django.core.management.base import BaseCommand
from django.test.client import RequestFactory

class Command(BaseCommand):
    help = 'run commands to parse mofangge questions'

    def add_arguments(self, parser):
        parser.add_argument(
            '--run',
            dest='run',
            help='run parse against mofange'
        )

        parser.add_argument(
            '--gen',
            dest='gen',
            help='run gen against mofange'
        )

    def handle(self, *args, **options):
        if options['run'] : self.handle_run()
        if options['gen'] : self.handle_gen()

    def handle_run(self):
        configure_logging({'LOG_FORMAT': '%(levelname)s: %(message)s'})
        runner = CrawlerRunner(crawler_setting)
        d = runner.crawl(MfgSpider)
        d.addBoth(lambda _: reactor.stop())
        reactor.run()

    def handle_gen(self):
        from mofangge.views import render_questions
        factory = RequestFactory()
        request = factory.get('/questions')
        print render_questions(request)