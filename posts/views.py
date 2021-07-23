from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Post

from .serializers.common import PostSerializer
from .serializers.populated import PopulatedPostSerializer


class PostListView(APIView):
    # handle permissions ENABLE FOR LOGGED IN VIEW
    # permission_classes = (IsAuthenticatedOrReadOnly, )
    def get(self, _request):
        posts = Post.objects.all()
        print('📝 POSTS', posts)
        serialized_posts = PopulatedPostSerializer(posts, many=True)
        print('📝 SERIALIZED POSTS', serialized_posts.data)
        return Response(serialized_posts.data, status=status.HTTP_200_OK)

    def post(self, request):
        request.data["owner"] = request.user.id #ENABLE FOR LOGGED IN VIEW
        print(request.user.id)
        post_to_add = PostSerializer(data=request.data)
        if post_to_add.is_valid():
            post_to_add.save()
            print('📝 POST TO ADD', post_to_add.data)
            return Response(post_to_add.data, status=status.HTTP_201_CREATED)
        return Response(post_to_add.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class PostDetailView(APIView):
    # handle permissions ENABLE FOR LOGGED IN VIEW
    # permission_classes = (IsAuthenticatedOrReadOnly, )
    def get_post(self, pk):
        try: 
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            raise NotFound(detail="🆘 This post does not exist!")

    def get(self, _request, pk):
        post = self.get_post(pk=pk)
        serialized_post = PopulatedPostSerializer(post)
        return Response(serialized_post.data, status=status.HTTP_200_OK)

    def delete(self, _request, pk):
        post_to_delete = self.get_post(pk=pk)
        post_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        post_to_edit = self.get_post(pk=pk)
        updated_post = PostSerializer(post_to_edit, data=request.data)
        if updated_post.is_valid():
            updated_post.save()
            return Response(updated_post.data, status=status.HTTP_202_ACCEPTED)
        return Response(updated_post.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)