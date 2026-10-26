from django.db import models

# Create your models here.


class HrUser(models.Model):
    full_name = models.CharField(('full name'), max_length=255)
    email = models.EmailField(('email address'), unique=True)
    mobile_number = models.CharField(('mobile number'), max_length=15)
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    position = models.CharField(('position'), max_length=100)
    company_name = models.CharField(('company name'), max_length=255)
    company_address = models.TextField(('company address'))
    
    def __str__(self):
        return self.email



class Title(models.Model):
    title = models.CharField(('title'), max_length=255)
    def __str__(self):
        return self.title

class Post(models.Model):
    JOB_TYPES = [
        ('field', 'Field Job'),
        ('office', 'Office Job'),
        ('wfh', 'Work From Home'),
        ('industry', 'Industry Job'),
    ]

    # EDUCATION_CHOICES = [
    #     ('10th', '10th'),
    #     ('12th', '12th'),
    #     ('diploma', 'Diploma/ITI'),
    #     ('graduate', 'Graduate'),
    #     ('post_graduate', 'Post Graduate'),
    #     ('none', 'Not Required'),
    # ]

    # EXPERIENCE_CHOICES = [
    #     ('less_than_1', 'Less than 1 year'),
    #     ('1_3', '1-3 Years'),
    #     ('3_5', '3-5 Years'),
    #     ('5_10', '5-10 Years'),
    #     ('10_plus', '10+ Years'),
    #     ('any', 'Any Experience'),
    # ]

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('any', 'Any Gender'),
    ]

    SHIFT_CHOICES = [
        ('day', 'Day Shift'),
        ('night', 'Night Shift'),
        ('any', 'Any Shift'),
    ]


    EDUCATION_CHOICES = [
        ('10th', '10th'),
        ('12th', '12th'),
        ('Engineering', 'Engineering'),
        ('ITI', 'ITI'),
        ('Diploma', 'Diploma'),
        ('Graduation', 'Graduation'),
        ('Uneducated', 'Uneducated'),
    ]

    EXPERIENCE_CHOICES = [
        ('Fresher', 'Fresher'),
        ('1-2 Years', '1-2 Years'),
        ('3-5 Years', '3-5 Years'),
        ('5-10 Years', '5-10 Years'),
        ('10+ Years', '10+ Years'),
    ]

    MANAGE_DATA = [
        ('Calls', 'Calls'),
        ('WhatsApp', 'WhatsApp'),
        ('Apply', 'Apply'),
        ('Email', 'Email'),
    ]


    # First group
    hr_user = models.ForeignKey(HrUser,on_delete=models.CASCADE,related_name='posts',default=1)
    job_title = models.CharField(max_length=255, default="N/A")
    job_description = models.TextField(blank=True, default="")
    number_of_openings = models.PositiveIntegerField(default=1)
    min_salary = models.PositiveIntegerField( default=8000)
    max_salary = models.PositiveIntegerField( default=12000)
    shifts = models.CharField(
        max_length=255, default='three'
    )
    job_type = models.CharField(
        max_length=255, choices=JOB_TYPES, default='Field Job'
    )
    charges = models.BooleanField(default=False)
    facilities = models.CharField(max_length=255, default='Not specified')

    # Second group
    min_education = models.CharField(
        max_length=255,  default='10th'
    )
    course_name = models.CharField(max_length=255, default="any")
    experience = models.CharField(
        max_length=255, choices=EXPERIENCE_CHOICES, default='fresher'
    )
    gender = models.CharField(
        max_length=255, choices=GENDER_CHOICES, default='male'
    )
    manage_through = models.CharField(
        max_length=255, default='apply'
    )
    calling_number = models.CharField(max_length=255, default="")
    whatsapp_number = models.CharField(max_length=255, default="")
    email = models.EmailField(default="")
    terms_accepted = models.BooleanField(default=True)


    # Company group
    company_type = models.CharField(max_length=255, default="")
    company_name = models.CharField(max_length=255, default="")
    company_address = models.TextField(default="")
    company_size = models.CharField(max_length=50, default="")
    bus_route = models.TextField(default="", blank=True, null=True)
    area = models.CharField(max_length=255, default="chakan")
    village = models.CharField(max_length=255, default="")
    
    
    # education_required = models.CharField(max_length=20, choices=EDUCATION_CHOICES)
    # experience_required = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES)
    # preferred_gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    # skills_required = models.TextField(blank=True)
    # candidate_management = models.CharField(max_length=100)
    # terms_agreed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"






