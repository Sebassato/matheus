import React from 'react';
import { View } from '../App';
import { useCart } from '../hooks/useCart';
import { CartIcon } from './icons';

interface HeaderProps {
  onNavigate: (view: View) => void;
  isAdmin: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, isAdmin, onLogout }) => {
  const { cartCount } = useCart();

  return (
    <header className="bg-dark-gray sticky top-0 z-50 shadow-lg shadow-black/30">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a onClick={() => onNavigate('list')} className="cursor-pointer text-2xl font-bold tracking-wider">
              <span className="text-neon-yellow">Mega</span><span className="text-neon-blue">Loca</span>
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <a onClick={() => onNavigate('list')} className="cursor-pointer text-gray-300 hover:text-neon-yellow transition-colors duration-200">
              Catálogo
            </a>
            {isAdmin ? (
                <>
                    <a onClick={() => onNavigate('admin-dashboard')} className="cursor-pointer text-gray-300 hover:text-neon-yellow transition-colors duration-200">
                      Painel
                    </a>
                    <a onClick={onLogout} className="cursor-pointer text-gray-300 hover:text-neon-yellow transition-colors duration-200">
                      Sair
                    </a>
                </>
            ) : (
                <a onClick={() => onNavigate('admin-login')} className="cursor-pointer text-gray-300 hover:text-neon-yellow transition-colors duration-200">
                  Admin
                </a>
            )}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-gray-300 hover:text-neon-blue transition-colors duration-200"
            >
              <CartIcon className="h-7 w-7" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black transform translate-x-1/2 -translate-y-1/2 bg-neon-yellow rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;