from django.contrib import admin
from .models import JobPost, Application, Title, Review, FCMToken


@admin.register(JobPost)
class JobPostAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'company_name',
        'area',
        'job_type',
        'shift',
        'min_salary',
        'max_salary',
        'status',
        'created_at'
    )
    list_filter = ('status', 'job_type', 'shift', 'min_education', 'experience_required', 'area')
    search_fields = ('title', 'company_name', 'area', 'description')
    ordering = ('-created_at',)


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        'full_name',
        'job_post',
        'mobile_number',
        'qualification',
        'age',
        'status',
        'submitted_at'
    )
    list_filter = ('status', 'submitted_at')
    search_fields = ('full_name', 'mobile_number', 'job_post__title', 'job_post__company_name')
    ordering = ('-submitted_at',)


@admin.register(Title)
class TitleAdmin(admin.ModelAdmin):
    list_display = ('title',)
    search_fields = ('title',)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('rating', 'message', 'created_at')


@admin.register(FCMToken)
class FCMTokenAdmin(admin.ModelAdmin):
    list_display = ('token', 'created_at')