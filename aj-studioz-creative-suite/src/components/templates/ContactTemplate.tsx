import React from 'react';
import type { ContactData } from '../../types';

export const ContactTemplate: React.FC<ContactData> = ({ title, address, email, phone }) => {
  return (
    <section id="contact" className="py-20 bg-secondary/10">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral mb-8" data-path="contact.title">{title}</h2>
        <div className="max-w-md mx-auto text-lg text-neutral/80 space-y-4">
            <p><strong>Address:</strong> <span data-path="contact.address">{address}</span></p>
            <p><strong>Email:</strong> <a href={`mailto:${email}`} className="text-primary hover:underline" data-path="contact.email">{email}</a></p>
            <p><strong>Phone:</strong> <span data-path="contact.phone">{phone}</span></p>
        </div>
      </div>
    </section>
  );
};