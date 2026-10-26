from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import JobPost, Application

User = get_user_model()


class JobModelTests(TestCase):
    def setUp(self):
        self.recruiter = User.objects.create_user(
            username='recruiter_bajaj',
            email='hr@bajajchakan.com',
            password='Password@123',
            role=User.Role.RECRUITER,
            company_name='Bajaj Auto Vendor',
            company_address='Plot A-12, MIDC Phase 2, Chakan',
            mobile_number='9890012345'
        )

    def test_create_job_post_with_numeric_salary(self):
        """Verify salary is properly stored as integers for accurate comparison queries."""
        job = JobPost.objects.create(
            recruiter=self.recruiter,
            title='CNC Machine Operator',
            description='Experienced CNC operator needed for 3 shifts in Chakan MIDC.',
            openings=5,
            min_salary=15000,
            max_salary=22000,
            job_type=JobPost.JobType.INDUSTRY,
            shift=JobPost.ShiftType.ROTATIONAL,
            min_education=JobPost.EducationLevel.ITI,
            experience_required=JobPost.ExperienceLevel.ONE_TO_TWO,
            area='Chakan MIDC Phase 2'
        )
        self.assertEqual(job.min_salary, 15000)
        self.assertEqual(job.max_salary, 22000)
        self.assertTrue(job.min_salary < job.max_salary)
        self.assertEqual(job.company_name, 'Bajaj Auto Vendor')
        self.assertEqual(job.status, JobPost.Status.ACTIVE)

    def test_candidate_application_submission(self):
        job = JobPost.objects.create(
            recruiter=self.recruiter,
            title='Quality Inspector',
            min_salary=18000,
            max_salary=25000,
            area='Chakan'
        )
        app = Application.objects.create(
            job_post=job,
            full_name='Rahul Patil',
            age=24,
            qualification='Diploma Mechanical',
            course_name='DME',
            mobile_number='9822011223',
            current_address='Chakan, Pune'
        )
        self.assertEqual(app.status, Application.Status.SUBMITTED)
        self.assertEqual(job.applications.count(), 1)
        self.assertEqual(job.applications.first().full_name, 'Rahul Patil')
