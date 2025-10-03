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
import { Textarea } from '../ui/textarea';
import { Plus, Edit, Trash2, Building2, Bed, AlertTriangle } from 'lucide-react';

const departmentsData = [
    {
        id: 1,
        name: 'Cardiology',
        description: 'Specialized care for heart and cardiovascular conditions',
        location: 'Building A, Floor 3',
        head: 'Dr. Emily Wilson',
        staff: 12,
        rooms: 8
    },
    {
        id: 2,
        name: 'Neurology',
        description: 'Treatment of nervous system disorders',
        location: 'Building B, Floor 2',
        head: 'Dr. Michael Davis',
        staff: 8,
        rooms: 6
    },
    {
        id: 3,
        name: 'Pediatrics',
        description: 'Medical care for infants, children, and adolescents',
        location: 'Building C, Floor 1',
        head: 'Dr. Sarah Miller',
        staff: 15,
        rooms: 10
    },
    {
        id: 4,
        name: 'Emergency',
        description: 'Emergency medical care and trauma treatment',
        location: 'Building A, Ground Floor',
        head: 'Dr. Lisa Rodriguez',
        staff: 20,
        rooms: 12
    }
];

const roomsData = [
    {
        id: 1,
        name: 'Room 101',
        type: 'Normal',
        floor: '1st Floor',
        department: 'Cardiology',
        capacity: 2,
        occupied: 1
    },
    {
        id: 2,
        name: 'ICU-01',
        type: 'ICU',
        floor: '2nd Floor',
        department: 'Emergency',
        capacity: 1,
        occupied: 1
    },
    {
        id: 3,
        name: 'OR-01',
        type: 'Operating',
        floor: '3rd Floor',
        department: 'Surgery',
        capacity: 1,
        occupied: 0
    },
    {
        id: 4,
        name: 'ER-01',
        type: 'Emergency',
        floor: 'Ground Floor',
        department: 'Emergency',
        capacity: 4,
        occupied: 2
    },
    {
        id: 5,
        name: 'Room 205',
        type: 'Normal',
        floor: '2nd Floor',
        department: 'Pediatrics',
        capacity: 2,
        occupied: 0
    }
];

const bedsData = [
    {
        id: 1,
        bedNumber: 'B001',
        roomName: 'Room 101',
        status: 'Occupied',
        patient: 'John Smith',
        department: 'Cardiology'
    },
    {
        id: 2,
        bedNumber: 'B002',
        roomName: 'Room 101',
        status: 'Available',
        patient: null,
        department: 'Cardiology'
    },
    {
        id: 3,
        bedNumber: 'ICU001',
        roomName: 'ICU-01',
        status: 'Occupied',
        patient: 'Sarah Johnson',
        department: 'Emergency'
    },
    {
        id: 4,
        bedNumber: 'B003',
        roomName: 'Room 205',
        status: 'Maintenance',
        patient: null,
        department: 'Pediatrics'
    },
    {
        id: 5,
        bedNumber: 'ER001',
        roomName: 'ER-01',
        status: 'Available',
        patient: null,
        department: 'Emergency'
    }
];

