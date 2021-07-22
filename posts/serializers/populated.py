from comments.serializers.common import CommentSerializer
from .common import PostSerializer
from hashtags.serializers.common import HashtagSerializer

class PopulatedPostSerializer(PostSerializer):
    comments = CommentSerializer(many=True)
    hashtags = HashtagSerializer(many=True)