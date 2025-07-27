import AuthPage from './components/AuthPage';
import VendorDashboard from './components/VendorDashboard';
import SupplierDashboard from './components/SupplierDashboard';
import { AuthContextProvider, useAuth } from './contexts/AuthContext';
import { DataContextProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LanguageProvider } from './contexts/LanguageContext';

function AppContent() {
  const { user, userType } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {userType === 'vendor' ? <VendorDashboard /> : <SupplierDashboard />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <AuthContextProvider>
          <DataContextProvider>
            <AppContent />
          </DataContextProvider>
        </AuthContextProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;