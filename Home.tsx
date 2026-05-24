import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import type { Product } from '@/types';

const heroImages = [
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=900&fit=crop',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=900&fit=crop',
];

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $150' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: Sparkles, title: 'AI Styling', desc: 'Personalized outfits' },
];

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((i) => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.slice(0, 8);
  const newArrivals = products.slice(8, 12);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        {heroImages.map((img, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: heroIndex === i ? 1 : 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        ))}

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Fashion
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                Style Meets
                <br />
                Intelligence
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-lg">
                Discover curated fashion powered by AI. Get personalized outfit recommendations
                and shop the latest trends with confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-white text-black rounded-xl font-medium flex items-center gap-2 hover:bg-neutral-100 transition-colors"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/ai-outfit"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-medium flex items-center gap-2 hover:bg-white/20 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Stylist
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                heroIndex === i ? 'w-8 bg-white' : 'w-4 bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800"
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                Curated For You
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
                Featured Collection
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white hover:opacity-70 transition-opacity"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                index={i}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Stylist Banner */}
      <section className="py-20 bg-neutral-900 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1400&h=600&fit=crop"
              alt="AI Styling"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex items-center justify-center text-center p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm mb-6">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Your Personal AI Stylist
                </h2>
                <p className="text-white/70 max-w-xl mx-auto mb-8">
                  Get intelligent outfit recommendations based on your style preferences,
                  color palette, and the latest fashion trends.
                </p>
                <Link
                  to="/ai-outfit"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-medium hover:bg-neutral-100 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Try AI Stylist
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                Just Dropped
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white hover:opacity-70 transition-opacity"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                index={i}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
              Browse By Category
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
              Trending Now
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { name: 'Men', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=400&fit=crop' },
              { name: 'Women', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop' },
              { name: 'Accessories', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=400&fit=crop' },
              { name: 'Footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop' },
              { name: 'Outerwear', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop' },
              { name: 'Activewear', img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&h=400&fit=crop' },
            ].map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/shop?category=${cat.name}`} className="group block relative rounded-2xl overflow-hidden aspect-[4/3]">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl md:text-2xl font-bold text-white">{cat.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
