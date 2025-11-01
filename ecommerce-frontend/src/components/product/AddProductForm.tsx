import React, { useEffect, useState } from 'react';
import { FiPackage, FiX, FiUpload } from 'react-icons/fi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { addProduct, getCategories } from '../../services/productService';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  description: string;
}

const PackageIcon = FiPackage as React.ComponentType<{ className?: string }>;
const XIcon = FiX as React.ComponentType<{ className?: string }>;
const UploadIcon = FiUpload as React.ComponentType<{ className?: string }>;

const AddProductForm: React.FC<{ onCancel?: () => void }> = ({ onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    category_id: 0,
    image_url: ''
  });

    const categories = [
        { id: 1, name: 'Electronics', description: 'Gadgets and electronic devices' },
        { id: 2, name: 'Books', description: 'Fiction and non-fiction books' },
        { id: 3, name: 'Clothing', description: 'Apparel for men and women' },
        { id: 4, name: 'Home', description: 'Home decor and furniture' }
    ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock_quantity' || name === 'category_id' 
        ? Number(value) 
        : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await addProduct(formData);
      // Redirect to seller dashboard on success
      navigate('/seller/dashboard');
      onCancel && onCancel();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <Card.Body>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <PackageIcon className="mr-2" /> Add New Product
          </h2>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <XIcon />
            </Button>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              type="text"
              placeholder="Product name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              label="Product Name"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d7773e]"
                required
              >
                <option value={0}>Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <Input
              type="number"
              placeholder="0.00"
              name="price"
              value={formData.price}
              onChange={handleChange}
              label="Price ($)"
              min={0}
              step={0.01}
              required
            />
            
            <Input
              type="number"
              placeholder="0"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              label="Stock Quantity"
              min={0}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d7773e]"
              placeholder="Enter product description"
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
           
            <Input
              type="text"
              placeholder="Or enter image URL"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="mt-3"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding Product...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default AddProductForm;