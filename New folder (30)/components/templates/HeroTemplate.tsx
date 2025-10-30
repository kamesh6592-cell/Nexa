import React from 'react';
import type { HeroData } from '../../types';

export const HeroTemplate: React.FC<HeroData> = ({ headline, subheadline, ctaButtonText }) => {
  return (
    <section id="home" className="bg-base-100 py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-neutral leading-tight" data-path="hero.headline">
          {headline}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-neutral/80 max-w-3xl mx-auto" data-path="hero.subheadline">
          {subheadline}
        </p>
        <button className="mt-8 bg-accent text-white font-bold py-3 px-8 rounded-full text-lg hover:opacity-90 transition-transform transform hover:scale-105" data-path="hero.ctaButtonText">
          {ctaButtonText}
        </button>
      </div>
    </section>
  );
};