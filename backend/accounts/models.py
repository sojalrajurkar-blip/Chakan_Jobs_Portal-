from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        RECRUITER = 'RECRUITER', 'Recruiter'
        CANDIDATE = 'CANDIDATE', 'Candidate'
        ADMIN = 'ADMIN', 'Administrator'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.RECRUITER
    )
    mobile_number = models.CharField(
        max_length=15,
        blank=True,
        default='',
        help_text="Primary 10-digit mobile contact number"
    )
    company_name = models.CharField(
        max_length=255,
        blank=True,
        default='',
        help_text="Company / Employer name for recruiters"
    )
    company_address = models.TextField(
        blank=True,
        default=''
    )
    position = models.CharField(
        max_length=100,
        blank=True,
        default='',
        help_text="Role / Designation in company (e.g. HR Manager)"
    )
    company_type = models.CharField(
        max_length=100,
        blank=True,
        default=''
    )
    is_verified = models.BooleanField(
        default=False,
        help_text="Whether this account has been verified by portal administration"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.username} ({self.get_role_display()} - {self.company_name or self.email})"
