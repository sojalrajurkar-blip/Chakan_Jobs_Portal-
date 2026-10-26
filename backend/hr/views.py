from django.shortcuts import render,HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth import get_user_model
from django.http import HttpResponseBadRequest
from django.core.exceptions import ValidationError
from .models import HrUser
from .models import Title
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login as auth_login
from django.http import JsonResponse
from django.views import View
from .models import Post
from job.models import Applications
from .decorators import hr_login_required
from django.shortcuts import render, get_object_or_404, redirect


# from django.contrib.auth import update_session_auth_hash




# Create your views here.

@hr_login_required
def hr_home(request):
    return render(request, 'hr/hr_home.html')



def hr_signup(request):
    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        mobile_number = request.POST.get('mobile_number')
        username = request.POST.get('username')
        password = request.POST.get('password1')
        confirm_password = request.POST.get("password2")
        position = request.POST.get('position')
        company_name = request.POST.get('company_name')
        company_address = request.POST.get('company_address')

        print(f"Full Name :{full_name}")
        print(f"Email :{email}")
        print(f"mobile_number :{mobile_number}")
        print(f"username :{username}")
        print(f"password :{password}")
        print(f"confirm_password :{confirm_password}")
        print(f"position :{position}")
        print(f"company_name :{company_name}")
        print(f"comapany Address :{company_address}")




         # Validate required fields
        if not all([full_name, email, mobile_number, username, password, position, company_name, company_address]):
            messages.error(request, "All fields are required.")
            return render(request, 'hr/hr_signup.html', {
                'full_name': full_name,
                'email': email,
                'mobile_number': mobile_number,
                'username': username,
                'position': position,
                'company_name': company_name,
                'company_address': company_address,
            })

        # Validate mobile number
        if len(mobile_number) != 10 or not mobile_number.isdigit():
            messages.error(request, "Mobile number must be exactly 10 digits.")
            return render(request, 'hr/hr_signup.html', {
                'full_name': full_name,
                'email': email,
                'mobile_number': mobile_number,
                'username': username,
                'position': position,
                'company_name': company_name,
                'company_address': company_address,
            })
        
        # Validate password
        if ( password != confirm_password ):
            messages.error(request, "Password and confirm_password must be same.")
            return render(request, 'hr/hr_signup.html', {
                'full_name': full_name,
                'email': email,
                'mobile_number': mobile_number,
                'username': username,
                'position': position,
                'company_name': company_name,
                'company_address': company_address,
            })

        # Validate password strength
        if len(password) < 5:
            messages.error(request, "Password must be at least 6 characters long.")
            return render(request, 'hr/hr_signup.html', {
                'full_name': full_name,
                'email': email,
                'mobile_number': mobile_number,
                'username': username,
                'position': position,
                'company_name': company_name,
                'company_address': company_address,
            })
        

        # Address Len Must be at least 10 digit
        if len(company_address) < 10:
            messages.error(request, " Company address must be at least 10 characters long.")
            return render(request, 'hr/hr_signup.html', {
                'full_name': full_name,
                'email': email,
                'mobile_number': mobile_number,
                'username': username,
                'position': position,
                'company_name': company_name,
                'company_address': company_address,
            })

        # Check if username is unique
        if HrUser.objects.filter(username=username).exists():
            messages.error(request, "Username is already taken.")
            return render(request, 'hr/hr_signup.html', {
                'full_name': full_name,
                'email': email,
                'mobile_number': mobile_number,
                'username': username,
                'position': position,
                'company_name': company_name,
                'company_address': company_address,
            })
        
        if HrUser.objects.filter(email=email).exists():
            messages.error(request, "An account with this email already exists.")
            return render(request, 'hr/hr_signup.html', {
                'full_name': full_name,
                'email': email,
                'mobile_number': mobile_number,
                'username': username,
                'position': position,
                'company_name': company_name,
                'company_address': company_address,
            })


        try:
            HrUser.objects.create(
            full_name=full_name,
            email=email,
            mobile_number=mobile_number,
            username=username,
            password=password,
            position=position,
            company_name=company_name,
            company_address=company_address
        )
            return redirect('hr_login')  # Redirect to a success page.
        except Exception as e:
            return HttpResponseBadRequest(f"Error: {e}")
    return render(request, 'hr/hr_signup.html')



def hr_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password1')

        try:
            user = HrUser.objects.get(username=username)
            if user.password == password:  # Direct password comparison
                request.session['username'] = user.username
                request.session['id'] = user.id
                print("login Successfull")
                return redirect('home')
            else:
                messages.error(request, "Invalid username or password.")
        except HrUser.DoesNotExist:
            messages.error(request, "User does not exist.")   
    return render(request, 'hr/hr_login.html')


