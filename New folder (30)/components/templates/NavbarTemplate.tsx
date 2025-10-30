import React from 'react';
import type { NavbarData } from '../../types';

export const NavbarTemplate: React.FC<NavbarData> = ({ brandName, links }) => {
  return (
    <nav className="bg-base-100/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="text-xl font-bold text-neutral" data-path="navbar.brandName">
          {brandName}
        </a>
        <div className="hidden md:flex space-x-6 items-center">
          {links.map((link, index) => (
            <a key={link.href} href={link.href} className="text-neutral/80 hover:text-neutral transition-colors" data-path={`navbar.links[${index}].text`}>
              {link.text}
            </a>
          ))}
           <a href={links.find(l => l.href ==='#contact')?.href || '#'} className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
};