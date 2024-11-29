from django.urls import path
from . import views

urlpatterns = [
    path('projects/', views.project_list, name='project-list'),
    path('projects/<int:pk>/', views.project_detail, name='project-detail'),
    path('projects/<int:pk>/share/', views.share_project, name='share_project'),
    path('discussions/', views.discussion_list, name='discussion-list'),
    path('discussions/<int:pk>/', views.discussion_detail, name='discussion-detail'),
    path('notifications/', views.notification_list, name='notification-list'),
    path('notifications/<int:pk>/read/', views.mark_notification_read, name='mark-notification-read'),
    path('notifications/mark-all-read/', views.mark_all_notifications_read, name='mark-all-notifications-read'),
    path('notifications/<int:pk>/', views.delete_notification, name='delete-notification'),
    path('notifications/count/', views.notification_count, name='notification-count'),
]