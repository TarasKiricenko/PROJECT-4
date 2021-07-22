from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers, status

from .serializers.common import HashtagSerializer
from .models import Hashtag
from .serializers.populated import PopulatedHashtagSerializer

class HashtagListView(APIView):
    def get(self, request):
        hashtags = Hashtag.objects.all()
        serialized_hashtags = PopulatedHashtagSerializer(hashtags, many=True)
        return Response(serialized_hashtags.data, status=status.HTTP_200_OK)