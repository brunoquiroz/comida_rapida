import React, { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import Dashboard from '../components/admin/Dashboard';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import TagManagement from '../components/admin/TagManagement';
import FeaturedProductAdmin from '../components/admin/FeaturedProductAdmin';
import AboutUs from '../components/admin/AboutUs';
import Contact from '../components/admin/Contact';
import HeroSection from '../components/admin/HeroSection';
import Settings from '../components/admin/Settings';
import DjangoAdmin from '../components/admin/DjangoAdmin';
import IngredientManagement from '../components/admin/IngredientManagement';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Login from '../components/admin/Login';

const AdminContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { isLoggedIn, isAdminUser, logout } = useAuth();
  
  if (!isLoggedIn || !isAdminUser) {
    return <Login />;
  }

  // Si la sección activa es django-admin, mostrar el componente DjangoAdmin
  if (activeSection === 'django-admin') {
    return (
      <DjangoAdmin 
        onBack={() => setActiveSection('dashboard')} 
      />
    );
  }
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={handleLogout} />
      
      <div className="flex-1 overflow-auto p-8">
        {/* Demo banner */}
        <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-900">
          <div className="font-semibold">Modo demo estático</div>
          <div className="text-sm">Esta sección es solo de demostración. Las acciones de crear, editar y eliminar están deshabilitadas y no hay persistencia.</div>
        </div>
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'products' && <ProductManagement />}
        {activeSection === 'orders' && <OrderManagement />}
        {activeSection === 'categories' && <CategoryManagement />}
        {activeSection === 'ingredients' && <IngredientManagement />}
        {activeSection === 'tags' && <TagManagement />}
        {activeSection === 'featured' && <FeaturedProductAdmin />}
        {activeSection === 'about' && <AboutUs />}
        {activeSection === 'contact' && <Contact />}
        {activeSection === 'hero' && <HeroSection />}
        {activeSection === 'settings' && <Settings />}
      </div>
    </div>
  );
};

const Admin: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AdminContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default Admin;