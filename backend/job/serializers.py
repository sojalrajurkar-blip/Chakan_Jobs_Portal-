from rest_framework import serializers
from django.db.models import Q
from .models import JobPost, Application


class JobPostPublicListSerializer(serializers.ModelSerializer):
    job_type_display = serializers.CharField(source='get_job_type_display', read_only=True)
    shift_display = serializers.CharField(source='get_shift_display', read_only=True)
    min_education_display = serializers.CharField(source='get_min_education_display', read_only=True)
    experience_required_display = serializers.CharField(source='get_experience_required_display', read_only=True)

    class Meta:
        model = JobPost
        fields = [
            'id',
            'title',
            'company_name',
            'area',
            'village',
            'job_type',
            'job_type_display',
            'shift',
            'shift_display',
            'min_education',
            'min_education_display',
            'experience_required',
            'experience_required_display',
            'min_salary',
            'max_salary',
            'openings',
            'charges_applicable',
            'status',
            'created_at',
        ]


class JobPostDetailSerializer(serializers.ModelSerializer):
    job_type_display = serializers.CharField(source='get_job_type_display', read_only=True)
    shift_display = serializers.CharField(source='get_shift_display', read_only=True)
    min_education_display = serializers.CharField(source='get_min_education_display', read_only=True)
    experience_required_display = serializers.CharField(source='get_experience_required_display', read_only=True)
    gender_preference_display = serializers.CharField(source='get_gender_preference_display', read_only=True)
    related_jobs = serializers.SerializerMethodField()
    application_count = serializers.SerializerMethodField()

    class Meta:
        model = JobPost
        fields = [
            'id',
            'title',
            'description',
            'company_name',
            'company_address',
            'area',
            'village',
            'bus_route',
            'job_type',
            'job_type_display',
            'shift',
            'shift_display',
            'min_education',
            'min_education_display',
            'course_required',
            'experience_required',
            'experience_required_display',
            'gender_preference',
            'gender_preference_display',
            'facilities',
            'min_salary',
            'max_salary',
            'openings',
            'charges_applicable',
            'calling_number',
            'whatsapp_number',
            'email',
            'status',
            'created_at',
            'updated_at',
            'related_jobs',
            'application_count',
        ]

    def get_related_jobs(self, obj):
        # Find active jobs with overlapping keywords or same area, excluding self
        keywords = [w for w in obj.title.split() if len(w) > 2]
        query = Q(area=obj.area)
        for word in keywords[:3]:
            query |= Q(title__icontains=word)

        related = (
            JobPost.objects.filter(status=JobPost.Status.ACTIVE)
            .filter(query)
            .exclude(pk=obj.pk)
            .order_by('-created_at')[:4]
        )
        return JobPostPublicListSerializer(related, many=True).data

    def get_application_count(self, obj):
        # Expose applicant count only if requester is the owner recruiter or admin
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            if obj.recruiter == request.user or request.user.is_staff:
                return obj.applications.count()
        return None


class JobPostWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = [
            'id',
            'title',
            'description',
            'company_name',
            'company_address',
            'area',
            'village',
            'bus_route',
            'job_type',
            'shift',
            'min_education',
            'course_required',
            'experience_required',
            'gender_preference',
            'facilities',
            'min_salary',
            'max_salary',
            'openings',
            'charges_applicable',
            'calling_number',
            'whatsapp_number',
            'email',
            'status',
        ]

    def validate_title(self, value):
        cleaned = value.strip()
        if len(cleaned) < 3 or len(cleaned) > 100:
            raise serializers.ValidationError("Job title must be between 3 and 100 characters.")
        return cleaned

    def validate_openings(self, value):
        if value < 1:
            raise serializers.ValidationError("Openings count must be at least 1.")
        return value

    def validate(self, attrs):
        min_salary = attrs.get('min_salary', getattr(self.instance, 'min_salary', 0))
        max_salary = attrs.get('max_salary', getattr(self.instance, 'max_salary', 0))

        if min_salary < 0 or max_salary < 0:
            raise serializers.ValidationError("Salary values cannot be negative.")

        if max_salary > 0 and min_salary > max_salary:
            raise serializers.ValidationError({
                "max_salary": "Maximum salary must be greater than or equal to minimum salary."
            })

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        recruiter = request.user if request else None
        return JobPost.objects.create(recruiter=recruiter, **validated_data)


class CandidateApplicationSerializer(serializers.ModelSerializer):
    resume_file = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Application
        fields = [
            'id',
            'full_name',
            'age',
            'qualification',
            'course_name',
            'mobile_number',
            'current_address',
            'resume_file',
            'submitted_at',
        ]
        read_only_fields = ['id', 'submitted_at']

    def validate_full_name(self, value):
        cleaned = value.strip()
        if len(cleaned) < 3:
            raise serializers.ValidationError("Full name must be at least 3 characters long.")
        return cleaned

    def validate_age(self, value):
        if value < 18 or value > 65:
            raise serializers.ValidationError("Age must be between 18 and 65 years.")
        return value

    def validate_mobile_number(self, value):
        cleaned = value.strip().replace(' ', '').replace('-', '')
        if cleaned.startswith('+91'):
            cleaned = cleaned[3:]
        if not cleaned.isdigit() or len(cleaned) != 10:
            raise serializers.ValidationError("Please provide a valid 10-digit mobile number.")
        return cleaned

    def validate_qualification(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Qualification is required.")
        return cleaned

    def validate_current_address(self, value):
        cleaned = value.strip()
        if len(cleaned) < 5:
            raise serializers.ValidationError("Current address must be at least 5 characters.")
        return cleaned

    def validate_resume_file(self, value):
        if value:
            max_size = 5 * 1024 * 1024  # 5MB
            if value.size > max_size:
                raise serializers.ValidationError("Resume file size cannot exceed 5 MB.")

            import os
            ext = os.path.splitext(value.name)[1].lower()
            allowed = ['.pdf', '.doc', '.docx']
            if ext not in allowed:
                raise serializers.ValidationError("Only PDF, DOC, or DOCX documents are accepted.")
        return value


class RecruiterApplicantSerializer(serializers.ModelSerializer):
    job_id = serializers.IntegerField(source='job_post.id', read_only=True)
    job_title = serializers.CharField(source='job_post.title', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    resume_url = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'id',
            'job_id',
            'job_title',
            'full_name',
            'age',
            'qualification',
            'course_name',
            'mobile_number',
            'current_address',
            'resume_file',
            'resume_url',
            'status',
            'status_display',
            'submitted_at',
        ]
        read_only_fields = [
            'id',
            'job_id',
            'job_title',
            'full_name',
            'age',
            'qualification',
            'course_name',
            'mobile_number',
            'current_address',
            'resume_file',
            'resume_url',
            'status_display',
            'submitted_at',
        ]

    def get_resume_url(self, obj):
        if obj.resume_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume_file.url)
            return obj.resume_file.url
        return None


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']

    def validate_status(self, value):
        if value not in Application.Status.values:
            raise serializers.ValidationError(f"Invalid status. Choose from: {Application.Status.values}")
        return value
