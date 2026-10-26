from rest_framework import status, generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404, render
from datetime import timedelta
from django.utils import timezone

from .models import JobPost, Application, Title
from .serializers import (
    JobPostPublicListSerializer,
    JobPostDetailSerializer,
    JobPostWriteSerializer,
    CandidateApplicationSerializer,
    RecruiterApplicantSerializer,
    ApplicationStatusUpdateSerializer,
)
from accounts.permissions import IsRecruiter, IsJobOwner, IsApplicationJobOwner


class StandardResultsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


# ==========================================
# PUBLIC CANDIDATE ENDPOINTS
# ==========================================

class PublicJobListView(generics.ListAPIView):
    """
    GET /api/jobs/
    List and search published active jobs.
    Supports search query (?search=), area (?area=), shift (?shift=),
    job_type (?job_type=), min_education (?education=), experience (?experience=),
    min_salary (?min_salary=), and sorting (?ordering=).
    """
    permission_classes = [AllowAny]
    serializer_class = JobPostPublicListSerializer
    pagination_class = StandardResultsPagination

    def get_queryset(self):
        queryset = JobPost.objects.filter(status=JobPost.Status.ACTIVE).select_related('recruiter')

        params = self.request.query_params

        # Free-text keyword search
        search_query = params.get('search', '').strip()
        if search_query:
            words = search_query.split()
            q_filter = Q()
            for word in words:
                q_filter |= (
                    Q(title__icontains=word)
                    | Q(company_name__icontains=word)
                    | Q(description__icontains=word)
                    | Q(area__icontains=word)
                    | Q(village__icontains=word)
                )
            queryset = queryset.filter(q_filter)

        # Structured filters
        area = params.get('area', '').strip()
        if area and area.lower() != 'all':
            queryset = queryset.filter(area__icontains=area)

        job_type = params.get('job_type', '').strip()
        if job_type and job_type.lower() != 'all':
            queryset = queryset.filter(job_type=job_type)

        shift = params.get('shift', '').strip()
        if shift and shift.lower() != 'all':
            queryset = queryset.filter(shift=shift)

        education = params.get('education', '').strip()
        if education and education.lower() != 'all':
            queryset = queryset.filter(min_education=education)

        experience = params.get('experience', '').strip()
        if experience and experience.lower() != 'all':
            queryset = queryset.filter(experience_required=experience)

        min_salary = params.get('min_salary', '').strip()
        if min_salary and min_salary.isdigit():
            queryset = queryset.filter(max_salary__gte=int(min_salary))

        # Ordering
        ordering = params.get('ordering', '-created_at')
        valid_orderings = ['-created_at', 'created_at', 'min_salary', '-min_salary', 'title']
        if ordering in valid_orderings:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-created_at')

        return queryset


class PublicJobDetailView(generics.RetrieveAPIView):
    """
    GET /api/jobs/{id}/
    Retrieve full details for an active job post, including related job suggestions.
    """
    permission_classes = [AllowAny]
    serializer_class = JobPostDetailSerializer
    queryset = JobPost.objects.filter(status=JobPost.Status.ACTIVE).select_related('recruiter')


