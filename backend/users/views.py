from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, viewsets, generics
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from shops.models import Shop
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        total_shops = Shop.objects.count()
        active_shops = Shop.objects.filter(is_active=True).count()
        inactive_shops = total_shops - active_shops
        
        total_users = User.objects.count()
        shop_owners = User.objects.filter(role='shop_owner').count()
        customers = User.objects.filter(role='customer').count()
        
        return Response({
            "shops": {
                "total": total_shops,
                "active": active_shops,
                "inactive": inactive_shops
            },
            "users": {
                "total": total_users,
                "shop_owners": shop_owners,
                "customers": customers
            }
        })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admins see all, others see none or self? 
        # For now, restrict to Admin only to be safe
        if self.request.user.role == 'admin':
            return User.objects.all().order_by('-date_joined')
        return User.objects.none()
