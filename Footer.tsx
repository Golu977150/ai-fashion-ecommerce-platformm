import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Share2, Video, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                NOVA
              </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              AI-powered fashion for the modern world. Discover, style, and shop with intelligence.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Share2, Video].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-3">
              {['New Arrivals', 'Men', 'Women', 'Accessories', 'Footwear', 'Sale'].map((item) => (
                <li key={item}>
                  <Link
                    to="/shop"
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3">
              {['Help Center', 'Order Tracking', 'Shipping Info', 'Returns', 'Size Guide', 'Contact Us'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="#"
                      className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">
              Stay Updated
            </h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Subscribe for exclusive drops and AI styling tips.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
              <button className="px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            &copy; 2024 NOVA Fashion. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link
                key={item}
                to="#"
                className="text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
