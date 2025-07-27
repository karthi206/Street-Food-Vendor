import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Package, MapPin, Phone, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import RatingModal from './RatingModal';

interface OrderHistoryProps {
  userType: 'vendor' | 'supplier';
}

export default function OrderHistory({ userType }: OrderHistoryProps) {
  const { user } = useAuth();
  const { getOrdersByUser, updateOrder, addSupplierRating } = useData();
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orders = getOrdersByUser(user?.id || '', userType);
  
  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  const handleStatusUpdate = (orderId: string, newStatus: 'accepted' | 'rejected' | 'delivered') => {
    updateOrder(orderId, { status: newStatus });
  };

  const handleRateSupplier = (order: any) => {
    setSelectedOrder(order);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    if (selectedOrder) {
      addSupplierRating({
        supplierId: selectedOrder.supplierId,
        vendorId: user?.id || '',
        vendorName: user?.name || '',
        rating,
        comment,
        orderId: selectedOrder.id
      });
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'accepted': return Package;
      case 'rejected': return XCircle;
      case 'delivered': return CheckCircle;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {userType === 'vendor' ? 'My Orders' : 'Incoming Orders'}
          </h2>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">{t('pending')}</option>
            <option value="accepted">{t('accepted')}</option>
            <option value="rejected">{t('rejected')}</option>
            <option value="delivered">{t('delivered')}</option>
            <option value="completed">{t('completed')}</option>
          </select>
        </div>
      </div>
      
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          setSelectedOrder(null);
        }}
        onSubmit={handleRatingSubmit}
        title="Rate Supplier"
        subtitle={selectedOrder?.supplierName}
      />

      <div className="p-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const StatusIcon = getStatusIcon(order.status);
              
              return (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order #{order.id.slice(-6)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {userType === 'vendor' ? order.supplierName : order.vendorName}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(order.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {item.productName} - {item.quantity} {item.unit} × ₹{item.price.toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery:</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-2" />
                          {order.deliveryMode === 'online' ? 'Delivery' : 'Pickup'}
                        </div>
                        {order.deliveryAddress && (
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="break-words">{order.deliveryAddress}</span>
                          </div>
                        )}
                        {(order.deliveryTime || order.pickupTime) && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {new Date(order.deliveryTime || order.pickupTime || '').toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{order.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                      Ordered on {new Date(order.orderDate).toLocaleDateString()}
                    </span>

                    {userType === 'supplier' && order.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'rejected')}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          {t('rejected')}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'accepted')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                        >
                          {t('accepted')}
                        </button>
                      </div>
                    )}

                    {userType === 'supplier' && order.status === 'accepted' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        Mark as {t('delivered')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}