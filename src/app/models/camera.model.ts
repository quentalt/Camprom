export interface CameraDB {
  id: number;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  discount?: number;
  rating: number;
  image: string;
  features: string[];
  is_on_sale: boolean;
  sale_label?: string;
  megapixels: number;
  type: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Camera {
  category: string;
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  image: string;
  features: string[];
  isOnSale: boolean;
  saleLabel?: string;
  megapixels: number;
  type: string;
}

