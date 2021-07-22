from comments.models import Comment

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound

from .serializers.common import CommentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

class CommentListView(APIView):
    # permission_classes = (IsAuthenticated, ) ENABLE FOR LOGGED IN VIEW
    def post(self, request):
        request.data["onwer"] = request.user.id
        comment_to_create = CommentSerializer(data=request.data)
        if comment_to_create.is_valid():
            comment_to_create.save()
            return Response(comment_to_create.data, status=status.HTTP_201_CREATED)
        return Response(comment_to_create.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class CommentDetailView(APIView):
    def delete(self, request, pk):
        try:
            comment_to_delete = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            raise NotFound(detail="Comment not found")
        # if comment_to_delete.owner != request.user: # ENABLE FOR LOGGED IN VIEW
        #     raise PermissionDenied(detail="You can't delete something you did not created")
        comment_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)