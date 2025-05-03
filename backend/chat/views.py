from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer

# Create your views here.

class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):  # handle Swagger schema generation
            return ChatRoom.objects.none()
        if not self.request.user.is_authenticated:
            return ChatRoom.objects.none()
        return ChatRoom.objects.filter(participants=self.request.user)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """
        Send a message in the chat room
        """
        chat_room = self.get_object()
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(sender=request.user, chat_room=chat_room)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """
        Get all messages in the chat room
        """
        chat_room = self.get_object()
        messages = chat_room.messages.all().order_by('-created_at')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
