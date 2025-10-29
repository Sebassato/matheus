
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { api } from '../services/apiService';
import ProductCard from './ProductCard';
import { SearchIcon } from './icons';

interface ProductListProps {
  onProductSelect: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onProductSelect }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
  
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-neon-yellow"></div>
        </div>
    );
  }

  return (
    <div>
        <div className="mb-8 p-4 bg-dark-gray rounded-lg flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:flex-grow">
                <input 
                    type="text"
                    placeholder="Buscar por nome ou palavra-chave..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-medium-gray border-2 border-gray-600 focus:border-neon-yellow focus:ring-0 rounded-lg py-2 pl-10 pr-4 outline-none transition-colors"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="w-full md:w-auto">
                <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-medium-gray border-2 border-gray-600 focus:border-neon-blue focus:ring-0 rounded-lg py-2 px-4 outline-none transition-colors appearance-none"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
        ))}
      </div>
      {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-gray-400">
              <h2 className="text-2xl">Nenhum produto encontrado.</h2>
              <p>Tente ajustar sua busca ou filtros.</p>
          </div>
      )}
    </div>
  );
};

export default ProductList;
