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
        return new Date(dateString).toLocaleDateString('en-US', {
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
                    <h1>Loading...</h1>
                    <p className="text-muted-foreground">Loading your dashboard...</p>
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
                <h1>Welcome back, {user?.full_name?.split(' ')[0] || 'John'}!</h1>
                <p className="text-muted-foreground">Here's an overview of your healthcare journey</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {upcomingAppointments.length > 0 ? 'Next appointment scheduled' : 'No upcoming appointments'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                        <FileText className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalVisits}</div>
                        <p className="text-xs text-muted-foreground">
                            Completed appointments this year
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Insurance</CardTitle>
                        <Shield className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {user?.insurance_provider ? 'Active' : 'None'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {user?.insurance_provider || 'No insurance on file'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                        <DollarSign className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalPayments.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {pendingPayments > 0 ? `${pendingPayments} pending bill(s)` : 'All bills paid'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Next Appointment */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Next Appointment</CardTitle>
                        <CardDescription>Your upcoming medical appointments</CardDescription>
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
                                            <p className="text-sm text-muted-foreground">Department</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(nextAppointment.appointment_date)} - {nextAppointment.shift?.name || 'Shift'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange('my-appointments')}
                                    >
                                        View Details
                                    </Button>
                                </div>
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    onClick={() => onPageChange('book-appointment')}
                                >
                                    <CalendarPlus className="h-4 w-4 mr-2" />
                                    Book Another Appointment
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="font-medium mb-2">No upcoming appointments</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Schedule your next appointment to stay on top of your health
                                </p>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => onPageChange('book-appointment')}
                                >
                                    <CalendarPlus className="h-4 w-4 mr-2" />
                                    Book Appointment
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => onPageChange('medical-records')}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            View Medical Records
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => onPageChange('prescriptions')}
                        >
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            View Prescriptions
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => onPageChange('payments')}
                        >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Manage Payments
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => onPageChange('profile')}
                        >
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Update Profile
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest appointments and medical records</CardDescription>
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
                                                Department • {formatDate(appointment.appointment_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onPageChange('medical-records')}
                                    >
                                        View Record
                                    </Button>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}