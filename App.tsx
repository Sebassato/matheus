
import React, { useState, useMemo } from 'react';
import { Product, CartItem } from './types';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { CartProvider } from './hooks/useCart';

export type View = 'list' | 'detail' | 'cart' | 'checkout' | 'admin-login' | 'admin-dashboard' | 'order-success';

const App: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [lastOrder, setLastOrder] = useState<{
    customerName: string,
    total: number,
    products: CartItem[],
    deliveryDate: string,
    deliveryTime: string,
    customerPhone: string,
    address: string,
  } | null>(null);

  const navigateTo = (newView: View, product: Product | null = null) => {
    setSelectedProduct(product);
    setView(newView);
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView('admin-dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('list');
  };
  
  const handleCheckoutSuccess = (orderData: any) => {
    setLastOrder(orderData);
    setView('order-success');
  };

  const content = useMemo(() => {
    switch (view) {
      case 'list':
        return <ProductList onProductSelect={(product) => navigateTo('detail', product)} />;
      case 'detail':
        return selectedProduct ? <ProductDetail product={selectedProduct} onBack={() => navigateTo('list')} /> : <ProductList onProductSelect={(product) => navigateTo('detail', product)} />;
      case 'cart':
        return <CartView onCheckout={() => navigateTo('checkout')} onContinueShopping={() => navigateTo('list')} />;
      case 'checkout':
        return <CheckoutView onCheckoutSuccess={handleCheckoutSuccess} />;
      case 'order-success':
        const { customerName, total, products, deliveryDate, deliveryTime, customerPhone, address } = lastOrder!;
        
        const ADMIN_PHONE = '5521984791222';
        
        const itemsSummary = products.map(p => `${p.quantity}x ${p.name} (Aluguel)`).join('; ');

        const textParts = [
            `📦 *Novo pedido de aluguel confirmado!*`,
            ``,
            `👤 *Cliente:* ${customerName}`,
            `📞 *Contato:* ${customerPhone}`,
            `💰 *Valor total:* R$${total.toFixed(2)}`,
            `🏠 *Endereço:* ${address}`,
            `📅 *Data de entrega:* ${deliveryDate} às ${deliveryTime}`,
            `🛍️ *Itens:* ${itemsSummary}`,
            ``,
            `✅ Pagamento confirmado com sucesso!`
        ];

        const text = encodeURIComponent(textParts.join('\n'));
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_PHONE}&text=${text}`;
        
        return (
          <div className="text-center p-8 max-w-2xl mx-auto bg-dark-gray rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-neon-yellow mb-4">Pedido Realizado com Sucesso!</h2>
            <p className="text-lg mb-6">Obrigado, {customerName}! Para finalizar e agendar sua entrega, por favor envie a confirmação do pedido para nossa equipe via WhatsApp.</p>
            <p className="mb-8">Clique no botão abaixo para abrir o WhatsApp com a mensagem pronta para enviar ao administrador.</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
              Enviar Confirmação via WhatsApp
            </a>
            <button onClick={() => navigateTo('list')} className="mt-8 block mx-auto text-neon-blue hover:underline">Voltar à loja</button>
          </div>
        );
      case 'admin-login':
        return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
      case 'admin-dashboard':
        return isAuthenticated ? <AdminDashboard onLogout={handleLogout} /> : <AdminLogin onLoginSuccess={handleLoginSuccess} />;
      default:
        return <ProductList onProductSelect={(product) => navigateTo('detail', product)} />;
    }
  }, [view, selectedProduct, isAuthenticated, lastOrder]);

  return (
    <CartProvider>
      <div className="min-h-screen bg-amoled-black">
        <Header 
          onNavigate={(view) => setView(view)} 
          isAdmin={isAuthenticated} 
          onLogout={handleLogout} 
        />
        <main className="container mx-auto p-4 md:p-8">
          {content}
        </main>
        <footer className="text-center p-4 text-gray-500 border-t border-medium-gray mt-12">
            <p>&copy; 2024 Catálogo Digital Sincronizado. Todos os direitos reservados.</p>
        </footer>
      </div>
    </CartProvider>
  );
};

export default App;
