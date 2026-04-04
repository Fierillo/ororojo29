import React, { ReactNode } from "react";

/**
 * Domain Models
 */

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  intro_text?: string;
  image_id?: number | null;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  specs?: string;
  category_id: number | null;
  category_name?: string;
  featured: boolean;
  image_id: number | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface AdminData {
  whatsappNumber?: string;
  contactEmail?: string;
  location?: string;
  schedule?: string;
}

export interface Session {
  token: string;
  expires_at: string | Date;
}

export interface Image {
  id: number;
  filename: string;
  mime_type: string;
  data: Buffer;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

/**
 * UI & Helper Types
 */

export type AdminView = 'products' | 'categories' | 'config';

export interface ImageOptions {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  withFallback?: boolean;
}

export interface CropImageResult {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * Component Props
 */

export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

export interface ProductCardProps {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string | null | undefined;
  category: string;
}

export interface FeaturedProductsProps {
  categories: Category[];
  products: Product[];
}

export interface ProductGridProps {
  categories: Category[];
  products: Product[];
}

export interface CategoryFilterProps {
  categories: Category[];
  baseUrl?: string;
}

export interface WhatsAppButtonProps {
  message?: string;
  phone?: string;
}
