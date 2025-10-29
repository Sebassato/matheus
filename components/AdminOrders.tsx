
import React, { useState, useEffect, useCallback } from 'react';
import { Order } from '../types';
import { api } from '../services/apiService';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    const data = await api.getOrders();
    setOrders(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) return <p>Carregando pedidos...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-neon-yellow mb-6">Pedidos Recebidos</h2>
      {orders.length === 0 ? (
        <p className="text-gray-400">Nenhum pedido recebido ainda.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-medium-gray p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{order.customerName}</p>
                  <p className="text-sm text-gray-400">Pedido #{order.id}</p>
                   <p className="text-sm text-gray-400">Data: {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-neon-yellow">R$ {order.total.toFixed(2)}</p>
                   <span className={`text-sm font-medium px-2 py-1 rounded-full capitalize ${
                      order.status === 'paid' ? 'bg-green-900 text-green-300' : 
                      order.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-blue-900 text-blue-300'
                   }`}>{order.status}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-dark-gray">
                <h4 className="font-semibold mb-2">Itens:</h4>
                <ul className="list-disc list-inside text-gray-300">
                  {order.items.map(item => (
                    <li key={item.id}>{item.name} (x{item.quantity})</li>
                  ))}
                </ul>
                 <h4 className="font-semibold mt-4 mb-2">Contato:</h4>
                 <p className="text-gray-300">WhatsApp: {order.whatsapp}</p>
                 <p className="text-gray-300">Endereço: {order.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
