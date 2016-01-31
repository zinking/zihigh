# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy

from scrapy.item import Item, Field

from mofangge.models import *


class QuestionItem(Item):
    # fields for this item are automatically created from the django model
    question = Field()
    image_urls = Field()

#class OutlineItem(DjangoItem):
    # fields for this item are automatically created from the django model
#    django_model = Outline




