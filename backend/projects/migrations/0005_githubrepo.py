# Generated by Django 5.0.6 on 2024-11-29 19:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0004_notification"),
    ]

    operations = [
        migrations.CreateModel(
            name="GithubRepo",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("username", models.CharField(max_length=255)),
                ("githubRepo", models.CharField(max_length=255)),
                (
                    "project",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="github_repos",
                        to="projects.project",
                    ),
                ),
            ],
        ),
    ]
