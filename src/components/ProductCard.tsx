import React, { useState } from 'react';
import { MapPin, Star, Truck, Clock, Plus, Minus, MessageCircle, ThumbsUp } from 'lucide-react';
import { Product } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import RatingModal from './RatingModal';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addProductRating } = useData();
  const [quantity, setQuantity] = useState(product.minOrder);
  const [showDetails, setShowDetails] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const calculateBulkDiscount = (qty: number) => {
    if (!product.bulkDiscounts) return 0;
    let discount = 0;
    for (const bulk of product.bulkDiscounts) {
      if (qty >= bulk.quantity) {
        discount = bulk.discount;
      }
    }
    return discount;
  };

  const discount = calculateBulkDiscount(quantity);
  const discountedPrice = product.price * (1 - discount / 100);

  const handleRatingSubmit = (rating: number, comment: string) => {
    try {
      addProductRating(product.id, {
        userId: user?.id || '',
        userName: user?.name || '',
        rating,
        comment
      });
    } catch (error) {
      console.error('Rating submission failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={product.image || '/fallback.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {product.stock} {product.unit} left
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Certified Hygienic
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>

        <div className="flex items-center mb-2">
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium ml-1">{product.supplierRating}</span>
          </div>
          <span className="text-sm text-gray-500 ml-2">{product.supplierName}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{product.distance} km away</span>
        </div>
        <p className="text-xs text-gray-600">📍 Live Location: 13.0345, 80.2564</p>
        <p className="text-xs text-gray-600 mb-1">⏳ Wait Time: 10 mins</p>
        <p className="text-xs text-gray-600 mb-3">📍 Location: Marina Street</p>

        <div className="flex items-center space-x-2 mb-3">
          {product.deliveryModes.includes('online') && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
              <Truck className="h-3 w-3 mr-1" />
              {t('delivery')}
            </span>
          )}
          {product.deliveryModes.includes('offline') && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {t('pickup')}
            </span>
          )}
        </div>

        <div className="mb-4">
          {discount > 0 ? (
            <div>
              <span className="text-lg font-bold text-green-600">₹{discountedPrice.toFixed(2)}/{product.unit}</span>
              <span className="text-sm text-gray-500 line-through ml-2">₹{product.price}</span>
              <span className="text-xs text-green-600 ml-1">({discount}% off)</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">₹{product.price}/{product.unit}</span>
          )}
          <p className="text-xs text-gray-500 mt-1">{t('minOrder')}: {product.minOrder} {product.unit}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(product.minOrder, quantity - 1))}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-gray-600">{quantity} {product.unit}</span>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onAddToCart(product, quantity)}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            {t('addToCart')} - ₹{(discountedPrice * quantity).toFixed(2)}
          </button>

          <button
            onClick={() => setShowOrderModal(true)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Order Now
          </button>
          <button
          onClick={() => alert("Scan this UPI QR to pay 🧾")}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            Pay with UPI
          </button>


          <div className="flex space-x-1">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-200 transition-colors text-xs"
            >
              {showDetails ? t('hideDetails') : t('viewDetails')}
            </button>
            <button
              onClick={() => setShowRatingModal(true)}
              className="bg-yellow-100 text-yellow-700 py-2 px-2 rounded-lg hover:bg-yellow-200 transition-colors text-xs"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>

            <button className="bg-blue-100 text-blue-700 py-2 px-2 rounded-lg hover:bg-blue-200 transition-colors text-xs">
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
          {showOrderModal && (
            <div className="fixed top-1/3 left-1/3 bg-white p-6 rounded-lg shadow-lg z-50">
            <p className="text-sm text-gray-700 mb-1">Thanks for ordering!</p>
            <p className="text-sm text-green-600 font-medium mb-4">🎁 You earned 10 loyalty points!</p>
            <button onClick={() => setShowOrderModal(false)} className="bg-blue-600 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        )}

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">{product.description}</p>

            {product.bulkDiscounts && product.bulkDiscounts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">{t('bulkDiscounts')}:</h4>
                <div className="space-y-1">
                  {product.bulkDiscounts.map((bulk, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      {bulk.quantity}+ {product.unit}: {bulk.discount}% off
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.ratings && product.ratings.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Reviews:</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {product.ratings.slice(-3).map((rating, index) => (
                    <div key={rating.id || index} className="text-xs border-l-2 border-gray-200 pl-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <span className="font-medium">{rating.userName}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      {rating.comment && <p className="text-gray-600">{rating.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showOrderModal && (
        <div className="fixed top-1/3 left-1/3 bg-white p-6 rounded-lg shadow-lg z-50">
          <h3 className="text-lg font-semibold mb-2">Order Confirmed 🎉</h3>
          <p className="text-sm text-gray-700 mb-4">Thanks for ordering!</p>
          <button onClick={() => setShowOrderModal(false)} className="bg-blue-600 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      )}

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        title="Rate this Product"
        subtitle={product.name}
      />
    </div>
  );
}