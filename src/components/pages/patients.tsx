import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Label } from '../ui/label';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { IPatient } from '@/interfaces/patient';

export function Patients() {
    const [patients, setPatients] = useState<IPatient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [genderFilter, setGenderFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newPatient, setNewPatient] = useState({
        name: '',
        personalId: '',
        phone: '',
        email: '',
        gender: '',
        birthDate: '',
        address: '',
        password: '',
        joinDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {

    };

    const handleAddPatient = async () => {

    };

    const handleDeletePatient = async (patientId: string) => {

    };

    const filteredPatients = patients.filter(patient => {
        if (!patient || typeof patient !== 'object') return false;

        const name = patient.full_name || '';
        const personalId = patient.personal_id || '';
        const email = patient.email || '';
        const status = patient.status || '';
        const gender = patient.gender || '';

        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            personalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || status === statusFilter;
        const matchesGender = genderFilter === 'All' || gender === genderFilter;

        return matchesSearch && matchesStatus && matchesGender;
    });

    const totalPages = Math.ceil(filteredPatients.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const paginatedPatients = filteredPatients.slice(startIndex, startIndex + recordsPerPage);

    const getStatusBadge = (status: string) => {
        return (
            <Badge variant={status === 'Active' ? 'default' : 'secondary'}>
                {status}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1>Patient Management</h1>
                    <p className="text-muted-foreground">
                        Manage patient information and records
                    </p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Patient
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Patient</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Enter full name"
                                    value={newPatient.name}
                                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="personalId">Personal ID</Label>
                                <Input
                                    id="personalId"
                                    placeholder="Enter ID number"
                                    value={newPatient.personalId}
                                    onChange={(e) => setNewPatient({ ...newPatient, personalId: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="Enter phone number"
                                    value={newPatient.phone}
                                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    value={newPatient.email}
                                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="birthDate">Birth Date</Label>
                                <Input
                                    id="birthDate"
                                    type="date"
                                    value={newPatient.birthDate}
                                    onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={newPatient.gender} onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    placeholder="Enter full address"
                                    value={newPatient.address}
                                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Initial Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={newPatient.password}
                                    onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="joinDate">Join Date</Label>
                                <Input
                                    id="joinDate"
                                    type="date"
                                    value={newPatient.joinDate}
                                    onChange={(e) => setNewPatient({ ...newPatient, joinDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddPatient}>
                                Add Patient
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                        <CardTitle>All Patients</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search patients..."
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
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={genderFilter} onValueChange={setGenderFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Gender</SelectItem>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
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
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Personal ID</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Birth Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse"></div></TableCell>
                                            <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse"></div></TableCell>
                                            <TableCell><div className="h-4 w-28 bg-muted rounded animate-pulse"></div></TableCell>
                                            <TableCell><div className="h-4 w-32 bg-muted rounded animate-pulse"></div></TableCell>
                                            <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse"></div></TableCell>
                                            <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse"></div></TableCell>
                                            <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse"></div></TableCell>
                                            <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse"></div></TableCell>
                                        </TableRow>
                                    ))
                                ) : paginatedPatients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            No patients found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedPatients.map((patient) => (
                                        <TableRow key={patient.id}>
                                            <TableCell>{patient.full_name}</TableCell>
                                            <TableCell>{patient.personal_id}</TableCell>
                                            <TableCell>{patient.phone}</TableCell>
                                            <TableCell>{patient.email}</TableCell>
                                            <TableCell>{patient.gender}</TableCell>
                                            <TableCell>
                                                {patient.birth_date ? patient.birth_date.toLocaleDateString() : ''}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(patient.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-1">
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeletePatient(patient.id.replace('patient:', ''))}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                                Showing {startIndex + 1} to {Math.min(startIndex + recordsPerPage, filteredPatients.length)} of {filteredPatients.length} results
                            </span>
                            <Select value={recordsPerPage.toString()} onValueChange={(value) => setRecordsPerPage(Number(value))}>
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">per page</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <span className="text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}