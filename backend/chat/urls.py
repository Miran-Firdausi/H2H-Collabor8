from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register the viewsets
router = DefaultRouter()
router.register(r"chats", views.ChatViewSet, basename="chat")
router.register(r"users", views.UserViewSet, basename="user")

urlpatterns = [
    # Include the router's automatically generated URLs
    path("api/", include(router.urls)),
    # Manually add the routes for custom actions
    path(
        "api/chats/my_chats/",
        views.ChatViewSet.as_view({"get": "my_chats"}),
        name="my_chats",
    ),
    path(
        "api/chats/<int:pk>/messages/",
        views.ChatViewSet.as_view({"get": "messages"}),
        name="chat_messages",
    ),
    path(
        "api/chats/<int:pk>/send_message/",
        views.ChatViewSet.as_view({"post": "send_message"}),
        name="send_message",
    ),
    path(
        "api/chats/create_or_get_ai_chat/",
        views.ChatViewSet.as_view({"post": "create_or_get_ai_chat"}),
        name="create_or_get_ai_chat",
    ),
]
