from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from django.conf import settings
import jwt
from .serializer import UserSerializer

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        user_to_create = UserSerializer(data=request.data)
        if user_to_create.is_valid():
            user_to_create.save()
            return Response({"message": "Registration successful"}, status=status.HTTP_202_ACCEPTED)
        return Response(user_to_create.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        try:
            user_to_login = User.objects.get(email=email)
        except User.DoesNotExist:
            raise PermissionDenied(detail="Invalid credentials")
        if not user_to_login.check_password(password):
            raise PermissionDenied(detail="Invalid credentials")
        dt = datetime.now() + timedelta(days=7)
        token = jwt.encode(
          {"sub": user_to_login.id, "exp": int(dt.strftime("%s"))},
          settings.SECRET_KEY,
          algorithm="HS256"
        )
        return Response({"token": token, "message": f"Welcome in, {user_to_login.username}"})

# class AccountView(APIView):
#     def get(self, request):
#         print('trying hard >>>>>>>>>>>>>>>>>>>>')
#         header = request.headers.get('Authorization')
#         if not header:
#             print("no header")
#             return None
#         if not header.startswith('Bearer '):
#             print("wrong bearer stuff")
#             raise PermissionDenied(detail="🎖Invalid token")
#         token = header.replace('Bearer ', '')
#         try:
#             payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
#             print('Payload is >>>>>>>>>>', payload)
#             # user = User.objects.get(pk=payload.get('sub'))
#             user = User.objects.get(pk=payload.get('sub'))
#             print('USER IS>>>>', user)
#             # user = UserSerializer(user)
#             print('USER IS after serializing>>>>', user.username, user.first_name )
#             user = user.username, user.first_name, user.last_name, user.profile_image, user.id
#             print(user)
#             user = UserSerializer(data=request.data)
#         except jwt.exceptions.InvalidTokenError:
#             raise PermissionDenied(detail="🎖Invalid token")
#         except User.DoesNotExist:
#             raise PermissionDenied(detail="👤 User not found")
#         return Response(user, status=status.HTTP_200_OK)

        # class RegisterView(APIView):
    # def post(self, request):
    #     user_to_create = UserSerializer(data=request.data)
    #     if user_to_create.is_valid():
    #         user_to_create.save()
    #         return Response({"message": "Registration successful"}, status=status.HTTP_202_ACCEPTED)
    #     return Response(user_to_create.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)