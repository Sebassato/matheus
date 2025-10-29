
import React from 'react';
import { useCart } from '../hooks/useCart';
import { TrashIcon, PlusIcon, MinusIcon } from './icons';

interface CartViewProps {
  onCheckout: () => void;
  onContinueShopping: () => void;
}

const CartView: React.FC<CartViewProps> = ({ onCheckout, onContinueShopping }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="text-center p-8 bg-dark-gray rounded-lg">
        <h2 className="text-3xl font-bold text-neon-yellow mb-4">Seu carrinho está vazio.</h2>
        <p className="text-gray-400 mb-6">Adicione produtos ao seu carrinho para vê-los aqui.</p>
        <button
          onClick={onContinueShopping}
          className="bg-neon-blue text-black font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
        >
          Continuar Comprando
        </button>
      </div>
    );
  }

  return (
    <div className="bg-dark-gray p-4 sm:p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-neon-yellow mb-6 border-b-2 border-neon-blue pb-4">Seu Carrinho</h2>
      <div className="space-y-4">
        {cart.map(item => {
          const imageUrl = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : 'https://picsum.photos/200';
          return (
            <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-medium-gray rounded-lg">
              <div className="flex items-center mb-4 sm:mb-0">
                <img src={imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-400">
                    R$ {item.price.toFixed(2)} (Aluguel)
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 bg-dark-gray rounded-l-md hover:bg-gray-700"><MinusIcon className="w-4 h-4" /></button>
                  <input type="text" value={item.quantity} readOnly className="w-12 text-center bg-medium-gray border-y border-gray-600" />
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 bg-dark-gray rounded-r-md hover:bg-gray-700"><PlusIcon className="w-4 h-4" /></button>
                </div>
                <p className="font-bold text-neon-yellow w-24 text-right">R$ {(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 p-2"><TrashIcon className="w-6 h-6" /></button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 pt-6 border-t-2 border-medium-gray flex flex-col sm:flex-row justify-between items-center">
        <div className="text-2xl font-bold">
          Total: <span className="text-neon-yellow">R$ {cartTotal.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          className="mt-4 sm:mt-0 bg-neon-yellow text-black font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-neon-yellow"
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
};

export default CartView;