export function Departments() {
    const [isAddDeptDialogOpen, setIsAddDeptDialogOpen] = useState(false);
    const [isAddRoomDialogOpen, setIsAddRoomDialogOpen] = useState(false);

    const getRoomTypeColor = (type: string) => {
        switch (type) {
            case 'ICU': return 'destructive';
            case 'Emergency': return 'secondary';
            case 'Operating': return 'default';
            default: return 'outline';
        }
    };

    const getBedStatusColor = (status: string) => {
        switch (status) {
            case 'Occupied': return 'destructive';
            case 'Available': return 'default';
            case 'Maintenance': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1>Departments & Rooms</h1>
                    <p className="text-muted-foreground">
                        Manage hospital departments, rooms, and bed allocation
                    </p>
                </div>
            </div>

            <Tabs defaultValue="departments" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="departments">Departments</TabsTrigger>
                    <TabsTrigger value="rooms">Rooms</TabsTrigger>
                    <TabsTrigger value="beds">Beds</TabsTrigger>
                </TabsList>

                <TabsContent value="departments">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center">
                                    <Building2 className="mr-2 h-5 w-5" />
                                    Departments
                                </CardTitle>
                                <Dialog open={isAddDeptDialogOpen} onOpenChange={setIsAddDeptDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Department
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Department</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="deptName">Department Name</Label>
                                                <Input id="deptName" placeholder="Enter department name" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="deptDescription">Description</Label>
                                                <Textarea id="deptDescription" placeholder="Enter department description" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="deptLocation">Location</Label>
                                                <Input id="deptLocation" placeholder="Building, Floor" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="deptHead">Department Head</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select department head" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="dr-wilson">Dr. Emily Wilson</SelectItem>
                                                        <SelectItem value="dr-davis">Dr. Michael Davis</SelectItem>
                                                        <SelectItem value="dr-miller">Dr. Sarah Miller</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline" onClick={() => setIsAddDeptDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={() => setIsAddDeptDialogOpen(false)}>
                                                Add Department
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {departmentsData.map((dept) => (
                                    <Card key={dept.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                                                    <p className="text-sm text-muted-foreground">{dept.location}</p>
                                                </div>
                                                <div className="flex space-x-1">
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm mb-4">{dept.description}</p>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Department Head:</span>
                                                    <span className="text-sm">{dept.head}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Staff:</span>
                                                    <span className="text-sm">{dept.staff} members</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Rooms:</span>
                                                    <span className="text-sm">{dept.rooms} rooms</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rooms">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Rooms</CardTitle>
                                <Dialog open={isAddRoomDialogOpen} onOpenChange={setIsAddRoomDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Room
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Room</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="roomName">Room Name</Label>
                                                <Input id="roomName" placeholder="e.g., Room 101, ICU-01" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="roomType">Room Type</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select room type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="normal">Normal</SelectItem>
                                                        <SelectItem value="icu">ICU</SelectItem>
                                                        <SelectItem value="emergency">Emergency</SelectItem>
                                                        <SelectItem value="operating">Operating</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="roomFloor">Floor</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select floor" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ground">Ground Floor</SelectItem>
                                                        <SelectItem value="1st">1st Floor</SelectItem>
                                                        <SelectItem value="2nd">2nd Floor</SelectItem>
                                                        <SelectItem value="3rd">3rd Floor</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="roomDept">Department</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select department" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {departmentsData.map(dept => (
                                                            <SelectItem key={dept.id} value={dept.name.toLowerCase()}>
                                                                {dept.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="roomCapacity">Capacity</Label>
                                                <Input id="roomCapacity" type="number" placeholder="Number of beds" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline" onClick={() => setIsAddRoomDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={() => setIsAddRoomDialogOpen(false)}>
                                                Add Room
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Room Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Floor</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Capacity</TableHead>
                                            <TableHead>Occupied</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {roomsData.map((room) => (
                                            <TableRow key={room.id}>
                                                <TableCell>{room.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getRoomTypeColor(room.type)}>
                                                        {room.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{room.floor}</TableCell>
                                                <TableCell>{room.department}</TableCell>
                                                <TableCell>{room.capacity}</TableCell>
                                                <TableCell>
                                                    <span className={room.occupied === room.capacity ? 'text-red-600' : 'text-green-600'}>
                                                        {room.occupied}/{room.capacity}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-1">
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
                </TabsContent>

                <TabsContent value="beds">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Bed className="mr-2 h-5 w-5" />
                                Bed Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-sm">Available: {bedsData.filter(b => b.status === 'Available').length}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <span className="text-sm">Occupied: {bedsData.filter(b => b.status === 'Occupied').length}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <span className="text-sm">Maintenance: {bedsData.filter(b => b.status === 'Maintenance').length}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bed Number</TableHead>
                                            <TableHead>Room</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Patient</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bedsData.map((bed) => (
                                            <TableRow key={bed.id}>
                                                <TableCell className="font-medium">{bed.bedNumber}</TableCell>
                                                <TableCell>{bed.roomName}</TableCell>
                                                <TableCell>{bed.department}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant={getBedStatusColor(bed.status)}>
                                                            {bed.status}
                                                        </Badge>
                                                        {bed.status === 'Maintenance' && (
                                                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{bed.patient || '-'}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-1">
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        {bed.status === 'Maintenance' && (
                                                            <Button variant="ghost" size="sm" className="text-green-600">
                                                                Fix
                                                            </Button>
                                                        )}
                                                    </div>
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