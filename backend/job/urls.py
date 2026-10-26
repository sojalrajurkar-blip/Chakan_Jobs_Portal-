from django.urls import path
from .views import (
    PublicJobListView,
    PublicJobDetailView,
    CandidateApplyView,
    CandidateMyApplicationsListView,
    FilterChoicesView,
    RecruiterJobListCreateView,
    RecruiterJobDetailView,
    RecruiterJobApplicantsView,
    RecruiterApplicationStatusView,
    RecruiterDashboardSummaryView,
    # Legacy views
    home,
    post_detail,
    job_search,
    apply_view,
    application_success,
)

urlpatterns = [
    # Public REST API Endpoints
    path('api/jobs/', PublicJobListView.as_view(), name='api_job_list'),
    path('api/jobs/filters/', FilterChoicesView.as_view(), name='api_job_filters'),
    path('api/jobs/<int:pk>/', PublicJobDetailView.as_view(), name='api_job_detail'),
    path('api/jobs/<int:pk>/apply/', CandidateApplyView.as_view(), name='api_candidate_apply'),

    # Candidate Application Tracking
    path('api/candidate/applications/', CandidateMyApplicationsListView.as_view(), name='api_candidate_applications'),

    # Recruiter Management REST API Endpoints
    path('api/recruiter/jobs/', RecruiterJobListCreateView.as_view(), name='api_recruiter_jobs'),
    path('api/recruiter/jobs/<int:pk>/', RecruiterJobDetailView.as_view(), name='api_recruiter_job_detail'),
    path('api/recruiter/jobs/<int:pk>/applicants/', RecruiterJobApplicantsView.as_view(), name='api_recruiter_job_applicants'),
    path('api/recruiter/applications/<int:pk>/status/', RecruiterApplicationStatusView.as_view(), name='api_recruiter_application_status'),
    path('api/recruiter/dashboard/summary/', RecruiterDashboardSummaryView.as_view(), name='api_recruiter_dashboard_summary'),

    # Legacy template URLs (kept for backward compatibility during React transition)
    path('', home, name='home'),
    path('post/<int:pk>/', post_detail, name='post_detail'),
    path('search-jobs/', job_search, name='job_search'),
    path('apply/<int:post_id>/', apply_view, name='apply'),
    path('success/', application_success, name='application_success'),
]