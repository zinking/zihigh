# -*- coding: utf-8 -*-

# Scrapy settings for bot project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/en/latest/topics/settings.html
#

BOT_NAME = 'bot'

SPIDER_MODULES = ['bot.spiders']
NEWSPIDER_MODULE = 'bot.spiders'

# Crawl responsibly by identifying yourself (and your website) on the user-agent


# Random interval between 0.5 and 1.5 * DOWNLOAD_DELAY
#DOWNLOAD_DELAY     = 5
#SPIDER_MODULES     = ['mofangge.bot.spiders']
#NEWSPIDER_MODULE   = 'mofangge.bot.spiders'
#DEFAULT_ITEM_CLASS = 'mofangge.bot.items.QuestionItem'

# USER_AGENT = '%s/%s' % (BOT_NAME, BOT_VERSION)
USER_AGENT     = "Mozilla/5.0 (Windows NT 6.0; rv:2.0) Gecko/20150101 Firefox/4.0"
#IM_MODULE      = 'mofangge.bot.pipelines.FormulaImagePipeline'
ITEM_PIPELINES = {
    #'scrapy.pipelines.images.ImagesPipeline': 1,
    'mofangge.bot.pipelines.FormulaImagePipeline': 100
}
#ITEM_PIPELINES = ['mofangge.bot.pipelines.FormulaImagePipeline']

# Where we store the images, in this case they will be stored
# in E:/ImageGrabber/full directory. Change this to meet your needs.
IMAGES_STORE = '/var/tmp/hxkimg/'

# Specify the min height and width of the image to download
#IMAGES_MIN_HEIGHT = 768
#IMAGES_MIN_WIDTH  = 1024


from scrapy.settings import Settings
crawler_setting = Settings()
crawler_setting.set('USER_AGENT',USER_AGENT)
crawler_setting.set('ITEM_PIPELINES',ITEM_PIPELINES)
crawler_setting.set('IMAGES_STORE',IMAGES_STORE)
#crawler_setting.set('IMAGES_MIN_HEIGHT',IMAGES_MIN_HEIGHT)
#crawler_setting.set('IMAGES_MIN_WIDTH',IMAGES_MIN_WIDTH)


