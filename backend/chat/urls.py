from django.urls import path
from . import views

urlpatterns = [
    path('api/chat/history/', views.ChatHistoryView.as_view(), name='chat_history'),
    path('api/chat/send/', views.SendMessageView.as_view(), name='send_message'),
    path('api/chat/room/<int:room_id>/', views.ChatRoomView.as_view(), name='chat_room'),
    path('api/chat/room/create/', views.CreateChatRoomView.as_view(), name='create_chat_room'),
    path('api/chat/rooms/', views.ActiveChatRoomsView.as_view(), name='active_chat_rooms'),
    path('api/chats/create_or_get_ai_chat/', views.CreateOrGetAIChatView.as_view(), name='create_or_get_ai_chat'),
]
