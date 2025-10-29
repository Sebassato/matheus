
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Agora representa o preço do aluguel
  stock: number;
  imageUrls: string[];
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
    id: string;
    customerName: string;
    address: string;
    whatsapp: string;
    deliveryDateTime: string;
    paymentMethod: 'pix' | 'card' | 'boleto';
    items: CartItem[];
    total: number;
    status: 'pending' | 'paid' | 'delivered';
    createdAt: string;
}
