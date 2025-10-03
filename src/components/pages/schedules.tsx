import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Plus, Calendar, Clock, Users, Check, X, AlertCircle } from 'lucide-react';

const schedulesData = [
    {
        id: 1,
        doctor: 'Dr. Emily Wilson',
        room: 'Room 301',
        shift: 'Morning',
        date: '2024-03-15',
        startTime: '08:00',
        endTime: '14:00',
        status: 'Scheduled',
        department: 'Cardiology'
    },
    {
        id: 2,
        doctor: 'Dr. Michael Davis',
        room: 'Room 205',
        shift: 'Afternoon',
        date: '2024-03-15',
        startTime: '14:00',
        endTime: '20:00',
        status: 'Scheduled',
        department: 'Neurology'
    },
    {
        id: 3,
        doctor: 'Dr. Sarah Miller',
        room: 'Room 102',
        shift: 'Morning',
        date: '2024-03-16',
        startTime: '08:00',
        endTime: '14:00',
        status: 'Completed',
        department: 'Pediatrics'
    },
    {
        id: 4,
        doctor: 'Dr. James Garcia',
        room: 'OR-01',
        shift: 'Morning',
        date: '2024-03-16',
        startTime: '09:00',
        endTime: '15:00',
        status: 'In Progress',
        department: 'Orthopedics'
    },
    {
        id: 5,
        doctor: 'Dr. Lisa Rodriguez',
        room: 'ER-01',
        shift: 'Night',
        date: '2024-03-15',
        startTime: '20:00',
        endTime: '08:00',
        status: 'Scheduled',
        department: 'Emergency'
    }
];

const leaveRequestsData = [
    {
        id: 1,
        doctor: 'Dr. Emily Wilson',
        requestDate: '2024-03-01',
        startDate: '2024-03-20',
        endDate: '2024-03-22',
        reason: 'Personal leave',
        status: 'Pending',
        days: 3
    },
    {
        id: 2,
        doctor: 'Dr. Michael Davis',
        requestDate: '2024-02-28',
        startDate: '2024-03-25',
        endDate: '2024-03-29',
        reason: 'Medical conference',
        status: 'Approved',
        days: 5
    },
    {
        id: 3,
        doctor: 'Dr. Sarah Miller',
        requestDate: '2024-03-05',
        startDate: '2024-03-18',
        endDate: '2024-03-18',
        reason: 'Sick leave',
        status: 'Approved',
        days: 1
    },
    {
        id: 4,
        doctor: 'Dr. James Garcia',
        requestDate: '2024-03-08',
        startDate: '2024-04-01',
        endDate: '2024-04-07',
        reason: 'Vacation',
        status: 'Rejected',
        days: 7
    }
];

const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const rooms = [
    'Room 101', 'Room 102', 'Room 205', 'Room 301', 'OR-01', 'OR-02', 'ER-01', 'ICU-01'
];

const doctors = [
    'Dr. Emily Wilson', 'Dr. Michael Davis', 'Dr. Sarah Miller',
    'Dr. James Garcia', 'Dr. Lisa Rodriguez'
];

