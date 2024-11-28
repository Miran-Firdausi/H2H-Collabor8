from django.urls import path
from . import views

urlpatterns = [
    path(
        "api/users/",
        views.get_all_users,
        name="all_users",
    ),
    path("api/chats/my_chats/", views.my_chats, name="my_chats"),
    path(
        "api/chats/<int:chat_id>/messages/", views.chat_messages, name="chat_messages"
    ),
    path(
        "api/chats/create_or_get_ai_chat/",
        views.create_or_get_ai_chat,
        name="create_or_get_ai_chat",
    ),
    path(
        "api/chats/create_or_get_private_chat/",
        views.create_or_get_private_chat,
        name="create_or_get_private_chat",
    ),
    path(
        "api/chats/create_group_chat/",
        views.create_group_chat,
        name="create_group_chat",
    ),
]
