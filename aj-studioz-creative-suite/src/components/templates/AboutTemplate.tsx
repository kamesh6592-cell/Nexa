import React from 'react';
import type { AboutData } from '../../types';

export const AboutTemplate: React.FC<AboutData> = ({ title, paragraph1, paragraph2, imageUrl }) => {
  return (
    <section id="about" className="py-20 bg-secondary/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral mb-4" data-path="about.title">{title}</h2>
            <p className="text-neutral/80 mb-4 leading-relaxed" data-path="about.paragraph1">{paragraph1}</p>
            <p className="text-neutral/80 leading-relaxed" data-path="about.paragraph2">{paragraph2}</p>
          </div>
          <div className="order-1 md:order-2">
            <img src={imageUrl} alt={title} className="rounded-lg shadow-xl w-full h-auto object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};