from django.db import models
from django.conf import settings


class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=50,
        choices=[
            ("active", "Active"),
            ("completed", "Completed"),
            ("archived", "Archived"),
        ],
    )

    owner = models.ForeignKey("accounts.UserAccount", on_delete=models.CASCADE)

    def __str__(self):
        return str(self.name)

    class Meta:
        ordering = ["-created_at"]


class GithubRepo(models.Model):
    project = models.ForeignKey(
        "Project", on_delete=models.CASCADE, related_name="github_repos"
    )
    username = models.CharField(max_length=255)
    githubRepo = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.username}/{self.githubRepo}"


class Discussion(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    additional_info = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("project_created", "Project Created"),
        ("project_updated", "Project Updated"),
        ("project_deleted", "Project Deleted"),
        ("project_shared", "Project Shared"),
        ("discussion_created", "Discussion Created"),
    ]

    recipient = models.ForeignKey("accounts.UserAccount", on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    related_object_id = models.IntegerField(null=True, blank=True)
    related_object_type = models.CharField(max_length=50, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.notification_type} - {self.title}"


# class Task(models.Model):
#     project = models.ForeignKey(Project, related_name="tasks", on_delete=models.CASCADE)
#     title = models.CharField(max_length=255)
#     description = models.TextField(blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     due_date = models.DateTimeField(null=True, blank=True)
#     status = models.CharField(
#         max_length=50,
#         choices=[("todo", "To Do"), ("in_progress", "In Progress"), ("done", "Done")],
#     )
#     priority = models.PositiveSmallIntegerField(
#         choices=[(1, "1"), (2, "2"), (3, "3"), (4, "4"), (5, "5")]
#     )
#     assignee = models.ForeignKey(
#         UserAccount, null=True, blank=True, on_delete=models.SET_NULL
#     )
#     parent = models.ForeignKey(
#         "self", null=True, blank=True, related_name="subtasks", on_delete=models.CASCADE
#     )

#     def __str__(self):
#         return str(self.title)


# class Collaborator(models.Model):
#     user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
#     project = models.ForeignKey(
#         Project, related_name="collaborators", on_delete=models.CASCADE
#     )
#     role = models.CharField(
#         max_length=50,
#         choices=[
#             ("member", "Member"),
#             ("admin", "Admin"),
#             ("viewer", "Viewer"),
#         ],
#     )
#     joined_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.user.email} - {self.role} in project {self.project.name}"


# class Team(models.Model):
#     name = models.CharField(max_length=255)
#     project = models.ForeignKey(
#         Project, related_name="teams", on_delete=models.CASCADE, null=True, blank=True
#     )
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return str(self.name)


# class TeamMember(models.Model):
#     user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
#     team = models.ForeignKey(Team, related_name="members", on_delete=models.CASCADE)
#     joined_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.user.email} in team {self.team.name}"


# class Sprint(models.Model):
#     project = models.ForeignKey(
#         Project, related_name="sprints", on_delete=models.CASCADE
#     )
#     name = models.CharField(max_length=255)
#     start_date = models.DateTimeField()
#     end_date = models.DateTimeField()
#     goal = models.TextField()


# class Backlog(models.Model):
#     project = models.ForeignKey(
#         Project, related_name="backlogs", on_delete=models.CASCADE
#     )
#     tasks = models.ManyToManyField(Task, related_name="backlogs")


# class KanbanBoard(models.Model):
#     project = models.ForeignKey(
#         Project, related_name="kanban_board", on_delete=models.CASCADE
#     )
#     title = models.CharField(max_length=255)
#     order = models.IntegerField(default=0)  # For sorting columns


# class KanbanColumn(models.Model):
#     board = models.ForeignKey(
#         KanbanBoard, related_name="columns", on_delete=models.CASCADE
#     )
#     title = models.CharField(max_length=255)
#     order = models.IntegerField(default=0)  # For sorting columns


# class Comment(models.Model):
#     task = models.ForeignKey(Task, related_name="comments", on_delete=models.CASCADE)
#     user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
#     text = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
