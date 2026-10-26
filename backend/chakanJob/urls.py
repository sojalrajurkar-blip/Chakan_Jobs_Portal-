
from django.contrib import admin
from django.urls import path,include
from .views import ads_txt

urlpatterns = [
    path('admin/', admin.site.urls),
    path('hr/', include('hr.urls')),
    path('', include('job.urls')),
    path('ads.txt', ads_txt),
]
