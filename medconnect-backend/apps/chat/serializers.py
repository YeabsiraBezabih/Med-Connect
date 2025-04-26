from rest_framework import serializers
from .models import ChatRoom, ChatMessage
from apps.users.serializers import UserSerializer

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = '__all__'
        read_only_fields = ('sender', 'is_read')

class ChatRoomSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = '__all__'
    
    def get_last_message(self, obj):
        last_message = obj.messages.first()
        if last_message:
            return ChatMessageSerializer(last_message).data
        return None
    
    def get_unread_count(self, obj):
        user = self.context['request'].user
        return obj.messages.filter(is_read=False).exclude(sender=user).count()

class ChatRoomCreateSerializer(serializers.ModelSerializer):
    participant_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True
    )
    
    class Meta:
        model = ChatRoom
        fields = ('participant_ids',)
    
    def create(self, validated_data):
        participant_ids = validated_data.pop('participant_ids')
        room = ChatRoom.objects.create()
        room.participants.add(*participant_ids)
        return room 