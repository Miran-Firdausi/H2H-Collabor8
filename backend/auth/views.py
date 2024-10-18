from django.http import HttpResponse
from django.shortcuts import render


# Create your views here.
def home(request):
    return render(request, "auth/index.html")

def signin(request):
    return render(request, "auth/signin.html")

def signup(request):
    return render(request, "auth/signup.html")

def signout(request):
    pass