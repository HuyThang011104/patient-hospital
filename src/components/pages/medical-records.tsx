import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, Eye, FileText, Pill, TestTube, Download, Calendar } from 'lucide-react';
import { serverRequest } from '@/utils/backend/client';

const medicalRecordsData = [
    {
        id: 1,
        patient: 'John Smith',
        doctor: 'Dr. Emily Wilson',
        diagnosis: 'Hypertension',
        treatment: 'Blood pressure medication and lifestyle changes',
        date: '2024-03-10',
        severity: 'Moderate',
        department: 'Cardiology'
    },
    {
        id: 2,
        patient: 'Sarah Johnson',
        doctor: 'Dr. Michael Davis',
        diagnosis: 'Migraine',
        treatment: 'Pain management and trigger avoidance',
        date: '2024-03-08',
        severity: 'Mild',
        department: 'Neurology'
    },
    {
        id: 3,
        patient: 'Mike Brown',
        doctor: 'Dr. Sarah Miller',
        diagnosis: 'Common Cold',
        treatment: 'Rest and symptomatic treatment',
        date: '2024-03-05',
        severity: 'Mild',
        department: 'Pediatrics'
    },
    {
        id: 4,
        patient: 'Lisa Williams',
        doctor: 'Dr. James Garcia',
        diagnosis: 'Fractured Wrist',
        treatment: 'Cast application and physical therapy',
        date: '2024-03-01',
        severity: 'Moderate',
        department: 'Orthopedics'
    }
];

const prescriptionsData = [
    {
        id: 1,
        recordId: 1,
        medicine: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        prescribedBy: 'Dr. Emily Wilson',
        date: '2024-03-10'
    },
    {
        id: 2,
        recordId: 1,
        medicine: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '30 days',
        prescribedBy: 'Dr. Emily Wilson',
        date: '2024-03-10'
    },
    {
        id: 3,
        recordId: 2,
        medicine: 'Sumatriptan',
        dosage: '50mg',
        frequency: 'As needed',
        duration: '10 days',
        prescribedBy: 'Dr. Michael Davis',
        date: '2024-03-08'
    },
    {
        id: 4,
        recordId: 4,
        medicine: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Every 8 hours',
        duration: '7 days',
        prescribedBy: 'Dr. James Garcia',
        date: '2024-03-01'
    }
];

const labTestsData = [
    {
        id: 1,
        recordId: 1,
        testType: 'Blood Pressure Monitoring',
        result: '140/90 mmHg',
        normalRange: '120/80 mmHg',
        status: 'Abnormal',
        date: '2024-03-10'
    },
    {
        id: 2,
        recordId: 1,
        testType: 'Cholesterol Panel',
        result: '220 mg/dL',
        normalRange: '<200 mg/dL',
        status: 'High',
        date: '2024-03-10'
    },
    {
        id: 3,
        recordId: 2,
        testType: 'MRI Brain',
        result: 'No structural abnormalities',
        normalRange: 'Normal',
        status: 'Normal',
        date: '2024-03-08'
    },
    {
        id: 4,
        recordId: 4,
        testType: 'X-Ray Wrist',
        result: 'Distal radius fracture',
        normalRange: 'No fracture',
        status: 'Abnormal',
        date: '2024-03-01'
    }
];

