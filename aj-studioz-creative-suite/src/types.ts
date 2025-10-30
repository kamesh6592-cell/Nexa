import type { ReactNode } from "react";

export type View = 'builder' | 'imageEditor' | 'imageGenerator' | 'imageAnalyzer' | 'chat' | 'logoDesigner';
export type Plan = string[];

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  base64Data: string;
}

export interface AdvancedOptions {
  customCss: string;
  themeOverrides: {
    primary: string;
    secondary: string;
    accent: string;
  }
}

export interface PromptState {
  prompt: string;
  advancedOptions: AdvancedOptions;
  uploadedFiles: UploadedFile[];
}

export interface LogoConcept {
  description: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface HistorySnapshot {
    timestamp: number;
    data: WebsiteData;
}

export interface AnalysisResult {
  ocrText: string;
  answer: string;
}


export interface NavLink {
  text: string;
  href: string;
}

export interface NavbarData {
  brandName: string;
  links: NavLink[];
}

export interface HeroData {
  headline: string;
  subheadline: string;
  ctaButtonText: string;
}

export interface AboutData {
  title: string;
  paragraph1: string;
  paragraph2: string;
  imageUrl: string;
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

export interface ServicesData {
  title: string;
  services: ServiceItem[];
}

export interface ContactData {
  title: string;
  address: string;
  email: string;
  phone: string;
}

export interface FooterData {
  copyrightText: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  instagramUrl?: string;
}

export interface WebsiteData {
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    base: string;
    fontHeading: string;
    fontBody: string;
  };
  navbar: NavbarData;
  hero: HeroData;
  about: AboutData;
  services: ServicesData;
  contact: ContactData;
  footer: FooterData;
  groundingSources?: {
    web?: {
      uri: string;
      title: string;
    };
  }[];
  customCss?: string;
}