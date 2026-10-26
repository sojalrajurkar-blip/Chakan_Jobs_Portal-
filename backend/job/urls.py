from django.urls import path
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView
from .views import home , post_detail ,job_search,apply_view , application_success

urlpatterns = [
    path('', home, name='home'),
    path('post/<int:pk>/', post_detail, name='post_detail'),
    path('search-jobs/', job_search, name='job_search'),  
    path('apply/<int:post_id>/', apply_view, name='apply'),
    path('success/', application_success, name='application_success'),
    # path('save-fcm-token/', save_fcm_token, name='save_fcm_token'),

    # path('firebase-messaging-sw.js', TemplateView.as_view(
    #     template_name="firebase-messaging-sw.js",
    #     content_type='application/javascript'
    # ), name='firebase-messaging-sw'),
]