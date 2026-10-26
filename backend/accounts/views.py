from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout as django_logout

from .serializers import (
    UserRegistrationSerializer,
    CandidateRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
)


class CandidateRegisterView(APIView):
    """
    POST /api/auth/candidate/register/
    Registers a new candidate job-seeker account with 10-digit mobile number.
    Auto-activates account and issues token.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = CandidateRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    "success": True,
                    "message": "Candidate account created successfully.",
                    "token": token.key,
                    "user": UserProfileSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Please correct the highlighted form errors.",
                    "details": serializer.errors,
                },
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class RegisterView(APIView):
    """
    POST /api/auth/register/
    Registers a new recruiter account, validates fields, and issues an authentication token.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    "success": True,
                    "message": "Account created successfully.",
                    "token": token.key,
                    "user": UserProfileSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Please correct the highlighted form errors.",
                    "details": serializer.errors,
                },
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class LoginView(APIView):
    """
    POST /api/auth/login/
    Authenticates a recruiter using either username or email and password.
    Returns auth token and profile data.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    "success": True,
                    "message": "Authentication successful.",
                    "token": token.key,
                    "user": UserProfileSerializer(user).data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {
                "success": False,
                "error": {
                    "code": "AUTHENTICATION_FAILED",
                    "message": "Invalid username/email or password.",
                    "details": serializer.errors,
                },
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Revokes the current authentication token and terminates the session.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # Delete the DRF auth token
            if hasattr(request.user, 'auth_token'):
                request.user.auth_token.delete()
        except Exception:
            pass

        # Clear session if session-based auth was used
        django_logout(request)

        return Response(
            {
                "success": True,
                "message": "Logged out successfully.",
            },
            status=status.HTTP_200_OK,
        )


class MeView(generics.RetrieveUpdateAPIView):
    """
    GET /api/auth/me/
    Retrieves the currently authenticated user's profile.

    PATCH /api/auth/me/
    Updates editable fields of the user's company and contact profile.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({"success": True, "user": serializer.data})

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "Profile updated successfully.",
                    "user": serializer.data,
                }
            )
        return Response(
            {
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Failed to update profile.",
                    "details": serializer.errors,
                },
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
