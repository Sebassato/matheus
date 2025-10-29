import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { api } from '../services/apiService';

interface AdminProductFormProps {
  product: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrls: [],
    category: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '', description: '', price: 0, stock: 0, imageUrls: [], category: '',
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // FIX: Refactored to use a for...of loop to iterate over FileList, which correctly infers the 'file' type and avoids the 'unknown' type error.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      const totalImages = formData.imageUrls.length + files.length;
      if (totalImages > 5) {
        alert('Você pode adicionar no máximo 5 fotos.');
        return;
      }

      for (const file of files) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setFormData(prev => ({
              ...prev,
              imageUrls: [...prev.imageUrls, reader.result as string],
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
        ...prev,
        imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.imageUrls.length === 0) {
        alert('Por favor, adicione pelo menos uma imagem.');
        return;
    }
    if (product) {
      await api.updateProduct({ ...formData, id: product.id });
    } else {
      await api.addProduct(formData);
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-gray rounded-lg p-8 w-full max-w-2xl max-h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{product ? 'Editar Produto' : 'Adicionar Produto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Nome</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-medium-gray rounded p-2" required />
            </div>
            <div>
              <label>Categoria</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full bg-medium-gray rounded p-2" required />
            </div>
          </div>
          <div>
            <label>Descrição</label>
            <textarea name="description" value={formData.description} onChange={handleTextAreaChange} className="w-full bg-medium-gray rounded p-2" rows={3}></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Preço do Aluguel</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-medium-gray rounded p-2" required />
            </div>
            <div>
              <label>Estoque</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-medium-gray rounded p-2" required />
            </div>
          </div>
          <div>
             <label>Imagens (máx. 5)</label>
             <div className="mt-2 p-4 border-2 border-dashed border-gray-600 rounded-lg">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {formData.imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                            <img src={url} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded"/>
                            <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 m-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                        </div>
                    ))}
                    {formData.imageUrls.length < 5 && (
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()} 
                            className="w-full h-24 bg-medium-gray rounded flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                            <span className="text-3xl">+</span>
                        </button>
                    )}
                </div>
             </div>
             <input 
                type="file" 
                multiple 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                className="hidden"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onCancel} className="bg-gray-600 py-2 px-4 rounded">Cancelar</button>
            <button type="submit" className="bg-neon-yellow text-black font-bold py-2 px-4 rounded">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;