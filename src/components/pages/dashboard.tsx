import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, Clock, Shield, DollarSign, CalendarPlus, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/utils/backend/client';
import type { IAppointment } from '@/interfaces/appointment';
import type { IPayment } from '@/interfaces/payment';

interface DashboardProps {
    onPageChange: (page: string) => void;
}

export function Dashboard({ onPageChange }: DashboardProps) {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            
            // Fetch appointments
            const { data: appointmentsData, error: appointmentsError } = await supabase
                .from('appointment')
                .select(`
                    *,
                    doctor(full_name, department_id),
                    shift(*),
                    patient(*)
                `)
                .eq('patient_id', user.id)
                .order('appointment_date', { ascending: false });

            // Fetch payments
            const { data: paymentsData, error: paymentsError } = await supabase
                .from('payment')
                .select('*')
                .eq('patient_id', user.id)
                .order('payment_date', { ascending: false });

            if (appointmentsError) throw appointmentsError;
            if (paymentsError) throw paymentsError;

            setAppointments(appointmentsData || []);
            setPayments(paymentsData || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setAppointments([]);
            setPayments([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const upcomingAppointments = appointments.filter(
        apt => apt.status === 'Pending' && new Date(apt.appointment_date) >= new Date()
    );

    const totalVisits = appointments.filter(apt => apt.status === 'Completed').length;
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const pendingPayments = payments.filter(payment => payment.status === 'Pending').length;

    const nextAppointment = upcomingAppointments.sort((a, b) =>
        new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
    )[0];

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div>
                    <h1>Đang tải...</h1>
                    <p className="text-muted-foreground">Đang tải bảng điều khiển của bạn...</p>
                </div>
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1>Chào mừng trở lại, {user?.full_name?.split(' ')[0] || 'John'}!</h1>
                <p className="text-muted-foreground">Đây là tổng quan về hành trình chăm sóc sức khỏe của bạn</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lịch Hẹn Sắp Tới</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {upcomingAppointments.length > 0 ? 'Đã có lịch hẹn tiếp theo' : 'Không có lịch hẹn sắp tới'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Số Lượt Khám</CardTitle>
                        <FileText className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalVisits}</div>
                        <p className="text-xs text-muted-foreground">
                            Lịch hẹn đã hoàn thành trong năm nay
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bảo Hiểm</CardTitle>
                        <Shield className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {user?.insurance_provider ? 'Có' : 'Không'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {user?.insurance_provider || 'Không có bảo hiểm'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Thanh Toán</CardTitle>
                        <DollarSign className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalPayments.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {pendingPayments > 0 ? `${pendingPayments} hóa đơn chưa thanh toán` : 'Đã thanh toán tất cả'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Next Appointment */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Lịch Hẹn Tiếp Theo</CardTitle>
                        <CardDescription>Các lịch hẹn y tế sắp tới của bạn</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {nextAppointment ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <Calendar className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{nextAppointment.doctor?.full_name || 'Doctor'}</h3>
                                            <p className="text-sm text-muted-foreground">Khoa</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(nextAppointment.appointment_date)} - {nextAppointment.shift?.name || 'Ca'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange('my-appointments')}
                                    >
                                        Xem Chi Tiết
                                    </Button>
                                </div>
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    onClick={() => onPageChange('book-appointment')}
                                >
                                    <CalendarPlus className="h-4 w-4 mr-2" />
                                    Đặt Lịch Hẹn Khác
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="font-medium mb-2">Không có lịch hẹn sắp tới</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Đặt lịch hẹn tiếp theo để bảo vệ sức khỏe của bạn
                                </p>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => onPageChange('book-appointment')}
                                >
                                    <CalendarPlus className="h-4 w-4 mr-2" />
                                    Đặt Lịch Hẹn
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hành Động Nhanh</CardTitle>
                        <CardDescription>Các tác vụ thường dùng và đường tắt</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => onPageChange('medical-records')}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Xem Hồ Sơ Y Tế
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => onPageChange('prescriptions')}
                        >
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Xem Đơn Thuốc
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => onPageChange('payments')}
                        >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Quản Lý Thanh Toán
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => onPageChange('profile')}
                        >
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Cập Nhật Hồ Sơ
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Hoạt Động Gần Đây</CardTitle>
                    <CardDescription>Các lịch hẹn và hồ sơ y tế mới nhất của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {appointments
                            .filter(apt => apt.status === 'Completed')
                            .slice(0, 3)
                            .map((appointment) => (
                                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">{appointment.doctor?.full_name || 'Doctor'}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Khoa • {formatDate(appointment.appointment_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onPageChange('medical-records')}
                                    >
                                        Xem Hồ Sơ
                                    </Button>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}