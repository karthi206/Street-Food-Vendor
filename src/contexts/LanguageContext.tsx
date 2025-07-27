import React, { createContext, useContext, useState, useEffect } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Auth
    'welcome': 'Welcome',
    'vendor': 'Vendor',
    'supplier': 'Supplier',
    'login': 'Login',
    'register': 'Register',
    'email': 'Email Address',
    'password': 'Password',
    'fullName': 'Full Name',
    'phone': 'Phone Number',
    'address': 'Business Address',
    'signIn': 'Sign In',
    'createAccount': 'Create Account',
    
    // Dashboard
    'browseProducts': 'Browse Products',
    'orderHistory': 'Order History',
    'messages': 'Messages',
    'myProducts': 'My Products',
    'orders': 'Orders',
    'addProduct': 'Add Product',
    'searchProducts': 'Search products or suppliers...',
    'sortByDistance': 'Sort by Distance',
    'sortByPrice': 'Sort by Price',
    'sortByRating': 'Sort by Rating',
    'allDeliveryTypes': 'All Delivery Types',
    'onlineDelivery': 'Online Delivery',
    'pickupOnly': 'Pickup Only',
    
    // Product
    'addToCart': 'Add to Cart',
    'viewDetails': 'View Details',
    'hideDetails': 'Hide Details',
    'minOrder': 'Min order',
    'left': 'left',
    'bulkDiscounts': 'Bulk Discounts',
    'delivery': 'Delivery',
    'pickup': 'Pickup',
    'kmAway': 'km away',
    
    // Cart & Orders
    'cart': 'Cart',
    'total': 'Total',
    'clearCart': 'Clear Cart',
    'proceedToCheckout': 'Proceed to Checkout',
    'deliveryMode': 'Delivery Mode',
    'deliveryAddress': 'Delivery Address',
    'preferredDeliveryTime': 'Preferred Delivery Time',
    'pickupTime': 'Pickup Time',
    'specialNotes': 'Special Notes',
    'placeOrder': 'Place Order',
    'orderPlaced': 'Order Placed Successfully!',
    
    // Status
    'pending': 'Pending',
    'accepted': 'Accepted',
    'rejected': 'Rejected',
    'delivered': 'Delivered',
    'completed': 'Completed',
    
    // Common
    'cancel': 'Cancel',
    'save': 'Save',
    'edit': 'Edit',
    'delete': 'Delete',
    'submit': 'Submit',
    'close': 'Close',
    'search': 'Search',
    'filter': 'Filter',
    'category': 'Category',
    'price': 'Price',
    'rating': 'Rating',
    'distance': 'Distance',
    'stock': 'Stock',
    'quantity': 'Quantity',
    'unit': 'Unit',
    'description': 'Description',
    'voiceSearch': 'Voice Search',
    'listening': 'Listening...',
    'speakNow': 'Speak now',
    'language': 'Language'
  },
  hi: {
    // Auth
    'welcome': 'स्वागत है',
    'vendor': 'विक्रेता',
    'supplier': 'आपूर्तिकर्ता',
    'login': 'लॉगिन',
    'register': 'पंजीकरण',
    'email': 'ईमेल पता',
    'password': 'पासवर्ड',
    'fullName': 'पूरा नाम',
    'phone': 'फोन नंबर',
    'address': 'व्यापार का पता',
    'signIn': 'साइन इन',
    'createAccount': 'खाता बनाएं',
    
    // Dashboard
    'browseProducts': 'उत्पाद ब्राउज़ करें',
    'orderHistory': 'ऑर्डर इतिहास',
    'messages': 'संदेश',
    'myProducts': 'मेरे उत्पाद',
    'orders': 'ऑर्डर',
    'addProduct': 'उत्पाद जोड़ें',
    'searchProducts': 'उत्पाद या आपूर्तिकर्ता खोजें...',
    'sortByDistance': 'दूरी के अनुसार क्रमबद्ध करें',
    'sortByPrice': 'कीमत के अनुसार क्रमबद्ध करें',
    'sortByRating': 'रेटिंग के अनुसार क्रमबद्ध करें',
    'allDeliveryTypes': 'सभी डिलीवरी प्रकार',
    'onlineDelivery': 'ऑनलाइन डिलीवरी',
    'pickupOnly': 'केवल पिकअप',
    
    // Product
    'addToCart': 'कार्ट में जोड़ें',
    'viewDetails': 'विवरण देखें',
    'hideDetails': 'विवरण छुपाएं',
    'minOrder': 'न्यूनतम ऑर्डर',
    'left': 'बचा है',
    'bulkDiscounts': 'थोक छूट',
    'delivery': 'डिलीवरी',
    'pickup': 'पिकअप',
    'kmAway': 'किमी दूर',
    
    // Cart & Orders
    'cart': 'कार्ट',
    'total': 'कुल',
    'clearCart': 'कार्ट साफ़ करें',
    'proceedToCheckout': 'चेकआउट पर जाएं',
    'deliveryMode': 'डिलीवरी मोड',
    'deliveryAddress': 'डिलीवरी पता',
    'preferredDeliveryTime': 'पसंदीदा डिलीवरी समय',
    'pickupTime': 'पिकअप समय',
    'specialNotes': 'विशेष नोट्स',
    'placeOrder': 'ऑर्डर दें',
    'orderPlaced': 'ऑर्डर सफलतापूर्वक दिया गया!',
    
    // Status
    'pending': 'लंबित',
    'accepted': 'स्वीकृत',
    'rejected': 'अस्वीकृत',
    'delivered': 'वितरित',
    'completed': 'पूर्ण',
    
    // Common
    'cancel': 'रद्द करें',
    'save': 'सेव करें',
    'edit': 'संपादित करें',
    'delete': 'हटाएं',
    'submit': 'जमा करें',
    'close': 'बंद करें',
    'search': 'खोजें',
    'filter': 'फिल्टर',
    'category': 'श्रेणी',
    'price': 'कीमत',
    'rating': 'रेटिंग',
    'distance': 'दूरी',
    'stock': 'स्टॉक',
    'quantity': 'मात्रा',
    'unit': 'इकाई',
    'description': 'विवरण',
    'voiceSearch': 'आवाज खोज',
    'listening': 'सुन रहा है...',
    'speakNow': 'अब बोलें',
    'language': 'भाषा'
  },
  ta: {
    // Auth
    'welcome': 'வரவேற்கிறோம்',
    'vendor': 'விற்பனையாளர்',
    'supplier': 'சப்ளையர்',
    'login': 'உள்நுழைவு',
    'register': 'பதிவு',
    'email': 'மின்னஞ்சல் முகவரி',
    'password': 'கடவுச்சொல்',
    'fullName': 'முழு பெயர்',
    'phone': 'தொலைபேசி எண்',
    'address': 'வணிக முகவரி',
    'signIn': 'உள்நுழைக',
    'createAccount': 'கணக்கை உருவாக்கவும்',
    
    // Dashboard
    'browseProducts': 'தயாரிப்புகளை உலாவவும்',
    'orderHistory': 'ஆர்டர் வரலாறு',
    'messages': 'செய்திகள்',
    'myProducts': 'எனது தயாரிப்புகள்',
    'orders': 'ஆர்டர்கள்',
    'addProduct': 'தயாரிப்பு சேர்க்கவும்',
    'searchProducts': 'தயாரிப்புகள் அல்லது சப்ளையர்களைத் தேடுங்கள்...',
    'sortByDistance': 'தூரத்தின் அடிப்படையில் வரிசைப்படுத்தவும்',
    'sortByPrice': 'விலையின் அடிப்படையில் வரிசைப்படுத்தவும்',
    'sortByRating': 'மதிப்பீட்டின் அடிப்படையில் வரிசைப்படுத்தவும்',
    'allDeliveryTypes': 'அனைத்து டெலிவரி வகைகள்',
    'onlineDelivery': 'ஆன்லைன் டெலிவரி',
    'pickupOnly': 'பிக்அப் மட்டும்',
    
    // Product
    'addToCart': 'கார்ட்டில் சேர்க்கவும்',
    'viewDetails': 'விவரங்களைப் பார்க்கவும்',
    'hideDetails': 'விவரங்களை மறைக்கவும்',
    'minOrder': 'குறைந்தபட்ச ஆர்டர்',
    'left': 'மீதம்',
    'bulkDiscounts': 'மொத்த தள்ளுபடிகள்',
    'delivery': 'டெலிவரி',
    'pickup': 'பிக்அப்',
    'kmAway': 'கிமீ தூரம்',
    
    // Cart & Orders
    'cart': 'கார்ட்',
    'total': 'மொத்தம்',
    'clearCart': 'கார்ட்டை அழிக்கவும்',
    'proceedToCheckout': 'செக்அவுட்டுக்கு செல்லவும்',
    'deliveryMode': 'டெலிவரி முறை',
    'deliveryAddress': 'டெலிவரி முகவரி',
    'preferredDeliveryTime': 'விருப்பமான டெலிவரி நேரம்',
    'pickupTime': 'பிக்அப் நேரம்',
    'specialNotes': 'சிறப்பு குறிப்புகள்',
    'placeOrder': 'ஆர்டர் செய்யவும்',
    'orderPlaced': 'ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டது!',
    
    // Status
    'pending': 'நிலுவையில்',
    'accepted': 'ஏற்றுக்கொள்ளப்பட்டது',
    'rejected': 'நிராகரிக்கப்பட்டது',
    'delivered': 'வழங்கப்பட்டது',
    'completed': 'முடிந்தது',
    
    // Common
    'cancel': 'ரத்து செய்யவும்',
    'save': 'சேமிக்கவும்',
    'edit': 'திருத்தவும்',
    'delete': 'நீக்கவும்',
    'submit': 'சமர்ப்பிக்கவும்',
    'close': 'மூடவும்',
    'search': 'தேடவும்',
    'filter': 'வடிகட்டி',
    'category': 'வகை',
    'price': 'விலை',
    'rating': 'மதிப்பீடு',
    'distance': 'தூரம்',
    'stock': 'ஸ்டாக்',
    'quantity': 'அளவு',
    'unit': 'அலகு',
    'description': 'விவரம்',
    'voiceSearch': 'குரல் தேடல்',
    'listening': 'கேட்கிறது...',
    'speakNow': 'இப்போது பேசுங்கள்',
    'language': 'மொழி'
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  languages: { code: string; name: string; nativeName: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t,
      languages
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}