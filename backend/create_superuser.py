import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

email = 'admin@example.com'
password = 'admin'

if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(username='admin', email=email, password=password, role='admin')
    print(f"Superuser created.\nEmail: {email}\nPassword: {password}")
else:
    print("Superuser already exists.")
