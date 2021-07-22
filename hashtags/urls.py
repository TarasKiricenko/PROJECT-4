from django.urls import path
from .views import HashtagListView

urlpatterns = [
  path('', HashtagListView.as_view())
]