from django.urls import path
from django.contrib.auth import views as auth_views
from .views import hr_signup, hr_home , hr_login ,hr_logout ,hr_post ,TitleAutocomplete, hr_post_candidate , hr_post_company , success_page ,job_applications,job_applicants, delete_post

urlpatterns = [
    path('signup/', hr_signup, name='hr_signup'),
    path('login/', hr_login, name='hr_login'),
    path('logout/', hr_logout, name='hr_logout'),
    path('home/', hr_home, name='hr_home'),
    path('autocomplete/title/', TitleAutocomplete.as_view(), name='title-autocomplete'),
    path('job-post/', hr_post, name='hr_post'),  # Adjust as needed
    path('job-post-candidate/', hr_post_candidate, name='hr_post_candidate'),  # Adjust as needed
    path('job-post-company/', hr_post_company, name='hr_post_company'),  # Adjust as needed
    path('job-applications/', job_applications, name ="job_applications"),
    path('delete-post/<int:pk>/', delete_post, name="delete_post"),
    path('job-applicants/<int:post_id>/', job_applicants, name="job_applicants"),
    path('success-page/' , success_page , name='success_page'),
    
]
