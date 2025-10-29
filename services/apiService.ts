
import { Product, Order } from '../types';

let mockProducts: Product[] = [
  {
    id: '1',
    name: 'Drone de Corrida FPV',
    description: 'Drone ultrarrápido para corridas FPV, com câmera de alta definição e chassi de fibra de carbono. Bateria de longa duração e controle preciso.',
    price: 500.00,
    stock: 15,
    imageUrls: ['https://picsum.photos/seed/drone/800/600', 'https://picsum.photos/seed/drone2/800/600', 'https://picsum.photos/seed/drone3/800/600'],
    category: 'Drones',
  },
  {
    id: '2',
    name: 'Câmera 4K Profissional',
    description: 'Grave vídeos com qualidade de cinema. Sensor full-frame, lentes intercambiáveis e gravação em 4K a 120fps.',
    price: 750.00,
    stock: 8,
    imageUrls: ['https://picsum.photos/seed/camera/800/600'],
    category: 'Equipamento de Vídeo',
  },
  {
    id: '3',
    name: 'Kit de Iluminação LED RGB',
    description: 'Conjunto com 3 painéis de LED RGB, tripés e difusores. Controle total de cor e intensidade via app.',
    price: 250.00,
    stock: 22,
    imageUrls: ['https://picsum.photos/seed/lights/800/600', 'https://picsum.photos/seed/lights2/800/600'],
    category: 'Iluminação',
  },
    {
    id: '4',
    name: 'Microfone de Lapela Sem Fio',
    description: 'Sistema de microfone sem fio de alta qualidade para entrevistas e gravações. Áudio cristalino com alcance de 100m.',
    price: 180.00,
    stock: 30,
    imageUrls: ['https://picsum.photos/seed/mic/800/600'],
    category: 'Equipamento de Áudio',
  },
  {
    id: '5',
    name: 'Mesa de Som Digital 16 Canais',
    description: 'Mixer digital compacto com 16 canais, efeitos integrados e interface de áudio USB para gravação multicanal.',
    price: 1000.00,
    stock: 5,
    imageUrls: ['https://picsum.photos/seed/mixer/800/600'],
    category: 'Equipamento de Áudio',
  },
  {
    id: '6',
    name: 'Estabilizador Gimbal 3 Eixos',
    description: 'Gimbal profissional para câmeras DSLR e Mirrorless. Movimentos suaves e estabilizados para produções cinematográficas.',
    price: 400.00,
    stock: 12,
    imageUrls: ['https://picsum.photos/seed/gimbal/800/600', 'https://picsum.photos/seed/gimbal2/800/600'],
    category: 'Equipamento de Vídeo',
  },
];

let mockOrders: Order[] = [];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  getProducts: async (): Promise<Product[]> => {
    await simulateDelay(500);
    console.log('API: Fetching all products');
    return [...mockProducts];
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await simulateDelay(300);
    console.log(`API: Fetching product with id ${id}`);
    return mockProducts.find(p => p.id === id);
  },
  
  submitOrder: async (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> => {
    await simulateDelay(1000);
    const newOrder: Order = {
        ...orderData,
        id: new Date().getTime().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
    };
    mockOrders.push(newOrder);
    console.log('API: Order submitted', newOrder);
    
    // Simulate stock update
    orderData.items.forEach(item => {
        const productIndex = mockProducts.findIndex(p => p.id === item.id);
        if (productIndex !== -1) {
            mockProducts[productIndex].stock -= item.quantity;
        }
    });

    return newOrder;
  },

  processPayment: async (orderId: string): Promise<{ success: boolean; message: string }> => {
    await simulateDelay(1500);
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        mockOrders[orderIndex].status = 'paid';
        console.log(`API: Payment processed for order ${orderId}`);
        return { success: true, message: 'Pagamento confirmado!' };
    }
    return { success: false, message: 'Pedido não encontrado.' };
  },

  // Admin functions
  getOrders: async (): Promise<Order[]> => {
      await simulateDelay(500);
      console.log('API: Fetching all orders');
      return [...mockOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
      await simulateDelay(500);
      const newProduct: Product = {
          ...productData,
          id: new Date().getTime().toString(),
      };
      mockProducts.unshift(newProduct);
      console.log('API: Product added', newProduct);
      return newProduct;
  },

  updateProduct: async (productData: Product): Promise<Product> => {
      await simulateDelay(500);
      const index = mockProducts.findIndex(p => p.id === productData.id);
      if (index !== -1) {
          mockProducts[index] = productData;
          console.log('API: Product updated', productData);
          return productData;
      }
      throw new Error('Product not found');
  },

  deleteProduct: async (productId: string): Promise<{ success: boolean }> => {
      await simulateDelay(500);
      const initialLength = mockProducts.length;
      mockProducts = mockProducts.filter(p => p.id !== productId);
      console.log(`API: Product deleted: ${productId}`);
      return { success: mockProducts.length < initialLength };
  },
};
