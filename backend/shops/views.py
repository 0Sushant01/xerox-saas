from rest_framework import viewsets, permissions
from .models import Shop
from .serializers import ShopSerializer, AdminShopSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated and request.user.role == 'admin':
            return True
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user

class IsShopOwnerUser(permissions.BasePermission):
    """
    Allocates permissions for shop management actions to shop owners and admins.
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.role == 'admin':
            return True
        if request.method == 'POST':
            return request.user.is_authenticated and request.user.role == 'shop_owner'
        return True

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsShopOwnerUser, IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'role') and self.request.user.role == 'admin':
            return AdminShopSerializer
        return ShopSerializer

    def perform_create(self, serializer):
        if self.request.user.role == 'admin':
            # Admin must provide owner in validated_data or we need to handle it.
            # Serializer saves whatever is passed. If 'owner' is in fields, it works.
            # If not, we might need to modify serializer or passing logic. A simple save() is enough if serializer handles it.
            serializer.save() 
        elif self.request.user.role == 'shop_owner':
            serializer.save(owner=self.request.user)
        else:
            raise permissions.PermissionDenied("Only shop owners or admins can create shops.")
