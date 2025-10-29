
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const imageUrl = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls[0]
    : 'https://picsum.photos/800/600'; // Fallback image

  return (
    <div
      onClick={() => onSelect(product)}
      className="bg-dark-gray rounded-lg overflow-hidden border-2 border-transparent hover:border-neon-blue transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-all duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-100 truncate">{product.name}</h3>
        <p className="text-sm text-gray-400 mt-1">{product.category}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-neon-yellow">
            R$ {product.price.toFixed(2)}
          </p>
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {product.stock > 0 ? 'Disponível' : 'Esgotado'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;