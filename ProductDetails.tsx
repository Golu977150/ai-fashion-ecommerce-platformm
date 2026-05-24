import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, ShoppingBag, Share2, Truck, RotateCcw, Shield,
  ChevronRight, Check, Minus, Plus,
} from 'lucide-react';
import { products, reviews } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import StarRating from '@/components/StarRating';
import ProductCard from '@/components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const product = products.find((p) => p._id === id);
  const productReviews = reviews.filter((r) => r.productId === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'shipping'>('details');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            Product Not Found
          </h2>
          <Link
            to="/shop"
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      addToast('Please select a size', 'warning');
      return;
    }
    const color = selectedColor || product.colors[0]?.name || '';
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, color);
    }
    addToast(`${quantity} × ${product.name} added to cart`, 'success');
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-8">
          <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/shop" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-neutral-900 dark:text-white">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? 'border-black dark:border-white'
                      : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                {product.brand}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <StarRating rating={product.rating} showValue />
                <span className="text-sm text-neutral-400 dark:text-neutral-500">
                  {product.reviewCount} reviews
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                ${product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-neutral-400 dark:text-neutral-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white mb-3">
                  Color {selectedColor && `— ${selectedColor}`}
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-black dark:border-white scale-110'
                          : 'border-neutral-300 dark:border-neutral-600'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check className="w-5 h-5 text-white mix-blend-difference mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      selectedSize === size
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 min-w-[200px] py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={() => {
                  toggleWishlist(product);
                  addToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', 'info');
                }}
                className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-colors ${
                  inWishlist
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>

              <button className="w-14 h-14 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              {[
                { icon: Truck, label: 'Free Shipping', desc: 'Orders $150+' },
                { icon: RotateCcw, label: 'Easy Returns', desc: '30 days' },
                { icon: Shield, label: 'Secure', desc: 'Checkout' },
              ].map((badge) => (
                <div key={badge.label} className="text-center">
                  <badge.icon className="w-5 h-5 mx-auto mb-2 text-neutral-500 dark:text-neutral-400" />
                  <p className="text-xs font-medium text-neutral-900 dark:text-white">{badge.label}</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{badge.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex gap-6 border-b border-neutral-200 dark:border-neutral-800 mb-8">
            {(['details', 'reviews', 'shipping'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium capitalize transition-colors relative ${
                  activeTab === tab
                    ? 'text-neutral-900 dark:text-white'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
                  />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'details' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                    Product Details
                  </h3>
                  <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <li className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <span>Category</span>
                      <span className="text-neutral-900 dark:text-white">{product.category}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <span>Type</span>
                      <span className="text-neutral-900 dark:text-white">{product.subcategory}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <span>Brand</span>
                      <span className="text-neutral-900 dark:text-white">{product.brand}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <span>Material</span>
                      <span className="text-neutral-900 dark:text-white">Premium Quality</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {productReviews.length === 0 ? (
                <p className="text-neutral-500 dark:text-neutral-400">No reviews yet. Be the first to review!</p>
              ) : (
                productReviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-600 dark:text-neutral-400">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            {review.userName}
                          </p>
                          <p className="text-xs text-neutral-400 dark:text-neutral-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                      {review.title}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'shipping' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
                <p>We offer free standard shipping on all orders over $150. Orders are typically processed within 1-2 business days.</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Standard Shipping: 5-7 business days (Free over $150)</li>
                  <li>Express Shipping: 2-3 business days ($15)</li>
                  <li>Next Day Delivery: 1 business day ($25)</li>
                </ul>
                <p>International shipping is available to select countries. Customs fees may apply.</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
