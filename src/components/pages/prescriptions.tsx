import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Pill, Calendar, User, Search, Filter, FileText } from 'lucide-react';
import { supabase } from '@/utils/backend/client';
import type { IPrescription } from '@/interfaces/prescription';
import { useAuth } from '@/hooks/use-auth';

export function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('all');
    const [filterMonth, setFilterMonth] = useState('all');
    const { user } = useAuth();

    const fetchPrescriptions = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);

            // First get medical records for the current patient
            const { data: medicalRecords, error: medicalRecordsError } = await supabase
                .from('medical_record')
                .select('id')
                .eq('patient_id', user.id);

            if (medicalRecordsError) throw medicalRecordsError;

            if (!medicalRecords || medicalRecords.length === 0) {
                setPrescriptions([]);
                return;
            }

            // Then get prescriptions for those medical records
            const medicalRecordIds = medicalRecords.map(record => record.id);

            const { data: prescriptionsData, error: prescriptionsError } = await supabase
                .from('prescription')
                .select(`
                    *,
                    medical_record(
                        id,
                        patient_id,
                        doctor_id,
                        diagnosis,
                        treatment,
                        record_date,
                        doctor(*)
                    ),
                    medicine(*)
                `)
                .in('medical_record_id', medicalRecordIds)

            if (prescriptionsError) throw prescriptionsError;

            // Transform the data to match the IPrescription interface
            const transformedPrescriptions = prescriptionsData?.map(prescription => ({
                id: prescription.id,
                medical_record_id: prescription.medical_record_id,
                medicine_id: prescription.medicine_id,
                dosage: prescription.dosage,
                frequency: prescription.frequency,
                duration: prescription.duration,
                medical_record: prescription.medical_record,
                medicine: prescription.medicine
            })) as IPrescription[];

            setPrescriptions(transformedPrescriptions || []);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            setPrescriptions([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPrescriptions();
    }, [fetchPrescriptions]);

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredPrescriptions = prescriptions.filter(prescription => {
        const matchesSearch = prescription.medicine.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDoctor = filterDoctor === '' || filterDoctor === 'all' || prescription.medical_record.doctor.full_name === filterDoctor;
        const matchesMonth = filterMonth === '' || filterMonth === 'all' ||
            new Date(prescription.medical_record.record_date).getMonth() === parseInt(filterMonth);

        return matchesSearch && matchesDoctor && matchesMonth;
    });

    const groupedPrescriptions = filteredPrescriptions.reduce((groups, prescription) => {
        const date = new Date(prescription.medical_record.record_date).toISOString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(prescription);
        return groups;
    }, {} as Record<string, typeof prescriptions>);

    const uniqueDoctors = Array.from(new Set(prescriptions.map(p => p.medical_record.doctor.full_name)));

    const months = [
        { value: '0', label: 'Tháng Một' },
        { value: '1', label: 'Tháng Hai' },
        { value: '2', label: 'Tháng Ba' },
        { value: '3', label: 'Tháng Tư' },
        { value: '4', label: 'Tháng Năm' },
        { value: '5', label: 'Tháng Sáu' },
        { value: '6', label: 'Tháng Bảy' },
        { value: '7', label: 'Tháng Tám' },
        { value: '8', label: 'Tháng Chín' },
        { value: '9', label: 'Tháng Mười' },
        { value: '10', label: 'Tháng Mười Một' },
        { value: '11', label: 'Tháng Mười Hai' },
    ];

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div>
                    <h1>Đơn Thuốc</h1>
                    <p className="text-muted-foreground">Đang tải các loại thuốc được kê đơn của bạn...</p>
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
                <h1>Đơn Thuốc</h1>
                <p className="text-muted-foreground">Xem và quản lý các loại thuốc được kê đơn của bạn</p>
            </div>

            {/* Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5" />
                        Tóm Tắt Đơn Thuốc
                    </CardTitle>
                    <CardDescription>Tổng quan về các loại thuốc được kê đơn của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{prescriptions.length}</div>
                            <p className="text-sm text-muted-foreground">Tổng Đơn Thuốc</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{uniqueDoctors.length}</div>
                            <p className="text-sm text-muted-foreground">Bác Sĩ Kê Đơn</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {Array.from(new Set(prescriptions.map(p => p.medicine.name))).length}
                            </div>
                            <p className="text-sm text-muted-foreground">Loại Thuốc Khác Nhau</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Lọc Đơn Thuốc
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tìm Kiếm Thuốc</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm theo tên thuốc..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Lọc Theo Bác Sĩ</label>
                            <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tất cả bác sĩ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả bác sĩ</SelectItem>
                                    {uniqueDoctors.map((doctor) => (
                                        <SelectItem key={doctor} value={doctor}>
                                            {doctor}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Lọc Theo Tháng</label>
                            <Select value={filterMonth} onValueChange={setFilterMonth}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tất cả tháng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả tháng</SelectItem>
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
                    <h2>Tất Cả Đơn Thuốc</h2>
                    <Badge variant="secondary">
                        {filteredPrescriptions.length} đơn thuốc được tìm thấy
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
                                        <h3 className="font-medium">{formatDate(new Date(date))}</h3>
                                        <Badge variant="outline">{prescriptions.length} mục</Badge>
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
                                                                <CardTitle className="text-lg">{prescription.medicine.name}</CardTitle>
                                                                <CardDescription className="flex items-center gap-1">
                                                                    <User className="h-3 w-3" />
                                                                    {prescription.medical_record.doctor.full_name}
                                                                </CardDescription>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-muted-foreground">Liều Lượng:</span>
                                                            <p className="font-medium">{prescription.dosage}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Tần Suất:</span>
                                                            <p className="font-medium">{prescription.frequency}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Thời Gian:</span>
                                                            <p className="font-medium">{prescription.duration}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Ngày Kê Đơn:</span>
                                                            <p className="font-medium">{formatDate(prescription.medical_record.record_date)}</p>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 border-t">
                                                        <Button variant="outline" size="sm" className="w-full">
                                                            <FileText className="h-3 w-3 mr-2" />
                                                            Xem Hồ Sơ Y Tế
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
                            <h3 className="font-medium mb-2">Không tìm thấy đơn thuốc</h3>
                            <p className="text-sm text-muted-foreground">
                                {searchTerm || filterDoctor || filterMonth
                                    ? 'Thử điều chỉnh bộ lọc để xem thêm kết quả'
                                    : 'Bạn chưa có đơn thuốc nào'
                                }
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}