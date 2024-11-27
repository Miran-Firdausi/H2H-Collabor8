from django.db import models
import uuid


class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    data = models.JSONField(default=dict, blank=True, null=True)

    def __str__(self):
        return str(self.id)
