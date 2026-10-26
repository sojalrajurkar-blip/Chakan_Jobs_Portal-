from django.http import HttpResponse
from django.views.decorators.http import require_GET

@require_GET
def ads_txt(request):
    content = "google.com, pub-9155980795220429, DIRECT, f08c47fec0942fa0"
    return HttpResponse(content, content_type="text/plain")
