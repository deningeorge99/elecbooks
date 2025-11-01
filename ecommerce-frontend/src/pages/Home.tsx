import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiStar, FiArrowRight } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { getFeaturedProducts } from '../services/productService';
import { Product } from '../types/product';

// Add this type assertion
const ShoppingBagIcon = FiShoppingBag as React.ComponentType<{ className?: string }>;
const StarIcon = FiStar as React.ComponentType<{ className?: string }>;
const ArrowRightIcon = FiArrowRight as React.ComponentType<{ className?: string }>;


const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#d7773e] to-[#e8955f] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Amazing Products at Great Prices
            </h1>
            <p className="text-xl mb-8">
              Shop from our collection of high-quality products with fast shipping and excellent customer service.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/products">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100" style={{ color: '#000'}}>
                  Shop Now
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#d7773e]">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our wide range of products organized by categories to find exactly what you're looking for.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Electronics', icon: <ShoppingBagIcon className="text-3xl" />, color: 'bg-blue-100' },
              { name: 'Books', icon: <StarIcon className="text-3xl" />, color: 'bg-green-100' },
              { name: 'Clothing', icon: <ShoppingBagIcon className="text-3xl" />, color: 'bg-purple-100' },
              { name: 'Home', icon: <ShoppingBagIcon className="text-3xl" />, color: 'bg-yellow-100' }
            ].map((category, index) => (
              <Link to={`/products?category=${category.name.toLowerCase()}`} key={index}>
                <Card hoverable className="text-center p-6">
                  <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">View all {category.name.toLowerCase()}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-600">Check out our most popular products</p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All Products <ArrowRightIcon className="ml-2" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <Link to={`/products/${product.id}`} key={product.id}>
                  <Card hoverable>
                    <Card.Image 
                      src={product.image_url || 'https://via.placeholder.com/300x200?text=Product'} 
                      alt={product.name} 
                    />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text className="mb-3">${product.price}</Card.Text>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{product.category_name}</span>
                        <Button size="sm">View Details</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-[#d7773e] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Sign up today and get exclusive access to deals, new arrivals, and much more.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100" style={{ color: '#000' }}>
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;