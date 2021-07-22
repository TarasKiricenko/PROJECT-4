from django.contrib import admin
from django.contrib.admin.decorators import register

from django.contrib.auth import get_user_model

User = get_user_model()

admin.site.register(User)