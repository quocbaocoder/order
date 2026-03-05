export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: number;
  created_at: string;
  total: number;
  items: CartItem[];
  synced_to_sheets: boolean;
}
