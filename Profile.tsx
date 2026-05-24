import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Settings, Package, LogOut, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { orders } from '@/data/products';
import type { Address } from '@/types';

export default function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'settings'>('profile');
  const [addresses, setAddresses] = useState<Address[]>(user?.addresses || []);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  const userOrders = orders.filter((o) => o.userId === user?._id);

  const handleAddAddress = () => {
    if (newAddress.fullName && newAddress.street && newAddress.city) {
      setAddresses((prev) => [...prev, newAddress as Address]);
      setNewAddress({});
      setShowAddAddress(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'orders' as const, label: 'Orders', icon: Package },
    { id: 'addresses' as const, label: 'Addresses', icon: MapPin },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-neutral-500">
                      {user?.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'profile' && (
                <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                    Profile Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        readOnly
                        className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-500 dark:text-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue={user?.addresses[0]?.phone}
                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.role}
                        readOnly
                        className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-500 dark:text-neutral-400 capitalize"
                      />
                    </div>
                  </div>
                  <button className="mt-6 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                    Save Changes
                  </button>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                    Order History
                  </h2>
                  {userOrders.length === 0 ? (
                    <p className="text-neutral-500 dark:text-neutral-400">No orders yet.</p>
                  ) : (
                    userOrders.map((order) => (
                      <div
                        key={order._id}
                        className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              Order #{order._id}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered'
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="w-14 h-18 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
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
                              </div>
                              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                                ${item.product.price * item.quantity}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-4 pt-4 flex justify-between">
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            Total
                          </span>
                          <span className="text-sm font-bold text-neutral-900 dark:text-white">
                            ${order.total}
                          </span>
                        </div>
                        {order.trackingNumber && (
                          <div className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                            Tracking: {order.trackingNumber}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Saved Addresses
                    </h2>
                    <button
                      onClick={() => setShowAddAddress(!showAddAddress)}
                      className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Address
                    </button>
                  </div>

                  {showAddAddress && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-6"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { key: 'fullName', label: 'Full Name' },
                          { key: 'street', label: 'Street' },
                          { key: 'city', label: 'City' },
                          { key: 'state', label: 'State' },
                          { key: 'zipCode', label: 'ZIP Code' },
                          { key: 'phone', label: 'Phone' },
                        ].map((field) => (
                          <div key={field.key} className={field.key === 'street' ? 'md:col-span-2' : ''}>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              {field.label}
                            </label>
                            <input
                              type="text"
                              onChange={(e) =>
                                setNewAddress((prev) => ({ ...prev, [field.key]: e.target.value }))
                              }
                              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => setShowAddAddress(false)}
                          className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-700 dark:text-neutral-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddAddress}
                          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium"
                        >
                          Save Address
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map((addr, i) => (
                      <div
                        key={i}
                        className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-neutral-500" />
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {addr.fullName}
                            </span>
                          </div>
                          <button
                            onClick={() => setAddresses((prev) => prev.filter((_, idx) => idx !== i))}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {addr.street}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                          {addr.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                    Account Settings
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-neutral-200 dark:border-neutral-800">
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          Email Notifications
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Receive updates about orders and promotions
                        </p>
                      </div>
                      <button className="w-12 h-6 bg-black dark:bg-white rounded-full relative transition-colors">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white dark:bg-black rounded-full" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-neutral-200 dark:border-neutral-800">
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          AI Recommendations
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Get personalized outfit suggestions
                        </p>
                      </div>
                      <button className="w-12 h-6 bg-black dark:bg-white rounded-full relative transition-colors">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white dark:bg-black rounded-full" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                          Delete Account
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Permanently remove your account and data
                        </p>
                      </div>
                      <button className="px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
