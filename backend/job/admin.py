from django.contrib import admin
from django.utils.html import format_html
from .models import JobPost, Application, Title, Review, FCMToken


@admin.register(JobPost)
class JobPostAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'company_name',
        'area',
        'job_type',
        'shift',
        'salary_display',
        'status_badge',
        'created_at'
    )
    list_filter = ('status', 'job_type', 'shift', 'min_education', 'experience_required', 'area')
    search_fields = ('title', 'company_name', 'area', 'description')
    ordering = ('-created_at',)

    @admin.display(description="Salary Range", ordering="min_salary")
    def salary_display(self, obj):
        return format_html(
            '<span style="font-weight: 600; color: #0A0733;">₹{:,.0f} - ₹{:,.0f}</span>',
            obj.min_salary, obj.max_salary
        )

    @admin.display(description="Status", ordering="status")
    def status_badge(self, obj):
        colors = {
            'ACTIVE': ('#EAF6EF', '#237A52', '#A6E2BE', '🟢 ACTIVE'),
            'PAUSED': ('#FFF5D9', '#8A5A00', '#FFE699', '⏸ PAUSED'),
            'CLOSED': ('#FEF0EE', '#B42318', '#FECDCA', '🔴 CLOSED'),
        }
        bg, fg, border, label = colors.get(obj.status, ('#EEF2EF', '#5F6070', '#DDE1E3', obj.status))
        return format_html(
            '<span style="background: {}; color: {}; border: 1px solid {}; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;">{}</span>',
            bg, fg, border, label
        )


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        'full_name',
        'job_post',
        'mobile_number',
        'qualification',
        'age',
        'status_badge',
        'submitted_at'
    )
    list_filter = ('status', 'submitted_at')
    search_fields = ('full_name', 'mobile_number', 'job_post__title', 'job_post__company_name')
    ordering = ('-submitted_at',)

    @admin.display(description="Status", ordering="status")
    def status_badge(self, obj):
        colors = {
            'SUBMITTED': ('#EEF5FF', '#245EA8', '#BBD7FC', '📥 SUBMITTED'),
            'REVIEWING': ('#FFF5D9', '#8A5A00', '#FFE699', '🔍 UNDER REVIEW'),
            'SHORTLISTED': ('#E8ECE9', '#0A0733', '#C5D0C9', '⭐ SHORTLISTED'),
            'HIRED': ('#EAF6EF', '#237A52', '#A6E2BE', '🎉 HIRED'),
            'REJECTED': ('#FEF0EE', '#B42318', '#FECDCA', '✖ REJECTED'),
        }
        bg, fg, border, label = colors.get(obj.status, ('#EEF2EF', '#5F6070', '#DDE1E3', obj.status))
        return format_html(
            '<span style="background: {}; color: {}; border: 1px solid {}; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;">{}</span>',
            bg, fg, border, label
        )



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