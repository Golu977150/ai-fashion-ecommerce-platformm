import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, RefreshCw, ShoppingBag } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import type { Product } from '@/types';

interface OutfitSet {
  name: string;
  description: string;
  items: Product[];
  occasion: string;
  colorPalette: string[];
}

function generateOutfits(preferences: {
  occasion: string;
  style: string;
  colorPreference: string;
}): OutfitSet[] {
  const { occasion, style, colorPreference } = preferences;

  const colorMap: Record<string, string[]> = {
    neutral: ['Black', 'White', 'Gray', 'Beige'],
    bold: ['Red', 'Green', 'Blue'],
    dark: ['Black', 'Navy'],
    light: ['White', 'Beige'],
  };

  const preferredColors = colorMap[colorPreference] || colorMap.neutral;

  const filtered = products.filter((p) => {
    const matchesColor = p.colors.some((c) => preferredColors.includes(c.name));
    const matchesStyle =
      style === 'any' ||
      p.tags.some((t) => t.toLowerCase().includes(style.toLowerCase())) ||
      p.category.toLowerCase().includes(style.toLowerCase());
    return matchesColor && matchesStyle;
  });

  const outfits: OutfitSet[] = [];

  // Generate 3 outfit combinations
  for (let i = 0; i < 3; i++) {
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const items = shuffled.slice(0, Math.min(3 + i, shuffled.length));

    if (items.length >= 2) {
      const palette = [...new Set(items.flatMap((p) => p.colors.map((c) => c.name)))].slice(0, 3);
      outfits.push({
        name: `${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Look ${i + 1}`,
        description: `A ${style} inspired outfit perfect for ${occasion}. Features complementary textures and a cohesive ${colorPreference} color palette.`,
        items,
        occasion,
        colorPalette: palette,
      });
    }
  }

  return outfits;
}

export default function AIOutfit() {
  const [occasion, setOccasion] = useState('casual');
  const [style, setStyle] = useState('any');
  const [colorPreference, setColorPreference] = useState('neutral');
  const [outfits, setOutfits] = useState<OutfitSet[]>([]);
  const [generating, setGenerating] = useState(false);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setOutfits(generateOutfits({ occasion, style, colorPreference }));
      setGenerating(false);
    }, 1500);
  };

  const addOutfitToCart = (outfit: OutfitSet) => {
    outfit.items.forEach((item) => {
      const size = item.sizes[0];
      const color = item.colors[0]?.name || '';
      addToCart(item, size, color);
    });
    addToast(`Added "${outfit.name}" to cart`, 'success');
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            AI Outfit Stylist
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            Tell us your preferences and our AI will generate personalized outfit combinations
            tailored to your style, occasion, and color preferences.
          </p>
        </div>

        {/* Preferences Panel */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Occasion */}
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-3">
                  Occasion
                </label>
                <div className="space-y-2">
                  {['casual', 'formal', 'business', 'evening', 'sport'].map((o) => (
                    <button
                      key={o}
                      onClick={() => setOccasion(o)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                        occasion === o
                          ? 'bg-black dark:bg-white text-white dark:text-black font-medium'
                          : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {o.charAt(0).toUpperCase() + o.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-3">
                  Style Vibe
                </label>
                <div className="space-y-2">
                  {['any', 'minimal', 'classic', 'streetwear', 'elegant'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                        style === s
                          ? 'bg-black dark:bg-white text-white dark:text-black font-medium'
                          : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-3">
                  Color Palette
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'neutral', label: 'Neutral Tones' },
                    { value: 'bold', label: 'Bold Colors' },
                    { value: 'dark', label: 'Dark & Moody' },
                    { value: 'light', label: 'Light & Airy' },
                  ].map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setColorPreference(c.value)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                        colorPreference === c.value
                          ? 'bg-black dark:bg-white text-white dark:text-black font-medium'
                          : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Outfits...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate Outfits
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {outfits.length > 0 && (
          <div className="space-y-12">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white text-center">
              Your AI-Generated Outfits
            </h2>
            {outfits.map((outfit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden"
              >
                <div className="p-6 md:p-8 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                        {outfit.name}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {outfit.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {outfit.colorPalette.map((color) => (
                        <span
                          key={color}
                          className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs text-neutral-600 dark:text-neutral-400"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                    {outfit.items.map((item, j) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: j * 0.1 }}
                        className="group"
                      >
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-3">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                          {item.brand}
                        </p>
                        <h4 className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">
                          ${item.price}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => addOutfitToCart(outfit)}
                      className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add Outfit to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
