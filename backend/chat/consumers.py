import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Receive a message from WebSocket, save to DB, and broadcast to the group.
        """
        try:
            data = json.loads(text_data)
            content = data.get('content')
            if not content or not content.strip():
                await self.send(text_data=json.dumps({'error': 'Empty message.'}))
                return
            user = self.scope['user']
            if not user.is_authenticated:
                await self.send(text_data=json.dumps({'error': 'Authentication required.'}))
                return
            # Save message to DB
            message = await self.create_message(user, content)
            # Serialize message
            msg_json = await self.message_to_json(message)
            # Broadcast message to room
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': msg_json
                }
            )
        except Exception as e:
            await self.send(text_data=json.dumps({'error': str(e)}))

    async def chat_message(self, event):
        """
        Receive message from room group and send to WebSocket.
        """
        message = event['message']
        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def create_message(self, user, content):
        from .models import ChatRoom, Message
        try:
            room = ChatRoom.objects.get(id=self.room_id)
        except ChatRoom.DoesNotExist:
            raise Exception("Chat room does not exist.")
        msg = Message.objects.create(chat_room=room, sender=user, content=content)
        return msg

    @database_sync_to_async
    def message_to_json(self, message):
        from users.serializers import UserSerializer
        return {
            'id': message.id,
            'room': message.chat_room.id,
            'sender': UserSerializer(message.sender).data,
            'content': message.content,
            'created_at': message.created_at.isoformat(),
            'is_read': message.is_read,
        }