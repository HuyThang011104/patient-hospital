/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { CreditCard, DollarSign, Calendar, Eye, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { mockPayments } from '@/utils/mock/mock-data';

export function Payments() {
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Paid':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'Card':
                return <CreditCard className="h-4 w-4" />;
            case 'Cash':
                return <DollarSign className="h-4 w-4" />;
            case 'Insurance':
                return <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>;
            default:
                return <DollarSign className="h-4 w-4" />;
        }
    };

    const totalPaid = mockPayments
        .filter(payment => payment.status === 'Paid')
        .reduce((sum, payment) => sum + payment.amount, 0);

    const pendingAmount = mockPayments
        .filter(payment => payment.status === 'Pending')
        .reduce((sum, payment) => sum + payment.amount, 0);

    const pendingPayments = mockPayments.filter(payment => payment.status === 'Pending');

    const handleViewDetails = (payment: any) => {
        setSelectedPayment(payment);
        setShowDetails(true);
    };

    const handlePayNow = (payment: any) => {
        setSelectedPayment(payment);
        setShowPaymentDialog(true);
    };

    const processPayment = () => {
        if (!paymentMethod) {
            toast.error('Please select a payment method');
            return;
        }

        toast.success('Payment processed successfully!');
        setShowPaymentDialog(false);
        setPaymentMethod('');
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1>Payments</h1>
                <p className="text-muted-foreground">Manage your medical bills and payment history</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            All completed payments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
                        <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {pendingPayments.length} pending bill(s)
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Year</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            ${(totalPaid + pendingAmount).toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total medical expenses
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Payments */}
            {pendingPayments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-yellow-600">Pending Payments</CardTitle>
                        <CardDescription>Bills that require your attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pendingPayments.map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <DollarSign className="h-5 w-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{payment.description}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Due: {formatDate(payment.date)} • ${payment.amount.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700"
                                        onClick={() => handlePayNow(payment)}
                                    >
                                        Pay Now
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Complete record of all your medical payments</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Payment ID</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockPayments
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-mono text-sm">#{payment.id}</TableCell>
                                        <TableCell>{payment.description}</TableCell>
                                        <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                {formatDate(payment.date)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getMethodIcon(payment.method)}
                                                {payment.method}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(payment.status)}>
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(payment)}
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                                {payment.status === 'Pending' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        onClick={() => handlePayNow(payment)}
                                                    >
                                                        <ExternalLink className="h-3 w-3 mr-1" />
                                                        Pay
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

            {/* Payment Details Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Payment Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about this payment
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPayment && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Payment ID</Label>
                                    <p className="font-mono">#{selectedPayment.id}</p>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Badge className={getStatusColor(selectedPayment.status)}>
                                        {selectedPayment.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label>Amount</Label>
                                    <p className="font-medium text-lg">${selectedPayment.amount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <Label>Date</Label>
                                    <p>{formatDate(selectedPayment.date)}</p>
                                </div>
                                <div>
                                    <Label>Payment Method</Label>
                                    <div className="flex items-center gap-2">
                                        {getMethodIcon(selectedPayment.method)}
                                        <p>{selectedPayment.method}</p>
                                    </div>
                                </div>
                                {selectedPayment.appointment_id && (
                                    <div>
                                        <Label>Appointment ID</Label>
                                        <p className="font-mono">#{selectedPayment.appointment_id}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label>Description</Label>
                                <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedPayment.description}</p>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetails(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Payment Dialog */}
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Process Payment</DialogTitle>
                        <DialogDescription>
                            Complete your payment for this medical bill
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPayment && (
                        <div className="space-y-6">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-medium mb-2">Payment Summary</h4>
                                <div className="space-y-1 text-sm">
                                    <p><strong>Description:</strong> {selectedPayment.description}</p>
                                    <p><strong>Amount:</strong> ${selectedPayment.amount.toFixed(2)}</p>
                                    <p><strong>Due Date:</strong> {formatDate(selectedPayment.date)}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Select Payment Method</Label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                                        <SelectItem value="insurance">Insurance</SelectItem>
                                        <SelectItem value="cash">Cash Payment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="p-3 bg-gray-50 rounded-lg text-sm text-muted-foreground">
                                    You will be redirected to a secure payment gateway to complete your card payment.
                                </div>
                            )}

                            {paymentMethod === 'insurance' && (
                                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                                    This payment will be processed through your insurance provider.
                                </div>
                            )}

                            {paymentMethod === 'cash' && (
                                <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                                    Please visit the hospital reception to complete your cash payment.
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={processPayment}
                            disabled={!paymentMethod}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Process Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

