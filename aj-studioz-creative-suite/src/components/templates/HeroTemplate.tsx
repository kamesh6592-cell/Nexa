import React from 'react';
import type { HeroData } from '../../types';

export const HeroTemplate: React.FC<HeroData> = ({ headline, subheadline, ctaButtonText }) => {
  return (
    <section id="home" className="relative overflow-hidden bg-base-100 py-20 md:py-32">
      {/* Style tag for keyframes and animation classes */}
      <style>{`
        @keyframes blob-move {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob-move 12s ease-in-out infinite alternate;
        }
        .delay-1 {
          animation-delay: -3s;
        }
        .delay-2 {
          animation-delay: -6s;
        }
      `}</style>

      {/* Background Blobs Container */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-blob delay-1"></div>
        <div className="absolute -bottom-16 left-1/3 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl animate-blob delay-2"></div>
      </div>

      {/* Content needs to be in a relative container to sit on top */}
      <div className="relative z-10 container mx-auto px-6 text-center">
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
