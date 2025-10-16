import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { CreditCard, DollarSign, Calendar, Eye, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/utils/backend/client';
import type { IPayment } from '@/interfaces/payment';
import type { PaymentMethod, PaymentStatus } from '@/types';
import { useAuth } from '@/hooks/use-auth';

export function Payments() {
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');
    const { user } = useAuth();

    const fetchPayments = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('payment')
                .select('*')
                .eq('patient_id', user.id)
                .order('payment_date', { ascending: false });

            if (error) throw error;
            setPayments(data || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setPayments([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: PaymentStatus) => {
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

    const getMethodIcon = (method: PaymentMethod) => {
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

    const totalPaid = payments
        .filter(payment => payment.status === 'Paid')
        .reduce((sum, payment) => sum + payment.amount, 0);

    const pendingAmount = payments
        .filter(payment => payment.status === 'Pending')
        .reduce((sum, payment) => sum + payment.amount, 0);

    const pendingPayments = payments.filter(payment => payment.status === 'Pending');

    const handleViewDetails = (payment: IPayment) => {
        setSelectedPayment(payment);
        setShowDetails(true);
    };

    const handlePayNow = (payment: IPayment) => {
        setSelectedPayment(payment);
        setShowPaymentDialog(true);
    };

    const processPayment = async () => {
        if (!paymentMethod || !selectedPayment) {
            toast.error('Vui lòng chọn phương thức thanh toán');
            return;
        }

        try {
            const { error } = await supabase
                .from('payment')
                .update({ 
                    status: 'Paid',
                    payment_date: new Date().toISOString()
                })
                .eq('id', selectedPayment.id);

            if (error) throw error;

            toast.success('Thanh toán được xử lý thành công!');
            setShowPaymentDialog(false);
            setPaymentMethod('Card');
            fetchPayments(); // Refresh the payments list
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Xử lý thanh toán thất bại. Vui lòng thử lại.');
        }
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div>
                    <h1>Thanh Toán</h1>
                    <p className="text-muted-foreground">Đang tải lịch sử thanh toán của bạn...</p>
                </div>
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1>Thanh Toán</h1>
                <p className="text-muted-foreground">Quản lý hóa đơn y tế và lịch sử thanh toán của bạn</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Đã Thanh Toán</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Tất cả thanh toán đã hoàn thành
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hóa Đơn Chờ Thanh Toán</CardTitle>
                        <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {pendingPayments.length} hóa đơn chưa thanh toán
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Năm Nay</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            ${(totalPaid + pendingAmount).toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Tổng chi phí y tế
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Payments */}
            {pendingPayments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-yellow-600">Thanh Toán Chờ Xử Lý</CardTitle>
                        <CardDescription>Các hóa đơn cần bạn xử lý</CardDescription>
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
                                            <p className="font-medium">Thanh Toán Y Tế</p>
                                            <p className="text-sm text-muted-foreground">
                                                Hạn: {payment.payment_date ? formatDate(payment.payment_date) : 'Chưa đặt'} • ${payment.amount.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700"
                                        onClick={() => handlePayNow(payment)}
                                    >
                                        Thanh Toán Ngay
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
                    <CardTitle>Lịch Sử Thanh Toán</CardTitle>
                    <CardDescription>Hồ sơ đầy đủ tất cả các thanh toán y tế của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã Thanh Toán</TableHead>
                                <TableHead>Mô Tả</TableHead>
                                <TableHead>Số Tiền</TableHead>
                                <TableHead>Ngày</TableHead>
                                <TableHead>Phương Thức</TableHead>
                                <TableHead>Trạng Thái</TableHead>
                                <TableHead>Hành Động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments
                                .sort((a, b) => new Date(b.payment_date || '').getTime() - new Date(a.payment_date || '').getTime())
                                .map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-mono text-sm">#{payment.id}</TableCell>
                                        <TableCell>Thanh Toán Y Tế</TableCell>
                                        <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                {payment.payment_date ? formatDate(payment.payment_date) : 'Chưa đặt'}
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
                                                    Xem
                                                </Button>
                                                {payment.status === 'Pending' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        onClick={() => handlePayNow(payment)}
                                                    >
                                                        <ExternalLink className="h-3 w-3 mr-1" />
                                                        Thanh Toán
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
                        <DialogTitle>Chi Tiết Thanh Toán</DialogTitle>
                        <DialogDescription>
                            Thông tin chi tiết về thanh toán này
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPayment && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Mã Thanh Toán</Label>
                                    <p className="font-mono">#{selectedPayment.id}</p>
                                </div>
                                <div>
                                    <Label>Trạng Thái</Label>
                                    <Badge className={getStatusColor(selectedPayment.status)}>
                                        {selectedPayment.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label>Số Tiền</Label>
                                    <p className="font-medium text-lg">${selectedPayment.amount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <Label>Ngày Thanh Toán</Label>
                                    <p>{selectedPayment.payment_date ? formatDate(selectedPayment.payment_date) : 'Chưa đặt'}</p>
                                </div>
                                <div>
                                    <Label>Phương Thức Thanh Toán</Label>
                                    <div className="flex items-center gap-2">
                                        {getMethodIcon(selectedPayment.method)}
                                        <p>{selectedPayment.method}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label>Mã Bệnh Nhân</Label>
                                    <p className="font-mono">#{selectedPayment.patient_id}</p>
                                </div>
                            </div>

                            <div>
                                <Label>Mô Tả</Label>
                                <p className="mt-1 p-3 bg-gray-50 rounded-lg">Thanh Toán Y Tế</p>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetails(false)}>
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Payment Dialog */}
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xử Lý Thanh Toán</DialogTitle>
                        <DialogDescription>
                            Hoàn tất thanh toán cho hóa đơn y tế này
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPayment && (
                        <div className="space-y-6">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-medium mb-2">Tóm Tắt Thanh Toán</h4>
                                <div className="space-y-1 text-sm">
                                    <p><strong>Mô Tả:</strong> Thanh Toán Y Tế</p>
                                    <p><strong>Số Tiền:</strong> ${selectedPayment.amount.toFixed(2)}</p>
                                    <p><strong>Ngày Hết Hạn:</strong> {selectedPayment.payment_date ? formatDate(selectedPayment.payment_date) : 'Chưa đặt'}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Chọn Phương Thức Thanh Toán</Label>
                                <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn phương thức thanh toán" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Card">Thẻ Tín Dụng/Ghi Nợ</SelectItem>
                                        <SelectItem value="Insurance">Bảo Hiểm</SelectItem>
                                        <SelectItem value="Cash">Tiền Mặt</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {paymentMethod === 'Card' && (
                                <div className="p-3 bg-gray-50 rounded-lg text-sm text-muted-foreground">
                                    Bạn sẽ được chuyển đến cổng thanh toán bảo mật để hoàn tất thanh toán thẻ.
                                </div>
                            )}

                            {paymentMethod === 'Insurance' && (
                                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                                    Thanh toán này sẽ được xử lý thông qua nhà cung cấp bảo hiểm của bạn.
                                </div>
                            )}

                            {paymentMethod === 'Cash' && (
                                <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                                    Vui lòng đến quầy lễ tân của bệnh viện để hoàn tất thanh toán tiền mặt.
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                            Hủy Bỏ
                        </Button>
                        <Button
                            onClick={processPayment}
                            disabled={!paymentMethod}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Xử Lý Thanh Toán
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

