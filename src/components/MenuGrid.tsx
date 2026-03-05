import { MenuItem } from '../types';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuGrid({ items, onAddToCart }: MenuGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <motion.div
          key={item.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
        >
          <div className="aspect-video bg-gray-100 relative overflow-hidden">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-4xl">🍽️</span>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                {item.category}
              </span>
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{item.name}</h3>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-emerald-600 font-bold text-lg">
                {item.price.toLocaleString('vi-VN')} đ
              </span>
              <button
                onClick={() => onAddToCart(item)}
                className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
