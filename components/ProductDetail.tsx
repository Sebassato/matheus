
import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [mainImage, setMainImage] = useState(product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : 'https://picsum.photos/800/600');

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-dark-gray p-4 sm:p-8 rounded-lg">
      <button onClick={onBack} className="text-neon-blue hover:underline mb-6">&larr; Voltar ao catálogo</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={mainImage} alt={product.name} className="w-full h-auto aspect-square object-cover rounded-lg shadow-lg mb-4" />
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="flex space-x-2">
              {product.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  onClick={() => setMainImage(url)}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all ${
                    mainImage === url ? 'border-neon-blue' : 'border-transparent hover:border-gray-500'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <div>
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-white my-3">{product.name}</h1>
          <p className="text-gray-300 leading-relaxed mb-6">{product.description}</p>
          
          <div className="text-4xl font-bold text-neon-yellow mb-6">
            R$ {product.price.toFixed(2)}
            <span className="text-lg text-gray-300"> / aluguel</span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <label className="text-sm font-medium text-gray-400">Quantidade:</label>
            <div className="flex items-center">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 bg-medium-gray rounded-l-md hover:bg-gray-600">-</button>
              <input type="text" value={quantity} readOnly className="w-12 text-center bg-dark-gray border-y border-gray-600" />
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 bg-medium-gray rounded-r-md hover:bg-gray-600">+</button>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || added}
            className={`w-full text-lg font-bold py-3 rounded-lg transition-all duration-300 ${
              added 
                ? 'bg-green-500 shadow-neon-yellow'
                : 'bg-neon-yellow text-black hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105'
            }`}
          >
            {added ? 'Adicionado!' : 'Adicionar ao Carrinho'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
