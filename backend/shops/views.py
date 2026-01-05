from rest_framework import viewsets, permissions
from .models import Shop
from .serializers import ShopSerializer

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user

class IsShopOwnerUser(permissions.BasePermission):
    """
    Allocates permissions for shop management actions to shop owners only.
    """
    def has_permission(self, request, view):
        # Allow read-only actions for everyone (authenticated or not, depending on other settings)
        # But for 'create', strictly enforce 'shop_owner' role.
        if request.method == 'POST':
            return request.user.is_authenticated and request.user.role == 'shop_owner'
        return True

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsShopOwnerUser, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        # Double check in perform_create (redundant but safe)
        if self.request.user.role != 'shop_owner':
            raise permissions.PermissionDenied("Only shop owners can create shops.")
        serializer.save(owner=self.request.user)
