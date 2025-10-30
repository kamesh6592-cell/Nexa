import React from 'react';
import type { ServicesData } from '../../types';
import { Icon } from '../icons/Icon';

export const ServicesTemplate: React.FC<ServicesData> = ({ title, services }) => {
  return (
    <section id="services" className="py-20 bg-base-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral" data-path="services.title">{title}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-secondary/10 p-8 rounded-lg text-center shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/20 text-primary p-4 rounded-full">
                   <Icon name={service.icon} className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-neutral mb-2" data-path={`services.services[${index}].title`}>{service.title}</h3>
              <p className="text-neutral/80" data-path={`services.services[${index}].description`}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};