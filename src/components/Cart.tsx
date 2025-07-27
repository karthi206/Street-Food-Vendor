import React, { useState } from 'react';
import { X, Plus, Minus, Truck, Clock, MapPin, CreditCard } from 'lucide-react';
import { Product } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';

interface CartProps {
  items: { product: Product; quantity: number }[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
}

export default function Cart({ items, onClose, onUpdateQuantity, onClearCart }: CartProps) {
  const { user } = useAuth();
  const { addOrder } = useData();
  const { showToast } = useNotifications();
  const { t } = useLanguage();
  const [deliveryMode, setDeliveryMode] = useState<'online' | 'offline'>('online');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [notes, setNotes] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const discount = calculateBulkDiscount(item.product, item.quantity);
      const discountedPrice = item.product.price * (1 - discount / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  const calculateBulkDiscount = (product: Product, quantity: number) => {
    if (!product.bulkDiscounts) return 0;
    
    let discount = 0;
    for (const bulk of product.bulkDiscounts) {
      if (quantity >= bulk.quantity) {
        discount = bulk.discount;
      }
    }
    return discount;
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    // Group items by supplier
    const ordersBySupplier = items.reduce((acc, item) => {
      const supplierId = item.product.supplierId;
      if (!acc[supplierId]) {
        acc[supplierId] = {
          supplierId,
          supplierName: item.product.supplierName,
          items: []
        };
      }
      acc[supplierId].items.push(item);
      return acc;
    }, {} as Record<string, any>);

    // Create orders for each supplier
    Object.values(ordersBySupplier).forEach((supplierOrder: any) => {
      const orderItems = supplierOrder.items.map((item: any) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price * (1 - calculateBulkDiscount(item.product, item.quantity) / 100),
        unit: item.product.unit
      }));

      const totalAmount = orderItems.reduce((total: number, item: any) => 
        total + (item.price * item.quantity), 0);

      addOrder({
        vendorId: user?.id || '',
        vendorName: user?.name || '',
        supplierId: supplierOrder.supplierId,
        supplierName: supplierOrder.supplierName,
        items: orderItems,
        totalAmount,
        deliveryMode,
        deliveryAddress: deliveryMode === 'online' ? user?.location.address : undefined,
        deliveryTime: deliveryMode === 'online' ? deliveryTime : undefined,
        pickupTime: deliveryMode === 'offline' ? deliveryTime : undefined,
        status: 'pending',
        notes
      });
    });

    onClearCart();
    onClose();
    showToast('success', t('orderPlaced'), 'Your orders have been sent to suppliers');
  };

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{t('cart')}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{t('cart')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!showCheckout ? (
            <div>
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const discount = calculateBulkDiscount(item.product, item.quantity);
                  const discountedPrice = item.product.price * (1 - discount / 100);
                  
                  return (
                    <div key={item.product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.supplierName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {discount > 0 ? (
                            <>
                              <span className="text-green-600 font-medium">₹{discountedPrice.toFixed(2)}</span>
                              <span className="text-gray-500 line-through text-sm">₹{item.product.price}</span>
                              <span className="text-xs text-green-600">({discount}% off)</span>
                            </>
                          ) : (
                            <span className="text-gray-900 font-medium">₹{item.product.price}</span>
                          )}
                          <span className="text-sm text-gray-500">/{item.product.unit}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(discountedPrice * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold mb-4">
                  <span>{t('total')}:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={onClearCart}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t('clearCart')}
                  </button>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t('proceedToCheckout')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">Checkout Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('deliveryMode')}
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="online"
                        checked={deliveryMode === 'online'}
                        onChange={(e) => setDeliveryMode(e.target.value as 'online')}
                        className="mr-2"
                      />
                      <Truck className="h-4 w-4 mr-1" />
                      {t('delivery')}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="offline"
                        checked={deliveryMode === 'offline'}
                        onChange={(e) => setDeliveryMode(e.target.value as 'offline')}
                        className="mr-2"
                      />
                      <Clock className="h-4 w-4 mr-1" />
                      {t('pickup')}
                    </label>
                  </div>
                </div>

                {deliveryMode === 'online' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('deliveryAddress')}
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">{user?.location.address}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {deliveryMode === 'online' ? t('preferredDeliveryTime') : t('pickupTime')}
                  </label>
                  <input
                    type="datetime-local"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('specialNotes')} (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Any special instructions..."
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold mb-4">
                    <span>{t('total')} Amount:</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Back to {t('cart')}
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {t('placeOrder')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}