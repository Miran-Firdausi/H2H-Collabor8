from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer, UserSerializer
from .ai_utils import get_ai_response


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [
        IsAuthenticated
    ]  # Ensure only authenticated users can access chats

    @action(detail=False, methods=["GET"])
    def my_chats(self, request):
        """
        Get the list of chats for the authenticated user.
        """
        chats = Chat.objects.filter(participants=request.user)
        serializer = self.get_serializer(chats, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["GET"])
    def messages(self, request, pk=None):
        """
        Get the messages for a specific chat room.
        """
        chat = self.get_object()
        messages = chat.messages.all().order_by("-timestamp")
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["POST"])
    def create_or_get_ai_chat(self, request):
        """
        Create or get the AI chat with the authenticated user.
        """
        ai_user, _ = User.objects.get_or_create(username="AI Assistant")

        # Try to find an AI chat for this user, or create one if it doesn't exist
        chat = Chat.objects.filter(participants=request.user, is_ai_chat=True).first()
        if not chat:
            chat = Chat.objects.create(name="AI Chat", is_ai_chat=True)
            chat.participants.add(request.user, ai_user)

        serializer = self.get_serializer(chat)
        return Response(serializer.data)

    @action(detail=True, methods=["POST"])
    def send_message(self, request, pk=None):
        """
        Send a message to a specific chat room.
        If the chat is an AI chat, the AI response will be generated and sent back.
        """
        chat = get_object_or_404(Chat, pk=pk)
        content = request.data.get("content")
        sender = request.user

        # Validate message
        if not content:
            return Response({"error": "Message content cannot be empty"}, status=400)

        message = Message.objects.create(chat=chat, sender=sender, content=content)

        # If this is an AI chat, generate and save the AI's response
        if chat.is_ai_chat:
            ai_response = get_ai_response(content)
            ai_user = User.objects.get(username="AI Assistant")
            Message.objects.create(
                chat=chat, sender=ai_user, content=ai_response, is_ai_message=True
            )

        serializer = MessageSerializer(message)
        return Response(serializer.data)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for viewing user details.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
