from rest_framework import permissions
from .models import User


class IsRecruiter(permissions.BasePermission):
    """
    Allows access only to authenticated users with RECRUITER or ADMIN role.
    """
    message = "Access restricted to authenticated recruiters and administrators."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_active
            and (request.user.role == User.Role.RECRUITER or request.user.is_staff)
        )


class IsVerifiedRecruiter(permissions.BasePermission):
    """
    Allows access only to VERIFIED recruiters or administrators.
    Unverified recruiters are blocked from creating jobs, updating jobs, or viewing candidate data.
    """
    message = "Your recruiter account is pending administrator verification. You cannot post vacancies or view applicants until approved."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated and request.user.is_active):
            return False
        if request.user.is_staff:
            return True
        return bool(request.user.role == User.Role.RECRUITER and request.user.is_verified)


class IsJobOwner(permissions.BasePermission):
    """
    Object-level permission allowing only the recruiter who created the job post
    (or an administrator) to modify or delete it.
    """
    message = "You do not have permission to manage this job posting."

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return hasattr(obj, 'recruiter') and obj.recruiter == request.user


class IsApplicationJobOwner(permissions.BasePermission):
    """
    Object-level permission allowing only the recruiter who owns the linked job post
    to view and update candidate applications for that post.
    """
    message = "You do not have permission to view or manage applicants for this job post."

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        if hasattr(obj, 'job_post') and hasattr(obj.job_post, 'recruiter'):
            return obj.job_post.recruiter == request.user
        return False
