import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { orders } from '@/data/products';
import { useAuth } from '@/context/AuthContext';

const statusSteps = [
  { status: 'pending', label: 'Order Placed', icon: Clock },
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function OrderTracking() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const userOrders = orders.filter((o) => o.userId === user?._id);
  const order = userOrders.find((o) => o._id === selectedOrder);

  const getStatusIndex = (status: string) =>
    statusSteps.findIndex((s) => s.status === status);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
          Track Your Order
        </h1>

        {/* Search */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Enter order number or tracking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>

        {/* Orders List */}
        <div className="space-y-4 mb-10">
          {userOrders.map((o) => (
            <button
              key={o._id}
              onClick={() => setSelectedOrder(o._id === selectedOrder ? null : o._id)}
              className={`w-full p-6 rounded-2xl border text-left transition-colors ${
                selectedOrder === o._id
                  ? 'bg-neutral-50 dark:bg-neutral-800 border-black dark:border-white'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Order #{o._id}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      o.status === 'delivered'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : o.status === 'shipped'
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </span>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                    ${o.total}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Tracking Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
          >
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">
              Tracking Details
            </h2>

            {/* Progress */}
            <div className="relative mb-8">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-800" />
              <div className="relative flex justify-between">
                {statusSteps.map((step, i) => {
                  const currentIndex = getStatusIndex(order.status);
                  const isActive = i <= currentIndex;
                  const isCurrent = i === currentIndex;
                  return (
                    <div key={step.status} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 relative z-10 ${
                          isActive
                            ? 'bg-black dark:bg-white text-white dark:text-black'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                        } ${isCurrent ? 'ring-4 ring-black/10 dark:ring-white/10' : ''}`}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isActive
                            ? 'text-neutral-900 dark:text-white'
                            : 'text-neutral-400 dark:text-neutral-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">
                  Shipping Address
                </h3>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                  <MapPin className="w-4 h-4 text-neutral-500 mt-0.5" />
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {order.shippingAddress.fullName}
                    </p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">
                  Order Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500 dark:text-neutral-400">Tracking Number</span>
                    <span className="text-neutral-900 dark:text-white font-mono">
                      {order.trackingNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500 dark:text-neutral-400">Order Date</span>
                    <span className="text-neutral-900 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500 dark:text-neutral-400">Est. Delivery</span>
                    <span className="text-neutral-900 dark:text-white">
                      {order.estimatedDelivery
                        ? new Date(order.estimatedDelivery).toLocaleDateString()
                        : 'TBD'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-neutral-500 dark:text-neutral-400">Total</span>
                    <span className="text-neutral-900 dark:text-white font-semibold">
                      ${order.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
