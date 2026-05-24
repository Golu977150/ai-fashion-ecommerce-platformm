import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-neutral-400" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
            Your wishlist is empty
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            Save items you love to your wishlist.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium"
          >
            Explore Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
          My Wishlist ({items.length})
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-4">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <button
                  onClick={() => {
                    removeFromWishlist(product._id);
                    addToast('Removed from wishlist', 'info');
                  }}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-black/90 text-red-500 flex items-center justify-center backdrop-blur-md"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              <Link to={`/product/${product._id}`}>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                  {product.brand}
                </p>
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-1 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  ${product.price}
                </p>
              </Link>

              <button
                onClick={() => {
                  const size = product.sizes[0];
                  const color = product.colors[0]?.name || '';
                  addToCart(product, size, color);
                  addToast(`${product.name} added to cart`, 'success');
                }}
                className="w-full mt-3 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
