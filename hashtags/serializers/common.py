from ..models import Hashtag
from rest_framework import serializers, fields

class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = "__all__"