@hr_login_required
def hr_logout(request):
    request.session.flush()  # Clears all session data
    return redirect('hr_login')  # Redirect to the login page


@hr_login_required
def hr_post(request):
    if request.method == 'POST':
        job_title = request.POST.get('job_title')
        number_of_openings = request.POST.get('number_of_opening')
        min_salary = request.POST.get('min_salary')
        max_salary = request.POST.get('max_salary')
        shifts = request.POST.getlist('shift')  # For multiple selections
        if not shifts:  # If nothing selected
            shifts = ['three']  # Default
        job_type = request.POST.get('job_type')
        if not job_type:
            job_type = "Field Job"
        facilities = request.POST.getlist('facility')  # For multiple selections
        if not facilities :
            facilities = "Not Specified"
        charges = 'charges' in request.POST  # Checkbox for charges


        # conditions
        if len(job_title) < 3 or len(job_title) > 35:
            messages.error(request, "Title length must be between 3 and 35 letters.")
            return render(request, 'hr/hr_post.html')

        if min_salary > max_salary :
            messages.error(request, "Maximum salary must be greater than mininum salary.")
            return render(request, 'hr/hr_post.html')


        print(f"Job Title: {job_title}")
        print(f"Number of Openings: {number_of_openings}")
        print(f"Minimum Salary: {min_salary}")
        print(f"Maximum Salary: {max_salary}")
        print(f"Shifts: {shifts}") 
        print(f"Job Type: {job_type}") 
        print(f"Facilities: {facilities}") 
        print(f"Application Charges: {charges}")

                # ✅ Save to session
        request.session['job_post_data'] = {
            'job_title': job_title,
            'number_of_openings': number_of_openings,
            'min_salary': min_salary,
            'max_salary': max_salary,
            'shifts': shifts,
            'job_type': job_type,
            'facilities': facilities,
            'charges': charges
        }

        print("Job data saved in session:", request.session['job_post_data'])

        return redirect(hr_post_candidate)
    return render(request, 'hr/hr_post.html')

@hr_login_required
def hr_post_candidate(request):
    if request.method == "POST":
        min_education = request.POST.getlist('min_education')
        print(min_education)
        if not min_education:
            min_education = ['10th']
        course_name = request.POST.get('course_name', '').strip()
        if not course_name:
            course_name = "All"
        experience = request.POST.get('experience', 'fresher')

        gender = request.POST.get('gender', 'any')  # Default to 'any' if not selected
        manage_through = request.POST.getlist('manage_through')
        if not manage_through:
            manage_through = ['apply']

        calling_number = request.POST.get('calling_number', '').strip()
        whatsapp_number = request.POST.get('whatsapp_number', '').strip()
        email = request.POST.get('email', '').strip()
        terms_accepted = (request.POST.get('terms') == 'on')

        
        print(f"Min Education: {min_education}")
        print(f"Course Name: {course_name}")
        print(f"experiece: {experience}")
        print(f"manage_through: {manage_through}")
        print(f"gender: {gender}")
        print(f"calling_number: {calling_number}")
        print(f"whatsapp_number: {whatsapp_number}")
        print(f"email: {email}")
        print(f"terms_accepted: {terms_accepted}")

        request.session['job_data'] = {
            'min_education': min_education,
            'course_name': course_name,
            'experience': experience,
            'gender': gender,
            'manage_through': manage_through,
            'calling_number': calling_number,
            'whatsapp_number': whatsapp_number,
            'email': email,
            'terms_accepted': terms_accepted,
        }
        return redirect(hr_post_company)

        #print("Session Data:", request.session['job_data'])  # Debug

 

        # print(f"Min Education: {min_education}")
        # print(f"Course Name: {course_name}")
        # print(f"experiece: {experience}")
        # print(f"manage_through: {manage_through}")
        # print(f"gender: {gender}")
        # print(f"calling_number: {calling_number}")
        # print(f"whatsapp_number: {whatsapp_number}")
        # print(f"email: {email}")
        # print(f"terms_accepted: {terms_accepted}")
        # return redirect(hr_post_company)

        
        #print(min_education,course_name, experience,gender,manage_through,calling_number,whatsapp_number,email,terms_accepted)

    return render(request, 'hr/hr_post_candidate.html')

