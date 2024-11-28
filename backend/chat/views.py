import json
from .models import Chat, Message
from accounts.serializers import CustomUserCreateSerializer
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model

User = get_user_model()


@api_view(["GET"])
def get_all_users(request):
    users = User.objects.all()
    users_data = [
        {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
        for user in users
    ]
    return Response(users_data)


def get_or_create_private_chat(user1, user2):
    chat = (
        Chat.objects.filter(
            participants__in=[user1, user2],
            is_group_chat=False,
            is_ai_chat=False,
        )
        .annotate(participant_count=Count("participants"))
        .filter(participant_count=2)
        .first()
    )
    if not chat:
        chat = Chat.objects.create(is_group_chat=False)
        chat.participants.add(user1, user2)
    return chat


def get_or_create_ai_chat(user):
    ai_user, _ = User.objects.get_or_create(email="ai@collabor8.com")

    chat = (
        Chat.objects.filter(participants__in=[user, ai_user], is_ai_chat=True)
        .annotate(participant_count=Count("participants"))
        .filter(participant_count=2)
        .first()
    )
    if not chat:
        chat = Chat.objects.create(name="AI Chat", is_ai_chat=True)
        chat.participants.add(user, ai_user)
    return chat


@api_view(["GET"])
def my_chats(request):
    chats = Chat.objects.filter(participants=request.user).prefetch_related(
        "participants", "messages"
    )

    chat_data = []
    for chat in chats:
        # Get the last message for the chat, if any
        last_message = chat.messages.order_by("-timestamp").first()

        chat_info = {
            "id": chat.id,
            "name": chat.name,
            "is_group_chat": chat.is_group_chat,
            "is_ai_chat": chat.is_ai_chat,
            "last_message": (
                {
                    "content": last_message.content,
                    "timestamp": last_message.timestamp.isoformat(),
                    "sender": (
                        {
                            "id": last_message.sender.id,
                            "email": last_message.sender.email,
                        }
                        if last_message
                        else None
                    ),
                }
                if last_message
                else {"content": "", "timestamp": "", "sender": None}
            ),
            "participants": [
                {
                    "id": participant.id,
                    "email": participant.email,
                    "name": f"{participant.first_name} {participant.last_name}".strip(),
                }
                for participant in chat.participants.all()
            ],
            "created_at": chat.created_at,
        }
        chat_data.append(chat_info)

    return Response(chat_data)


@api_view(["GET"])
def chat_messages(request, chat_id):
    chat = get_object_or_404(Chat, id=chat_id, participants=request.user)
    messages = chat.messages.all().order_by("timestamp")
    message_data = [
        {
            "id": message.id,
            "content": message.content,
            "sender": {"id": message.sender.id, "email": message.sender.email},
            "timestamp": message.timestamp,
        }
        for message in messages
    ]
    return Response(message_data)


@api_view(["GET", "POST"])
def create_or_get_ai_chat(request):
    if request.method == "POST":
        chat = get_or_create_ai_chat(request.user)
        return Response(
            {
                "id": chat.id,
                "is_ai_chat": chat.is_ai_chat,
                "participants": [
                    {"id": participant.id, "email": participant.email}
                    for participant in chat.participants.all()
                ],
            }
        )
    return Response({"error": "Invalid HTTP method"}, status=405)


@api_view(["POST"])
@csrf_exempt
def create_or_get_private_chat(request):
    if request.method == "POST":
        data = json.loads(request.body)
        other_user_id = data.get("user_id")
        if not other_user_id:
            return Response({"error": "Other user ID is required"}, status=400)

        other_user = get_object_or_404(User, id=other_user_id)

        chat = get_or_create_private_chat(request.user, other_user)

        return Response(
            {
                "id": chat.id,
                "name": chat.name,
                "is_group_chat": chat.is_group_chat,
                "participants": [
                    {"id": participant.id, "email": participant.email}
                    for participant in chat.participants.all()
                ],
            }
        )
    return Response({"error": "Invalid HTTP method"}, status=405)


def create_group_chat(request):
    if request.method == "POST":
        data = json.loads(request.body)
        participant_ids = data.get("participant_ids", [])
        name = data.get("name")

        if len(participant_ids) < 2:
            return Response(
                {"error": "At least two participants are required"}, status=400
            )

        participants = User.objects.filter(id__in=participant_ids)
        if participants.count() != len(participant_ids):
            return Response({"error": "Some participants are invalid"}, status=400)

        chat = Chat.objects.create(name=name, is_group_chat=True)
        chat.participants.add(*participants, request.user)

        return Response(
            {
                "id": chat.id,
                "name": chat.name,
                "is_group_chat": chat.is_group_chat,
                "participants": [
                    {"id": participant.id, "email": participant.email}
                    for participant in chat.participants.all()
                ],
            }
        )
    return Response({"error": "Invalid HTTP method"}, status=405)
