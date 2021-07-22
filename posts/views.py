from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound

from .models import Post

from .serializer import PostSerializer

class PostListView(APIView):

    def get(self, _request):
        posts = Post.objects.all()
        print('📝 POSTS', posts)
        serialized_posts = PostSerializer(posts, many=True)
        print('📝 SERIALIZED POSTS', serialized_posts.data)
        return Response(serialized_posts.data, status=status.HTTP_200_OK)

    def post(self, request):
        post_to_add = PostSerializer(data=request.data)
        if post_to_add.is_valid():
            post_to_add.save()
            print('📝 POST TO ADD', post_to_add.data)
            return Response(post_to_add.data, status=status.HTTP_201_CREATED)
        return Response(post_to_add.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class PostDetailView(APIView):

    def get_post(self, pk):
        try: 
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            raise NotFound(detail="🆘 Can't find that post!")

    def get(self, _request, pk):
        post = self.get_post(pk=pk)
        serialized_post = PostSerializer(post)
        return Response(serialized_post.data, status=status.HTTP_200_OK)