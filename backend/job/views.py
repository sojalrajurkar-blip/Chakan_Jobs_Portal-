from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
from hr.models import Post
from django.db.models import Q
import re
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.views.generic import CreateView
from django.contrib import messages
from .models import Applications
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import FCMToken

#from .models import Application

# Create your views here.


def home(request):
    posts = Post.objects.all()
    for post in posts:
        # Ensure manage_through is a list
        if isinstance(post.manage_through, str):
            post.manage_through = post.manage_through.strip("[]").replace("'", "").split(',')
        # Strip any leading/trailing whitespace from each item
        post.manage_through = [item.strip() for item in post.manage_through]

        # minimum education
        if isinstance(post.min_education, str):
            post.min_education = post.min_education.strip("[]").replace("'", "").split(',')
        post.min_education = [item.strip() for item in post.min_education]
        # print(post.min_education)
        # print(post.manage_through)
    context = {"posts": posts}
    return render(request, 'job/home.html', context)




def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if isinstance(post.manage_through, str):
        post.manage_through = post.manage_through.strip("[]").replace("'", "").split(',')
        # Strip any leading/trailing whitespace from each item
    post.manage_through = [item.strip() for item in post.manage_through]

    # print(post.manage_through)

    # Parse min_education similarly
    if isinstance(post.min_education, str):
        post.min_education = post.min_education.strip("[]").replace("'", "").split(',')
    post.min_education = [item.strip() for item in post.min_education]
    print(post.min_education)


    if isinstance(post.shifts, str):
        post.shifts = post.shifts.strip("[]").replace("'", "").split(',')
    post.shifts = [item.strip() for item in post.shifts]
    # print(post.shifts)

    if isinstance(post.facilities, str):
        post.facilities = post.facilities.strip("[]").replace("'", "").split(',')
    post.facilities = [item.strip() for item in post.facilities]
    print(post.facilities)
    # print(post.job_title)
    # print(post.experience)

    title_words = post.job_title.split()
    query = Q()
    for word in set(title_words):
        query |= Q(job_title__icontains=word)
    related_jobs = Post.objects.filter(query).exclude(pk=post.pk)[:25]

        # Check if any related jobs were found
    if related_jobs.exists():
        # If related jobs exist, use that queryset
        related = related_jobs
    else:
        # If no related jobs are found, get all jobs instead
        related = Post.objects.all().exclude(pk=post.pk)[:20]

    # --- Clean fields for each related job ---
    for job in related:
        if isinstance(job.manage_through, str):
            job.manage_through = job.manage_through.strip("[]").replace("'", "").split(',')
        job.manage_through = [item.strip() for item in job.manage_through]

        if isinstance(job.min_education, str):
            job.min_education = job.min_education.strip("[]").replace("'", "").split(',')
        job.min_education = [item.strip() for item in job.min_education]

        if isinstance(job.shifts, str):
            job.shifts = job.shifts.strip("[]").replace("'", "").split(',')
        job.shifts = [item.strip() for item in job.shifts]

        if isinstance(job.facilities, str):
            job.facilities = job.facilities.strip("[]").replace("'", "").split(',')
        job.facilities = [item.strip() for item in job.facilities]
   



    #  # show all posts on 
    # all_posts = Post.objects.all()
    # for post in all_posts:
    #     # Ensure manage_through is a list
    #     if isinstance(post.manage_through, str):
    #         post.manage_through = post.manage_through.strip("[]").replace("'", "").split(',')
    #     # Strip any leading/trailing whitespace from each item
    #     post.manage_through = [item.strip() for item in post.manage_through]

    #     # minimum education
    #     if isinstance(post.min_education, str):
    #         post.min_education = post.min_education.strip("[]").replace("'", "").split(',')
    #     post.min_education = [item.strip() for item in post.min_education]
    #     # print(post.min_education)
    #     # print(post.manage_through)

    return render(request, 'job/post_detail.html', {'post': post,
    'related_jobs': related})




# def job_search(request):
#     title = request.GET.get('searchTitle', '')
#     min_education = request.GET.get('minEducation', '')
#     exp_query = request.GET.get('minExperience', '')
#     shift = request.GET.get('shift', '')
#     print(title,min_education,experience2,shift)



