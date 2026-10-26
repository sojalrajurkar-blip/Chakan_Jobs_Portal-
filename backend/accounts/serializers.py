from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import Q
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    full_name = serializers.CharField(
        write_only=True,
        required=False,
        default=''
    )

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'confirm_password',
            'full_name',
            'mobile_number',
            'company_name',
            'company_address',
            'position',
            'company_type',
        ]
        extra_kwargs = {
            'email': {'required': True},
            'company_name': {'required': True},
            'mobile_number': {'required': True},
        }

    def validate_mobile_number(self, value):
        cleaned = value.strip().replace(' ', '').replace('-', '')
        if cleaned.startswith('+91'):
            cleaned = cleaned[3:]
        if not cleaned.isdigit() or len(cleaned) != 10:
            raise serializers.ValidationError("Mobile number must be a valid 10-digit phone number.")
        if User.objects.filter(mobile_number=cleaned).exists():
            raise serializers.ValidationError("An account with this mobile number already exists.")
        return cleaned

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return email

    def validate_username(self, value):
        username = value.strip()
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError("This username is already taken. Please choose another.")
        return username

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        # Validate password strength using Django validators
        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        full_name = validated_data.pop('full_name', '').strip()
        password = validated_data.pop('password')

        first_name = ''
        last_name = ''
        if full_name:
            parts = full_name.split(' ', 1)
            first_name = parts[0]
            last_name = parts[1] if len(parts) > 1 else ''

        user = User.objects.create_user(
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=User.Role.RECRUITER,
            **validated_data
        )
        return user


class CandidateRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    full_name = serializers.CharField(
        write_only=True,
        required=True
    )
    username = serializers.CharField(required=False, allow_blank=True, default='')
    email = serializers.EmailField(required=False, allow_blank=True, default='')

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'confirm_password',
            'full_name',
            'mobile_number',
            'qualification',
            'current_address',
        ]
        extra_kwargs = {
            'mobile_number': {'required': True},
        }

    def validate_mobile_number(self, value):
        cleaned = value.strip().replace(' ', '').replace('-', '')
        if cleaned.startswith('+91'):
            cleaned = cleaned[3:]
        if not cleaned.isdigit() or len(cleaned) != 10:
            raise serializers.ValidationError("Please enter a valid 10-digit mobile number.")
        if User.objects.filter(mobile_number=cleaned).exists():
            raise serializers.ValidationError("An account with this mobile number already exists. Please log in.")
        return cleaned

    def validate_full_name(self, value):
        cleaned = value.strip()
        if len(cleaned) < 3:
            raise serializers.ValidationError("Full name must be at least 3 characters long.")
        return cleaned

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        full_name = validated_data.pop('full_name', '').strip()
        password = validated_data.pop('password')
        mobile_number = validated_data.get('mobile_number')

        username = validated_data.get('username')
        if not username:
            username = f"cand_{mobile_number}"
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1
            validated_data['username'] = username

        first_name = ''
        last_name = ''
        if full_name:
            parts = full_name.split(' ', 1)
            first_name = parts[0]
            last_name = parts[1] if len(parts) > 1 else ''

        user = User.objects.create_user(
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=User.Role.CANDIDATE,
            is_verified=True,
            **validated_data
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        identifier = attrs.get('username_or_email', '').strip()
        password = attrs.get('password')

        if not identifier or not password:
            raise serializers.ValidationError("Must include both username/mobile/email and password.")

        # Allow login with either username, email, or 10-digit mobile number
        cleaned_id = identifier.replace(' ', '').replace('-', '')
        if cleaned_id.startswith('+91'):
            cleaned_id = cleaned_id[3:]

        user_obj = User.objects.filter(
            Q(username__iexact=identifier) |
            Q(email__iexact=identifier) |
            Q(mobile_number=cleaned_id) |
            Q(mobile_number=identifier)
        ).first()

        if not user_obj:
            raise serializers.ValidationError("Invalid credentials. Please verify your details.")

        # Authenticate against Django backend
        user = authenticate(username=user_obj.username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials. Please verify your details.")

        if not user.is_active:
            raise serializers.ValidationError("This account has been deactivated. Please contact support.")

        attrs['user'] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'role',
            'mobile_number',
            'qualification',
            'current_address',
            'company_name',
            'company_address',
            'position',
            'company_type',
            'is_verified',
            'created_at',
        ]
        read_only_fields = ['id', 'username', 'role', 'is_verified', 'created_at']

    def get_full_name(self, obj):
        name = f"{obj.first_name} {obj.last_name}".strip()
        return name or obj.username
