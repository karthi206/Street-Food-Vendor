import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  supplierId: string;
  supplierName: string;
  supplierRating: number;
  distance: number;
  deliveryModes: ('online' | 'offline')[];
  description: string;
  minOrder: number;
  bulkDiscounts?: { quantity: number; discount: number }[];
  lastUpdated: string;
  ratings?: ProductRating[];
  averageRating?: number;
}

export interface ProductRating {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  vendorId: string;
  vendorName: string;
  supplierId: string;
  supplierName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    unit: string;
  }[];
  totalAmount: number;
  deliveryMode: 'online' | 'offline';
  deliveryAddress?: string;
  pickupTime?: string;
  deliveryTime?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'delivered' | 'completed';
  orderDate: string;
  notes?: string;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SupplierRating {
  id: string;
  supplierId: string;
  vendorId: string;
  vendorName: string;
  rating: number;
  comment: string;
  orderId: string;
  date: string;
}
interface DataContextType {
  products: Product[];
  orders: Order[];
  messages: Message[];
  supplierRatings: SupplierRating[];
  addProduct: (product: Omit<Product, 'id' | 'lastUpdated'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'orderDate'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  markMessageAsRead: (id: string) => void;
  addProductRating: (productId: string, rating: Omit<ProductRating, 'id' | 'date'>) => void;
  addSupplierRating: (rating: Omit<SupplierRating, 'id' | 'date'>) => void;
  getProductsBySupplier: (supplierId: string) => Product[];
  getOrdersByUser: (userId: string, userType: 'vendor' | 'supplier') => Order[];
  getMessagesByUser: (userId: string) => Message[];
  getSupplierRating: (supplierId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Red Onions',
    category: 'Vegetables',
    price: 30,
    unit: 'kg',
    stock: 500,
    image: 'https://images.pexels.com/photos/3648850/pexels-photo-3648850.jpeg',
    supplierId: 'supplier1',
    supplierName: 'Ravi Vegetable Mart',
    supplierRating: 4.5,
    distance: 1.2,
    deliveryModes: ['online', 'offline'],
    description: 'Fresh, high-quality red onions sourced directly from local farms.',
    minOrder: 5,
    bulkDiscounts: [
      { quantity: 50, discount: 5 },
      { quantity: 100, discount: 10 }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Premium Potatoes',
    category: 'Vegetables',
    price: 25,
    unit: 'kg',
    stock: 300,
    image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg',
    supplierId: 'supplier2',
    supplierName: 'Sharma Fresh Supplies',
    supplierRating: 4.2,
    distance: 2.5,
    deliveryModes: ['online'],
    description: 'Grade A potatoes perfect for all your cooking needs.',
    minOrder: 10,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Garam Masala Powder',
    category: 'Spices',
    price: 180,
    unit: 'kg',
    stock: 50,
    image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg',
    supplierId: 'supplier1',
    supplierName: 'Ravi Vegetable Mart',
    supplierRating: 4.5,
    distance: 1.2,
    deliveryModes: ['online', 'offline'],
    description: 'Authentic garam masala blend with premium spices.',
    minOrder: 1,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: 35,
    unit: 'kg',
    stock: 200,
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
    supplierId: 'supplier3',
    supplierName: 'Green Valley Farms',
    supplierRating: 4.8,
    distance: 3.1,
    deliveryModes: ['online', 'offline'],
    description: 'Farm-fresh tomatoes with rich flavor and vibrant color.',
    minOrder: 5,
    bulkDiscounts: [
      { quantity: 25, discount: 8 }
    ],
    lastUpdated: new Date().toISOString()
  }
];

export function DataContextProvider({ children }: { children: React.ReactNode }) {
  const notifications = useNotifications();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [supplierRatings, setSupplierRatings] = useState<SupplierRating[]>([]);

  const addProduct = (productData: Omit<Product, 'id' | 'lastUpdated'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...updates, lastUpdated: new Date().toISOString() }
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'orderDate'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderDate: new Date().toISOString()
    };
    setOrders(prev => [...prev, newOrder]);
    
    // Send notification to supplier
    if (notifications) {
      notifications.addNotification({
        type: 'info',
        title: 'New Order Received',
        message: `New order from ${orderData.vendorName} for ₹${orderData.totalAmount.toFixed(2)}`,
        userId: orderData.supplierId
      });
    }
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    const order = orders.find(o => o.id === id);
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ));
    
    // Send notification based on status update
    if (order && updates.status && notifications) {
      const statusMessages = {
        accepted: 'Your order has been accepted',
        rejected: 'Your order has been rejected',
        delivered: 'Your order has been delivered'
      };
      
      if (statusMessages[updates.status as keyof typeof statusMessages]) {
        notifications.addNotification({
          type: updates.status === 'rejected' ? 'error' : 'success',
          title: 'Order Status Update',
          message: statusMessages[updates.status as keyof typeof statusMessages],
          userId: order.vendorId
        });
      }
    }
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Send notification to recipient
    if (notifications) {
      notifications.addNotification({
        type: 'info',
        title: 'New Message',
        message: `New message from ${messageData.fromName}`,
        userId: messageData.toId
      });
    }
  };

  const markMessageAsRead = (id: string) => {
    setMessages(prev => prev.map(message => 
      message.id === id ? { ...message, read: true } : message
    ));
  };

  const addProductRating = (productId: string, ratingData: Omit<ProductRating, 'id' | 'date'>) => {
    const newRating: ProductRating = {
      ...ratingData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const ratings = [...(product.ratings || []), newRating];
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        return { ...product, ratings, averageRating };
      }
      return product;
    }));
  };

  const addSupplierRating = (ratingData: Omit<SupplierRating, 'id' | 'date'>) => {
    const newRating: SupplierRating = {
      ...ratingData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setSupplierRatings(prev => [...prev, newRating]);
  };
  const getProductsBySupplier = (supplierId: string) => {
    return products.filter(product => product.supplierId === supplierId);
  };

  const getOrdersByUser = (userId: string, userType: 'vendor' | 'supplier') => {
    return orders.filter(order => 
      userType === 'vendor' ? order.vendorId === userId : order.supplierId === userId
    );
  };

  const getMessagesByUser = (userId: string) => {
    return messages.filter(message => 
      message.fromId === userId || message.toId === userId
    );
  };

  const getSupplierRating = (supplierId: string) => {
    const ratings = supplierRatings.filter(rating => rating.supplierId === supplierId);
    if (ratings.length === 0) return 4.5; // Default rating
    return ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
  };
  return (
    <DataContext.Provider value={{
      products,
      orders,
      messages,
      supplierRatings,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrder,
      addMessage,
      markMessageAsRead,
      addProductRating,
      addSupplierRating,
      getProductsBySupplier,
      getOrdersByUser,
      getMessagesByUser,
      getSupplierRating
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataContextProvider');
  }
  return context;
}