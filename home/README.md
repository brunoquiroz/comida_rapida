# 🍔 Comida Rápida - Sistema de Gestión

Un sistema completo de gestión para restaurantes de comida rápida con frontend en React + TypeScript y backend en Django REST Framework, **con el admin de Django integrado directamente en React**.

## 🚀 Características

### Frontend (React + TypeScript)
- ✅ Interfaz moderna y responsiva con Tailwind CSS
- ✅ Sistema de autenticación completo
- ✅ **Panel de administración integrado con Django Admin**
- ✅ Gestión de productos y categorías
- ✅ Sistema de notificaciones toast
- ✅ Navegación con React Router
- ✅ Context API para estado global
- ✅ **Admin de Django embebido en React**

### Backend (Django REST Framework)
- ✅ API REST completa
- ✅ Autenticación con tokens
- ✅ Gestión de productos y categorías
- ✅ Subida de imágenes
- ✅ Filtros y búsqueda
- ✅ **Panel de administración Django integrado**
- ✅ CORS configurado para desarrollo
- ✅ **Contenido dinámico gestionable**

## 📋 Requisitos Previos

- Node.js 18+ 
- Python 3.8+
- npm o yarn

## 🛠️ Instalación

### Opción 1: Script Automático con Admin Integrado (Recomendado)

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd comida_rapida/home

# Ejecutar script de instalación con admin integrado
./start-admin.sh
```

### Opción 2: Instalación Manual

#### 1. Configurar Backend

```bash
# Navegar al directorio del proyecto
cd comida_rapida/home

# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Navegar al backend
cd backend

# Ejecutar migraciones
python3 manage.py migrate

# Crear superusuario (opcional)
python3 manage.py createsuperuser

# Poblar con datos de ejemplo
python3 populate_data.py
python3 populate_content.py

# Iniciar servidor backend
python3 manage.py runserver 8000
```

#### 2. Configurar Frontend

```bash
# En otra terminal, desde el directorio raíz
cd comida_rapida/home

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Admin React**: http://localhost:5173/admin
- **Admin Django Integrado**: http://localhost:5173/admin → "Admin Django"
- **Admin Django Directo**: http://localhost:8000/admin
- **Backend API**: http://localhost:8000/api/

## 👤 Credenciales de Acceso

### Usuario Administrador
- **Usuario**: admin
- **Contraseña**: (la que configuraste al crear el superusuario)

Si no creaste un superusuario, puedes crear uno con:
```bash
cd backend
python3 manage.py createsuperuser
```

## 🎯 **Nueva Funcionalidad: Admin Integrado**

### **Panel de Administración Unificado**
- ✅ **Admin de Django embebido** en React
- ✅ **Acceso directo** desde el panel de React
- ✅ **Interfaz unificada** para toda la gestión
- ✅ **Navegación fluida** entre React y Django Admin

### **Cómo Funciona**
1. **Accede al admin de React**: http://localhost:5173/admin
2. **Inicia sesión** con tus credenciales de Django
3. **Selecciona "Admin Django"** en el sidebar
4. **Gestiona todo** desde la interfaz integrada

### **Ventajas del Sistema Integrado**
- 🎨 **Interfaz moderna** de React
- 🔐 **Autenticación unificada**
- 📊 **Dashboard con estado del sistema**
- 🔄 **Cambios en tiempo real**
- 📱 **Responsive design**
- 🚀 **Rendimiento optimizado**

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/logout/` - Cerrar sesión

### Categorías
- `GET /api/categories/` - Listar categorías
- `GET /api/categories/{id}/` - Obtener categoría
- `GET /api/categories/{id}/products/` - Productos de categoría
- `POST /api/categories/` - Crear categoría (admin)
- `PUT /api/categories/{id}/` - Actualizar categoría (admin)
- `DELETE /api/categories/{id}/` - Eliminar categoría (admin)

### Productos
- `GET /api/products/` - Listar productos
- `GET /api/products/{id}/` - Obtener producto
- `GET /api/products/featured/` - Productos destacados
- `GET /api/products/search/?q={query}` - Buscar productos
- `POST /api/products/` - Crear producto (admin)
- `PUT /api/products/{id}/` - Actualizar producto (admin)
- `DELETE /api/products/{id}/` - Eliminar producto (admin)

### Contenido Dinámico
- `GET /api/hero/active/` - Hero Section activa
- `GET /api/about/active/` - About Section activa
- `GET /api/contact/active/` - Contact Info activa
- `GET /api/featured/active/` - Featured Product activo

### Parámetros de Consulta
- `category=all` - Filtrar por categoría
- `search=query` - Buscar por nombre/descripción

## 🎨 Estructura del Proyecto

```
comida_rapida/home/
├── backend/                 # Backend Django
│   ├── api/                # API REST + Admin Django
│   ├── fastfood/           # Configuración Django
│   ├── products/           # App de productos
│   ├── manage.py
│   └── requirements.txt
├── src/                    # Frontend React
│   ├── components/         # Componentes
│   │   ├── admin/         # Componentes de admin
│   │   │   ├── DjangoAdmin.tsx  # Admin Django integrado
│   │   │   └── ...
│   │   ├── layout/        # Componentes de layout
│   │   ├── public/        # Componentes públicos
│   │   └── ui/            # Componentes UI
│   ├── context/           # Contextos React
│   ├── services/          # Servicios API
│   ├── pages/             # Páginas
│   └── types/             # Tipos TypeScript
├── package.json
└── README.md
```

## 🔧 Scripts Disponibles

### Backend
```bash
# Ejecutar migraciones
python3 manage.py migrate

# Crear superusuario
python3 manage.py createsuperuser

# Poblar datos de ejemplo
python3 populate_data.py
python3 populate_content.py

# Iniciar servidor
python3 manage.py runserver 8000
```

### Frontend
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview de producción
npm run preview

# Linting
npm run lint
```

### Scripts Integrados
```bash
# Iniciar sistema completo con admin integrado
./start-admin.sh

# Iniciar sistema básico
./start-dev.sh
```

## 🚀 Despliegue

### Backend (Django)
1. Configurar variables de entorno para producción
2. Usar PostgreSQL en lugar de SQLite
3. Configurar archivos estáticos
4. Usar Gunicorn + Nginx

### Frontend (React)
1. Ejecutar `npm run build`
2. Servir archivos estáticos con Nginx
3. Configurar proxy para API

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de Django y React
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de que los puertos 8000 y 5173 estén disponibles
4. Revisa los logs del servidor para errores
5. Verifica que el superusuario esté creado

## 🎯 Próximas Características

- [ ] Sistema de pedidos
- [ ] Gestión de inventario
- [ ] Reportes y analytics
- [ ] Notificaciones push
- [ ] Integración con pagos
- [ ] App móvil
- [ ] **Editor visual para contenido dinámico**
- [ ] **Sistema de roles y permisos avanzado** 