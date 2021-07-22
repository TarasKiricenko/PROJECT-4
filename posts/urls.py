from django.urls import path
from rest_framework import views
from .views import PostListView, PostDetailView

urlpatterns = [
    path('', PostListView.as_view()),
    path('<int:pk>/', PostDetailView.as_view())
]