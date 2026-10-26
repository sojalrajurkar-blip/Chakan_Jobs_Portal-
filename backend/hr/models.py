# Compatibility references during architecture modernization
from accounts.models import User as HrUser
from job.models import Title, JobPost as Post

__all__ = ['HrUser', 'Title', 'Post']
