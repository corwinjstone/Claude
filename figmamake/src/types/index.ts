export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: string;
  image: string;
  category: 'meats' | 'veggies' | 'fruits' | 'breads';
}

export interface CartItem {
  product: Product;
  quantity: number;
}
