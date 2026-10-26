from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import JobPost, Application

User = get_user_model()


class JobCoreAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create two distinct verified recruiters to test isolation
        self.recruiter_1 = User.objects.create_user(
            username='recruiter_bajaj',
            email='bajaj@chakanjobs.com',
            password='Password@123',
            role=User.Role.RECRUITER,
            company_name='Bajaj Auto Vendor',
            mobile_number='9890011111',
            is_verified=True
        )
        self.token_1 = Token.objects.create(user=self.recruiter_1)

        self.recruiter_2 = User.objects.create_user(
            username='recruiter_mahindra',
            email='mahindra@chakanjobs.com',
            password='Password@123',
            role=User.Role.RECRUITER,
            company_name='Mahindra Supplier',
            mobile_number='9890022222',
            is_verified=True
        )
        self.token_2 = Token.objects.create(user=self.recruiter_2)

        # Create unverified recruiter to test verification gating
        self.unverified_recruiter = User.objects.create_user(
            username='recruiter_pending',
            email='pending@chakanjobs.com',
            password='Password@123',
            role=User.Role.RECRUITER,
            company_name='Pending Startup',
            mobile_number='9890033333',
            is_verified=False
        )
        self.token_unverified = Token.objects.create(user=self.unverified_recruiter)

        # Create sample job posts
        self.job_1 = JobPost.objects.create(
            recruiter=self.recruiter_1,
            title='CNC Machine Operator',
            description='Operating CNC lathe machines in Chakan MIDC Phase 2.',
            openings=5,
            min_salary=18000,
            max_salary=24000,
            job_type=JobPost.JobType.INDUSTRY,
            shift=JobPost.ShiftType.ROTATIONAL,
            min_education=JobPost.EducationLevel.ITI,
            experience_required=JobPost.ExperienceLevel.ONE_TO_TWO,
            area='Chakan MIDC Phase 2',
            status=JobPost.Status.ACTIVE
        )

        self.job_2 = JobPost.objects.create(
            recruiter=self.recruiter_2,
            title='Quality Control Inspector',
            description='Quality inspection of sheet metal auto parts.',
            openings=2,
            min_salary=20000,
            max_salary=28000,
            job_type=JobPost.JobType.INDUSTRY,
            shift=JobPost.ShiftType.DAY,
            min_education=JobPost.EducationLevel.DIPLOMA,
            experience_required=JobPost.ExperienceLevel.THREE_TO_FIVE,
            area='Nanekarwadi',
            status=JobPost.Status.ACTIVE
        )

    # ----------------------------------------------------
    # Public Candidate API Tests
    # ----------------------------------------------------

    def test_public_job_list_and_search(self):
        response = self.client.get('/api/jobs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 2)

        # Search by keyword
        search_resp = self.client.get('/api/jobs/?search=CNC')
        self.assertEqual(len(search_resp.data['results']), 1)
        self.assertEqual(search_resp.data['results'][0]['title'], 'CNC Machine Operator')

        # Filter by area
        area_resp = self.client.get('/api/jobs/?area=Nanekarwadi')
        self.assertEqual(len(area_resp.data['results']), 1)
        self.assertEqual(area_resp.data['results'][0]['title'], 'Quality Control Inspector')

        # Filter by salary
        salary_resp = self.client.get('/api/jobs/?min_salary=25000')
        self.assertEqual(len(salary_resp.data['results']), 1)
        self.assertEqual(salary_resp.data['results'][0]['company_name'], 'Mahindra Supplier')

    def test_public_job_detail_with_related_jobs(self):
        response = self.client.get(f'/api/jobs/{self.job_1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'CNC Machine Operator')
        self.assertIn('related_jobs', response.data)

    def test_public_filter_choices(self):
        response = self.client.get('/api/jobs/filters/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('areas', response.data)
        self.assertIn('shifts', response.data)
        self.assertIn('education_levels', response.data)

    def test_candidate_apply_success(self):
        payload = {
            'full_name': 'Santosh Shinde',
            'age': 23,
            'qualification': 'ITI Machinist',
            'course_name': 'Machinist Trade',
            'mobile_number': '9811223344',
            'current_address': 'Kuruli, Chakan',
        }
        response = self.client.post(f'/api/jobs/{self.job_1.id}/apply/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(self.job_1.applications.count(), 1)

    def test_candidate_apply_duplicate_rejection(self):
        payload = {
            'full_name': 'Santosh Shinde',
            'age': 23,
            'qualification': 'ITI Machinist',
            'mobile_number': '9811223344',
            'current_address': 'Kuruli, Chakan',
        }
        # First application succeeds
        first_resp = self.client.post(f'/api/jobs/{self.job_1.id}/apply/', payload, format='json')
        self.assertEqual(first_resp.status_code, status.HTTP_201_CREATED)

        # Immediate repeat application rejected as duplicate
        dup_resp = self.client.post(f'/api/jobs/{self.job_1.id}/apply/', payload, format='json')
        self.assertEqual(dup_resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(dup_resp.data['error']['code'], 'DUPLICATE_APPLICATION')

    def test_candidate_apply_validation_errors(self):
        payload = {
            'full_name': 'A',  # Too short
            'age': 16,  # Underage (< 18)
            'qualification': '',
            'mobile_number': '123',  # Invalid phone
            'current_address': '',
        }
        response = self.client.post(f'/api/jobs/{self.job_1.id}/apply/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('full_name', response.data['error']['details'])
        self.assertIn('age', response.data['error']['details'])
        self.assertIn('mobile_number', response.data['error']['details'])

    def test_candidate_apply_with_valid_resume_upload(self):
        resume_file = SimpleUploadedFile(
            'rahul_patil_cv.pdf',
            b'%PDF-1.4 sample pdf content for resume',
            content_type='application/pdf'
        )
        payload = {
            'full_name': 'Rahul Patil',
            'age': 24,
            'qualification': 'Diploma Mechanical',
            'course_name': 'Production Engineering',
            'mobile_number': '9822334455',
            'current_address': 'MIDC Phase 1, Chakan',
            'resume_file': resume_file,
        }
        response = self.client.post(
            f'/api/jobs/{self.job_1.id}/apply/',
            payload,
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])

        app = Application.objects.get(mobile_number='9822334455')
        self.assertTrue(bool(app.resume_file))
        self.assertIn('rahul_patil_cv', app.resume_file.name)

        # Recruiter viewing applicant should receive resume_url
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token_1.key}')
        recruiter_resp = self.client.get(f'/api/recruiter/jobs/{self.job_1.id}/applicants/')
        self.assertEqual(recruiter_resp.status_code, status.HTTP_200_OK)
        first_applicant = recruiter_resp.data['results'][0]
        self.assertIsNotNone(first_applicant['resume_url'])
        self.assertIn('rahul_patil_cv', first_applicant['resume_url'])

    def test_candidate_apply_with_invalid_file_extension(self):
        bad_file = SimpleUploadedFile(
            'virus_script.exe',
            b'MZ binary content',
            content_type='application/octet-stream'
        )
        payload = {
            'full_name': 'Test Candidate',
            'age': 22,
            'qualification': '12th Pass',
            'mobile_number': '9833445566',
            'current_address': 'Nanekarwadi, Chakan',
            'resume_file': bad_file,
        }
        response = self.client.post(
            f'/api/jobs/{self.job_1.id}/apply/',
            payload,
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('resume_file', response.data['error']['details'])

    def test_candidate_apply_with_oversized_file(self):
        # 6MB file (exceeds 5MB limit)
        oversized = SimpleUploadedFile(
            'huge_portfolio.pdf',
            b'x' * (6 * 1024 * 1024),
            content_type='application/pdf'
        )
        payload = {
            'full_name': 'Test Candidate 2',
            'age': 25,
            'qualification': 'BE Mechanical',
            'mobile_number': '9844556677',
            'current_address': 'Chakan Market Yard',
            'resume_file': oversized,
        }
        response = self.client.post(
            f'/api/jobs/{self.job_1.id}/apply/',
            payload,
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('resume_file', response.data['error']['details'])

    # ----------------------------------------------------
    # Recruiter Job Management & Isolation Tests
    # ----------------------------------------------------

    def test_recruiter_can_post_job(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token_1.key}')
        payload = {
            'title': 'Tool & Die Maker',
            'description': 'Experienced tool maker for progressive press dies.',
            'openings': 3,
            'min_salary': 22000,
            'max_salary': 30000,
            'job_type': 'INDUSTRY',
            'shift': 'DAY',
            'min_education': 'DIPLOMA',
            'experience_required': '3_5_YEARS',
            'area': 'Chakan MIDC Phase 3',
        }
        response = self.client.post('/api/recruiter/jobs/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['job']['title'], 'Tool & Die Maker')
        self.assertEqual(response.data['job']['company_name'], 'Bajaj Auto Vendor')

    def test_recruiter_salary_validation_min_greater_than_max(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token_1.key}')
        payload = {
            'title': 'Helper',
            'openings': 2,
            'min_salary': 25000,
            'max_salary': 15000,  # Invalid: min > max
            'area': 'Chakan',
        }
        response = self.client.post('/api/recruiter/jobs/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('max_salary', response.data['error']['details'])

    def test_recruiter_cannot_access_or_edit_another_recruiters_job(self):
        """Security isolation: Recruiter 2 cannot view or edit Recruiter 1's job."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token_2.key}')

        # Recruiter 2 tries to GET Recruiter 1's job
        get_resp = self.client.get(f'/api/recruiter/jobs/{self.job_1.id}/')
        self.assertEqual(get_resp.status_code, status.HTTP_404_NOT_FOUND)

        # Recruiter 2 tries to PATCH Recruiter 1's job
        patch_resp = self.client.patch(
            f'/api/recruiter/jobs/{self.job_1.id}/',
            {'title': 'Hacked Title'},
            format='json'
        )
        self.assertEqual(patch_resp.status_code, status.HTTP_404_NOT_FOUND)

        # Recruiter 2 tries to DELETE Recruiter 1's job
        del_resp = self.client.delete(f'/api/recruiter/jobs/{self.job_1.id}/')
        self.assertEqual(del_resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_recruiter_cannot_view_another_recruiters_applicants(self):
        """Security isolation: Recruiter 2 cannot see applicants for Recruiter 1's job."""
        Application.objects.create(
            job_post=self.job_1,
            full_name='Confidential Candidate',
            age=25,
            qualification='B.E. Mechanical',
            mobile_number='9800112233',
            current_address='Chakan'
        )

        # Recruiter 2 queries applicants for job 1
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token_2.key}')
        response = self.client.get(f'/api/recruiter/jobs/{self.job_1.id}/applicants/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Recruiter 1 queries applicants for job 1 -> succeeds
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token_1.key}')
        recruiter_1_resp = self.client.get(f'/api/recruiter/jobs/{self.job_1.id}/applicants/')
        self.assertEqual(recruiter_1_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(recruiter_1_resp.data['results']), 1)
        self.assertEqual(recruiter_1_resp.data['results'][0]['full_name'], 'Confidential Candidate')

    def test_recruiter_can_update_application_status(self):
        app = Application.objects.create(
            job_post=self.job_1,
            full_name='Pooja Jadhav',
            age=24,
            qualification='Diploma Electrical',
            mobile_number='9765432100',
            current_address='Talegaon'
        )
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token_1.key}')
        status_resp = self.client.patch(
            f'/api/recruiter/applications/{app.id}/status/',
            {'status': 'SHORTLISTED'},
            format='json'
        )
        self.assertEqual(status_resp.status_code, status.HTTP_200_OK)
        app.refresh_from_db()
        self.assertEqual(app.status, Application.Status.SHORTLISTED)

    def test_recruiter_dashboard_summary(self):
        Application.objects.create(
            job_post=self.job_1,
            full_name='Ajay More',
            age=26,
            qualification='ITI Welder',
            mobile_number='9871122334',
            current_address='Chakan'
        )
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token_1.key}')
        response = self.client.get('/api/recruiter/dashboard/summary/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['active_jobs'], 1)
        self.assertEqual(response.data['total_applications'], 1)
        self.assertEqual(response.data['pending_reviews'], 1)
        self.assertEqual(len(response.data['recent_applications']), 1)

    def test_unverified_recruiter_blocked_from_posting_job_and_viewing_applicants(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token_unverified.key}')

        # 1. Blocked from creating jobs
        post_resp = self.client.post(
            '/api/recruiter/jobs/',
            {'title': 'Unverified Job', 'openings': 1, 'min_salary': 15000, 'max_salary': 20000},
            format='json'
        )
        self.assertEqual(post_resp.status_code, status.HTTP_403_FORBIDDEN)

        # 2. Blocked from viewing applicants
        applicants_resp = self.client.get(f'/api/recruiter/jobs/{self.job_1.id}/applicants/')
        self.assertEqual(applicants_resp.status_code, status.HTTP_403_FORBIDDEN)