@hr_login_required
def hr_post_company(request):
    if request.method == 'POST':
        company_type = request.POST.get('company_type')
        if not company_type:
            company_type = "company"
        company_name = request.POST.get('company_name')
        if len(company_name) < 3 or len(company_name) > 35:
            messages.error(request, "Company name length must be between 3 and 35 letters.")
            return render(request, 'hr/hr_post_company.html')
        
        company_address = request.POST.get('company_address')
        if len(company_address) < 10 :
            messages.error(request, "Company Address length must be greater than 10 letters.")
            return render(request, 'hr/hr_post_company.html')

        company_size = request.POST.get('company_size')
        if not company_size :
            company_size = "50+"
        bus_route = request.POST.get('bus_route')
        if not bus_route :
            bus_route = None
        area = request.POST.get('area')
        village = request.POST.get('village')



        # print(f"company_type : {company_type}")
        # print(f"company_name :{company_name}")
        # print(f"company_address :{company_address}")
        # print(f"company_size : {company_size}")
        # print(f"bus_route : {bus_route}")
        # print(f"area :  {area}")
        # print(f"village : {village}")

        # Save to session
        request.session['company_data'] = {
            'company_type': company_type,
            'company_name': company_name,
            'company_address': company_address,
            'company_size': company_size,
            'bus_route': bus_route,
            'area': area,
            'village': village,
        }

        print("Company Session Data:", request.session['company_data'])  # Debug



        job_part = request.session.get('job_post_data', {})
        cand_part = request.session.get('job_data', {})
        comp_part = request.session.get('company_data', {})

        combined = {**job_part, **cand_part, **comp_part}

        #save id
        user_id = request.session.get('id')
        if not user_id:
            messages.error(request, "User not logged in.")
            return redirect('hr_login')  # or your login URL        
        combined['hr_user_id'] = user_id
        #save id end

        job = Post(**combined)
        job.save()

        # Clean up session
        for key in ('job_post_data', 'job_data', 'company_data'):
            request.session.pop(key, None)
        request.session.modified = True

        return redirect('success_page')

    return render(request, 'hr/hr_post_company.html')


@hr_login_required
def job_applications(request):
    # Retrieve the user ID from the session
    user_id = request.session.get('id')
    if user_id:
        # Filter posts where the hr_user matches the session ID
        posts = Post.objects.filter(hr_user_id=user_id)
        # Retrieve applications related to the filtered posts
        applications = Applications.objects.filter(post__in=posts)
    else:
        posts = Post.objects.none()  # Return an empty queryset if no user ID in session
        applications = Applications.objects.none()

    return render(request, 'hr/job_applications.html', {'posts': posts, 'applications': applications})




@hr_login_required
def delete_post(request, pk):
    post = get_object_or_404(Post, pk=pk, hr_user_id=request.session.get('id'))
    if request.method == "POST":
        post.delete()
        messages.success(request, "Post deleted successfully.")
        return redirect('job_applications')
    return redirect('job_applications')


@hr_login_required
def success_page(request) :
    return render(request,'hr/success_page.html')

# def change_password(request):
#     if request.method == 'POST':
#         username_input = request.POST.get('username')
#         old_password = request.POST.get('password1')
#         new_password = request.POST.get('password2')

#         # Check username matches logged-in user
#         if username_input != request.user.username:
#             messages.error(request, "Username doesn't match the current user.")
#             return render(request, 'hr/change_password.html', {
#                 'username': request.user.username
#             })

#         # Verify old password
#         if not request.user.check_password(old_password):
#             messages.error(request, "Old password is incorrect.")
#             return render(request, 'hr/change_password.html', {
#                 'username': request.user.username
#             })

#         # Change to new password
#         request.user.set_password(new_password)
#         request.user.save()

#         # Keep user logged in
#         update_session_auth_hash(request, request.user)

#         messages.success(request, "Password changed successfully!")
#         return redirect('hr_home')  # Adjust 'hr_home' to your home URL name

#     # On GET, prefill username
#     return render(request, 'hr/change_password.html', {
#         'username': request.user.username
#     })

#     return render(request, 'hr/change_password.html')









@hr_login_required
def job_applicants(request, post_id):
    user_id = request.session.get('id')
    if not user_id:
        # कोई login नहीं — redirect या empty context
        return redirect('hr_login')  # या जहाँ चाहें

    # सुनिश्चित करें कि वो HR user का post ही हो
    try:
        post = Post.objects.get(id=post_id, hr_user_id=user_id)
    except Post.DoesNotExist:
        # ऐसा post नहीं — error page या redirect
        return HttpResponse("No such job or you are not authorized", status=404)

    # उस post से जुड़े सभी applicants
    applications = Applications.objects.filter(post=post)

    context = {
        'post': post,
        'applications': applications,
    }
    return render(request, 'hr/applicants.html', context)


class TitleAutocomplete(View):
    def get(self, request):
        query = request.GET.get('term', '')
        matches = Title.objects.filter(title__icontains=query).values_list('title', flat=True)[:10]
        return JsonResponse(list(matches), safe=False)



