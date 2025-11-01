import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { getProducts } from '../services/productService';
import { Product } from '../types/product';

import { FiFilter, FiGrid, FiList, FiSearch, FiX } from 'react-icons/fi';

const FilterIcon = FiFilter as React.ComponentType<{ className?: string }>;
const GridIcon = FiGrid as React.ComponentType<{ className?: string }>;
const ListIcon = FiList as React.ComponentType<{ className?: string }>;
const SearchIcon = FiSearch as React.ComponentType<{ className?: string }>;
const CloseIcon = FiX as React.ComponentType<{ className?: string }>;

const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Get initial parameters from URL
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  
  // Available categories (you can fetch these from API or define statically)
  const categories = ['Electronics', 'Books', 'Clothing', 'Home'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (category) params.category = category;
        if (search) params.search = search;
        if (sort) params.sort = sort;
        
        const response = await getProducts(params);
        setProducts(response);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, search, sort]);

  // Initialize selected categories from URL
  useEffect(() => {
    if (category) {
      setSelectedCategories([category]);
    } else {
      setSelectedCategories([]);
    }
  }, [category]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        product.category_name && selectedCategories.includes(product.category_name.toLowerCase())
      );
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
    }

    // Filter by rating (if rating exists in product data)
    if (selectedRating !== null) {
      // Assuming product has a rating field - you may need to adjust this
      // If your products don't have rating, you can remove this filter
      filtered = filtered.filter(product => 
        (product as any).rating >= selectedRating
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategories, minPrice, maxPrice, selectedRating]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (value) {
      newSearchParams.set('sort', value);
    } else {
      newSearchParams.delete('sort');
    }
    setSearchParams(newSearchParams);
  };

  const handleCategoryChange = (cat: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (cat) {
      newSearchParams.set('category', cat);
    } else {
      newSearchParams.delete('category');
    }
    
    // Remove other filter params when changing category from URL
    newSearchParams.delete('search');
    setSearchParams(newSearchParams);
  };

  const handleCategoryFilterChange = (categoryName: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(cat => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedRating(null);
    setSelectedCategories([]);
    setSearchParams({});
  };

  const handleApplyFilters = () => {
    // Update URL with the first selected category (or clear if none)
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (selectedCategories.length > 0) {
      newSearchParams.set('category', selectedCategories[0]);
    } else {
      newSearchParams.delete('category');
    }
    
    setSearchParams(newSearchParams);
  };

  const hasActiveFilters = minPrice || maxPrice || selectedRating !== null || selectedCategories.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-gray-600">
            {category ? `${category} Products` : 'All Products'}
            {search && ` matching "${search}"`}
            {filteredProducts.length !== products.length && ` (${filteredProducts.length} of ${products.length} shown)`}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-[#d7773e] text-white' : 'bg-white'}`}
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-[#d7773e] text-white' : 'bg-white'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative">
            <select
              value={sort}
              onChange={handleSortChange}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#d7773e]"
            >
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <FilterIcon className="mr-2" /> 
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-[#d7773e] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {[
                  minPrice ? 1 : 0,
                  maxPrice ? 1 : 0,
                  selectedRating !== null ? 1 : 0,
                  selectedCategories.length
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-[#d7773e] flex items-center"
                >
                  <CloseIcon className="w-4 h-4 mr-1" />
                  Clear All
                </button>
              )}
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-3">Categories</h4>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.toLowerCase())}
                        onChange={() => handleCategoryFilterChange(cat.toLowerCase())}
                        className="mr-2 rounded text-[#d7773e] focus:ring-[#d7773e]"
                      />
                      {cat}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Min Price ($)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d7773e]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Max Price ($)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d7773e]"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-3">Rating</h4>
              <ul className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <li key={rating}>
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedRating === rating}
                        onChange={() => setSelectedRating(selectedRating === rating ? null : rating)}
                        className="mr-2 rounded text-[#d7773e] focus:ring-[#d7773e]"
                      />
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm">& Up</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={handleApplyFilters}
              className="w-full"
            >
              Apply Filters
            </Button>
          </Card>
        </div>
        
        {/* Products Grid */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={handleClearFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-6'
            }>
              {filteredProducts.map((product) => (
                <Link to={`/products/${product.id}`} key={product.id}>
                  <Card hoverable>
                    {viewMode === 'grid' ? (
                      <>
                        <Card.Image 
                          src={product.image_url || 'https://via.placeholder.com/300x200?text=Product'} 
                          alt={product.name} 
                        />
                        <Card.Body>
                          <Card.Title>{product.name}</Card.Title>
                          <Card.Text className="mb-3">${product.price}</Card.Text>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 capitalize">{product.category_name}</span>
                            <Button size="sm">View Details</Button>
                          </div>
                        </Card.Body>
                      </>
                    ) : (
                      <div className="flex">
                        <div className="w-1/3">
                          <img 
                            src={product.image_url || 'https://via.placeholder.com/300x200?text=Product'} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-4">
                          <Card.Title>{product.name}</Card.Title>
                          <Card.Text className="mb-3">${product.price}</Card.Text>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 capitalize">{product.category_name}</span>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;