export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price: number; // in cents
  compare_at_price: number | null;
  category: string;
  images: string[];
  specs: Record<string, string>;
  stock: number;
  status: 'available' | 'sold';
  is_digital: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  items: OrderItem[];
  total: number; // in cents
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  stripe_session_id: string | null;
  shipping_address: ShippingAddress | null;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  title: string;
  price: number; // in cents
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  full_name: string;
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  addresses: ShippingAddress[];
  role: 'user' | 'admin';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

// Database type helper for Supabase client
export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id'>;
        Update: Partial<Omit<Category, 'id'>>;
      };
    };
  };
}
