/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { FileText, Download, Calendar, User, TestTube, Pill, Eye } from 'lucide-react';
import { toast } from 'sonner';
import type { IMedicalRecord } from '@/interfaces/medical_record';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/utils/backend/client';
import type { ILabTest } from '@/interfaces/lab_test';
import type { IPrescription } from '@/interfaces/prescription';

export function MedicalRecords() {
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [labTests, setLabTests] = useState<ILabTest[]>([]);
    const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
    const [medicalRecords, setMedicalRecords] = useState<IMedicalRecord[]>([]);
    const { user } = useAuth();
    useEffect(() => {
        fetchMedicalRecords();
    }, [])

    useEffect(() => {
        if (selectedRecord) {
            fetchLabTests();
            fetchPrescriptions();
        }
    }, [selectedRecord])

    const fetchMedicalRecords = async () => {
        try {
            const { data, error } = await supabase
                .from('medical_record')
                .select(`
                    *,
                    doctor(*)
                `)
                .eq('patient_id', user?.id);
            if (error) throw error;
            console.log("medical_record", data)
            setMedicalRecords(data);
        } catch (error) {
            console.error('Error fetching medical records:', error);
        }
    }

    const fetchLabTests = async () => {
        console.log("selectedRecord", selectedRecord)
        try {
            const { data, error } = await supabase
                .from('lab_test')
                .select(`
                    *,
                    medical_record(*)
                `)
                .eq('medical_record_id', selectedRecord.id);
            if (error) throw error;
            console.log("lab_test", data)
            setLabTests(data);
        } catch (error) {
            console.error('Error fetching lab tests:', error);
        }
    }

    const fetchPrescriptions = async () => {
        try {
            const { data, error } = await supabase
                .from('prescription')
                .select(`
                    *,
                    medical_record(*)
                `)
                .eq('medical_record_id', selectedRecord.id);
            if (error) throw error;
            console.log("prescription", data)
            setPrescriptions(data);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        }
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);

        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short', // Ví dụ: 'T.5' (Thứ 5)
            day: 'numeric',   // Ví dụ: '9'
            month: 'numeric', // Ví dụ: '10'
            year: 'numeric',  // Ví dụ: '2025'
        };
        return date.toLocaleDateString('vi-VN', options);
    };

    const handleViewDetails = (record: IMedicalRecord) => {
        setSelectedRecord(record);
        setShowDetails(true);
    };

    const handleDownloadPDF = (recordId: string) => {
        toast.success('Medical record PDF download started');
    };

    const getLabTestsForRecord = (recordId: string) => {
        return labTests.filter(test => test.medical_record_id === recordId);
    };

    const getPrescriptionsForRecord = (recordId: string) => {
        return prescriptions.filter(prescription => prescription.medical_record_id === recordId);
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1>Medical Records</h1>
                <p className="text-muted-foreground">Access your complete medical history and documents</p>
            </div>

            {/* Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Medical Records Summary
                    </CardTitle>
                    <CardDescription>Overview of your medical visits and treatments</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{medicalRecords.length}</div>
                            <p className="text-sm text-muted-foreground">Total Records</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{labTests.length}</div>
                            <p className="text-sm text-muted-foreground">Lab Tests</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{prescriptions.length}</div>
                            <p className="text-sm text-muted-foreground">Prescriptions</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Medical Records List */}
            <div className="space-y-4">
                <h2>All Medical Records</h2>

                {medicalRecords.map((record) => (
                    <Card key={record.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{record.diagnosis}</CardTitle>
                                        <CardDescription className="flex items-center gap-4 mt-1">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {record.doctor.full_name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(record.record_date.toString())}
                                            </span>
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewDetails(record)}
                                    >
                                        <Eye className="h-3 w-3 mr-1" />
                                        View Details
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownloadPDF(record.id)}
                                    >
                                        <Download className="h-3 w-3 mr-1" />
                                        PDF
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">{record.treatment}</p>

                            <div className="flex gap-4 text-xs">
                                {getLabTestsForRecord(record.id).length > 0 && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <TestTube className="h-3 w-3" />
                                        {getLabTestsForRecord(record.id).length} Lab Test(s)
                                    </Badge>
                                )}
                                {getPrescriptionsForRecord(record.id).length > 0 && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Pill className="h-3 w-3" />
                                        {getPrescriptionsForRecord(record.id).length} Prescription(s)
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Medical Record Details Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Medical Record Details</DialogTitle>
                        <DialogDescription>
                            Complete information about your medical visit
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRecord && (
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Visit Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Record ID</Label>
                                            <p className="font-mono">#{selectedRecord.id}</p>
                                        </div>
                                        <div>
                                            <Label>Visit Date</Label>
                                            <p>{formatDate(selectedRecord.record_date.toString())}</p>
                                        </div>
                                        <div>
                                            <Label>Doctor</Label>
                                            <p>{selectedRecord.doctor.full_name}</p>
                                        </div>
                                        {/* <div>
                                            <Label>Appointment ID</Label>
                                            <p className="font-mono">#{selectedRecord.appointment_id}</p>
                                        </div> */}
                                    </div>

                                    <div>
                                        <Label>Diagnosis</Label>
                                        <p className="mt-1 p-3 bg-blue-50 rounded-lg">{selectedRecord.diagnosis}</p>
                                    </div>

                                    <div>
                                        <Label>Treatment</Label>
                                        <p className="mt-1 p-3 bg-green-50 rounded-lg">{selectedRecord.treatment}</p>
                                    </div>

                                    {selectedRecord.notes && (
                                        <div>
                                            <Label>Additional Notes</Label>
                                            <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedRecord.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Related Information Tabs */}
                            <Tabs defaultValue="lab-tests" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
                                    <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                                </TabsList>

                                <TabsContent value="lab-tests" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <TestTube className="h-5 w-5" />
                                                Lab Test Results
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {getLabTestsForRecord(selectedRecord.id).length > 0 ? (
                                                <div className="space-y-4">
                                                    {getLabTestsForRecord(selectedRecord.id).map((test) => (
                                                        <div key={test.id} className="border rounded-lg p-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-medium">{test.test_type}</h4>
                                                                <Badge variant="outline">{formatDate(test.test_date.toString())}</Badge>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <Label>Result</Label>
                                                                    <p className="font-medium">{test.result}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground text-center py-4">No lab tests for this record</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="prescriptions" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Pill className="h-5 w-5" />
                                                Prescribed Medications
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {getPrescriptionsForRecord(selectedRecord.id).length > 0 ? (
                                                <div className="space-y-4">
                                                    {getPrescriptionsForRecord(selectedRecord.id).map((prescription) => (
                                                        <div key={prescription.id} className="border rounded-lg p-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-medium">{prescription.medical_record.diagnosis}</h4>
                                                                <Badge variant="outline">{formatDate(prescription.medical_record.record_date.toString())}</Badge>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                                <div>
                                                                    <Label>Dosage</Label>
                                                                    <p>{prescription.dosage}</p>
                                                                </div>
                                                                <div>
                                                                    <Label>Frequency</Label>
                                                                    <p>{prescription.frequency}</p>
                                                                </div>
                                                                <div>
                                                                    <Label>Duration</Label>
                                                                    <p>{prescription.duration}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground text-center py-4">No prescriptions for this record</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => selectedRecord && handleDownloadPDF(selectedRecord.id)}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                        <Button variant="outline" onClick={() => setShowDetails(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

