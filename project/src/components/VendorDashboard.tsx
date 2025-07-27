import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, MapPin, Star, Truck, Clock, MessageCircle, LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData, Product } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import ProductCard from './ProductCard';
import Cart from './Cart';
import OrderHistory from './OrderHistory';
import Messages from './Messages';
import VoiceSearch from './VoiceSearch';
import LanguageSelector from './LanguageSelector';

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const { products } = useData();
  const { getUnreadCount } = useNotifications();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('distance');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [cartItems, setCartItems] = useState<{product: Product, quantity: number}[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = ['All', 'Vegetables', 'Spices', 'Grains', 'Dairy', 'Oils'];
  const unreadNotifications = getUnreadCount(user?.id || '');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesDelivery = deliveryFilter === 'all' || 
                           (deliveryFilter === 'online' && product.deliveryModes.includes('online')) ||
                           (deliveryFilter === 'offline' && product.deliveryModes.includes('offline'));
    
    return matchesSearch && matchesCategory && matchesDelivery;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price': return a.price - b.price;
      case 'rating': return b.supplierRating - a.supplierRating;
      case 'distance': return a.distance - b.distance;
      default: return 0;
    }
  });

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setShowCart(true);
  };

  const handleVoiceSearchResult = (transcript: string) => {
    setSearchTerm(transcript);
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{t('welcome')}, {user?.name}</h1>
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {user?.location.address}
                </p>
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
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {getTotalCartItems() > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-green-600 text-white rounded-full text-xs flex items-center justify-center">
                    {getTotalCartItems()}
                  </span>
                )}
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

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'browse', label: t('browseProducts'), icon: Search },
              { id: 'orders', label: t('orderHistory'), icon: Clock },
              { id: 'messages', label: t('messages'), icon: MessageCircle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && (
          <div>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('searchProducts')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <VoiceSearch onResult={handleVoiceSearchResult} />
                  </div>
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="distance">{t('sortByDistance')}</option>
                  <option value="price">{t('sortByPrice')}</option>
                  <option value="rating">{t('sortByRating')}</option>
                </select>

                <select
                  value={deliveryFilter}
                  onChange={(e) => setDeliveryFilter(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">{t('allDeliveryTypes')}</option>
                  <option value="online">{t('onlineDelivery')}</option>
                  <option value="offline">{t('pickupOnly')}</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && <OrderHistory userType="vendor" />}
        {activeTab === 'messages' && <Messages />}
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <Cart
          items={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={(productId, quantity) => {
            if (quantity === 0) {
              setCartItems(prev => prev.filter(item => item.product.id !== productId));
            } else {
              setCartItems(prev => prev.map(item => 
                item.product.id === productId ? { ...item, quantity } : item
              ));
            }
          }}
          onClearCart={() => setCartItems([])}
        />
      )}
    </div>
  );
}