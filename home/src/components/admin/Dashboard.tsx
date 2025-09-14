import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  Database, 
  Settings, 
  ExternalLink,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [systemStatus, setSystemStatus] = useState({
    backend: false,
    database: false,
    api: false
  });

  useEffect(() => {
    // Verificar estado del sistema
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      // Verificar backend
      const backendResponse = await fetch('http://localhost:8000/api/categories/');
      const apiResponse = await fetch('http://localhost:8000/api/products/');
      
      setSystemStatus({
        backend: backendResponse.ok,
        database: backendResponse.ok,
        api: apiResponse.ok
      });
    } catch (error) {
      setSystemStatus({
        backend: false,
        database: false,
        api: false
      });
    }
  };

  const stats = [
    {
      title: 'Productos Activos',
      value: '15',
      icon: <ShoppingBag className="w-8 h-8 text-blue-500" />,
      change: '+2 esta semana',
      color: 'blue'
    },
    {
      title: 'Categorías',
      value: '5',
      icon: <Star className="w-8 h-8 text-green-500" />,
      change: 'Todas activas',
      color: 'green'
    },
    {
      title: 'Contenido Dinámico',
      value: '4',
      icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
      change: 'Secciones configuradas',
      color: 'purple'
    },
    {
      title: 'Usuarios Admin',
      value: '1',
      icon: <Users className="w-8 h-8 text-orange-500" />,
      change: 'Acceso completo',
      color: 'orange'
    }
  ];

  const quickActions = [
    {
      title: 'Admin Django',
      description: 'Acceso completo al panel de administración de Django',
      icon: <Database className="w-6 h-6" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      link: 'http://localhost:8000/admin/',
      external: true
    },
    {
      title: 'Gestionar Productos',
      description: 'Añadir, editar o eliminar productos del menú',
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'bg-green-500 hover:bg-green-600',
      action: 'products'
    },
    {
      title: 'Configurar Contenido',
      description: 'Personalizar secciones del sitio web',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: 'settings'
    }
  ];

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-500' : 'text-red-500';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Bienvenido, {user?.username}. Aquí tienes una vista general del sistema.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Última actualización</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleString('es-CL')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className="text-right">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Estado del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            {getStatusIcon(systemStatus.backend)}
            <div>
              <p className="font-medium text-gray-900">Backend Django</p>
              <p className={`text-sm ${getStatusColor(systemStatus.backend)}`}>
                {systemStatus.backend ? 'Conectado' : 'Desconectado'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            {getStatusIcon(systemStatus.database)}
            <div>
              <p className="font-medium text-gray-900">Base de Datos</p>
              <p className={`text-sm ${getStatusColor(systemStatus.database)}`}>
                {systemStatus.database ? 'Operativa' : 'Error'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            {getStatusIcon(systemStatus.api)}
            <div>
              <p className="font-medium text-gray-900">API REST</p>
              <p className={`text-sm ${getStatusColor(systemStatus.api)}`}>
                {systemStatus.api ? 'Disponible' : 'No disponible'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              
              {action.external ? (
                <a
                  href={action.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Abrir en nueva pestaña
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Ir a sección
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-gray-900">Sistema iniciado correctamente</p>
              <p className="text-sm text-gray-600">Hace 2 minutos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Database className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium text-gray-900">Base de datos conectada</p>
              <p className="text-sm text-gray-600">Hace 5 minutos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Settings className="w-5 h-5 text-purple-500" />
            <div>
              <p className="font-medium text-gray-900">Configuración cargada</p>
              <p className="text-sm text-gray-600">Hace 10 minutos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}