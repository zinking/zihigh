# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
from scrapy.pipelines.images import ImagesPipeline,ImageException
from scrapy.http import Request
from cStringIO import StringIO
import hashlib

class BotPipeline(object):
    def process_item(self, item, spider):
        return item

class FormulaImagePipeline(ImagesPipeline):
    def get_media_requests(self, item, info):
        print item['image_urls']
        return [Request(x) for x in item['image_urls']]

    def item_completed(self, results, item, info):
        #item['images'] = [x for ok, x in results if ok]
        item['question'].replace_images(item['image_urls'])
        item['question'].save()
        return item

    # Override the convert_image method to disable image conversion
    def convert_image(self, image, size=None):
        buf = StringIO()
        try:
            print 'image format',image.format
            image.save(buf, image.format)
        except Exception, ex:
            raise ImageException("Cannot process image. Error: %s" % ex)
        print 'img saved'
        return image, buf

    def image_key(self, url):
        image_guid = hashlib.sha1(url).hexdigest()
        return 'full/%s.jpg' % (image_guid)