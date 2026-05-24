import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
  index?: number;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, index = 0, onQuickView }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors[0]?.name || '';
    addToCart(product, defaultSize, defaultColor);
    addToast(`${product.name} added to cart`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    addToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', 'info');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-4">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-700" />
          )}
          <img
            src={product.images[0]}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.originalPrice && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                Sale
              </span>
            )}
            {product.tags.includes('new') && (
              <span className="px-2.5 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-wider rounded-full">
                New
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={`absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}
          >
            <button
              onClick={handleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                inWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 dark:bg-black/90 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-black'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView?.(product);
              }}
              className="w-9 h-9 rounded-full bg-white/90 dark:bg-black/90 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-black flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart - Bottom */}
          <motion.button
            onClick={handleAddToCart}
            initial={false}
            animate={{ y: isHovered ? 0 : 60 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-3 left-3 right-3 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </motion.button>
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {product.brand}
          </p>
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} size={12} />
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              ({product.reviewCount})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
