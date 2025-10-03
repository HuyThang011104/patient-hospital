import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Plus, Search, Filter, Calendar as CalendarIcon, Clock, Eye, Edit, Trash2 } from 'lucide-react';
// import { serverRequest } from '../utils/supabase/client';
import { Button } from '../ui/button';

const appointmentsData = [
    {
        id: 1,
        patient: 'John Smith',
        doctor: 'Dr. Emily Wilson',
        date: '2024-03-15',
        time: '10:00 AM',
        shift: 'Morning',
        status: 'Confirmed',
        notes: 'Regular checkup',
        department: 'Cardiology'
    },
    {
        id: 2,
        patient: 'Sarah Johnson',
        doctor: 'Dr. Michael Davis',
        date: '2024-03-15',
        time: '11:30 AM',
        shift: 'Morning',
        status: 'Pending',
        notes: 'Follow-up consultation',
        department: 'Neurology'
    },
    {
        id: 3,
        patient: 'Mike Brown',
        doctor: 'Dr. Sarah Miller',
        date: '2024-03-15',
        time: '2:00 PM',
        shift: 'Afternoon',
        status: 'Completed',
        notes: 'Vaccination',
        department: 'Pediatrics'
    },
    {
        id: 4,
        patient: 'Lisa Williams',
        doctor: 'Dr. James Garcia',
        date: '2024-03-16',
        time: '9:00 AM',
        shift: 'Morning',
        status: 'Confirmed',
        notes: 'Post-surgery follow-up',
        department: 'Orthopedics'
    },
    {
        id: 5,
        patient: 'David Garcia',
        doctor: 'Dr. Lisa Rodriguez',
        date: '2024-03-16',
        time: '3:30 PM',
        shift: 'Afternoon',
        status: 'Cancelled',
        notes: 'Emergency consultation',
        department: 'Emergency'
    }
];

const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
];

const doctors = [
    'Dr. Emily Wilson', 'Dr. Michael Davis', 'Dr. Sarah Miller',
    'Dr. James Garcia', 'Dr. Lisa Rodriguez'
];

const patients = [
    'John Smith', 'Sarah Johnson', 'Mike Brown',
    'Lisa Williams', 'David Garcia'
];

export function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [doctorFilter, setDoctorFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('All');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [viewMode, setViewMode] = useState<'calendar' | 'table'>('table');
    const [newAppointment, setNewAppointment] = useState({
        patient: '',
        doctor: '',
        date: '',
        time: '',
        shift: '',
        status: 'Pending',
        notes: ''
    });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await serverRequest('/appointments');
            setAppointments(response.appointments || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAppointment = async () => {
        try {
            const response = await serverRequest('/appointments', {
                method: 'POST',
                body: JSON.stringify(newAppointment)
            });

            setAppointments([...appointments, response.appointment]);
            setIsAddDialogOpen(false);
            setNewAppointment({
                patient: '',
                doctor: '',
                date: '',
                time: '',
                shift: '',
                status: 'Pending',
                notes: ''
            });
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        if (!appointment || typeof appointment !== 'object') return false;

        const patient = appointment.patient || '';
        const doctor = appointment.doctor || '';
        const notes = appointment.notes || '';
        const status = appointment.status || '';
        const date = appointment.date || '';

        const matchesSearch = patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notes.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || status === statusFilter;
        const matchesDoctor = doctorFilter === 'All' || doctor === doctorFilter;
        const matchesDate = dateFilter === 'All' || date === dateFilter;

        return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
    });

    const getStatusBadge = (status: string) => {
        const variant = status === 'Confirmed' ? 'default' :
            status === 'Pending' ? 'secondary' :
                status === 'Completed' ? 'outline' : 'destructive';
        return <Badge variant={variant}>{status}</Badge>;
    };

    const getShiftColor = (shift: string) => {
        return shift === 'Morning' ? 'text-blue-600' : shift === 'Afternoon' ? 'text-orange-600' : 'text-purple-600';
    };

    // Calendar view data
    const getAppointmentsForDate = (date: Date) => {
        const dateString = date.toISOString().split('T')[0];
        return appointments.filter(apt => apt && apt.date === dateString);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1>Appointments</h1>
                    <p className="text-muted-foreground">
                        Manage patient appointments and schedules
                    </p>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex rounded-lg border">
                        <Button
                            variant={viewMode === 'table' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('table')}
                            className="rounded-r-none"
                        >
                            Table
                        </Button>
                        <Button
                            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('calendar')}
                            className="rounded-l-none"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Calendar
                        </Button>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Appointment
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Schedule New Appointment</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="patient">Patient</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select patient" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patients.map(patient => (
                                                <SelectItem key={patient} value={patient.toLowerCase().replace(' ', '-')}>
                                                    {patient}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="doctor">Doctor</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select doctor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {doctors.map(doctor => (
                                                <SelectItem key={doctor} value={doctor.toLowerCase().replace(' ', '-')}>
                                                    {doctor}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeSlots.map(time => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shift">Shift</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select shift" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="morning">Morning</SelectItem>
                                            <SelectItem value="afternoon">Afternoon</SelectItem>
                                            <SelectItem value="evening">Evening</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Input id="notes" placeholder="Appointment notes or reason" />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setIsAddDialogOpen(false)}>
                                    Schedule Appointment
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {viewMode === 'table' ? (
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                            <CardTitle>All Appointments</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search appointments..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8 w-64"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-32">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Status</SelectItem>
                                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Doctors</SelectItem>
                                        {doctors.map(doctor => (
                                            <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="date"
                                    value={dateFilter === 'All' ? '' : dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value || 'All')}
                                    className="w-40"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Doctor</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Shift</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Notes</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAppointments.map((appointment) => (
                                        <TableRow key={appointment.id}>
                                            <TableCell>{appointment.patient}</TableCell>
                                            <TableCell>{appointment.doctor}</TableCell>
                                            <TableCell>{appointment.date}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                                                    {appointment.time}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={getShiftColor(appointment.shift)}>
                                                    {appointment.shift}
                                                </span>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                                            <TableCell className="max-w-40 truncate">{appointment.notes}</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-1">
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Calendar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md"
                            />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>
                                Appointments for {selectedDate?.toLocaleDateString()}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedDate && (
                                <div className="space-y-3">
                                    {getAppointmentsForDate(selectedDate).length === 0 ? (
                                        <p className="text-muted-foreground text-center py-8">
                                            No appointments scheduled for this date
                                        </p>
                                    ) : (
                                        getAppointmentsForDate(selectedDate).map((appointment) => (
                                            <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium">{appointment.patient}</span>
                                                        <span className="text-muted-foreground">•</span>
                                                        <span className="text-muted-foreground">{appointment.doctor}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">{appointment.time}</span>
                                                        <span className={`text-sm ${getShiftColor(appointment.shift)}`}>
                                                            {appointment.shift}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">{appointment.notes}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {getStatusBadge(appointment.status)}
                                                    <div className="flex space-x-1">
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}