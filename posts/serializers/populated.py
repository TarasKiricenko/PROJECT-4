from comments.serializers.common import CommentSerializer
from .common import PostSerializer
from hashtags.serializers.common import HashtagSerializer
from comments.serializers.populated import PopulatedCommentSerializer
from jwt_auth.serializer import UserSerializer

class PopulatedPostSerializer(PostSerializer):
    comments = PopulatedCommentSerializer(many=True)
    hashtags = HashtagSerializer(many=True)
    owner = UserSerializer()