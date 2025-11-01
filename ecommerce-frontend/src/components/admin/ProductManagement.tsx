import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiPackage, FiFilter } from 'react-icons/fi';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { getAllProducts, deleteProduct as deleteProductApi } from '../../services/adminService';

const PlusIcon = FiPlus as React.ComponentType<{ className?: string }>;
const EditIcon = FiEdit as React.ComponentType<{ className?: string }>;
const TrashIcon = FiTrash2 as React.ComponentType<{ className?: string }>;
const SearchIcon = FiSearch as React.ComponentType<{ className?: string }>;
const PackageIcon = FiPackage as React.ComponentType<{ className?: string }>;
const FilterIcon = FiFilter as React.ComponentType<{ className?: string }>;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  seller_id: number;
  image_url?: string;
  created_at: string;
  category_name: string;
  seller_name: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductApi(productId);
        setProducts(products.filter(product => product.id !== productId));
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.seller_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category_name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category_name)));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <PlusIcon className="mr-2" /> Add Product
        </Button>
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center">
              <FilterIcon className="mr-2 text-gray-500" />
              <select 
                className="border border-gray-300 rounded-md px-3 py-2"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="h-48 bg-gray-200">
                <img 
                  src={product.image_url || 'https://via.placeholder.com/300x200?text=Product'} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <span className="text-lg font-bold text-[#d7773e]">${product.price}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>{product.category_name}</span>
                  <span>Stock: {product.stock_quantity}</span>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  Seller: {product.seller_name}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingProduct(product)}
                  >
                    <EditIcon />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;