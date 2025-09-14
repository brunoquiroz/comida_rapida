from django.contrib import admin
from .models import HeroSection, AboutSection, ContactInfo, FeaturedProduct, Order, OrderItem, OrderItemExtra

@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'subtitle']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_active']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('title', 'subtitle', 'button_text', 'button_url')
        }),
        ('Imagen', {
            'fields': ('background_image',)
        }),
        ('Estado', {
            'fields': ('is_active',)
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'years_experience', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'subtitle', 'description']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_active']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('title', 'subtitle', 'description', 'years_experience')
        }),
        ('Imágenes', {
            'fields': ('image_1', 'image_2')
        }),
        ('Estado', {
            'fields': ('is_active',)
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ['phone', 'email', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['phone', 'email', 'address']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_active']
    
    fieldsets = (
        ('Información de Contacto', {
            'fields': ('phone', 'email', 'address')
        }),
        ('Redes Sociales', {
            'fields': ('whatsapp', 'facebook', 'instagram')
        }),
        ('Estado', {
            'fields': ('is_active',)
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(FeaturedProduct)
class FeaturedProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'original_price', 'discount_percentage', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at', 'discount_amount', 'discount_percentage_calculated']
    list_editable = ['is_active']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'description', 'price', 'original_price', 'discount_percentage')
        }),
        ('Detalles', {
            'fields': ('preparation_time', 'servings', 'rating', 'reviews_count')
        }),
        ('Imagen', {
            'fields': ('image',)
        }),
        ('Estado', {
            'fields': ('is_active',)
        }),
        ('Cálculos', {
            'fields': ('discount_amount', 'discount_percentage_calculated'),
            'classes': ('collapse',)
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

# ADMIN PARA PEDIDOS
class OrderItemExtraInline(admin.TabularInline):
    model = OrderItemExtra
    extra = 0
    readonly_fields = ['ingredient_name', 'quantity', 'unit_price', 'total_price']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'product_description', 'quantity', 'unit_price', 'total_price']
    inlines = [OrderItemExtraInline]

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer_name', 'customer_phone', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at', 'delivery_city']
    search_fields = ['order_number', 'customer_name', 'customer_email', 'customer_phone']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    list_editable = ['status']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Información del Pedido', {
            'fields': ('order_number', 'status', 'total_amount')
        }),
        ('Información del Cliente', {
            'fields': ('customer_name', 'customer_email', 'customer_phone')
        }),
        ('Dirección de Entrega', {
            'fields': ('delivery_address', 'delivery_street', 'delivery_number', 
                      'delivery_apartment', 'delivery_city', 'delivery_region')
        }),
        ('Notas', {
            'fields': ('notes',)
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related().prefetch_related('items__extras')

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'quantity', 'unit_price', 'total_price']
    list_filter = ['order__status', 'order__created_at']
    search_fields = ['product_name', 'order__order_number', 'order__customer_name']
    readonly_fields = ['product_name', 'product_description', 'quantity', 'unit_price', 'total_price']
    inlines = [OrderItemExtraInline]

@admin.register(OrderItemExtra)
class OrderItemExtraAdmin(admin.ModelAdmin):
    list_display = ['order_item', 'ingredient_name', 'quantity', 'unit_price', 'total_price']
    list_filter = ['order_item__order__status', 'order_item__order__created_at']
    search_fields = ['ingredient_name', 'order_item__product_name', 'order_item__order__order_number']
    readonly_fields = ['ingredient_name', 'quantity', 'unit_price', 'total_price']
