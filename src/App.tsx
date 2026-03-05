import { useState, useEffect } from 'react';
import { MenuItem, CartItem } from './types';
import MenuGrid from './components/MenuGrid';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import { LayoutGrid, ShoppingBag, Settings, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'menu' | 'admin'>('menu');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
      showNotification('Lỗi tải thực đơn', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showNotification(`Đã thêm ${item.name}`, 'success');
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, total }),
      });
      
      if (!res.ok) throw new Error('Order failed');
      
      const data = await res.json();
      setCart([]);
      
      let msg = 'Đã gửi đơn thành công!';
      if (data.syncedSheets && data.syncedTelegram) {
        msg = 'Đã gửi đơn & đồng bộ Telegram, Sheet thành công!';
      } else if (data.syncedSheets) {
        msg = 'Đã gửi đơn & đồng bộ Google Sheet!';
      } else if (data.syncedTelegram) {
        msg = 'Đã gửi đơn & đồng bộ Telegram!';
      }
      
      showNotification(msg, 'success');
    } catch (error) {
      console.error(error);
      showNotification('Lỗi gửi đơn hàng', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin Functions
  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchMenu();
      showNotification('Đã thêm món mới', 'success');
    } catch (error) {
      showNotification('Lỗi thêm món', 'error');
    }
  };

  const updateMenuItem = async (id: number, item: Omit<MenuItem, 'id'>) => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchMenu();
      showNotification('Đã cập nhật món', 'success');
    } catch (error) {
      showNotification('Lỗi cập nhật món', 'error');
    }
  };

  const deleteMenuItem = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa món này?')) return;
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      await fetchMenu();
      showNotification('Đã xóa món', 'success');
    } catch (error) {
      showNotification('Lỗi xóa món', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <ChefHat size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Quán Ăn <span className="text-emerald-600">Ngon</span>
            </h1>
          </div>
          
          <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setView('menu')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'menu' 
                  ? 'bg-white text-emerald-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutGrid size={16} />
                Thực Đơn
              </div>
            </button>
            <button
              onClick={() => setView('admin')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'admin' 
                  ? 'bg-white text-emerald-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings size={16} />
                Quản Lý
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {view === 'menu' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Danh Sách Món Ăn</h2>
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                    {menuItems.length} món
                  </span>
                </div>
                
                {isLoading ? (
                  <div className="grid grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <MenuGrid items={menuItems} onAddToCart={addToCart} />
                )}
              </div>
              
              <div className="lg:col-span-1">
                <Cart
                  items={cart}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                  onPlaceOrder={placeOrder}
                  isSubmitting={isSubmitting}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AdminPanel
                menuItems={menuItems}
                onAdd={addMenuItem}
                onUpdate={updateMenuItem}
                onDelete={deleteMenuItem}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-lg text-white font-medium flex items-center gap-3 z-50 ${
              notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {notification.type === 'success' ? '✅' : '⚠️'}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
