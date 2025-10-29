import React, { useState } from 'react';
import AdminProductList from './AdminProductList';
import AdminOrders from './AdminOrders';
import AdminPaymentSettings from './AdminPaymentSettings';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminView = 'dashboard' | 'products' | 'orders' | 'payment-settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [view, setView] = useState<AdminView>('dashboard');

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <AdminMetrics />;
      case 'products':
        return <AdminProductList />;
      case 'orders':
        return <AdminOrders />;
      case 'payment-settings':
        return <AdminPaymentSettings />;
      default:
        return <AdminMetrics />;
    }
  };

  const NavButton: React.FC<{
    currentView: AdminView;
    targetView: AdminView;
    onClick: (view: AdminView) => void;
    children: React.ReactNode;
    icon: string;
  }> = ({ currentView, targetView, onClick, children, icon }) => (
    <button
      onClick={() => onClick(targetView)}
      className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg transition-colors ${
        currentView === targetView
          ? 'bg-neon-blue text-black font-bold'
          : 'text-gray-300 hover:bg-medium-gray'
      }`}
    >
        <span className="material-icons">{icon}</span>
        <span>{children}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 bg-dark-gray p-4 rounded-lg flex-shrink-0">
        <h2 className="text-xl font-bold text-neon-yellow mb-6">Painel Admin</h2>
        <nav className="space-y-2">
          <NavButton currentView={view} targetView="dashboard" onClick={setView} icon="dashboard">Dashboard</NavButton>
          <NavButton currentView={view} targetView="products" onClick={setView} icon="inventory_2">Produtos</NavButton>
          <NavButton currentView={view} targetView="orders" onClick={setView} icon="receipt_long">Pedidos</NavButton>
          <NavButton currentView={view} targetView="payment-settings" onClick={setView} icon="credit_card">Config. Pagamento</NavButton>
        </nav>
      </aside>
      <main className="flex-grow bg-dark-gray p-6 rounded-lg">
        {renderView()}
      </main>
    </div>
  );
};

const AdminMetrics: React.FC = () => {
    // These would be fetched from the API in a real app
    const metrics = {
        totalSales: 12530.50,
        totalOrders: 42,
        bestSeller: 'Drone de Corrida FPV'
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-neon-yellow mb-6">Métricas Principais</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-medium-gray p-6 rounded-lg">
                    <h3 className="text-gray-400 text-sm">Total de Vendas</h3>
                    <p className="text-3xl font-bold text-white mt-2">R$ {metrics.totalSales.toFixed(2)}</p>
                </div>
                <div className="bg-medium-gray p-6 rounded-lg">
                    <h3 className="text-gray-400 text-sm">Total de Pedidos</h3>
                    <p className="text-3xl font-bold text-white mt-2">{metrics.totalOrders}</p>
                </div>
                <div className="bg-medium-gray p-6 rounded-lg">
                    <h3 className="text-gray-400 text-sm">Produto Mais Vendido</h3>
                    <p className="text-3xl font-bold text-white mt-2">{metrics.bestSeller}</p>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;