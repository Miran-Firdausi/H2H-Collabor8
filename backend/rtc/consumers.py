import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Document


class DocumentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.document_id = self.scope["url_route"]["kwargs"]["document_id"]
        self.room_group_name = f"document_{self.document_id}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json.get("data")
        event_type = text_data_json.get("event_type")

        if event_type == "get-document":
            document, created = await self.get_or_create_document(self.document_id)
            await self.send(
                text_data=json.dumps(
                    {
                        "event_type": "load-document",
                        "data": document.data,
                    }
                )
            )

        elif event_type == "send-changes":
            # Broadcast changes to other users
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "document_update",
                    "data": data,
                    "userId": text_data_json.get("userId"),
                },
            )

        elif event_type == "save-document":
            await self.save_document(self.document_id, data)

    async def document_update(self, event):
        data = event["data"]
        user_id = event["userId"]
        await self.send(
            text_data=json.dumps(
                {"event_type": "receive-changes", "data": data, "userId": user_id}
            )
        )

    @staticmethod
    async def get_or_create_document(document_id):
        document, created = await Document.objects.aget_or_create(id=document_id)
        return document, created

    @staticmethod
    async def save_document(document_id, data):
        await Document.objects.filter(id=document_id).aupdate(data=data)
