from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields.files import ImageField

class Comment(models.Model):
    text = models.TextField(max_length=500, default=None)
    image = models.URLField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(
        "posts.Post",
        related_name = "comments",
        on_delete=models.CASCADE
    )
    owner = models.ForeignKey(
        "jwt_auth.User",
        related_name = "comments",
        on_delete= models.CASCADE
    )