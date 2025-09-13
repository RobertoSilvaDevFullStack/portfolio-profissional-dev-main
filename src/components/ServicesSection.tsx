import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Code, Share2, Siren, Wrench, Zap, type LucideIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const iconComponents: { [key: string]: LucideIcon } = {
  Code,
  Share2,
  Zap,
  Siren,
  Wrench,
};

const ServicesSection = (props: React.HTMLAttributes<HTMLElement>) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  return (
    <section {...props} className="w-full py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">O Que Eu Ofereço</h2>
          <div className="w-24 h-1 bg-light-cyan mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-56 w-full" />
            ))
          ) : (
            services.map((service) => {
              const IconComponent = iconComponents[service.icon];
              return (
                <Card key={service.id} className="bg-gray-800 border-gray-700 text-center p-6">
                  <CardHeader className="flex items-center justify-center">
                    {IconComponent ? <IconComponent className="w-10 h-10 text-light-cyan" /> : null}
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-white text-xl mb-2">{service.title}</CardTitle>
                    <p className="text-gray-400">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;