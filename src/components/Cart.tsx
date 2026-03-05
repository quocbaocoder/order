import { CartItem } from '../types';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
}

export default function Cart({ items, onUpdateQuantity, onRemove, onPlaceOrder, isSubmitting }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center h-full flex flex-col items-center justify-center text-gray-500">
        <ShoppingBag size={48} className="mb-4 opacity-20" />
        <p className="font-medium">Chưa có món nào</p>
        <p className="text-sm mt-1 opacity-60">Vui lòng chọn món từ thực đơn</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-140px)] sticky top-6">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBag className="text-emerald-600" />
          Đơn Hàng ({items.length})
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
                <p className="text-sm text-emerald-600 font-medium">
                  {item.price.toLocaleString('vi-VN')} đ
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Tổng cộng</span>
          <span className="text-2xl font-bold text-gray-900">
            {total.toLocaleString('vi-VN')} đ
          </span>
        </div>
        
        <button
          onClick={onPlaceOrder}
          disabled={isSubmitting}
          className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang Gửi...
            </>
          ) : (
            'Thanh Toán & Gửi Bếp'
          )}
        </button>
      </div>
    </div>
  );
}
