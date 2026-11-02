from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User

# Custom Admin Panel Branding
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
                'company_logo',
                'company_address',
                'position',
                'company_type',
                'qualification',
                'current_address',
                'resume',
            )
        }),
    )
    list_display = (
        'username',
        'email',
        'role_badge',
        'company_name',
        'mobile_number',
        'verification_badge',
        'is_active',
        'is_staff'
    )
    list_filter = ('is_verified', 'role', 'is_active', 'is_staff')
    search_fields = ('username', 'email', 'company_name', 'mobile_number')

    @admin.display(description="Role", ordering="role")
    def role_badge(self, obj):
        if obj.role == 'RECRUITER':
            return format_html(
                '<span style="background: #0A0733; color: #EFB817; padding: 4px 10px; border-radius: 999px; font-weight: 700; font-size: 11px; letter-spacing: 0.04em; display: inline-flex; align-items: center; gap: 4px;">🏢 RECRUITER</span>'
            )
        elif obj.role == 'CANDIDATE':
            return format_html(
                '<span style="background: #E8ECE9; color: #0A0733; padding: 4px 10px; border-radius: 999px; font-weight: 700; font-size: 11px; letter-spacing: 0.04em; display: inline-flex; align-items: center; gap: 4px;">👤 CANDIDATE</span>'
            )
        elif obj.role == 'ADMIN':
            return format_html(
                '<span style="background: #413E57; color: #FFFFFF; padding: 4px 10px; border-radius: 999px; font-weight: 700; font-size: 11px; letter-spacing: 0.04em; display: inline-flex; align-items: center; gap: 4px;">⚡ ADMIN</span>'
            )
        return obj.role

    @admin.display(description="Verification", ordering="is_verified")
    def verification_badge(self, obj):
        if obj.is_verified:
            return format_html(
                '<span style="background: #EAF6EF; color: #237A52; border: 1px solid #A6E2BE; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;">✔ VERIFIED</span>'
            )
        return format_html(
            '<span style="background: #FFF5D9; color: #8A5A00; border: 1px solid #FFE699; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;">⏳ PENDING</span>'
        )


