export type ProductCategory =
  | "marmitas"
  | "fitness"
  | "carnes"
  | "bebidas"
  | "sobremesas"
  | "pastel";

export interface Product {
  id: string;
  category: string;
  name: string;
  description: string;
  long_description?: string | null;
  price: number;
  image_url: string;
  badge?: string | null;
  badge_color?: string | null;
  stock: number;
  active: boolean;
  sort_order: number;
  // legacy aliases used by existing components
  desc?: string;
  image?: string;
  tag?: string | null;
}

export interface Ingredient {
  id: string;
  product_id: string;
  name: string;
  price: number;
  default_included: boolean;
  removable: boolean;
  stock: number;
  sort_order: number;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  nickname: string | null;
  username: string | null;
  avatar_url: string | null;
  role: "admin" | "user";
  loyalty_points: number;
}

export interface Testimonial {
  id: string;
  user_id: string;
  rating: number;
  content: string | null;
  created_at: string;
  author?: Pick<Profile, "nickname" | "username" | "avatar_url" | "full_name"> | null;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  items: Array<{ product_id: string; name: string; price: number; qty: number; ingredients?: string[] }>;
  note: string | null;
  created_at: string;
}

export interface AppSettings {
  address: string;
  hours: string;
  delivery_time: string;
  pickup_time: string;
  payment_methods: string[];
}
