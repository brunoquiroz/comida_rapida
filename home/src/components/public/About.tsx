import React, { useState, useEffect } from 'react';
import { Clock, Heart, Leaf } from 'lucide-react';
import { getAboutSection, type AboutSection } from '../../services/api';

export default function About() {
  const [aboutData, setAboutData] = useState<AboutSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await getAboutSection();
        setAboutData(data);
      } catch (error) {
        console.error('Error fetching about data:', error);
        // Datos por defecto si no hay datos en la API
        setAboutData({
          id: 1,
          title: 'Comida rápida con alma y sabor',
          subtitle: 'Somos más que una empresa de comida rápida',
          description: 'Creemos que cada bocado debe ser una experiencia memorable, donde la rapidez no compromete la calidad, y el sabor urbano se encuentra con la tradición culinaria.',
          image_1: 'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=400',
          image_1_url: 'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=400',
          image_2: 'https://images.pexels.com/photos/3662755/pexels-photo-3662755.jpeg?auto=compress&cs=tinysrgb&w=400',
          image_2_url: 'https://images.pexels.com/photos/3662755/pexels-photo-3662755.jpeg?auto=compress&cs=tinysrgb&w=400',
          years_experience: 5,
          is_active: true,
          created_at: '',
          updated_at: ''
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const values = [
    {
      icon: <Clock className="w-8 h-8 text-red-600" />,
      title: 'Rapidez sin prisa',
      description: 'Cada producto se prepara al momento, garantizando frescura y calidad en tiempo récord.'
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: 'Ingredientes premium',
      description: 'Seleccionamos cuidadosamente cada ingrediente para ofrecerte sabores auténticos y únicos.'
    },
    {
      icon: <Leaf className="w-8 h-8 text-red-600" />,
      title: 'Frescura garantizada',
      description: 'Todo se prepara fresco diariamente, desde nuestras salsas hasta el pan artesanal.'
    }
  ];

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando información...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!aboutData) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {aboutData.title.split(' ').map((word, index) => 
                index === 2 ? <span key={index} className="text-red-600">{word} </span> : word + ' '
              )}
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {aboutData.description}
            </p>

            <div className="space-y-6">
              {values.map((value, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-red-50 rounded-lg p-3 flex-shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src={aboutData.image_1_url || aboutData.image_1}
                alt="Chef preparando comida"
                className="rounded-2xl shadow-lg w-full h-64 object-cover"
              />
              <img
                src={aboutData.image_2_url || aboutData.image_2}
                alt="Cocina en acción"
                className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8"
              />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              <div className="text-3xl font-bold text-red-600 mb-2">{aboutData.years_experience}+</div>
              <div className="text-gray-600 font-medium">Años creando<br />experiencias únicas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}