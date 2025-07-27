import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  profileImage?: string;
  verified?: boolean;
  rating?: number;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  userType: 'vendor' | 'supplier' | null;
  login: (userData: User, type: 'vendor' | 'supplier') => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addPoints: (value: number) => void;
  loyaltyPoints: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'vendor' | 'supplier' | null>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('userType');
    const savedPoints = localStorage.getItem('loyaltyPoints');

    if (savedUser && savedUserType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType as 'vendor' | 'supplier');
    }

    if (savedPoints) {
      setLoyaltyPoints(parseInt(savedPoints, 10));
    }
  }, []);

  const login = (userData: User, type: 'vendor' | 'supplier') => {
    setUser(userData);
    setUserType(type);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('userType', type);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setLoyaltyPoints(0);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    localStorage.removeItem('loyaltyPoints');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const addPoints = (value: number) => {
    const updatedPoints = loyaltyPoints + value;
    setLoyaltyPoints(updatedPoints);
    localStorage.setItem('loyaltyPoints', updatedPoints.toString());
  };

  return (
    <AuthContext.Provider
      value={{ user, userType, login, logout, updateUser, addPoints, loyaltyPoints }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
}