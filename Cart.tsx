import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const shipping = totalPrice > 150 ? 0 : 15;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-neutral-400" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
            Your cart is empty
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium"
          >
            Continue Shopping
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
          Shopping Cart ({totalItems})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={`${item.product._id}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
              >
                <Link to={`/product/${item.product._id}`} className="shrink-0">
                  <div className="w-24 h-32 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link
                        to={`/product/${item.product._id}`}
                        className="text-sm font-medium text-neutral-900 dark:text-white hover:opacity-70 transition-opacity"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {item.color} / Size {item.size}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      ${item.product.price * item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)
                        }
                        className="px-3 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)
                        }
                        className="px-3 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          toggleWishlist(item.product);
                          addToast(
                            isInWishlist(item.product._id)
                              ? 'Removed from wishlist'
                              : 'Added to wishlist',
                            'info'
                          );
                        }}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isInWishlist(item.product._id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-neutral-400'
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => {
                          removeFromCart(item.product._id, item.size, item.color);
                          addToast('Item removed from cart', 'info');
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    Free shipping on orders over $150
                  </p>
                )}
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-neutral-900 dark:text-white">Total</span>
                  <span className="font-bold text-lg text-neutral-900 dark:text-white">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium text-center flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/shop"
                className="block w-full mt-3 py-3 text-center text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
