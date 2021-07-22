from comments.serializers.common import CommentSerializer
from .common import PostSerializer

class PopulatedPostSerializer(PostSerializer):
    comments = CommentSerializer(many=True)