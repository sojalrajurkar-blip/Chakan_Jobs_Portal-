# hr/admin.py
from django.contrib import admin
from .models import HrUser
from .models import Post
from .models import Title

admin.site.register(HrUser)
admin.site.register(Post)
admin.site.register(Title)
