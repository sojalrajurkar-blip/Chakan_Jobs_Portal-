from django.test import TestCase
from django.contrib.auth import get_user_model

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
