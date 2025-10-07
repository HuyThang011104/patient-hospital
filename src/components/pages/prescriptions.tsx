import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Pill, Calendar, User, Search, Filter, FileText } from 'lucide-react';
import { mockPrescriptions } from '@/utils/mock/mock-data';

export function Prescriptions() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('all');
    const [filterMonth, setFilterMonth] = useState('all');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredPrescriptions = mockPrescriptions.filter(prescription => {
        const matchesSearch = prescription.medicine_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDoctor = filterDoctor === '' || filterDoctor === 'all' || prescription.doctor_name === filterDoctor;
        const matchesMonth = filterMonth === '' || filterMonth === 'all' ||
            new Date(prescription.date).getMonth() === parseInt(filterMonth);

        return matchesSearch && matchesDoctor && matchesMonth;
    });

    const groupedPrescriptions = filteredPrescriptions.reduce((groups, prescription) => {
        const date = prescription.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(prescription);
        return groups;
    }, {} as Record<string, typeof mockPrescriptions>);

    const uniqueDoctors = Array.from(new Set(mockPrescriptions.map(p => p.doctor_name)));

    const months = [
        { value: '0', label: 'January' },
        { value: '1', label: 'February' },
        { value: '2', label: 'March' },
        { value: '3', label: 'April' },
        { value: '4', label: 'May' },
        { value: '5', label: 'June' },
        { value: '6', label: 'July' },
        { value: '7', label: 'August' },
        { value: '8', label: 'September' },
        { value: '9', label: 'October' },
        { value: '10', label: 'November' },
        { value: '11', label: 'December' },
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1>Prescriptions</h1>
                <p className="text-muted-foreground">View and manage your prescribed medications</p>
            </div>

            {/* Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5" />
                        Prescription Summary
                    </CardTitle>
                    <CardDescription>Overview of your prescribed medications</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{mockPrescriptions.length}</div>
                            <p className="text-sm text-muted-foreground">Total Prescriptions</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{uniqueDoctors.length}</div>
                            <p className="text-sm text-muted-foreground">Prescribing Doctors</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {Array.from(new Set(mockPrescriptions.map(p => p.medicine_name))).length}
                            </div>
                            <p className="text-sm text-muted-foreground">Unique Medicines</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filter Prescriptions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Search Medicine</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by medicine name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Filter by Doctor</label>
                            <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All doctors" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All doctors</SelectItem>
                                    {uniqueDoctors.map((doctor) => (
                                        <SelectItem key={doctor} value={doctor}>
                                            {doctor}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Filter by Month</label>
                            <Select value={filterMonth} onValueChange={setFilterMonth}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All months" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All months</SelectItem>
                                    {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Prescriptions List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2>All Prescriptions</h2>
                    <Badge variant="secondary">
                        {filteredPrescriptions.length} prescription(s) found
                    </Badge>
                </div>

                {Object.keys(groupedPrescriptions).length > 0 ? (
                    <div className="space-y-6">
                        {Object.entries(groupedPrescriptions)
                            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                            .map(([date, prescriptions]) => (
                                <div key={date}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <h3 className="font-medium">{formatDate(date)}</h3>
                                        <Badge variant="outline">{prescriptions.length} item(s)</Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {prescriptions.map((prescription) => (
                                            <Card key={prescription.id} className="hover:shadow-md transition-shadow">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                                <Pill className="h-5 w-5 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <CardTitle className="text-lg">{prescription.medicine_name}</CardTitle>
                                                                <CardDescription className="flex items-center gap-1">
                                                                    <User className="h-3 w-3" />
                                                                    {prescription.doctor_name}
                                                                </CardDescription>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-muted-foreground">Dosage:</span>
                                                            <p className="font-medium">{prescription.dosage}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Frequency:</span>
                                                            <p className="font-medium">{prescription.frequency}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Duration:</span>
                                                            <p className="font-medium">{prescription.duration}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Prescribed:</span>
                                                            <p className="font-medium">{formatDate(prescription.date)}</p>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 border-t">
                                                        <Button variant="outline" size="sm" className="w-full">
                                                            <FileText className="h-3 w-3 mr-2" />
                                                            View Medical Record
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-medium mb-2">No prescriptions found</h3>
                            <p className="text-sm text-muted-foreground">
                                {searchTerm || filterDoctor || filterMonth
                                    ? 'Try adjusting your filters to see more results'
                                    : 'You don\'t have any prescriptions yet'
                                }
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}