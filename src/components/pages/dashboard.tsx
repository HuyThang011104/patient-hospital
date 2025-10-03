import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Users, UserCheck, Bed, Calendar, DollarSign, Database } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { serverRequest } from '@/utils/backend/client';

const summaryData = [
    {
        title: 'Total Patients',
        value: '2,847',
        change: '+12%',
        trend: 'up',
        icon: Users,
        color: 'text-blue-600'
    },
    {
        title: 'Active Doctors',
        value: '124',
        change: '+3%',
        trend: 'up',
        icon: UserCheck,
        color: 'text-green-600'
    },
    {
        title: 'Available Beds',
        value: '89',
        change: '-5%',
        trend: 'down',
        icon: Bed,
        color: 'text-orange-600'
    },
    {
        title: "Today's Appointments",
        value: '156',
        change: '+8%',
        trend: 'up',
        icon: Calendar,
        color: 'text-purple-600'
    },
    {
        title: 'Pending Payments',
        value: '$45,230',
        change: '-2%',
        trend: 'down',
        icon: DollarSign,
        color: 'text-red-600'
    }
];

const genderData = [
    { name: 'Male', value: 1420, color: '#3b82f6' },
    { name: 'Female', value: 1427, color: '#ec4899' }
];

const departmentData = [
    { department: 'Cardiology', appointments: 45 },
    { department: 'Neurology', appointments: 32 },
    { department: 'Orthopedics', appointments: 28 },
    { department: 'Pediatrics', appointments: 51 },
    { department: 'Emergency', appointments: 67 },
    { department: 'Surgery', appointments: 23 }
];

const registrationData = [
    { month: 'Jan', patients: 180 },
    { month: 'Feb', patients: 205 },
    { month: 'Mar', patients: 190 },
    { month: 'Apr', patients: 240 },
    { month: 'May', patients: 260 },
    { month: 'Jun', patients: 285 }
];

export function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await serverRequest('/dashboard-stats');
            setStats(response.stats);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // Set default stats if server request fails
            setStats({
                totalPatients: 0,
                activeDoctors: 0,
                todayAppointments: 0,
                totalRecords: 0,
                availableBeds: 89,
                pendingPayments: 45230,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSeedDatabase = async () => {
        setSeeding(true);
        try {
            await seedDatabase();
            await fetchDashboardStats(); // Refresh stats after seeding
        } catch (error) {
            console.error('Error seeding database:', error);
        } finally {
            setSeeding(false);
        }
    };

    const summaryData = stats ? [
        {
            title: 'Total Patients',
            value: stats.totalPatients.toString(),
            change: '+12%',
            trend: 'up',
            icon: Users,
            color: 'text-blue-600'
        },
        {
            title: 'Active Doctors',
            value: stats.activeDoctors.toString(),
            change: '+3%',
            trend: 'up',
            icon: UserCheck,
            color: 'text-green-600'
        },
        {
            title: 'Available Beds',
            value: stats.availableBeds.toString(),
            change: '-5%',
            trend: 'down',
            icon: Bed,
            color: 'text-orange-600'
        },
        {
            title: "Today's Appointments",
            value: stats.todayAppointments.toString(),
            change: '+8%',
            trend: 'up',
            icon: Calendar,
            color: 'text-purple-600'
        },
        {
            title: 'Pending Payments',
            value: `${stats.pendingPayments.toLocaleString()}`,
            change: '-2%',
            trend: 'down',
            icon: DollarSign,
            color: 'text-red-600'
        }
    ] : [];

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1>Dashboard</h1>
                    <p className="text-muted-foreground">
                        Loading hospital overview and key metrics...
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2"></div>
                                <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1>Dashboard</h1>
                    <p className="text-muted-foreground">
                        Hospital overview and key metrics
                    </p>
                </div>
                <Button
                    onClick={handleSeedDatabase}
                    disabled={seeding}
                    variant="outline"
                >
                    <Database className="mr-2 h-4 w-4" />
                    {seeding ? 'Seeding...' : 'Seed Sample Data'}
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {summaryData.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Card key={item.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {item.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${item.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{item.value}</div>
                                <Badge
                                    variant={item.trend === 'up' ? 'default' : 'destructive'}
                                    className="text-xs mt-1"
                                >
                                    {item.change} from last month
                                </Badge>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patients by Gender */}
                <Card>
                    <CardHeader>
                        <CardTitle>Patients by Gender</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={60}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Appointments by Department */}
                <Card>
                    <CardHeader>
                        <CardTitle>Appointments by Department</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={departmentData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="appointments" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Patient Registrations */}
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Registrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={registrationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="patients" stroke="#10b981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { patient: 'John Smith', doctor: 'Dr. Wilson', time: '10:00 AM', status: 'confirmed' },
                                { patient: 'Sarah Johnson', doctor: 'Dr. Davis', time: '11:30 AM', status: 'pending' },
                                { patient: 'Mike Brown', doctor: 'Dr. Miller', time: '2:00 PM', status: 'completed' },
                                { patient: 'Lisa Williams', doctor: 'Dr. Garcia', time: '3:30 PM', status: 'confirmed' }
                            ].map((appointment, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{appointment.patient}</p>
                                        <p className="text-sm text-muted-foreground">{appointment.doctor} • {appointment.time}</p>
                                    </div>
                                    <Badge
                                        variant={
                                            appointment.status === 'completed' ? 'default' :
                                                appointment.status === 'confirmed' ? 'secondary' : 'outline'
                                        }
                                    >
                                        {appointment.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Critical Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { message: 'ICU Bed #12 requires immediate attention', priority: 'high', time: '5 min ago' },
                                { message: 'Medicine inventory running low: Amoxicillin', priority: 'medium', time: '15 min ago' },
                                { message: 'Equipment maintenance due: MRI Scanner #2', priority: 'medium', time: '1 hour ago' },
                                { message: 'New patient admission in Emergency', priority: 'low', time: '2 hours ago' }
                            ].map((alert, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${alert.priority === 'high' ? 'bg-red-500' :
                                            alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`} />
                                    <div className="flex-1">
                                        <p className="text-sm">{alert.message}</p>
                                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}