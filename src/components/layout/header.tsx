import { Bell, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
    const { user } = useAuth();

    return (
        <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
            <div className="flex items-center flex-1 max-w-lg">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm cuộc hẹn, bác sĩ, ..."
                        className="pl-10 bg-gray-50 border-0"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                        3
                    </span>
                </Button>

                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                            {user?.full_name?.split(' ').map(n => n[0]).join('') || 'JS'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <p className="font-medium">{user?.full_name || 'John Smith'}</p>
                        <p className="text-muted-foreground">{user?.personal_id || 'ID123456789'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}