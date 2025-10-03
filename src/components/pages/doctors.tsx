import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Award } from 'lucide-react';
import { serverRequest, supabase } from '@/utils/backend/client';

const doctorsData = [
    {
        id: 1,
        name: 'Dr. Emily Wilson',
        specialty: 'Cardiology',
        phone: '+1 (555) 111-2222',
        email: 'emily.wilson@hospital.com',
        certificates: ['Board Certified Cardiologist', 'ACLS Certification'],
        status: 'Active',
        avatar: '/api/placeholder/40/40'
    },
    {
        id: 2,
        name: 'Dr. Michael Davis',
        specialty: 'Neurology',
        phone: '+1 (555) 222-3333',
        email: 'michael.davis@hospital.com',
        certificates: ['Board Certified Neurologist', 'Epilepsy Specialist'],
        status: 'Active',
        avatar: '/api/placeholder/40/40'
    },
    {
        id: 3,
        name: 'Dr. Sarah Miller',
        specialty: 'Pediatrics',
        phone: '+1 (555) 333-4444',
        email: 'sarah.miller@hospital.com',
        certificates: ['Board Certified Pediatrician', 'Neonatal Care'],
        status: 'On Leave',
        avatar: '/api/placeholder/40/40'
    },
    {
        id: 4,
        name: 'Dr. James Garcia',
        specialty: 'Orthopedics',
        phone: '+1 (555) 444-5555',
        email: 'james.garcia@hospital.com',
        certificates: ['Orthopedic Surgery', 'Sports Medicine'],
        status: 'Active',
        avatar: '/api/placeholder/40/40'
    },
    {
        id: 5,
        name: 'Dr. Lisa Rodriguez',
        specialty: 'Emergency Medicine',
        phone: '+1 (555) 555-6666',
        email: 'lisa.rodriguez@hospital.com',
        certificates: ['Emergency Medicine', 'Trauma Certification'],
        status: 'Inactive',
        avatar: '/api/placeholder/40/40'
    }
];

const certificatesData = [
    {
        id: 1,
        doctorId: 1,
        name: 'Board Certified Cardiologist',
        issuedBy: 'American Board of Internal Medicine',
        issueDate: '2018-06-15',
        expiryDate: '2028-06-15'
    },
    {
        id: 2,
        doctorId: 1,
        name: 'ACLS Certification',
        issuedBy: 'American Heart Association',
        issueDate: '2023-01-10',
        expiryDate: '2025-01-10'
    },
    {
        id: 3,
        doctorId: 2,
        name: 'Board Certified Neurologist',
        issuedBy: 'American Board of Psychiatry and Neurology',
        issueDate: '2019-08-20',
        expiryDate: '2029-08-20'
    }
];

