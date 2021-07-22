from django.contrib import admin

# ! import and register model

from .models import Post 

admin.site.register(Post)