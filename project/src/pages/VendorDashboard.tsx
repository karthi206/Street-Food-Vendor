import React from 'react';

export default function VendorDashboard() {
  const dummyVendor = {
    name: 'Anand Snacks Corner',
    totalProducts: 5,
    totalOrders: 120,
    totalRatings: 37,
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">👨‍🍳 Vendor Dashboard</h2>
      <p className="text-lg text-gray-800 mb-2">Vendor: <strong>{dummyVendor.name}</strong></p>
      <p className="text-gray-600">🍜 Total Products: {dummyVendor.totalProducts}</p>
      <p className="text-gray-600">📦 Orders Received: {dummyVendor.totalOrders}</p>
      <p className="text-gray-600">⭐ Ratings Received: {dummyVendor.totalRatings}</p>
    </div>
  );
}
