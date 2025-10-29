
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { api } from '../services/apiService';
import AdminProductForm from './AdminProductForm';

const AdminProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    const data = await api.getProducts();
    setProducts(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await api.deleteProduct(productId);
      fetchProducts();
    }
  };

  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  if (isLoading) return <p>Carregando produtos...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neon-yellow">Gerenciar Produtos</h2>
        <button
          onClick={handleAddNew}
          className="bg-neon-blue text-black font-bold py-2 px-4 rounded-lg hover:opacity-80 transition-opacity"
        >
          Adicionar Produto
        </button>
      </div>

      {isFormOpen && (
        <AdminProductForm
          product={editingProduct}
          onSave={handleFormSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      <div className="bg-medium-gray mt-6 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-dark-gray">
            <tr>
              <th className="p-4">Produto</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Estoque</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-dark-gray last:border-b-0">
                <td className="p-4 flex items-center space-x-3">
                  <img src={product.imageUrls[0]} alt={product.name} className="w-10 h-10 object-cover rounded"/>
                  <span>{product.name}</span>
                </td>
                <td className="p-4">R$ {product.price.toFixed(2)}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <button onClick={() => handleEdit(product)} className="text-neon-yellow mr-4 hover:underline">Editar</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:underline">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductList;