import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Chat, Message
from django.contrib.auth import get_user_model
from .ai_utils import get_ai_response

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.chat_group_name = f"chat_{self.chat_id}"

        # Join group
        await self.channel_layer.group_add(self.chat_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave group
        await self.channel_layer.group_discard(self.chat_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json["message_content"]
        sender_id = text_data_json["sender"]

        print(message_content)
        print(self.chat_id)

        saved_message = await self.save_message(sender_id, message_content)

        if saved_message:
            await self.channel_layer.group_send(
                self.chat_group_name,
                {
                    "type": "chat_message",
                    "message": {
                        "id": saved_message.id,
                        "content": message_content,
                        "sender": {
                            "id": saved_message.sender.id,
                            "email": saved_message.sender.email,
                        },
                        "timestamp": saved_message.timestamp.isoformat(),
                    },
                },
            )

            # Check if this is an AI chat and generate a response asynchronously
            chat = await self.get_chat()
            if chat.is_ai_chat:
                ai_response = await self.get_ai_reply(message_content)
                if ai_response:
                    ai_user = await self.get_ai_user()
                    ai_message = await self.save_message(ai_user.id, ai_response)

                    # Send the AI response to the group
                    await self.channel_layer.group_send(
                        self.chat_group_name,
                        {
                            "type": "chat_message",
                            "message": {
                                "id": ai_message.id,
                                "content": ai_response,
                                "sender": {
                                    "id": ai_user.id,
                                    "email": ai_user.email,
                                },
                                "timestamp": ai_message.timestamp.isoformat(),
                            },
                        },
                    )

    async def chat_message(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def save_message(self, user_id, content):
        try:
            sender = User.objects.get(id=user_id)
            chat = Chat.objects.get(id=self.chat_id)
            saved_message = Message.objects.create(
                chat=chat, sender=sender, content=content
            )
            return saved_message
        except (User.DoesNotExist, Chat.DoesNotExist) as e:
            logging.error(e)
            return None

    @database_sync_to_async
    def get_chat(self):
        return Chat.objects.get(id=self.chat_id)

    async def get_ai_reply(self, message_content):
        try:
            return await database_sync_to_async(get_ai_response)(message_content)
        except Exception as e:
            logging.error(f"Error generating AI response: {e}")
            return "Sorry, I couldn't process your message."

    @database_sync_to_async
    def get_ai_user(self):
        user = User.objects.get(email="ai@collabor8.com")
        return user