export function MedicalRecords() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

    useEffect(() => {
        fetchMedicalRecords();
    }, []);

    const fetchMedicalRecords = async () => {
        try {
            const response = await serverRequest('/medical-records');
            setRecords(response.records || []);
        } catch (error) {
            console.error('Error fetching medical records:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = records.filter(record => {
        if (!record || typeof record !== 'object') return false;

        const patient = record.patient || '';
        const doctor = record.doctor || '';
        const diagnosis = record.diagnosis || '';

        return patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const getSeverityBadge = (severity: string) => {
        const variant = severity === 'Severe' ? 'destructive' :
            severity === 'Moderate' ? 'secondary' : 'default';
        return <Badge variant={variant}>{severity}</Badge>;
    };

    const getTestStatusBadge = (status: string) => {
        const variant = status === 'Normal' ? 'default' :
            status === 'High' || status === 'Abnormal' ? 'destructive' : 'secondary';
        return <Badge variant={variant}>{status}</Badge>;
    };

    const openRecordDetail = (recordId: number) => {
        setSelectedRecord(recordId);
        setIsDetailDialogOpen(true);
    };

    const selectedRecordData = selectedRecord ? medicalRecordsData.find(r => r.id === selectedRecord) : null;
    const recordPrescriptions = selectedRecord ? prescriptionsData.filter(p => p.recordId === selectedRecord) : [];
    const recordLabTests = selectedRecord ? labTestsData.filter(t => t.recordId === selectedRecord) : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1>Medical Records</h1>
                    <p className="text-muted-foreground">
                        Patient medical history and treatment records
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                        <CardTitle className="flex items-center">
                            <FileText className="mr-2 h-5 w-5" />
                            All Medical Records
                        </CardTitle>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search records..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 w-64"
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
                                    <TableHead>Diagnosis</TableHead>
                                    <TableHead>Treatment</TableHead>
                                    <TableHead>Severity</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRecords.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>{record.patient}</TableCell>
                                        <TableCell>{record.doctor}</TableCell>
                                        <TableCell>{record.diagnosis}</TableCell>
                                        <TableCell className="max-w-60 truncate">{record.treatment}</TableCell>
                                        <TableCell>{getSeverityBadge(record.severity)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                                                {record.date}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openRecordDetail(record.id)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Medical Record Detail Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Medical Record Details</DialogTitle>
                    </DialogHeader>

                    {selectedRecordData && (
                        <div className="space-y-6">
                            {/* Record Overview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Record Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Patient</p>
                                            <p className="font-medium">{selectedRecordData.patient}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Doctor</p>
                                            <p className="font-medium">{selectedRecordData.doctor}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Department</p>
                                            <p className="font-medium">{selectedRecordData.department}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Date</p>
                                            <p className="font-medium">{selectedRecordData.date}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-muted-foreground">Diagnosis</p>
                                            <p className="font-medium">{selectedRecordData.diagnosis}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-muted-foreground">Treatment</p>
                                            <p className="font-medium">{selectedRecordData.treatment}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Tabs defaultValue="prescriptions" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="prescriptions" className="flex items-center">
                                        <Pill className="mr-2 h-4 w-4" />
                                        Prescriptions
                                    </TabsTrigger>
                                    <TabsTrigger value="lab-tests" className="flex items-center">
                                        <TestTube className="mr-2 h-4 w-4" />
                                        Lab Tests
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="prescriptions">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Prescribed Medications</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {recordPrescriptions.length === 0 ? (
                                                <p className="text-muted-foreground text-center py-4">
                                                    No prescriptions for this record
                                                </p>
                                            ) : (
                                                <div className="space-y-4">
                                                    {recordPrescriptions.map((prescription) => (
                                                        <div key={prescription.id} className="border rounded-lg p-4">
                                                            <div className="flex justify-between items-start">
                                                                <div className="space-y-2">
                                                                    <h4 className="font-medium">{prescription.medicine}</h4>
                                                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                                                        <div>
                                                                            <span className="text-muted-foreground">Dosage: </span>
                                                                            <span>{prescription.dosage}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-muted-foreground">Frequency: </span>
                                                                            <span>{prescription.frequency}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-muted-foreground">Duration: </span>
                                                                            <span>{prescription.duration}</span>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Prescribed by {prescription.prescribedBy} on {prescription.date}
                                                                    </p>
                                                                </div>
                                                                <Button variant="outline" size="sm">
                                                                    <Download className="h-4 w-4 mr-1" />
                                                                    Print
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="lab-tests">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Laboratory Tests</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {recordLabTests.length === 0 ? (
                                                <p className="text-muted-foreground text-center py-4">
                                                    No lab tests for this record
                                                </p>
                                            ) : (
                                                <div className="space-y-4">
                                                    {recordLabTests.map((test) => (
                                                        <div key={test.id} className="border rounded-lg p-4">
                                                            <div className="flex justify-between items-start">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        <h4 className="font-medium">{test.testType}</h4>
                                                                        {getTestStatusBadge(test.status)}
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                                        <div>
                                                                            <span className="text-muted-foreground">Result: </span>
                                                                            <span className="font-medium">{test.result}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-muted-foreground">Normal Range: </span>
                                                                            <span>{test.normalRange}</span>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Performed on {test.date}
                                                                    </p>
                                                                </div>
                                                                <Button variant="outline" size="sm">
                                                                    <Download className="h-4 w-4 mr-1" />
                                                                    Download
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}