from django.db import models
from hr.models import Post


# Create your models here.
from django.db import models

class Applications(models.Model):
    full_name = models.CharField( max_length=200 ,default="None")
    age = models.PositiveIntegerField("Age",default="None")
    qualification = models.CharField("Qualification", max_length=100,default="None")
    course_name = models.CharField(max_length=255,default="None")
    mobile_number = models.CharField("Mobile Number", max_length=15, default="None")
    current_address = models.TextField("Current Address",default="None")
    post = models.ForeignKey(
        'hr.Post',  # Correctly reference the Post model in hr app
        on_delete=models.CASCADE,
        related_name='applications', default=1
    )
    submitted_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} (Age: {self.age})"






class Review(models.Model):
    rating = models.IntegerField()
    message = models.CharField(max_length=255)

    def __str__(self):
        return f"self.message"





class FCMToken(models.Model):
    """Model to store FCM registration tokens."""
    token = models.CharField(max_length=255, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.token

    class Meta:
        ordering = ['-created_at']