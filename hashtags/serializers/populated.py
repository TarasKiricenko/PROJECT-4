from posts.serializers.common import PostSerializer
from .common import HashtagSerializer

class PopulatedHashtagSerializer(HashtagSerializer):
    posts = PostSerializer(many=True)