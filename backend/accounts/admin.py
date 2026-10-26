from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

# Custom Admin Panel Branding (as requested: "Admin Panel")
admin.site.site_header = "Chakan Jobs — Admin Panel"
admin.site.site_title = "Admin Panel"
admin.site.index_title = "Chakan Jobs Portal Administration"


@admin.action(description="✓ Verify selected recruiters (Grant posting & applicant access)")
def verify_recruiters(modeladmin, request, queryset):
    updated = queryset.update(is_verified=True)
    modeladmin.message_user(request, f"Successfully verified {updated} recruiter account(s).")


@admin.action(description="✕ Revoke verification for selected recruiters")
def unverify_recruiters(modeladmin, request, queryset):
    updated = queryset.update(is_verified=False)
    modeladmin.message_user(request, f"Revoked verification for {updated} recruiter account(s).")


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    actions = [verify_recruiters, unverify_recruiters]
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Portal Profile & Verification', {
            'fields': (
                'role',
                'is_verified',
                'mobile_number',
                'company_name',
                'company_address',
                'position',
                'company_type',
            )
        }),
    )
    list_display = (
        'username',
        'email',
        'role',
        'company_name',
        'mobile_number',
        'is_verified',
        'is_active',
        'is_staff'
    )
    list_filter = ('is_verified', 'role', 'is_active', 'is_staff')
    search_fields = ('username', 'email', 'company_name', 'mobile_number')

