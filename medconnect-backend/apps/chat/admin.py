from django.contrib import admin
from .models import ChatRoom, ChatMessage

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at', 'updated_at', 'participants_count')
    filter_horizontal = ('participants',)
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    
    def participants_count(self, obj):
        return obj.participants.count()
    participants_count.short_description = 'Participants'

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'room', 'content_preview', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('content', 'sender__email')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content' 