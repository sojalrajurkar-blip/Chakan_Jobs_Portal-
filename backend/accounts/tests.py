from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token

User = get_user_model()


class UserModelTests(TestCase):
    def test_create_recruiter_user_password_is_hashed(self):
        """Verify recruiter passwords are encrypted using Django password hashing and never stored plain text."""
        raw_password = 'SecurePassword@123'
        user = User.objects.create_user(
            username='test_recruiter',
            email='recruiter@chakanjobs.com',
            password=raw_password,
            role=User.Role.RECRUITER,
            company_name='Chakan Auto Components Pvt Ltd',
            mobile_number='9876543210'
        )
        self.assertEqual(user.role, User.Role.RECRUITER)
        self.assertNotEqual(user.password, raw_password)
        self.assertTrue(user.password.startswith('pbkdf2_sha256$'))
        self.assertTrue(user.check_password(raw_password))
        self.assertFalse(user.check_password('WrongPassword'))

    def test_user_representation(self):
        user = User.objects.create_user(
            username='recruiter_2',
            company_name='Mahindra Supplier',
            role=User.Role.RECRUITER
        )
        self.assertIn('Mahindra Supplier', str(user))


class AuthAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.logout_url = '/api/auth/logout/'
        self.me_url = '/api/auth/me/'

        self.valid_payload = {
            'username': 'tata_motors_hr',
            'email': 'hr@tatamotors-chakan.com',
            'password': 'TataPassword@123',
            'confirm_password': 'TataPassword@123',
            'full_name': 'Vikram Deshmukh',
            'mobile_number': '9890123456',
            'company_name': 'Tata Motors Chakan Plant',
            'company_address': 'Sector 10, PCNTDA, Chakan, Pune',
            'position': 'Head of Talent Acquisition',
            'company_type': 'Automotive OEM',
        }

    def test_register_recruiter_success(self):
        """Test successful recruiter registration returning a valid auth token."""
        response = self.client.post(self.register_url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['username'], 'tata_motors_hr')
        self.assertEqual(response.data['user']['company_name'], 'Tata Motors Chakan Plant')
        self.assertEqual(response.data['user']['role'], 'RECRUITER')

        # Verify password is not in response
        self.assertNotIn('password', response.data['user'])

        # Verify token exists in database
        user = User.objects.get(username='tata_motors_hr')
        token = Token.objects.get(user=user)
        self.assertEqual(token.key, response.data['token'])

    def test_register_validation_password_mismatch(self):
        payload = self.valid_payload.copy()
        payload['confirm_password'] = 'DifferentPassword@123'
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('confirm_password', response.data['error']['details'])

    def test_register_validation_invalid_mobile(self):
        payload = self.valid_payload.copy()
        payload['mobile_number'] = '123'  # Too short
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('mobile_number', response.data['error']['details'])

    def test_register_duplicate_username_and_email(self):
        # First registration
        self.client.post(self.register_url, self.valid_payload, format='json')

        # Duplicate username
        dup_payload = self.valid_payload.copy()
        dup_payload['email'] = 'other@test.com'
        dup_payload['mobile_number'] = '9999999999'
        response = self.client.post(self.register_url, dup_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data['error']['details'])

    def test_login_success_with_username(self):
        self.client.post(self.register_url, self.valid_payload, format='json')

        login_data = {
            'username_or_email': 'tata_motors_hr',
            'password': 'TataPassword@123',
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['company_name'], 'Tata Motors Chakan Plant')

    def test_login_success_with_email(self):
        self.client.post(self.register_url, self.valid_payload, format='json')

        login_data = {
            'username_or_email': 'hr@tatamotors-chakan.com',
            'password': 'TataPassword@123',
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

    def test_login_failure_wrong_password(self):
        self.client.post(self.register_url, self.valid_payload, format='json')

        login_data = {
            'username_or_email': 'tata_motors_hr',
            'password': 'WrongPassword@999',
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(response.data['success'])

    def test_logout_revokes_token(self):
        reg_resp = self.client.post(self.register_url, self.valid_payload, format='json')
        token = reg_resp.data['token']

        # Call logout with token in header
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        logout_resp = self.client.post(self.logout_url)
        self.assertEqual(logout_resp.status_code, status.HTTP_200_OK)
        self.assertTrue(logout_resp.data['success'])

        # Verify token was destroyed in DB
        self.assertFalse(Token.objects.filter(key=token).exists())

        # Calling me now should fail with 401
        me_resp = self.client.get(self.me_url)
        self.assertEqual(me_resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_endpoint_retrieve_and_update(self):
        reg_resp = self.client.post(self.register_url, self.valid_payload, format='json')
        token = reg_resp.data['token']

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        # Retrieve profile
        get_resp = self.client.get(self.me_url)
        self.assertEqual(get_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(get_resp.data['user']['username'], 'tata_motors_hr')

        # Update profile
        patch_resp = self.client.patch(
            self.me_url,
            {'position': 'Senior VP of Operations', 'mobile_number': '9822334455'},
            format='json'
        )
        self.assertEqual(patch_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_resp.data['user']['position'], 'Senior VP of Operations')
        self.assertEqual(patch_resp.data['user']['mobile_number'], '9822334455')

    def test_candidate_registration_and_mobile_login(self):
        candidate_data = {
            'full_name': 'Ramesh Baburao Shinde',
            'mobile_number': '9850123456',
            'qualification': 'ITI Fitter',
            'current_address': 'Kuruli, Chakan, Pune',
            'password': 'Candidate@Password123',
            'confirm_password': 'Candidate@Password123',
        }
        # 1. Register candidate
        reg_resp = self.client.post('/api/auth/candidate/register/', candidate_data, format='json')
        self.assertEqual(reg_resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(reg_resp.data['success'])
        self.assertEqual(reg_resp.data['user']['role'], User.Role.CANDIDATE)
        self.assertTrue(reg_resp.data['user']['is_verified'])
        self.assertEqual(reg_resp.data['user']['mobile_number'], '9850123456')

        # 2. Login using 10-digit mobile number
        login_resp = self.client.post(
            self.login_url,
            {'username_or_email': '9850123456', 'password': 'Candidate@Password123'},
            format='json'
        )
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)
        self.assertTrue(login_resp.data['success'])
        self.assertIn('token', login_resp.data)
        self.assertEqual(login_resp.data['user']['role'], User.Role.CANDIDATE)

    def test_candidate_duplicate_mobile_validation(self):
        candidate_data = {
            'full_name': 'Ramesh Shinde',
            'mobile_number': '9850999999',
            'password': 'Candidate@Password123',
            'confirm_password': 'Candidate@Password123',
        }
        self.client.post('/api/auth/candidate/register/', candidate_data, format='json')

        # Second registration with same mobile number should fail
        dup_resp = self.client.post('/api/auth/candidate/register/', candidate_data, format='json')
        self.assertEqual(dup_resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(dup_resp.data['success'])

