import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList } from 'lucide-react';
import { products, categories, subcategories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import type { Product } from '@/types';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');

  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'All';
  const subcategoryParam = searchParams.get('subcategory') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedSubcategory) {
      result = result.filter((p) => p.subcategory === selectedSubcategory);
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedColors.length > 0) {
      result = result.filter((p) => p.colors.some((c) => selectedColors.includes(c.name)));
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedSubcategory, priceRange, selectedColors, selectedSizes, sortBy]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('');
    setPriceRange([0, 1000]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSearchParams({});
  };

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedSubcategory ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    selectedColors.length +
    selectedSizes.length;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            {searchQuery ? `Search: "${searchQuery}"` : selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            {filteredProducts.length} products found
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-black dark:bg-white text-white dark:text-black text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>

            <div className="hidden sm:flex border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}
              >
                <Grid3X3 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}
              >
                <LayoutList className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial={false}
            animate={{ width: filtersOpen ? 280 : 0, opacity: filtersOpen ? 1 : 0 }}
            className="shrink-0 overflow-hidden"
          >
            <div className="w-[280px] space-y-6 pr-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900 dark:text-white">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear all
                  </button>
                )}
              </div>

              {/* Category */}
              <div>
                <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedSubcategory('');
                      }}
                      className={`block text-sm w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory */}
              {selectedCategory !== 'All' && subcategories[selectedCategory] && (
                <div>
                  <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {subcategories[selectedCategory].map((sub) => (
                      <button
                        key={sub}
                        onClick={() =>
                          setSelectedSubcategory(selectedSubcategory === sub ? '' : sub)
                        }
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          selectedSubcategory === sub
                            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                            : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div>
                <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Price Range</h4>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-black dark:accent-white"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div>
                <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {['Black', 'White', 'Navy', 'Gray', 'Beige', 'Red', 'Green', 'Blue'].map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        selectedColors.includes(color)
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Sizes</h4>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-10 h-10 text-xs rounded-lg border transition-colors ${
                        selectedSizes.includes(size)
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-4">
                  No products found
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-4 md:gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-2 md:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    index={i}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
