import React, { useState } from 'react';
import { Plus, Package, ShoppingBag, MessageCircle, TrendingUp, LogOut, User, Edit, Trash2, Bell, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData, Product } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import AddProductModal from './AddProductModal';
import OrderHistory from './OrderHistory';
import Messages from './Messages';
import LanguageSelector from './LanguageSelector';

export default function SupplierDashboard() {
  const { user, logout } = useAuth();
  const { products, getProductsBySupplier, deleteProduct, getSupplierRating, supplierRatings } = useData();
  const { getUnreadCount } = useNotifications();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const myProducts = getProductsBySupplier(user?.id || '');
  const unreadNotifications = getUnreadCount(user?.id || '');
  const myRating = getSupplierRating(user?.id || '');
  const myRatings = supplierRatings.filter(rating => rating.supplierId === user?.id);
  
  const getTotalStock = () => {
    return myProducts.reduce((total, product) => total + product.stock, 0);
  };

  const getTotalValue = () => {
    return myProducts.reduce((total, product) => total + (product.stock * product.price), 0);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{t('welcome')}, {user?.name}</h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500">Supplier Dashboard</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1">{myRating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500 ml-1">({myRatings.length} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Bell className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('addProduct')}
              </button>
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{myProducts.length}</h3>
                <p className="text-sm text-gray-500">Active Products</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{getTotalStock()}</h3>
                <p className="text-sm text-gray-500">Total Stock (kg)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">₹{getTotalValue().toLocaleString()}</h3>
                <p className="text-sm text-gray-500">Inventory Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6">
            <div className="flex space-x-8">
              {[
                { id: 'products', label: t('myProducts'), icon: Package },
                { id: 'orders', label: t('orders'), icon: ShoppingBag },
                { id: 'messages', label: t('messages'), icon: MessageCircle }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('myProducts')}</h2>
              
              {myProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-500 mb-4">Start by adding your first product</p>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('addProduct')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProducts.map(product => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-green-600">₹{product.price}/{product.unit}</span>
                        <span className="text-sm text-gray-500">{product.stock} {product.unit} left</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowAddProduct(true);
                          }}
                          className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {t('delete')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && <OrderHistory userType="supplier" />}
        {activeTab === 'messages' && <Messages />}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <AddProductModal
          product={editingProduct}
          onClose={() => {
            setShowAddProduct(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}