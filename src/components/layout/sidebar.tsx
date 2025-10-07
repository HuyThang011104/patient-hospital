import {
    LayoutDashboard,
    Calendar,
    CalendarCheck,
    FileText,
    Pill,
    CreditCard,
    User,
    LogOut,
    Activity
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/use-auth';

interface SidebarProps {
    currentPage: string;
    onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
    const { logout } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'book-appointment', label: 'Book Appointment', icon: Calendar },
        { id: 'my-appointments', label: 'My Appointments', icon: CalendarCheck },
        { id: 'medical-records', label: 'Medical Records', icon: FileText },
        { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="w-64 bg-white border-r h-full flex flex-col">
            <div className="p-6 border-b">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-lg">MediCare</h1>
                        <p className="text-sm text-muted-foreground">Patient Portal</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Button
                            key={item.id}
                            variant={currentPage === item.id ? "default" : "ghost"}
                            className={`w-full justify-start gap-3 ${currentPage === item.id
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'hover:bg-gray-100'
                                }`}
                            onClick={() => onPageChange(item.id)}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Button>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}