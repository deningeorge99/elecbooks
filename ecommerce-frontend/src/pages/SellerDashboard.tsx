import React, { useEffect, useState } from 'react';
import { FiPackage, FiPlus, FiEdit, FiTrash2, FiDollarSign, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { getProducts } from '../services/productService';
import { Product } from '../types/product';
import AddProductForm from '../components/product/AddProductForm';
import EditProductForm from '../components/product/EditProductForm';
import DeleteProductModal from '../components/product/DeleteProductModal';

const PackageIcon = FiPackage as React.ComponentType<{ className?: string }>; 
const PlusIcon = FiPlus as React.ComponentType<{ className?: string }>;
const EditIcon = FiEdit as React.ComponentType<{ className?: string }>;
const TrashIcon = FiTrash2 as React.ComponentType<{ className?: string }>;
const DollarSignIcon = FiDollarSign as React.ComponentType<{ className?: string }>;
const ShoppingBagIcon = FiShoppingBag as React.ComponentType<{ className?: string }>;
const LogOutIcon = FiLogOut as React.ComponentType<{ className?: string }>;

const SellerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<{id: number, name: string} | null>(null);

  const [userData, setUserData] = useState(user);
  const location = useLocation();

   useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      } else {
        setUserData(null);
      }
    };

    initializeAuth();
  }, [location.pathname]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        setLoading(true);
        try {
          const response = await getProducts();
          const storedUserStr = localStorage.getItem('user');
          const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;

          const allProducts = storedUser
            ? response.filter((p: Product) => p.seller_id == storedUser.id )
            : [];
          setProducts(allProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    if (activeTab === 'products') fetchProducts();
  }, [user, activeTab, deletingProduct]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <Card className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <PackageIcon className="text-2xl text-gray-600" />
              </div>
              <h2 className="text-xl font-bold">{user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="mt-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Seller Account
              </span>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'overview' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <PackageIcon className="mr-3" /> Dashboard
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'products' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <ShoppingBagIcon className="mr-3" /> My Products
              </button>
            
              <button
                onClick={() => setActiveTab('earnings')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'earnings' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <DollarSignIcon className="mr-3" /> Earnings
              </button>
            </nav>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <LogOutIcon className="mr-2" /> Logout
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:w-3/4">
          <Card className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Seller Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="p-4 text-center">
                    <h3 className="text-lg font-semibold mb-2">Total Products</h3>
                    <p className="text-3xl font-bold text-[#d7773e]">{products.length}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold text-[#d7773e]">156</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
                    <p className="text-3xl font-bold text-[#d7773e]">$4,250</p>
                  </Card>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <div key={order} className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <div>
                        <p className="font-medium">Order #ORD00{order}</p>
                        <p className="text-sm text-gray-600">Customer Name</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(order * 45.99).toFixed(2)}</p>
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">My Products</h2>
                  <Button onClick={() => setShowAddForm(true)}>
                    <PlusIcon className="mr-2" /> Add Product
                  </Button>
                </div>
                
                {showAddForm && (
                  <div className="mb-8">
                    <AddProductForm onCancel={() => setShowAddForm(false)} />
                  </div>
                )}
                
                {editingProduct !== null && (
                  <div className="mb-8">
                    <EditProductForm 
                      productId={String(editingProduct)} 
                      onCancel={() => setEditingProduct(null)} 
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loading ? (
                    <p>Loading products...</p>
                  ) : products.length > 0 ? (
                    products.map((product) => (
                      <Card key={product.id} className="flex">
                        <div className="w-1/3">
                          <img 
                            src={product.image_url || `https://via.placeholder.com/150x150?text=No+Image`} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-4">
                          <h3 className="font-medium mb-1">{product.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{product.category_name || 'Category'}</p>
                          <p className="font-bold mb-3">${product.price}</p>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingProduct(product.id)}
                            >
                              <EditIcon />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => setDeletingProduct({id: product.id, name: product.name})}
                            >
                              <TrashIcon />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p>No products found.</p>
                  )}
                </div>
              </div>
            )}

             {activeTab === 'earnings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Earnings</h2>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Monthly Earnings</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <span>Current Month</span>
                      <span className="text-xl font-bold">$4,250</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Previous Month</span>
                      <span className="text-xl font-bold">$3,890</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-4">Earnings by Product</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((product) => (
                    <div key={product} className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <div>
                        <p className="font-medium">Product Name {product}</p>
                        <p className="text-sm text-gray-600">25 sold</p>
                      </div>
                      <p className="font-medium">${(product * 150).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {deletingProduct && (
              <DeleteProductModal 
                productId={deletingProduct.id}
                productName={deletingProduct.name}
                onClose={() => setDeletingProduct(null)}
                onSuccess={() => {
                  setDeletingProduct(null);
                }}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;