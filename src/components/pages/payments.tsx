import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Search, Filter, Download, Eye, DollarSign, CreditCard, Shield, FileText } from 'lucide-react';

const paymentsData = [
    {
        id: 1,
        patient: 'John Smith',
        amount: 1250.00,
        method: 'Insurance',
        status: 'Paid',
        date: '2024-03-10',
        invoiceId: 'INV-2024-001',
        services: [
            { name: 'Cardiology Consultation', amount: 200.00 },
            { name: 'ECG Test', amount: 150.00 },
            { name: 'Blood Pressure Monitoring', amount: 100.00 },
            { name: 'Medications', amount: 800.00 }
        ]
    },
    {
        id: 2,
        patient: 'Sarah Johnson',
        amount: 450.00,
        method: 'Card',
        status: 'Pending',
        date: '2024-03-08',
        invoiceId: 'INV-2024-002',
        services: [
            { name: 'Neurology Consultation', amount: 250.00 },
            { name: 'MRI Scan', amount: 200.00 }
        ]
    },
    {
        id: 3,
        patient: 'Mike Brown',
        amount: 75.00,
        method: 'Cash',
        status: 'Paid',
        date: '2024-03-05',
        invoiceId: 'INV-2024-003',
        services: [
            { name: 'Pediatric Consultation', amount: 75.00 }
        ]
    },
    {
        id: 4,
        patient: 'Lisa Williams',
        amount: 2100.00,
        method: 'Insurance',
        status: 'Cancelled',
        date: '2024-03-01',
        invoiceId: 'INV-2024-004',
        services: [
            { name: 'Surgery Consultation', amount: 500.00 },
            { name: 'X-Ray', amount: 100.00 },
            { name: 'Physical Therapy', amount: 300.00 },
            { name: 'Room Charges (3 days)', amount: 1200.00 }
        ]
    }
];

const insuranceData = [
    {
        id: 1,
        patient: 'John Smith',
        provider: 'HealthFirst Insurance',
        policyNumber: 'HF-2024-789012',
        validFrom: '2024-01-01',
        validTo: '2024-12-31',
        coverage: 80,
        status: 'Active'
    },
    {
        id: 2,
        patient: 'Sarah Johnson',
        provider: 'MediCare Plus',
        policyNumber: 'MCP-2024-345678',
        validFrom: '2024-02-15',
        validTo: '2025-02-14',
        coverage: 75,
        status: 'Active'
    },
    {
        id: 3,
        patient: 'Lisa Williams',
        provider: 'SecureHealth',
        policyNumber: 'SH-2024-901234',
        validFrom: '2023-12-01',
        validTo: '2024-11-30',
        coverage: 90,
        status: 'Expiring Soon'
    },
    {
        id: 4,
        patient: 'David Garcia',
        provider: 'FamilyCare Insurance',
        policyNumber: 'FC-2023-567890',
        validFrom: '2023-06-01',
        validTo: '2024-05-31',
        coverage: 85,
        status: 'Active'
    }
];

export function Payments() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [methodFilter, setMethodFilter] = useState('All');
    const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
    const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);

    const filteredPayments = paymentsData.filter(payment => {
        const matchesSearch = payment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
        const matchesMethod = methodFilter === 'All' || payment.method === methodFilter;

        return matchesSearch && matchesStatus && matchesMethod;
    });

    const getStatusBadge = (status: string) => {
        const variant = status === 'Paid' ? 'default' :
            status === 'Pending' ? 'secondary' : 'destructive';
        return <Badge variant={variant}>{status}</Badge>;
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'Cash': return <DollarSign className="h-4 w-4" />;
            case 'Card': return <CreditCard className="h-4 w-4" />;
            case 'Insurance': return <Shield className="h-4 w-4" />;
            default: return <DollarSign className="h-4 w-4" />;
        }
    };

    const getInsuranceStatusBadge = (status: string) => {
        const variant = status === 'Active' ? 'default' :
            status === 'Expiring Soon' ? 'secondary' : 'destructive';
        return <Badge variant={variant}>{status}</Badge>;
    };

    const openInvoiceDetail = (paymentId: number) => {
        setSelectedPayment(paymentId);
        setIsInvoiceDialogOpen(true);
    };

    const selectedPaymentData = selectedPayment ? paymentsData.find(p => p.id === selectedPayment) : null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1>Payments & Insurance</h1>
                    <p className="text-muted-foreground">
                        Manage patient payments, invoices, and insurance claims
                    </p>
                </div>
            </div>

            <Tabs defaultValue="payments" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="payments" className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Payments
                    </TabsTrigger>
                    <TabsTrigger value="insurance" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Insurance
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="payments">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                                <CardTitle>Payment Records</CardTitle>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search payments..."
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
                                            <SelectItem value="Paid">Paid</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={methodFilter} onValueChange={setMethodFilter}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Methods</SelectItem>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Card">Card</SelectItem>
                                            <SelectItem value="Insurance">Insurance</SelectItem>
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
                                            <TableHead>Patient</TableHead>
                                            <TableHead>Invoice ID</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPayments.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell>{payment.patient}</TableCell>
                                                <TableCell className="font-mono">{payment.invoiceId}</TableCell>
                                                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        {getMethodIcon(payment.method)}
                                                        <span>{payment.method}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                                <TableCell>{payment.date}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openInvoiceDetail(payment.id)}
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
                </TabsContent>

                <TabsContent value="insurance">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="mr-2 h-5 w-5" />
                                Insurance Policies
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Patient</TableHead>
                                            <TableHead>Provider</TableHead>
                                            <TableHead>Policy Number</TableHead>
                                            <TableHead>Valid From</TableHead>
                                            <TableHead>Valid To</TableHead>
                                            <TableHead>Coverage</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {insuranceData.map((insurance) => (
                                            <TableRow key={insurance.id}>
                                                <TableCell>{insurance.patient}</TableCell>
                                                <TableCell>{insurance.provider}</TableCell>
                                                <TableCell className="font-mono">{insurance.policyNumber}</TableCell>
                                                <TableCell>{insurance.validFrom}</TableCell>
                                                <TableCell>{insurance.validTo}</TableCell>
                                                <TableCell>{insurance.coverage}%</TableCell>
                                                <TableCell>{getInsuranceStatusBadge(insurance.status)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Invoice Detail Dialog */}
            <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <FileText className="mr-2 h-5 w-5" />
                            Invoice Details
                        </DialogTitle>
                    </DialogHeader>

                    {selectedPaymentData && (
                        <div className="space-y-6">
                            {/* Invoice Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold">HealthCare Hospital</h3>
                                    <p className="text-sm text-muted-foreground">Invoice #{selectedPaymentData.invoiceId}</p>
                                    <p className="text-sm text-muted-foreground">Date: {selectedPaymentData.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Patient:</p>
                                    <p className="font-medium">{selectedPaymentData.patient}</p>
                                    <div className="mt-2">
                                        {getStatusBadge(selectedPaymentData.status)}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Services Breakdown */}
                            <div>
                                <h4 className="font-medium mb-3">Services & Charges</h4>
                                <div className="space-y-2">
                                    {selectedPaymentData.services.map((service, index) => (
                                        <div key={index} className="flex justify-between">
                                            <span>{service.name}</span>
                                            <span>${service.amount.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Payment Summary */}
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>${selectedPaymentData.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (0%):</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total:</span>
                                    <span>${selectedPaymentData.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span>Payment Method:</span>
                                    <div className="flex items-center space-x-2">
                                        {getMethodIcon(selectedPaymentData.method)}
                                        <span>{selectedPaymentData.method}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </Button>
                                <Button>
                                    Print Invoice
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}