class CandidateApplyView(APIView):
    """
    POST /api/jobs/{id}/apply/
    Public endpoint for candidates to apply to a specific active job post.
    """
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request, pk, *args, **kwargs):
        job_post = get_object_or_404(JobPost, pk=pk, status=JobPost.Status.ACTIVE)

        serializer = CandidateApplicationSerializer(data=request.data)
        if serializer.is_valid():
            mobile_number = serializer.validated_data['mobile_number']

            # Check if this mobile number already applied to this specific job recently (within 24 hours)
            recent_threshold = timezone.now() - timedelta(hours=24)
            duplicate_exists = Application.objects.filter(
                job_post=job_post,
                mobile_number=mobile_number,
                submitted_at__gte=recent_threshold
            ).exists()

            if duplicate_exists:
                return Response(
                    {
                        "success": False,
                        "error": {
                            "code": "DUPLICATE_APPLICATION",
                            "message": "You have already submitted an application for this job within the last 24 hours.",
                        },
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            application = serializer.save(job_post=job_post)

            return Response(
                {
                    "success": True,
                    "message": "Your application has been submitted successfully to the employer.",
                    "application_id": application.id,
                    "job_title": job_post.title,
                    "company_name": job_post.company_name,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Please correct the application form errors.",
                    "details": serializer.errors,
                },
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class FilterChoicesView(APIView):
    """
    GET /api/jobs/filters/
    Returns selectable options for areas, shifts, education, and job types.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        # Query distinct areas with active jobs
        distinct_areas = (
            JobPost.objects.filter(status=JobPost.Status.ACTIVE)
            .values_list('area', flat=True)
            .distinct()
        )
        areas = sorted(list(set(filter(None, distinct_areas))))

        # Fallback default prominent Chakan areas if database is sparse
        default_areas = [
            "Chakan MIDC Phase 1",
            "Chakan MIDC Phase 2",
            "Chakan MIDC Phase 3",
            "Chakan MIDC Phase 4",
            "Kuruli",
            "Nanekarwadi",
            "Mahalunge",
            "Kharabwadi",
            "Shinde Vasti",
            "Sara City",
            "Talegaon MIDC",
        ]
        combined_areas = sorted(list(set(default_areas + list(areas))))

        return Response({
            "areas": combined_areas,
            "job_types": [
                {"value": choice.value, "label": choice.label}
                for choice in JobPost.JobType
            ],
            "shifts": [
                {"value": choice.value, "label": choice.label}
                for choice in JobPost.ShiftType
            ],
            "education_levels": [
                {"value": choice.value, "label": choice.label}
                for choice in JobPost.EducationLevel
            ],
            "experience_levels": [
                {"value": choice.value, "label": choice.label}
                for choice in JobPost.ExperienceLevel
            ],
        })


# ==========================================
# RECRUITER MANAGEMENT ENDPOINTS
# ==========================================

class RecruiterJobListCreateView(generics.ListCreateAPIView):
    """
    GET /api/recruiter/jobs/
    Lists all job postings created by the authenticated recruiter.

    POST /api/recruiter/jobs/
    Creates a new job posting under the recruiter's company.
    """
    permission_classes = [IsAuthenticated, IsRecruiter]
    pagination_class = StandardResultsPagination

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobPostWriteSerializer
        return JobPostPublicListSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return JobPost.objects.all().order_by('-created_at')
        return JobPost.objects.filter(recruiter=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            job = serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "Job post published successfully.",
                    "job": JobPostDetailSerializer(job, context={'request': request}).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Invalid job posting data.",
                    "details": serializer.errors,
                },
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class RecruiterJobDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/recruiter/jobs/{id}/
    Retrieves full details for a recruiter's job post.

    PUT/PATCH /api/recruiter/jobs/{id}/
    Updates an authorized job post.

    DELETE /api/recruiter/jobs/{id}/
    Deletes an authorized job post.
    """
    permission_classes = [IsAuthenticated, IsRecruiter, IsJobOwner]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return JobPostWriteSerializer
        return JobPostDetailSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return JobPost.objects.all()
        return JobPost.objects.filter(recruiter=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            job = serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "Job post updated successfully.",
                    "job": JobPostDetailSerializer(job, context={'request': request}).data,
                }
            )
        return Response(
            {
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Invalid job update data.",
                    "details": serializer.errors,
                },
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {
                "success": True,
                "message": "Job post deleted successfully.",
            },
            status=status.HTTP_200_OK,
        )


class RecruiterJobApplicantsView(generics.ListAPIView):
    """
    GET /api/recruiter/jobs/{id}/applicants/
    Lists all candidate applications for a specific job post owned by the recruiter.
    """
    permission_classes = [IsAuthenticated, IsRecruiter]
    serializer_class = RecruiterApplicantSerializer
    pagination_class = StandardResultsPagination

    def get_queryset(self):
        job_id = self.kwargs.get('pk')
        # Enforce that the recruiter owns this job post
        if self.request.user.is_staff:
            job = get_object_or_404(JobPost, pk=job_id)
        else:
            job = get_object_or_404(JobPost, pk=job_id, recruiter=self.request.user)

        queryset = Application.objects.filter(job_post=job)

        status_filter = self.request.query_params.get('status')
        if status_filter and status_filter in Application.Status.values:
            queryset = queryset.filter(status=status_filter)

        return queryset.order_by('-submitted_at')


class RecruiterApplicationStatusView(APIView):
    """
    PATCH /api/recruiter/applications/{id}/status/
    Updates the candidate application status (Reviewing, Shortlisted, Rejected, Hired).
    """
    permission_classes = [IsAuthenticated, IsRecruiter, IsApplicationJobOwner]

    def patch(self, request, pk, *args, **kwargs):
        application = get_object_or_404(Application, pk=pk)
        self.check_object_permissions(request, application)

        serializer = ApplicationStatusUpdateSerializer(application, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": f"Application status updated to {application.get_status_display()}.",
                "status": application.status,
            })

        return Response(
            {
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Invalid status value.",
                    "details": serializer.errors,
                },
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class RecruiterDashboardSummaryView(APIView):
    """
    GET /api/recruiter/dashboard/summary/
    Returns summary statistics for the recruiter's active jobs, total applications,
    pending reviews, and the 5 most recent applicants.
    """
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request, *args, **kwargs):
        recruiter = request.user
        base_jobs = JobPost.objects.all() if recruiter.is_staff else JobPost.objects.filter(recruiter=recruiter)

        total_jobs = base_jobs.count()
        active_jobs = base_jobs.filter(status=JobPost.Status.ACTIVE).count()

        recruiter_job_ids = base_jobs.values_list('id', flat=True)
        all_applications = Application.objects.filter(job_post_id__in=recruiter_job_ids)

        total_applications = all_applications.count()
        pending_reviews = all_applications.filter(
            status__in=[Application.Status.SUBMITTED, Application.Status.REVIEWING]
        ).count()
        shortlisted_count = all_applications.filter(status=Application.Status.SHORTLISTED).count()

        recent_applications = all_applications.select_related('job_post').order_by('-submitted_at')[:5]

        return Response({
            "total_jobs": total_jobs,
            "active_jobs": active_jobs,
            "total_applications": total_applications,
            "pending_reviews": pending_reviews,
            "shortlisted_count": shortlisted_count,
            "recent_applications": RecruiterApplicantSerializer(recent_applications, many=True).data,
        })


# Legacy views compatibility (returns templates or redirect during transition)
def home(request):
    return render(request, 'job/home.html', {'posts': JobPost.objects.filter(status=JobPost.Status.ACTIVE)})

def post_detail(request, pk):
    post = get_object_or_404(JobPost, pk=pk)
    return render(request, 'job/post_detail.html', {'post': post, 'related_jobs': []})

def job_search(request):
    return render(request, 'job/search_job.html', {'posts': JobPost.objects.filter(status=JobPost.Status.ACTIVE)})

def apply_view(request, post_id):
    post = get_object_or_404(JobPost, pk=post_id)
    return render(request, 'job/apply.html', {'post': post})

def application_success(request):
    return render(request, 'job/application_success.html')