from rest_framework import serializers
from .models import Project, Discussion


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name", "description", "created_at", "status"]
        read_only_fields = ["created_at", "id"]


# added
class DiscussionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discussion
        fields = ["id", "title", "description", "additional_info", "created_at"]
