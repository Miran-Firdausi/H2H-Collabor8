from rest_framework import serializers
from .models import Project, Discussion

class ProjectSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    owner_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'created_at', 'status', 'owner_email', 'owner_name']
        read_only_fields = ['created_at', 'id', 'owner_email', 'owner_name']

    def get_owner_name(self, obj):
        return f"{obj.owner.first_name} {obj.owner.last_name}".strip()

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['owner'] = request.user
        return super().create(validated_data)

class DiscussionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discussion
        fields = ["id", "title", "description", "additional_info", "created_at"]

