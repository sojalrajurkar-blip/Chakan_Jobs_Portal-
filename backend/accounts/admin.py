from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Portal Profile', {
            'fields': (
                'role',
                'mobile_number',
                'company_name',
                'company_address',
                'position',
                'company_type',
                'is_verified',
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
    list_filter = ('role', 'is_verified', 'is_active', 'is_staff')
    search_fields = ('username', 'email', 'company_name', 'mobile_number')
