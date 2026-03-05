import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Edit, Trash2, X, HelpCircle, FileText, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  menuItems: MenuItem[];
  onAdd: (item: Omit<MenuItem, 'id'>) => void;
  onUpdate: (id: number, item: Omit<MenuItem, 'id'>) => void;
  onDelete: (id: number) => void;
}

export default function AdminPanel({ menuItems, onAdd, onUpdate, onDelete }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'help'>('menu');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'Món Chính', image_url: '' });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', price: '', category: 'Món Chính', image_url: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      image_url: item.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
      name: formData.name,
      price: parseInt(formData.price),
      category: formData.category,
      image_url: formData.image_url
    };

    if (editingItem) {
      onUpdate(editingItem.id, itemData);
    } else {
      onAdd(itemData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('menu')}
            className={`text-2xl font-bold transition-colors ${activeTab === 'menu' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Quản Lý Thực Đơn
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`text-2xl font-bold transition-colors ${activeTab === 'help' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Hướng Dẫn Cấu Hình
          </button>
        </div>
        
        {activeTab === 'menu' && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={20} /> Thêm Món
          </button>
        )}
      </div>

      {activeTab === 'menu' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm">
                <th className="py-3 px-4">Tên Món</th>
                <th className="py-3 px-4">Giá</th>
                <th className="py-3 px-4">Danh Mục</th>
                <th className="py-3 px-4 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                  <td className="py-3 px-4 text-emerald-600 font-medium">
                    {item.price.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-8 max-w-3xl">
          {/* Telegram Guide */}
          <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2 mb-4">
              <Send size={24} />
              Cấu Hình Telegram
            </h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-bold text-gray-900">Bước 1: Lấy Bot Token</h4>
                <p>Chat với <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-blue-600 underline">@BotFather</a> trên Telegram, gửi lệnh <code>/newbot</code> và làm theo hướng dẫn để tạo bot mới. Bạn sẽ nhận được <strong>Token</strong>.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Bước 2: Lấy Chat ID</h4>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Tạo một nhóm chat mới trên Telegram.</li>
                  <li>Thêm bot vừa tạo vào nhóm đó.</li>
                  <li>Gửi một tin nhắn bất kỳ vào nhóm (ví dụ: "Hello bot").</li>
                  <li>Truy cập đường dẫn sau trên trình duyệt (thay thế TOKEN của bạn):</li>
                </ol>
                <div className="bg-white p-3 rounded border border-blue-200 mt-2 font-mono text-sm break-all">
                  https://api.telegram.org/bot<span className="text-red-500">YOUR_BOT_TOKEN</span>/getUpdates
                </div>
                <p className="mt-2">Tìm đoạn text <code>"chat":&#123;"id": -123456789...&#125;</code>. Số <strong>-123456789</strong> chính là Chat ID của bạn (nhớ lấy cả dấu âm).</p>
              </div>
            </div>
          </section>

          {/* Google Sheets Guide */}
          <section className="bg-green-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-xl font-bold text-green-800 flex items-center gap-2 mb-4">
              <FileText size={24} />
              Cấu Hình Google Sheets
            </h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-bold text-gray-900">Bước 1: Tạo Service Account</h4>
                <p>Truy cập <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-green-600 underline">Google Cloud Console</a>, tạo project mới, bật API Google Sheets, và tạo Service Account. Tải xuống file JSON chứa Key.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Bước 2: Chia sẻ Sheet</h4>
                <p>Mở file Google Sheet của bạn, nhấn nút <strong>Share</strong> và chia sẻ quyền <strong>Editor</strong> cho email của Service Account (có trong file JSON, đuôi <code>...iam.gserviceaccount.com</code>).</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Bước 3: Lấy Sheet ID</h4>
                <p>Sheet ID nằm trên thanh địa chỉ trình duyệt:</p>
                <div className="bg-white p-3 rounded border border-green-200 mt-2 font-mono text-sm break-all">
                  docs.google.com/spreadsheets/d/<span className="text-red-500">1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms</span>/edit
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingItem ? 'Sửa Món Ăn' : 'Thêm Món Mới'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên Món</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Ví dụ: Phở Bò"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh Mục</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    >
                      <option value="Món Chính">Món Chính</option>
                      <option value="Ăn Kèm">Ăn Kèm</option>
                      <option value="Đồ Uống">Đồ Uống</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình Ảnh (Tùy chọn)</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors shadow-sm"
                  >
                    {editingItem ? 'Lưu Thay Đổi' : 'Thêm Món'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
