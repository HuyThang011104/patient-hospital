/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Calendar, Clock, User, MapPin, Eye, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { IAppointment } from '@/interfaces/appointment';
import { supabase } from '@/utils/backend/client';
import { useAuth } from '@/hooks/use-auth';
import type { MedicalRecord } from '@/interfaces';

export function MyAppointments() {
    const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState<any>(null);
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const { data, error } = await supabase
                    .from('appointment')
                    .select(`
        *,
        doctor(
          *,
          specialty(*)
        ),
        shift(*)
      `)
                    .eq('patient_id', user?.id);

                if (error) throw error;
                console.log("appointment", data);
                setAppointments(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };
        fetchAppointments()
    }, [user?.id])

    useEffect(() => {
        if (!showDetails) return;
        const fetchMedicalRecords = async () => {
            try {
                const { data, error } = await supabase.from("medical_record")
                    .select(`*,
                    doctor(*),
                    patient(*),
                    appointment:appointment_id ( id, patient(*) )
                `)
                    .eq("patient_id", user?.id);
                console.log("medical records", data);
                if (error) throw error;
                setMedicalRecords(data);
            } catch (error) {
                console.error('Error fetching medical records:', error);
            }
        };
        fetchMedicalRecords()
    }, [showDetails, user?.id])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const isAppointmentPast = (appointmentDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
        const appointment = new Date(appointmentDate);
        appointment.setHours(0, 0, 0, 0);
        return appointment < today;
    };

    const isAppointmentExpired = (appointmentDate: string, status: string) => {
        return status === 'Pending' && isAppointmentPast(appointmentDate);
    };

    const handleViewDetails = (appointment: any) => {
        setSelectedAppointment(appointment);
        setShowDetails(true);
    };

    const handleCancelAppointment = (appointment: any) => {
        setAppointmentToCancel(appointment);
        setShowCancelDialog(true);
    };

    const confirmCancelAppointment = async () => {
        try {
            if (!appointmentToCancel) return;

            const { error } = await supabase
                .from('appointment')
                .update({ status: 'Cancelled' })
                .eq('id', appointmentToCancel.id);

            if (error) {
                console.error('Error cancelling appointment:', error);
                toast.error('Failed to cancel appointment. Please try again.');
                return;
            }

            toast.success('Appointment cancelled successfully');
            setShowCancelDialog(false);
            setAppointmentToCancel(null);

            // Refresh appointments list
            const { data, error: fetchError } = await supabase
                .from('appointment')
                .select(`
                    *,
                    doctor(
                        *,
                        specialty(*)
                    ),
                    shift(*)
                `)
                .eq('patient_id', user?.id);

            if (fetchError) throw fetchError;
            setAppointments(data);
        } catch (error) {
            console.error('Error in cancel appointment:', error);
            toast.error('An unexpected error occurred. Please try again.');
        }
    };
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1>My Appointments</h1>
                <p className="text-muted-foreground">View and manage your medical appointments</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {appointments.filter(apt => apt.status === 'Pending').length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {appointments.filter(apt => apt.status === 'Completed').length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {appointments.filter(apt => apt.status === 'Cancelled').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Appointments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Appointments</CardTitle>
                    <CardDescription>Complete list of your medical appointments</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Shift</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="h-4 w-4 text-blue-600" />
                                            </div>
                                            {appointment?.doctor?.full_name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{appointment.doctor.specialty?.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {new Date(appointment.appointment_date).toLocaleDateString('vi-VN')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            {appointment.shift.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getStatusColor(appointment.status)}>
                                                {appointment.status}
                                            </Badge>
                                            {isAppointmentExpired(appointment.appointment_date.toString(), appointment.status) && (
                                                <div className="flex items-center gap-1 text-orange-600">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    <span className="text-xs">Expired</span>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewDetails(appointment)}
                                            >
                                                <Eye className="h-3 w-3 mr-1" />
                                                View
                                            </Button>
                                            {appointment.status === 'Pending' && !isAppointmentPast(appointment.appointment_date.toString()) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleCancelAppointment(appointment)}
                                                >
                                                    <X className="h-3 w-3 mr-1" />
                                                    Cancel
                                                </Button>
                                            )}
                                            {appointment.status === 'Pending' && isAppointmentPast(appointment.appointment_date.toString()) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled
                                                    className="text-gray-400 cursor-not-allowed"
                                                >
                                                    <X className="h-3 w-3 mr-1" />
                                                    Expired
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Appointment Details Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Appointment Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about your appointment
                        </DialogDescription>
                    </DialogHeader>

                    {selectedAppointment && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Appointment ID</Label>
                                        <p className="font-mono">#{selectedAppointment.id}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Doctor</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{selectedAppointment.doctor?.full_name}</p>
                                                <p className="text-sm text-muted-foreground">{selectedAppointment.doctor?.specialty?.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Department</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <p>{selectedAppointment.doctor?.specialty?.name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Date & Time</Label>
                                        <div className="space-y-1 mt-1">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <p>{new Date(selectedAppointment.appointment_date).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <p>{selectedAppointment.shift.name} Shift</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Status</Label>
                                        <div className="mt-1">
                                            <Badge className={getStatusColor(selectedAppointment.status)}>
                                                {selectedAppointment.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedAppointment.notes && (
                                <div>
                                    <Label className="text-sm text-muted-foreground">Notes</Label>
                                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedAppointment.notes}</p>
                                </div>
                            )}

                            {selectedAppointment.status === 'Completed' && (
                                <div>
                                    <Label className="text-sm text-muted-foreground">Medical Record</Label>
                                    {(medicalRecords) ? (
                                        <Card className="mt-2">
                                            <CardContent className="pt-4">
                                                {medicalRecords.map(record => (
                                                    <div key={record.id}>
                                                        <div>
                                                            <p className="font-medium">{record.diagnosis}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">
                                                                {record.treatment}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <p className="text-sm text-muted-foreground mt-1">No medical record available yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetails(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel Appointment Dialog */}
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel this appointment? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {appointmentToCancel && (
                        <div className="py-4">
                            <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                                <p><strong>Doctor:</strong> {appointmentToCancel.doctor?.full_name}</p>
                                <p><strong>Date:</strong> {new Date(appointmentToCancel.appointment_date).toLocaleDateString('vi-VN')}</p>
                                <p><strong>Time:</strong> {appointmentToCancel.shift?.name} Shift</p>
                            </div>
                        </div>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmCancelAppointment}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Cancel Appointment
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

