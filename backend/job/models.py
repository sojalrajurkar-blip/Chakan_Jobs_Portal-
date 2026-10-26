from django.db import models
from django.conf import settings


class Title(models.Model):
    title = models.CharField(max_length=255, unique=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title


class JobPost(models.Model):
    class JobType(models.TextChoices):
        INDUSTRY = 'INDUSTRY', 'Industry Job'
        OFFICE = 'OFFICE', 'Office Job'
        FIELD = 'FIELD', 'Field Job'
        WFH = 'WFH', 'Work From Home'

    class ShiftType(models.TextChoices):
        DAY = 'DAY', 'Day Shift'
        NIGHT = 'NIGHT', 'Night Shift'
        ROTATIONAL = 'ROTATIONAL', 'Rotational Shift'
        ANY = 'ANY', 'Any Shift'

    class EducationLevel(models.TextChoices):
        BELOW_10TH = 'BELOW_10TH', 'Below 10th'
        TENTH = '10TH', '10th Pass'
        TWELFTH = '12TH', '12th Pass'
        ITI = 'ITI', 'ITI'
        DIPLOMA = 'DIPLOMA', 'Diploma'
        GRADUATION = 'GRADUATION', 'Graduate / BE / B.Tech'
        POST_GRADUATION = 'POST_GRADUATION', 'Post Graduate'

    class ExperienceLevel(models.TextChoices):
        FRESHER = 'FRESHER', 'Fresher'
        ONE_TO_TWO = '1_2_YEARS', '1-2 Years'
        THREE_TO_FIVE = '3_5_YEARS', '3-5 Years'
        FIVE_TO_TEN = '5_10_YEARS', '5-10 Years'
        TEN_PLUS = '10_PLUS_YEARS', '10+ Years'

    class GenderPreference(models.TextChoices):
        MALE = 'MALE', 'Male'
        FEMALE = 'FEMALE', 'Female'
        ANY = 'ANY', 'Any Gender'

    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        CLOSED = 'CLOSED', 'Closed'
        DRAFT = 'DRAFT', 'Draft'

    recruiter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='job_posts'
    )
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, default='')
    openings = models.PositiveIntegerField(default=1)

    # Numerical compensation fields for reliable SQL range queries
    min_salary = models.PositiveIntegerField(default=0)
    max_salary = models.PositiveIntegerField(default=0)
    charges_applicable = models.BooleanField(default=False)

    # Job Specifications
    job_type = models.CharField(max_length=50, choices=JobType.choices, default=JobType.INDUSTRY)
    shift = models.CharField(max_length=50, choices=ShiftType.choices, default=ShiftType.DAY)
    min_education = models.CharField(max_length=50, choices=EducationLevel.choices, default=EducationLevel.TENTH)
    course_required = models.CharField(max_length=255, blank=True, default='')
    experience_required = models.CharField(max_length=50, choices=ExperienceLevel.choices, default=ExperienceLevel.FRESHER)
    gender_preference = models.CharField(max_length=20, choices=GenderPreference.choices, default=GenderPreference.ANY)
    facilities = models.CharField(max_length=255, blank=True, default='Bus, Canteen')

    # Location Focus
    area = models.CharField(max_length=255, default='Chakan MIDC', db_index=True)
    village = models.CharField(max_length=255, blank=True, default='')
    company_name = models.CharField(max_length=255, blank=True, default='')
    company_address = models.TextField(blank=True, default='')
    bus_route = models.TextField(blank=True, default='')

    # Recruiter Contact Preferences
    calling_number = models.CharField(max_length=20, blank=True, default='')
    whatsapp_number = models.CharField(max_length=20, blank=True, default='')
    email = models.EmailField(blank=True, default='')

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        company = self.company_name or (self.recruiter.company_name if self.recruiter else '')
        return f"{self.title} at {company} ({self.area})"

    def save(self, *args, **kwargs):
        # Auto-populate company_name and contact info from recruiter if not explicitly provided
        if self.recruiter and not self.company_name:
            self.company_name = self.recruiter.company_name
        if self.recruiter and not self.company_address:
            self.company_address = self.recruiter.company_address
        if self.recruiter and not self.email:
            self.email = self.recruiter.email
        if self.recruiter and not self.calling_number:
            self.calling_number = self.recruiter.mobile_number
        super().save(*args, **kwargs)


class Application(models.Model):
    class Status(models.TextChoices):
        SUBMITTED = 'SUBMITTED', 'Submitted'
        REVIEWING = 'REVIEWING', 'In Review'
        SHORTLISTED = 'SHORTLISTED', 'Shortlisted'
        REJECTED = 'REJECTED', 'Rejected'
        HIRED = 'HIRED', 'Hired'

    job_post = models.ForeignKey(
        JobPost,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='candidate_applications'
    )
    full_name = models.CharField(max_length=255)
    age = models.PositiveSmallIntegerField()
    qualification = models.CharField(max_length=100)
    course_name = models.CharField(max_length=255, blank=True, default='')
    mobile_number = models.CharField(max_length=15)
    current_address = models.TextField()
    resume_file = models.FileField(upload_to='resumes/%Y/%m/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUBMITTED)
    submitted_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['job_post', 'submitted_at']),
            models.Index(fields=['mobile_number']),
            models.Index(fields=['candidate', 'submitted_at']),
        ]

    def __str__(self):
        return f"{self.full_name} -> {self.job_post.title}"


class Review(models.Model):
    rating = models.IntegerField(default=5)
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating: {self.rating} - {self.message[:30]}"


class FCMToken(models.Model):
    token = models.CharField(max_length=255, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.token


# Backward compatibility aliases for legacy templates and views
Applications = Application
Post = JobPost