import React, { useState, useEffect } from 'react';
import { X, Upload, Camera, Search } from 'lucide-react';
import { useData, Product } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

interface AddProductModalProps {
  product?: Product | null;
  onClose: () => void;
}

export default function AddProductModal({ product, onClose }: AddProductModalProps) {
  const { user } = useAuth();
  const { addProduct, updateProduct } = useData();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    stock: '',
    image: '',
    description: '',
    minOrder: '1',
    deliveryModes: ['online'] as ('online' | 'offline')[],
    bulkDiscounts: [{ quantity: '', discount: '' }]
  });

  const categories = ['Vegetables', 'Spices', 'Grains', 'Dairy', 'Oils', 'Fruits', 'Meat', 'Others'];
  const units = ['kg', 'grams', 'pieces', 'liters', 'packets'];
  
  const sampleImages = [
    'https://images.pexels.com/photos/3648850/pexels-photo-3648850.jpeg',
    'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg',
    'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
    'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg',
    'https://images.pexels.com/photos/2117978/pexels-photo-2117978.jpeg',
    'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg'
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        unit: product.unit,
        stock: product.stock.toString(),
        image: product.image,
        description: product.description,
        minOrder: product.minOrder.toString(),
        deliveryModes: product.deliveryModes,
        bulkDiscounts: product.bulkDiscounts?.map(bd => ({ 
          quantity: bd.quantity.toString(), 
          discount: bd.discount.toString() 
        })) || [{ quantity: '', discount: '' }]
      });
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDeliveryModeChange = (mode: 'online' | 'offline') => {
    setFormData(prev => ({
      ...prev,
      deliveryModes: prev.deliveryModes.includes(mode)
        ? prev.deliveryModes.filter(m => m !== mode)
        : [...prev.deliveryModes, mode]
    }));
  };

  const handleBulkDiscountChange = (index: number, field: 'quantity' | 'discount', value: string) => {
    setFormData(prev => ({
      ...prev,
      bulkDiscounts: prev.bulkDiscounts.map((bd, i) => 
        i === index ? { ...bd, [field]: value } : bd
      )
    }));
  };

  const addBulkDiscount = () => {
    setFormData(prev => ({
      ...prev,
      bulkDiscounts: [...prev.bulkDiscounts, { quantity: '', discount: '' }]
    }));
  };

  const removeBulkDiscount = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bulkDiscounts: prev.bulkDiscounts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      unit: formData.unit,
      stock: parseInt(formData.stock),
      image: formData.image || sampleImages[0],
      supplierId: user?.id || '',
      supplierName: user?.name || '',
      supplierRating: user?.rating || 4.5,
      distance: Math.random() * 5, // Mock distance
      deliveryModes: formData.deliveryModes,
      description: formData.description,
      minOrder: parseInt(formData.minOrder),
      bulkDiscounts: formData.bulkDiscounts
        .filter(bd => bd.quantity && bd.discount)
        .map(bd => ({
          quantity: parseInt(bd.quantity),
          discount: parseFloat(bd.discount)
        }))
    };

    if (product) {
      updateProduct(product.id, productData);
    } else {
      addProduct(productData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Fresh Red Onions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order *
                </label>
                <input
                  type="number"
                  name="minOrder"
                  value={formData.minOrder}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your product quality, source, etc."
              />
            </div>

            {/* Delivery Modes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Delivery Options *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.deliveryModes.includes('online')}
                    onChange={() => handleDeliveryModeChange('online')}
                    className="mr-2"
                  />
                  Online Delivery
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.deliveryModes.includes('offline')}
                    onChange={() => handleDeliveryModeChange('offline')}
                    className="mr-2"
                  />
                  Pickup Available
                </label>
              </div>
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Product Image
              </label>
              
              {formData.image && (
                <div className="mb-4">
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}

              <div className="space-y-3">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter image URL"
                />

                <div>
                  <p className="text-sm text-gray-600 mb-2">Or choose from sample images:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {sampleImages.map((imageUrl, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: imageUrl }))}
                        className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                          formData.image === imageUrl ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={imageUrl}
                          alt={`Sample ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Discounts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bulk Discounts (Optional)
              </label>
              <div className="space-y-3">
                {formData.bulkDiscounts.map((discount, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="number"
                      placeholder="Min quantity"
                      value={discount.quantity}
                      onChange={(e) => handleBulkDiscountChange(index, 'quantity', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">units get</span>
                    <input
                      type="number"
                      placeholder="Discount %"
                      value={discount.discount}
                      onChange={(e) => handleBulkDiscountChange(index, 'discount', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">% off</span>
                    {formData.bulkDiscounts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBulkDiscount(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBulkDiscount}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add another discount tier
                </button>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}