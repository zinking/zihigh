from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render
from models import Question
import re
# Create your views here.



def render_questions(request):
    questions = Question.objects.all()
    objects = map( lambda q:q.load_object(), questions)
    context = {
        'questions':objects
    }
    return render(request, 'choices.html',context)

def render_question_image(request,path):
    print path
    cpath = re.sub(r'"',"",path)
    cpath = re.sub(r'\\',"",cpath)
    try:
        img_path = "/var/tmp/hxkimg/%s"%(cpath)
        print img_path
        with open(img_path, 'r') as f:
            image_data = f.read()
            return HttpResponse(image_data, content_type="image/jpg")
    except IOError as e:
        print e
        return HttpResponseNotFound('N/A')