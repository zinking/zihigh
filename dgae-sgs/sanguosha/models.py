from django.db import models
from djangotoolbox.fields import ListField


# Create your models here.

#class DetailedService(models.Model):
#    category = models.CharField(max_length=75)
#    service = models.CharField(max_length=75)
#    subtype = models.CharField(max_length=75)
#    description = models.TextField()
#    is_buyout = models.BooleanField()
#    editor_pay = models.FloatField()
#    limit_short = models.IntegerField()
#    limit_long = models.IntegerField()
#	detailed_service = models.ForeignKey(DetailedService)
#	finish_time = models.DateTimeField(null=True)
	
class Group(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=75);

class Wujiang(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=75);

class Role( models.Model ):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=75);
	
class Player(models.Model):
	id = models.AutoField(primary_key=True);
	name 	= models.CharField(max_length=75);
	groups	= ListField(models.CharField(max_length=75));
	phonenumber 	= models.CharField(max_length=75);

	
class Game(models.Model):
	id = models.AutoField(primary_key=True)
	createtime 	= models.DateTimeField(null=False);
	finishtime 	= models.DateTimeField(null=True);
	rolelist	= ListField(models.CharField(max_length=75));
	playerlist	= ListField(models.IntegerField());
	wujianglist	= ListField(models.CharField(max_length=75));#simply keep names
	result 		= models.CharField(max_length=75);
	round		= models.IntegerField( default=0 );
	ip			= models.CharField(max_length=75);
	
class PlayRecord(models.Model):
	id = models.AutoField(primary_key=True)
	player  = models.ForeignKey(Player);
	game 	= models.ForeignKey(Game);
	role	= models.CharField( null=True, max_length=75,default="");
	wujiang	= models.CharField( null=True, max_length=75);
	killby	= models.IntegerField( null=True );
	srounds	= models.IntegerField( null=True, default = -1 );
	result 		= models.CharField( null=True, max_length=75);

class PandingRecord(models.Model):
	id = models.AutoField(primary_key=True);
	prid	= models.ForeignKey(PlayRecord);
	name	= models.CharField( null=True, max_length=75);
	hitcount= models.IntegerField( default=0 );
	nhitcount = models.IntegerField( default=0 );
	rhitby	= ListField(models.IntegerField());
	rnhitby	= ListField(models.IntegerField());
	
	
