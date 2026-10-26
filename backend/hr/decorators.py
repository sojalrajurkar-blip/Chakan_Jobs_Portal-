# hr/decorators.py
from functools import wraps
from django.shortcuts import redirect

def hr_login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.session.get('id'):
            return redirect('hr_login')  # Redirect if not logged in
        return view_func(request, *args, **kwargs)
    return wrapper