export function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
    const [newDoctor, setNewDoctor] = useState({
        name: '',
        specialty: '',
        phone: '',
        email: '',
        license: '',
        experience: '',
        certificates: '',
        status: 'Active'
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    // const fetchDoctors = async () => {
    //     try {
    //         const response = await serverRequest('/doctors');
    //         console.log('Fetched doctors:', response);
    //         setDoctors(response.doctors || []);
    //     } catch (error) {
    //         console.error('Error fetching doctors:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const fetchDoctors = async () => {
        try {
            const { data, error } = await supabase
                .from('doctor')
                .select(`  *,specialty ( * )`);
            if (error) console.error(error);
            else console.log(data);
            setDoctors(data || []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleAddDoctor = async () => {
        try {
            const response = await serverRequest('/doctors', {
                method: 'POST',
                body: JSON.stringify({
                    ...newDoctor,
                    certificates: newDoctor.certificates.split(',').map(cert => cert.trim())
                })
            });

            setDoctors([...doctors, response.doctor]);
            setIsAddDialogOpen(false);
            setNewDoctor({
                name: '',
                specialty: '',
                phone: '',
                email: '',
                license: '',
                experience: '',
                certificates: '',
                status: 'Active'
            });
        } catch (error) {
            console.error('Error adding doctor:', error);
        }
    };

    const filteredDoctors = doctors.filter(doctor => {
        if (!doctor || typeof doctor !== 'object') return false;

        const name = doctor.name || '';
        const specialty = doctor.specialty || '';
        const email = doctor.email || '';
        const status = doctor.status || '';

        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = specialtyFilter === 'All' || specialty === specialtyFilter;
        const matchesStatus = statusFilter === 'All' || status === statusFilter;

        return matchesSearch && matchesSpecialty && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const variant = status === 'Active' ? 'default' :
            status === 'On Leave' ? 'secondary' : 'destructive';
        return <Badge variant={variant}>{status}</Badge>;
    };

    const specialties = [...new Set(doctorsData.map(doctor => doctor.specialty))];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1>Doctor Management</h1>
                    <p className="text-muted-foreground">
                        Manage doctor profiles and certifications
                    </p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Doctor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Doctor</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="doctorName">Full Name</Label>
                                <Input id="doctorName" placeholder="Dr. John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="specialty">Specialty</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select specialty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cardiology">Cardiology</SelectItem>
                                        <SelectItem value="neurology">Neurology</SelectItem>
                                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                                        <SelectItem value="emergency">Emergency Medicine</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="doctorPhone">Phone Number</Label>
                                <Input id="doctorPhone" placeholder="Enter phone number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="doctorEmail">Email</Label>
                                <Input id="doctorEmail" type="email" placeholder="Enter email address" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="license">License Number</Label>
                                <Input id="license" placeholder="Enter license number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience">Years of Experience</Label>
                                <Input id="experience" type="number" placeholder="Enter experience years" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="certifications">Certifications (comma separated)</Label>
                                <Input id="certifications" placeholder="Board Certification, ACLS, etc." />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => setIsAddDialogOpen(false)}>
                                Add Doctor
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="doctors" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="doctors">Doctors</TabsTrigger>
                    <TabsTrigger value="certificates">Certificates</TabsTrigger>
                </TabsList>

                <TabsContent value="doctors">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                                <CardTitle>All Doctors</CardTitle>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search doctors..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-8 w-64"
                                        />
                                    </div>
                                    <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                                        <SelectTrigger className="w-40">
                                            <Filter className="mr-2 h-4 w-4" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Specialties</SelectItem>
                                            {specialties.map(specialty => (
                                                <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Status</SelectItem>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="On Leave">On Leave</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline">
                                        <Download className="mr-2 h-4 w-4" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Doctor</TableHead>
                                            <TableHead>Specialty</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Certificates</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredDoctors.map((doctor) => (
                                            <TableRow key={doctor.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar>
                                                            <AvatarImage src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png" />
                                                            <AvatarFallback>{doctor.name}</AvatarFallback>
                                                        </Avatar>
                                                        <span>{doctor.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{doctor.specialty?.name} - {doctor.specialty?.description}</TableCell>
                                                <TableCell>{doctor.phone}</TableCell>
                                                <TableCell>{doctor.email}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {/* {doctor.certificates.slice(0, 2).map((cert, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {cert}
                                                            </Badge>
                                                        ))}
                                                        {doctor.certificates.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{doctor.certificates.length - 2} more
                                                            </Badge>
                                                        )} */}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(doctor.status)}</TableCell>
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
                </TabsContent>

                <TabsContent value="certificates">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Award className="mr-2 h-5 w-5" />
                                Doctor Certificates
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Doctor</TableHead>
                                            <TableHead>Certificate Name</TableHead>
                                            <TableHead>Issued By</TableHead>
                                            <TableHead>Issue Date</TableHead>
                                            <TableHead>Expiry Date</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {certificatesData.map((cert) => {
                                            const doctor = doctorsData.find(d => d.id === cert.doctorId);
                                            const isExpiringSoon = new Date(cert.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                                            const isExpired = new Date(cert.expiryDate) < new Date();

                                            return (
                                                <TableRow key={cert.id}>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={doctor?.avatar} />
                                                                <AvatarFallback>{doctor?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                            </Avatar>
                                                            <span>{doctor?.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{cert.name}</TableCell>
                                                    <TableCell>{cert.issuedBy}</TableCell>
                                                    <TableCell>{cert.issueDate}</TableCell>
                                                    <TableCell>{cert.expiryDate}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={
                                                            isExpired ? 'destructive' :
                                                                isExpiringSoon ? 'secondary' : 'default'
                                                        }>
                                                            {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Valid'}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
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