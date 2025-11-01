import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { getProductById } from '../services/productService';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { Product } from '../types/product';

import { FiShoppingCart, FiArrowLeft, FiStar, FiHeart, FiShare2 } from 'react-icons/fi';

const ShoppingCartIcon = FiShoppingCart as React.ComponentType<{ className?: string }>;
const ArrowLeftIcon = FiArrowLeft as React.ComponentType<{ className?: string }>;
const StarIcon = FiStar as React.ComponentType<{ className?: string }>;
const HeartIcon = FiHeart as React.ComponentType<{ className?: string }>;
const Share2Icon = FiShare2 as React.ComponentType<{ className?: string }>;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setLoading(true);
        try {
          const data = await getProductById(parseInt(id));
          setProduct(data);
        } catch (error) {
          console.error('Failed to fetch product:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeftIcon className="mr-2" />
                        Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/products')}
        className="mb-6"
      >
        <ArrowLeftIcon className="mr-2" /> 
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-lg overflow-hidden shadow-card mb-4">
            <img 
              src={product.image_url || 'https://via.placeholder.com/600x400?text=Product'} 
              alt={product.name} 
              className="w-full h-96 object-cover"
            />
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((_, index) => (
              <div 
                key={index}
                className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                  selectedImage === index ? 'border-[#d7773e]' : 'border-gray-200'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={product.image_url || 'https://via.placeholder.com/150x150?text=Product'} 
                  alt={`Product thumbnail ${index + 1}`} 
                  className="w-full h-24 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="bg-white rounded-lg p-6 shadow-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.description}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="p-2">
                  <HeartIcon className="mr-2" /> Like
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <Share2Icon className="mr-2" /> Share
                </Button>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-gray-600">(24 reviews)</span>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {product.category_name}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-[#d7773e]">${product.price}</span>
                {product.stock_quantity > 0 ? (
                  <span className="ml-4 text-green-600">In Stock ({product.stock_quantity} available)</span>
                ) : (
                  <span className="ml-4 text-red-600">Out of Stock</span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <button 
                  className="bg-gray-200 text-gray-700 w-8 h-8 rounded-l-md flex items-center justify-center"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input 
                  type="number" 
                  min="1" 
                  max={product.stock_quantity || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(product.stock_quantity || 1, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-16 h-8 text-center border-t border-b border-gray-200"
                />
                <button 
                  className="bg-gray-200 text-gray-700 w-8 h-8 rounded-r-md flex items-center justify-center"
                  onClick={() => setQuantity(Math.min(product.stock_quantity || 1, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>

           {user?.role === 'customer' &&( <div className="grid grid-cols-2 gap-4 mb-6">
              <Button 
                onClick={handleAddToCart}
                disabled={!user || product.stock_quantity === 0}
                className="flex items-center justify-center"
              >
                <ShoppingCartIcon className="mr-2" /> 
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                disabled={!user || product.stock_quantity === 0}
                className="bg-[#d7773e] text-white hover:bg-[#c6662d]"
              >
                Buy Now
              </Button>
            </div>)}

            {!user && (
              <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md mb-4">
                Please <a href="/login" className="font-medium">login</a> to add this product to your cart.
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-2">Seller Information</h3>
              <div className="flex items-center">
                <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  {product.seller_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{product.seller_name}</p>
                  <p className="text-sm text-gray-600">Verified Seller</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Card className="mt-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <a href="#" className="py-4 px-1 border-b-2 border-[#d7773e] text-[#d7773e] font-medium">
                  Description
                </a>
                <a href="#" className="py-4 px-1 text-gray-500 hover:text-gray-700 font-medium">
                  Specifications
                </a>
                <a href="#" className="py-4 px-1 text-gray-500 hover:text-gray-700 font-medium">
                  Reviews (24)
                </a>
                <a href="#" className="py-4 px-1 text-gray-500 hover:text-gray-700 font-medium">
                  Shipping & Returns
                </a>
              </nav>
            </div>
            <div className="p-6">
              <p>{product.description}</p>
              <p className="mt-4 text-gray-600">
                This is a detailed description of the product. It provides information about the features, 
                benefits, and usage of the product. The description helps customers understand what they are 
                purchasing and make an informed decision.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;