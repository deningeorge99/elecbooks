export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  seller_id: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  seller_name?: string;
}