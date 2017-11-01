from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    convolutions = range(1)
    return render(request,
                  'convolution/index.html',
                  {'convolutions':convolutions})


def add(request):
    return HttpResponse("add")