import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Users, ShoppingCart, DollarSign,
  Plus, Pencil, Trash2, X, Search,
} from 'lucide-react';
import { products, orders, demoUser } from '@/data/products';
import { useToast } from '@/context/ToastContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 12400 },
  { name: 'Feb', revenue: 18200 },
  { name: 'Mar', revenue: 15600 },
  { name: 'Apr', revenue: 22400 },
  { name: 'May', revenue: 28900 },
  { name: 'Jun', revenue: 34100 },
];

const categoryData = [
  { name: 'Men', value: 35 },
  { name: 'Women', value: 30 },
  { name: 'Footwear', value: 20 },
  { name: 'Accessories', value: 15 },
];

const COLORS = ['#000000', '#525252', '#a3a3a3', '#d4d4d4'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard');
  const [productList, setProductList] = useState(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null);
  const { addToast } = useToast();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalUsers = 128;
  const totalProducts = productList.length;

  const filteredProducts = productList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (id: string) => {
    setProductList((prev) => prev.filter((p) => p._id !== id));
    addToast('Product deleted', 'success');
  };

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingCart },
    { id: 'users' as const, label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3 px-4 py-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                  <span className="text-white dark:text-black font-bold text-sm">A</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">Admin</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{demoUser.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, change: '+12%' },
                      { label: 'Orders', value: totalOrders.toString(), icon: ShoppingCart, change: '+8%' },
                      { label: 'Products', value: totalProducts.toString(), icon: Package, change: '+3%' },
                      { label: 'Users', value: totalUsers.toString(), icon: Users, change: '+24%' },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                            <stat.icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                          </div>
                          <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                            {stat.change}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                          {stat.value}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-6">
                        Revenue Overview
                      </h3>
                      <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={revenueData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                              <stop offset="95%" stopColor="#000" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                          <XAxis dataKey="name" stroke="#a3a3a3" fontSize={12} />
                          <YAxis stroke="#a3a3a3" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #e5e5e5',
                              borderRadius: '12px',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#000"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-6">
                        Sales by Category
                      </h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {categoryData.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 mt-4">
                        {categoryData.map((cat, i) => (
                          <div key={cat.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[i] }}
                              />
                              <span className="text-neutral-600 dark:text-neutral-400">
                                {cat.name}
                              </span>
                            </div>
                            <span className="font-medium text-neutral-900 dark:text-white">
                              {cat.value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-6">
                      Recent Orders
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-neutral-200 dark:border-neutral-800">
                            <th className="text-left py-3 text-neutral-500 dark:text-neutral-400 font-medium">
                              Order ID
                            </th>
                            <th className="text-left py-3 text-neutral-500 dark:text-neutral-400 font-medium">
                              Customer
                            </th>
                            <th className="text-left py-3 text-neutral-500 dark:text-neutral-400 font-medium">
                              Status
                            </th>
                            <th className="text-right py-3 text-neutral-500 dark:text-neutral-400 font-medium">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr
                              key={order._id}
                              className="border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                            >
                              <td className="py-3 text-neutral-900 dark:text-white font-mono text-xs">
                                {order._id}
                              </td>
                              <td className="py-3 text-neutral-600 dark:text-neutral-400">
                                {order.shippingAddress.fullName}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                    order.status === 'delivered'
                                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                      : order.status === 'shipped'
                                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                      : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 text-right font-medium text-neutral-900 dark:text-white">
                                ${order.total}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setShowProductModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Product
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-neutral-50 dark:bg-neutral-800">
                          <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 font-medium">
                            Product
                          </th>
                          <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 font-medium">
                            Category
                          </th>
                          <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 font-medium">
                            Price
                          </th>
                          <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 font-medium">
                            Stock
                          </th>
                          <th className="text-right py-3 px-4 text-neutral-500 dark:text-neutral-400 font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr
                            key={product._id}
                            className="border-b border-neutral-100 dark:border-neutral-800 last:border-0 bg-white dark:bg-neutral-900"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="font-medium text-neutral-900 dark:text-white">
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                              {product.category}
                            </td>
                            <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">
                              ${product.price}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  product.inStock
                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                    : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                }`}
                              >
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setShowProductModal(true);
                                  }}
                                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product._id)}
                                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-500 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.map((order) => (
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
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">
                              {item.product.name} x{item.quantity}
                            </span>
                            <span className="text-neutral-900 dark:text-white">
                              ${item.product.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-neutral-200 dark:border-neutral-800 mt-4 pt-4 flex justify-between">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">
                          ${order.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'users' && (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-800">
                        <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 font-medium">
                          User
                        </th>
                        <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 font-medium">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 font-medium">
                          Role
                        </th>
                        <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 font-medium">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[demoUser, { ...demoUser, _id: 'u2', name: 'Sarah Chen', email: 'sarah@example.com', role: 'user' as const },
                        { ...demoUser, _id: 'u3', name: 'Marcus Johnson', email: 'marcus@example.com', role: 'user' as const },
                        { ...demoUser, _id: 'u4', name: 'Emma Wilson', email: 'emma@example.com', role: 'user' as const }].map((u) => (
                        <tr
                          key={u._id}
                          className="border-b border-neutral-100 dark:border-neutral-800 last:border-0 bg-white dark:bg-neutral-900"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-600">
                                {u.name.charAt(0)}
                              </div>
                              <span className="font-medium text-neutral-900 dark:text-white">
                                {u.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                            {u.email}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                u.role === 'admin'
                                  ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-neutral-500 dark:text-neutral-400">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  defaultValue={editingProduct?.name}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    defaultValue={editingProduct?.price}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Category
                  </label>
                  <select className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">
                    <option>Men</option>
                    <option>Women</option>
                    <option>Accessories</option>
                    <option>Footwear</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  addToast(editingProduct ? 'Product updated' : 'Product added', 'success');
                }}
                className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