export function Schedules() {
    const [isAssignShiftDialogOpen, setIsAssignShiftDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('2024-03-15');

    const getStatusBadge = (status: string) => {
        const variant = status === 'Scheduled' ? 'default' :
            status === 'In Progress' ? 'secondary' :
                status === 'Completed' ? 'outline' : 'destructive';
        return <Badge variant={variant}>{status}</Badge>;
    };

    const getLeaveStatusBadge = (status: string) => {
        const variant = status === 'Approved' ? 'default' :
            status === 'Pending' ? 'secondary' : 'destructive';
        return <Badge variant={variant}>{status}</Badge>;
    };

    const getShiftColor = (shift: string) => {
        switch (shift) {
            case 'Morning': return 'text-blue-600';
            case 'Afternoon': return 'text-orange-600';
            case 'Night': return 'text-purple-600';
            default: return 'text-gray-600';
        }
    };

    const filteredSchedules = schedulesData.filter(schedule => schedule.date === selectedDate);

    const approveLeave = (id: number) => {
        // Handle approve leave logic
        console.log('Approving leave request:', id);
    };

    const rejectLeave = (id: number) => {
        // Handle reject leave logic
        console.log('Rejecting leave request:', id);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1>Work Schedules</h1>
                    <p className="text-muted-foreground">
                        Manage doctor schedules and leave requests
                    </p>
                </div>
            </div>

            <Tabs defaultValue="schedules" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="schedules" className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedules
                    </TabsTrigger>
                    <TabsTrigger value="leave-requests" className="flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Leave Requests
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="schedules">
                    <div className="space-y-4">
                        {/* Schedule Controls */}
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                                    <CardTitle>Schedule Overview</CardTitle>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-40"
                                        />
                                        <Dialog open={isAssignShiftDialogOpen} onOpenChange={setIsAssignShiftDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Assign Shift
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Assign New Shift</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid grid-cols-2 gap-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="shiftDoctor">Doctor</Label>
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
                                                        <Label htmlFor="shiftRoom">Room</Label>
                                                        <Select>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select room" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {rooms.map(room => (
                                                                    <SelectItem key={room} value={room.toLowerCase().replace(' ', '-')}>
                                                                        {room}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="shiftDate">Date</Label>
                                                        <Input id="shiftDate" type="date" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="shift">Shift</Label>
                                                        <Select>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select shift" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="morning">Morning (8:00 - 14:00)</SelectItem>
                                                                <SelectItem value="afternoon">Afternoon (14:00 - 20:00)</SelectItem>
                                                                <SelectItem value="night">Night (20:00 - 8:00)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="startTime">Start Time</Label>
                                                        <Select>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select start time" />
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
                                                        <Label htmlFor="endTime">End Time</Label>
                                                        <Select>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select end time" />
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
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <Button variant="outline" onClick={() => setIsAssignShiftDialogOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={() => setIsAssignShiftDialogOpen(false)}>
                                                        Assign Shift
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Schedule Grid */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Schedule for {new Date(selectedDate).toLocaleDateString()}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Doctor</TableHead>
                                                <TableHead>Room</TableHead>
                                                <TableHead>Shift</TableHead>
                                                <TableHead>Time</TableHead>
                                                <TableHead>Department</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredSchedules.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                        No schedules for this date
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredSchedules.map((schedule) => (
                                                    <TableRow key={schedule.id}>
                                                        <TableCell>
                                                            <div className="flex items-center space-x-2">
                                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                                <span>{schedule.doctor}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{schedule.room}</TableCell>
                                                        <TableCell>
                                                            <span className={getShiftColor(schedule.shift)}>
                                                                {schedule.shift}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center">
                                                                <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                                                                {schedule.startTime} - {schedule.endTime}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{schedule.department}</TableCell>
                                                        <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                                                        <TableCell>
                                                            <div className="flex space-x-1">
                                                                <Button variant="ghost" size="sm">
                                                                    Edit
                                                                </Button>
                                                                <Button variant="ghost" size="sm">
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Weekly Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Weekly Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-7 gap-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                        <div key={day} className="text-center">
                                            <div className="font-medium text-sm mb-2">{day}</div>
                                            <div className="space-y-1">
                                                {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, i) => (
                                                    <div key={i} className="bg-blue-100 dark:bg-blue-900 p-1 rounded text-xs">
                                                        Dr. {i + 1}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="leave-requests">
                    <Card>
                        <CardHeader>
                            <CardTitle>Leave Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Doctor</TableHead>
                                            <TableHead>Request Date</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Days</TableHead>
                                            <TableHead>Reason</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leaveRequestsData.map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>{request.doctor}</TableCell>
                                                <TableCell>{request.requestDate}</TableCell>
                                                <TableCell>{request.startDate}</TableCell>
                                                <TableCell>{request.endDate}</TableCell>
                                                <TableCell>{request.days} day{request.days !== 1 ? 's' : ''}</TableCell>
                                                <TableCell className="max-w-40 truncate">{request.reason}</TableCell>
                                                <TableCell>{getLeaveStatusBadge(request.status)}</TableCell>
                                                <TableCell>
                                                    {request.status === 'Pending' ? (
                                                        <div className="flex space-x-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-green-600"
                                                                onClick={() => approveLeave(request.id)}
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-600"
                                                                onClick={() => rejectLeave(request.id)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">
                                                            {request.status}
                                                        </span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}