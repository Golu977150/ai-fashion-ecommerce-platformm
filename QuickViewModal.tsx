import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Check } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import StarRating from './StarRating';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      addToast('Please select a size', 'warning');
      return;
    }
    const color = selectedColor || product.colors[0]?.name || '';
    addToCart(product, selectedSize, color);
    addToast(`${product.name} added to cart`, 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-neutral-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Images */}
            <div className="p-6 md:p-8">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === i
                          ? 'border-black dark:border-white'
                          : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 md:p-8 md:border-l border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                    {product.brand}
                  </p>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {product.name}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.rating} showValue />
                <span className="text-sm text-neutral-400 dark:text-neutral-500">
                  {product.reviewCount} reviews
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-neutral-400 dark:text-neutral-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Colors */}
              {product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white mb-3">
                    Color
                  </p>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color.name
                            ? 'border-black dark:border-white scale-110'
                            : 'border-neutral-300 dark:border-neutral-600'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check className="w-4 h-4 text-white mix-blend-difference mx-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              <div className="mb-6">
                <p className="text-sm font-medium text-neutral-900 dark:text-white mb-3">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
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

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    addToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', 'info');
                  }}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                    inWishlist
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
