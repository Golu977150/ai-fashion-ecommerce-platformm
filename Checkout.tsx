import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, Shield, Check, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirm'>('shipping');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const shipping = totalPrice > 150 ? 0 : 15;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shipping + tax;

  const [shippingData, setShippingData] = useState({
    fullName: user?.addresses[0]?.fullName || '',
    street: user?.addresses[0]?.street || '',
    city: user?.addresses[0]?.city || '',
    state: user?.addresses[0]?.state || '',
    zipCode: user?.addresses[0]?.zipCode || '',
    country: user?.addresses[0]?.country || 'USA',
    phone: user?.addresses[0]?.phone || '',
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
  });

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  if (items.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">
            Order Confirmed!
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-2">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-8">
            Order #: NOVA-{Math.random().toString(36).slice(2, 10).toUpperCase()}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-10">
          {[
            { id: 'shipping', label: 'Shipping', icon: Truck },
            { id: 'payment', label: 'Payment', icon: CreditCard },
            { id: 'confirm', label: 'Confirm', icon: Shield },
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  step === s.id
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : i < ['shipping', 'payment', 'confirm'].indexOf(step)
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </div>
              {i < 2 && (
                <div className="w-8 h-px bg-neutral-200 dark:bg-neutral-700" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
              >
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
                  Shipping Address
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { key: 'fullName', label: 'Full Name', type: 'text' },
                    { key: 'street', label: 'Street Address', type: 'text' },
                    { key: 'city', label: 'City', type: 'text' },
                    { key: 'state', label: 'State', type: 'text' },
                    { key: 'zipCode', label: 'ZIP Code', type: 'text' },
                    { key: 'phone', label: 'Phone', type: 'tel' },
                  ].map((field) => (
                    <div key={field.key} className={field.key === 'street' ? 'md:col-span-2' : ''}>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={shippingData[field.key as keyof typeof shippingData]}
                        onChange={(e) =>
                          setShippingData((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep('payment')}
                  className="mt-6 w-full py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Secure Payment
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={paymentData.cardNumber}
                      onChange={(e) =>
                        setPaymentData((prev) => ({ ...prev, cardNumber: e.target.value }))
                      }
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={paymentData.expiry}
                        onChange={(e) =>
                          setPaymentData((prev) => ({ ...prev, expiry: e.target.value }))
                        }
                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) =>
                          setPaymentData((prev) => ({ ...prev, cvv: e.target.value }))
                        }
                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={paymentData.nameOnCard}
                      onChange={(e) =>
                        setPaymentData((prev) => ({ ...prev, nameOnCard: e.target.value }))
                      }
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep('shipping')}
                    className="px-6 py-3.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep('confirm')}
                    className="flex-1 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'confirm' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
              >
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
                  Order Review
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.product._id}-${item.size}`} className="flex gap-4">
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {item.color} / Size {item.size} / Qty {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">
                          ${item.product.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-600 dark:text-neutral-400">Shipping to</span>
                    <span className="text-neutral-900 dark:text-white text-right">
                      {shippingData.street}, {shippingData.city}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">Payment</span>
                    <span className="text-neutral-900 dark:text-white">
                      **** {paymentData.cardNumber.slice(-4) || '4242'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('payment')}
                    className="px-6 py-3.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    className="flex-1 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Place Order — ${finalTotal.toFixed(2)}</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Order Summary
              </h3>
              <div className="space-y-2 text-sm mb-4">
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
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-neutral-900 dark:text-white">Total</span>
                  <span className="font-bold text-lg text-neutral-900 dark:text-white">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
