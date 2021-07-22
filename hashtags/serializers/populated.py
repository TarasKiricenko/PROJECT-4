from posts.serializers.common import PostSerializer
from .common import HashtagSerializer

class PopulatedHashtagSerializer(HashtagSerializer):
    hashtags = PostSerializer(many=True)