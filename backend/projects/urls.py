from django.urls import path
from . import views

urlpatterns = [
    path('projects/', views.project_list, name='project-list'),
    path('projects/<int:pk>/', views.project_detail, name='project-detail'),
    path('projects/<int:pk>/share/', views.share_project, name='share_project'),
    path('discussions/', views.discussion_list, name='discussion-list'),
    path('discussions/<int:pk>/', views.discussion_detail, name='discussion-detail'),
]