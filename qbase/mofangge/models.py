from __future__ import unicode_literals

from django.db import models

import json
import re
import hashlib

# Create your models here.

class Question(models.Model):
    content = models.TextField()
    course  = models.CharField(max_length=100)
    level   = models.CharField(max_length=100)
    type    = models.CharField(max_length=100)
    options = models.TextField() #json
    answer  = models.TextField()
    oname   = models.CharField(max_length=1000)
    explain = models.TextField()


    def load_object(self):
        content = self.clean_up(self.content)
        options = self.clean_up(self.options)
        options = json.loads(options)
        return {
            'content':content,
            'course':self.course,
            'level':self.course,
            'type':self.type,
            'options':options,
            'answer':self.answer,
            'oname':self.oname,
            'explain':self.explain
        }

    def replace_images(self, image_urls):
        for url in image_urls:
            image_guid = hashlib.sha1(url).hexdigest()
            image_path = 'questions/%s.jpg' % (image_guid)
            self.content = re.sub(url,image_path,self.content,flags=re.IGNORECASE)
            self.options = re.sub(url,image_path,self.options,flags=re.IGNORECASE)

    def clean_up(self, text ):
        text = re.sub(r'\sclass=".*?"\s', '', text, flags=re.IGNORECASE)
        text = re.sub(r'\sid=".*?"\s', '', text, flags=re.IGNORECASE)
        return text


class Outline(models.Model):
    name    = models.CharField(max_length=1000,primary_key=True)
    content = models.TextField()