#     posts = Post.objects.filter(min_education__contains="graduation")
#     post2 = Post.objects.filter(title__contains='title')
#     post3 = Post.objects.filter(experience__icontains=exp_query)

#     posts = Post.objects.filter(job_title__icontains=title)
#     for post in posts:
#         print(post.experience)
#         print(post.job_title)
#     return render(request, 'job/search_job.html' )






def job_search(request):
    title = request.GET.get('searchTitle', '').strip()
    min_education = request.GET.get('minEducation', '').strip()
    exp_query = request.GET.get('minExperience', '').strip()
    shift = request.GET.get('shift', '').strip()
    print(title, min_education, exp_query, shift)
    # Start with all posts
    posts = Post.objects.all()


    # Apply filters if values are provided
    if title:
        posts = posts.filter(job_title__icontains=title)

    if min_education and min_education != 'any':
        posts = posts.filter(min_education__contains=min_education)
  
    if exp_query and exp_query != 'any':
        posts = posts.filter(experience__icontains=exp_query)

    if shift and shift != 'any':
        posts = posts.filter(shifts__icontains=shift)

    # Debugging (prints to console)

    # if isinstance(posts.min_education, str):
    #     posts.min_education = posts.min_education.strip("[]").replace("'", "").split(',')
    # posts.min_education = [item.strip() for item in posts.min_education]
    for post in posts:
        # print(f"Min Education: {post.min_education} {type(post.min_education)}")
        if isinstance(post.min_education, str):
            post.min_education = post.min_education.strip("[]").replace("'", "").split(',')
        post.min_education = [item.strip() for item in post.min_education]
        # print(post.min_education)
        if isinstance(post.manage_through, str):
            post.manage_through = post.manage_through.strip("[]").replace("'", "").split(',')
        # Strip any leading/trailing whitespace from each item
        post.manage_through = [item.strip() for item in post.manage_through]

    

    return render(request, 'job/search_job.html', {'posts': posts})




def apply_view(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    if request.method == 'POST':
        full_name = request.POST.get('full_name', '').strip()
        qualification = request.POST.get('qualification', '').strip()
        age = request.POST.get('age', '').strip()
        mobile_number = request.POST.get('mobile_number', '').strip()
        current_address = request.POST.get('current_address', '').strip()
        received_post_id = request.POST.get('post_id')

        if str(post.id) != received_post_id:
            messages.error(request, "Invalid post reference.")
            return render(request, 'job/apply.html', {'post': post})

        errors = []
        if not full_name:
            errors.append("Full Name is required.")
        if not qualification:
            errors.append("Qualification is required.")
        if not age.isdigit():
            errors.append("Valid Age is required.")
        if not mobile_number:
            errors.append("Mobile Number is required.")
        if not current_address:
            errors.append("Current Address is required.")

        if errors:
            for err in errors:
                messages.error(request, err)
            return render(request, 'job/apply.html', {
                'post': post,
                'full_name': full_name,
                'qualification': qualification,
                'age': age,
                'mobile_number': mobile_number,
                'current_address': current_address,
            })

        Applications.objects.create(
            full_name=full_name,
            qualification=qualification,
            age=int(age),
            mobile_number=mobile_number,
            current_address=current_address,
            post=post
        )
        messages.success(request, "Application submitted successfully!")
        return redirect('application_success')

    return render(request, 'job/apply.html', {'post': post})

def application_success(request):
    return render(request, 'job/application_success.html')





# @csrf_exempt
# def save_fcm_token(request):
#     """Receives and saves the FCM token from the client."""
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             token = data.get('token')
#             if token:
#                 FCMToken.objects.get_or_create(token=token)
#                 return JsonResponse({"status": "success", "message": "Token saved."})
#             return JsonResponse({"status": "error", "message": "No token provided."}, status=400)
#         except json.JSONDecodeError:
#             return JsonResponse({"status": "error", "message": "Invalid JSON."}, status=400)
#     return JsonResponse({"status": "error", "message": "Invalid request method."}, status=405)