from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.exceptions import ValidationError  # AGREGAR ESTA LÍNEA
from django.db.models import Q
from products.models import Category, Product, ProductTag, Ingredient, ProductIngredient
from .models import HeroSection, AboutSection, ContactInfo, FeaturedProduct, Order, OrderItem, OrderItemExtra
from .serializers import (
    CategorySerializer, ProductSerializer, ProductDetailSerializer, ProductTagSerializer,
    HeroSectionSerializer, AboutSectionSerializer, ContactInfoSerializer, FeaturedProductSerializer,
    IngredientSerializer, ProductIngredientSerializer, OrderSerializer, CreateOrderSerializer
)
from decimal import Decimal

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Obtener todos los productos de una categoría específica"""
        category = self.get_object()
        products = Product.objects.filter(category=category, is_active=True)
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'search', 'featured', 'calculate_price']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        
        if category and category != 'all':
            queryset = queryset.filter(category__name=category)
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search) |
                Q(category__name__icontains=search)
            )
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        # Extraer las etiquetas del request
        tag_names = []
        for key in request.data.keys():
            if key.startswith('tag_names[') and key.endswith(']'):
                tag_names.append(request.data[key])
        
        # Extraer ingredientes si vienen
        product_ingredients_data = request.data.get('product_ingredients')
        
        # Crear una copia mutable de los datos
        data = request.data.copy()
        
        # Remover las etiquetas de los datos principales
        for key in list(data.keys()):
            if key.startswith('tag_names['):
                del data[key]
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        
        # Crear tags
        for tag_name in tag_names:
            if tag_name.strip():
                ProductTag.objects.create(product=product, name=tag_name.strip())
        
        # Crear ingredientes si se enviaron como JSON
        if product_ingredients_data:
            # Se espera lista de objetos con ingredient_id, default_included, extra_cost, is_active
            from json import loads
            try:
                parsed = loads(product_ingredients_data) if isinstance(product_ingredients_data, str) else product_ingredients_data
                for pi in parsed:
                    ProductIngredient.objects.create(
                        product=product,
                        ingredient_id=pi.get('ingredient_id'),
                        default_included=pi.get('default_included', True),
                        extra_cost=pi.get('extra_cost', 0),
                        is_active=pi.get('is_active', True)
                    )
            except Exception:
                pass
        
        response_serializer = ProductDetailSerializer(product, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        tag_names = []
        for key in request.data.keys():
            if key.startswith('tag_names[') and key.endswith(']'):
                tag_names.append(request.data[key])
        
        product_ingredients_data = request.data.get('product_ingredients')
        
        data = request.data.copy()
        for key in list(data.keys()):
            if key.startswith('tag_names['):
                del data[key]
        
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        
        # Actualizar tags
        instance.tags.all().delete()
        for tag_name in tag_names:
            if tag_name.strip():
                ProductTag.objects.create(product=product, name=tag_name.strip())
        
        # Actualizar ingredientes si se envían
        if product_ingredients_data is not None:
            from json import loads
            try:
                instance.product_ingredients.all().delete()
                parsed = loads(product_ingredients_data) if isinstance(product_ingredients_data, str) else product_ingredients_data
                for pi in parsed:
                    ProductIngredient.objects.create(
                        product=product,
                        ingredient_id=pi.get('ingredient_id'),
                        default_included=pi.get('default_included', True),
                        extra_cost=pi.get('extra_cost', 0),
                        is_active=pi.get('is_active', True)
                    )
            except Exception:
                pass
        
        response_serializer = ProductDetailSerializer(product, context={'request': request})
        return Response(response_serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Obtener productos destacados (los más recientes)"""
        featured_products = Product.objects.filter(is_active=True).order_by('-created_at')[:6]
        serializer = self.get_serializer(featured_products, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Buscar productos por nombre o descripción"""
        search_term = request.query_params.get('q', '')
        if not search_term:
            return Response({'error': 'Término de búsqueda requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        products = Product.objects.filter(
            Q(name__icontains=search_term) | 
            Q(description__icontains=search_term),
            is_active=True
        )
        serializer = self.get_serializer(products, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def calculate_price(self, request, pk=None):
        """Calcular precio para un producto dado un conjunto de extras (IDs de ingredientes)."""
        try:
            product = self.get_object()
        except Product.DoesNotExist:
            return Response({'detail': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        extra_ids = request.data.get('extra_ids', [])
        if not isinstance(extra_ids, list):
            return Response({'detail': 'extra_ids debe ser una lista de IDs'}, status=status.HTTP_400_BAD_REQUEST)

        base = Decimal(product.price)
        extras_qs = product.product_ingredients.filter(default_included=False, is_active=True, ingredient_id__in=extra_ids)
        extras_total = sum((pi.extra_cost for pi in extras_qs), Decimal('0'))
        total = base + extras_total
        return Response({
            'base_price': base,
            'extras_total': extras_total,
            'total': total,
            'extra_ids': extra_ids,
        })

class ProductTagViewSet(viewsets.ModelViewSet):
    queryset = ProductTag.objects.all()
    serializer_class = ProductTagSerializer
    permission_classes = [IsAdminUser]

# NUEVOS VIEWSETS PARA INGREDIENTES
class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class ProductIngredientViewSet(viewsets.ModelViewSet):
    queryset = ProductIngredient.objects.all()
    serializer_class = ProductIngredientSerializer
    permission_classes = [IsAdminUser]

# Vistas para contenido dinámico
class HeroSectionViewSet(viewsets.ModelViewSet):
    queryset = HeroSection.objects.filter(is_active=True)
    serializer_class = HeroSectionSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Obtener la sección hero activa"""
        hero = HeroSection.objects.filter(is_active=True).first()
        if hero:
            serializer = self.get_serializer(hero, context={'request': request})
            return Response(serializer.data)
        return Response({'error': 'No hay sección hero activa'}, status=status.HTTP_404_NOT_FOUND)

class AboutSectionViewSet(viewsets.ModelViewSet):
    queryset = AboutSection.objects.filter(is_active=True)
    serializer_class = AboutSectionSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Obtener la sección about activa"""
        about = AboutSection.objects.filter(is_active=True).first()
        if about:
            serializer = self.get_serializer(about, context={'request': request})
            return Response(serializer.data)
        return Response({'error': 'No hay sección about activa'}, status=status.HTTP_404_NOT_FOUND)

class ContactInfoViewSet(viewsets.ModelViewSet):
    queryset = ContactInfo.objects.filter(is_active=True)
    serializer_class = ContactInfoSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Obtener la información de contacto activa"""
        contact = ContactInfo.objects.filter(is_active=True).first()
        if contact:
            serializer = self.get_serializer(contact, context={'request': request})
            return Response(serializer.data)
        return Response({'error': 'No hay información de contacto activa'}, status=status.HTTP_404_NOT_FOUND)

class FeaturedProductViewSet(viewsets.ModelViewSet):
    queryset = FeaturedProduct.objects.filter(is_active=True)
    serializer_class = FeaturedProductSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Obtener el producto destacado activo"""
        featured = FeaturedProduct.objects.filter(is_active=True).first()
        if featured:
            serializer = self.get_serializer(featured, context={'request': request})
            return Response(serializer.data)
        return Response({'error': 'No hay producto destacado activo'}, status=status.HTTP_404_NOT_FOUND)

# VIEWSETS PARA PEDIDOS
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]  # Permitir crear pedidos sin autenticación
        else:
            permission_classes = [IsAdminUser]  # Solo admins pueden ver/editar pedidos
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer
    
    def create(self, request, *args, **kwargs):
        """Crear un nuevo pedido"""
        print("=== DATOS RECIBIDOS EN EL VIEWSET ===")
        print(f"Request data: {request.data}")
        
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            order = serializer.save()
            
            # Retornar el pedido creado con el serializer de lectura
            response_serializer = OrderSerializer(order, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        except ValidationError as e:  # CORREGIDO: usar ValidationError directamente
            print(f"Error de validación: {e}")
            print(f"Errores del serializer: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(f"Error inesperado: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Error interno del servidor: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Actualizar el estado de un pedido"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Estado inválido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    def get_queryset(self):
        """Filtrar pedidos por estado si se especifica"""
        queryset = Order.objects.all().order_by('-created_at')
        status_filter = self.request.query_params.get('status', None)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset
