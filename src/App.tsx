import { useState } from "react";
import { Sidebar } from "./components/layout/sidebar";
import { LoginPage } from "./components/pages/login";
import { useAuth } from "./hooks/use-auth";
import { Dashboard } from "./components/pages/dashboard";
import { BookAppointment } from "./components/pages/book-appointment";
import { MyAppointments } from "./components/pages/my-appointments";
import { Prescriptions } from "./components/pages/prescriptions";
import { Profile } from "./components/pages/profile";
import { Header } from "./components/layout/header";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "./components/ui/sonner";
import { MedicalRecords } from "./components/pages/medical-records";
import { Payments } from "./components/pages/payments";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'book-appointment':
        return <BookAppointment onPageChange={setCurrentPage} />;
      case 'my-appointments':
        return <MyAppointments />;
      case 'medical-records':
        return <MedicalRecords />;
      case 'prescriptions':
        return <Prescriptions />;
      case 'payments':
        return <Payments />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="size-full">
        <AppContent />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}