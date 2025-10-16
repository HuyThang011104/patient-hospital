import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ChevronLeft, ChevronRight, Clock, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/utils/backend/client';
import type { ISpecialty } from '@/interfaces/specialty';
import type { IDoctor } from '@/interfaces/doctor';
import type { IShift } from '@/interfaces/shift';
import { useAuth } from '@/hooks/use-auth';

interface BookAppointmentProps {
    onPageChange: (page: string) => void;
}

export function BookAppointment({ onPageChange }: BookAppointmentProps) {
    const [doctors, setDoctors] = useState<IDoctor[]>([]);
    const [specialty, setSpecialty] = useState<ISpecialty[]>([]);
    const [shifts, setShifts] = useState<IShift[]>([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedShift, setSelectedShift] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { user } = useAuth();

    const steps = [
        { number: 1, title: 'Chọn Khoa', description: 'Chọn khoa y tế' },
        { number: 2, title: 'Chọn Bác Sĩ', description: 'Chọn bác sĩ bạn mong muốn' },
        { number: 3, title: 'Chọn Ngày & Giờ', description: 'Chọn lịch hẹn' },
        { number: 4, title: 'Xác Nhận Lịch Hẹn', description: 'Xem lại và xác nhận' }
    ];

    useEffect(() => {
        fetchDoctors()
        fetchSpecialties()
        fetchShifts()
    }, [])

    const fetchDoctors = async () => {
        try {
            const { data, error } = await supabase
                .from('doctor')
                .select(`
                   *,
                    specialty (* )
                `);
            if (error) throw error;
            console.log("doctor", data)
            setDoctors(data as unknown as IDoctor[]);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchSpecialties = async () => {
        try {
            const { data, error } = await supabase
                .from('specialty')
                .select(`
                    *
                `);
            if (error) throw error;
            console.log("specialty", data)
            setSpecialty(data as unknown as ISpecialty[]);
        } catch (error) {
            console.error('Error fetching specialties:', error);
        }
    };

    const fetchShifts = async () => {
        try {
            const { data, error } = await supabase
                .from('shift')
                .select(`
                    *
                `);
            console.log("shifts", data)
            if (error) throw error;
            setShifts(data as unknown as IShift[]);
        } catch (error) {
            console.error('Error fetching shifts:', error);
        }
    }

    const filteredDoctors = doctors.filter(doctor =>
        doctor.specialty_id === selectedDepartment
    );

    const selectedDoctorData = doctors.find(doctor => doctor.id === selectedDoctor);

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            setShowConfirmation(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleConfirmAppointment = async () => {
        try {
            const { error } = await supabase.from('appointment').insert([
                {
                    patient_id: user?.id,
                    doctor_id: selectedDoctor,
                    shift_id: shifts.find((shift) => shift.name === selectedShift)?.id,
                    appointment_date: selectedDate,
                    status: 'Pending',
                    notes: null,
                },
            ]);

            if (error) {
                console.error('Error booking appointment:', error);
                toast.error('Đặt lịch hẹn thất bại. Vui lòng thử lại.');
                return;
            }

            toast.success('Đặt lịch hẹn thành công!');
            setShowConfirmation(false);
            onPageChange('my-appointments');
        } catch (error) {
            console.error('Unexpected error booking appointment:', error);
            toast.error('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
        }
    };


    const canProceed = () => {
        switch (currentStep) {
            case 1: return selectedDepartment !== '';
            case 2: return selectedDoctor !== '';
            case 3: return selectedDate && selectedShift !== '';
            case 4: return true;
            default: return false;
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step.number <= currentStep
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 text-gray-400'
                        }`}>
                        {step.number}
                    </div>
                    <div className="ml-3 hidden sm:block">
                        <p className={`text-sm font-medium ${step.number <= currentStep ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                            {step.title}
                        </p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-4 ${step.number < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-4">
            <h2>Chọn Khoa</h2>
            <p className="text-muted-foreground">Chọn khoa y tế cho lịch hẹn của bạn</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialty.map((department) => (
                    <Card
                        key={department.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${selectedDepartment === department.id ? 'ring-2 ring-blue-600 bg-blue-50' : ''
                            }`}
                        onClick={() => setSelectedDepartment(department.id)}
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">{department.name}</CardTitle>
                                    <CardDescription>{department.description}</CardDescription>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <MapPin className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <h2>Chọn Bác Sĩ</h2>
            <p className="text-muted-foreground">Chọn bác sĩ bạn mong muốn từ {specialty.find(d => d.id === selectedDepartment)?.name}</p>

            <div className="grid grid-cols-1 gap-4">
                {filteredDoctors.map((doctor) => (
                    <Card
                        key={doctor.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${selectedDoctor === doctor.id ? 'ring-2 ring-blue-600 bg-blue-50' : ''
                            }`}
                        onClick={() => setSelectedDoctor(doctor.id)}
                    >
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{doctor.full_name}</CardTitle>
                                    <CardDescription>{doctor?.specialty?.name}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <h2>Chọn Ngày & Giờ</h2>
            <p className="text-muted-foreground">Chọn ngày và giờ cho lịch hẹn của bạn</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Chọn Ngày</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            className="rounded-md border"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Khung Giờ Hẹn Có Sẵn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedDate ? (
                            <RadioGroup value={selectedShift} onValueChange={setSelectedShift}>
                                <div className="space-y-3">
                                    {shifts.map((shift) => (
                                        <div key={shift.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={shift.name} id={shift.name} />
                                            <Label htmlFor={shift.name} className="flex items-center gap-2 cursor-pointer">
                                                <Clock className="h-4 w-4" />
                                                Ca {shift.name}
                                                <Badge variant="outline">Có Sẵn</Badge>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                        ) : (
                            <p className="text-muted-foreground">Vui lòng chọn ngày trước</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <h2>Xác Nhận Lịch Hẹn</h2>
            <p className="text-muted-foreground">Vui lòng xem lại chi tiết lịch hẹn trước khi xác nhận</p>

            <Card>
                <CardHeader>
                    <CardTitle>Tóm Tắt Lịch Hẹn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm text-muted-foreground">Khoa</Label>
                            <p className="font-medium">{specialty.find(d => d.id === selectedDepartment)?.name}</p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Bác Sĩ</Label>
                            <p className="font-medium">{selectedDoctorData?.full_name}</p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Ngày</Label>
                            <p className="font-medium">
                                {selectedDate?.toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Giờ</Label>
                            <p className="font-medium">Ca {selectedShift}</p>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <Label className="text-sm text-muted-foreground">Chuyên Khoa</Label>
                        <p className="font-medium">{selectedDoctorData?.specialty?.name}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1>Đặt Lịch Hẹn</h1>
                <p className="text-muted-foreground">Đặt lịch hẹn y tế của bạn trong vài bước đơn giản</p>
            </div>

            {renderStepIndicator()}

            <div className="min-h-96">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
            </div>

            <div className="flex justify-between mt-8">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Quay Lại
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {currentStep === 4 ? 'Đặt Lịch Hẹn' : 'Tiếp Tục'}
                    {currentStep < 4 && <ChevronRight className="h-4 w-4 ml-2" />}
                </Button>
            </div>

            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác Nhận Lịch Hẹn</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn đặt lịch hẹn này không?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-2">
                            <p><strong>Bác Sĩ:</strong> {selectedDoctorData?.full_name}</p>
                            <p><strong>Khoa:</strong> {specialty.find(d => d.id === selectedDepartment)?.name}</p>
                            <p><strong>Ngày:</strong> {selectedDate?.toLocaleDateString('vi-VN')}</p>
                            <p><strong>Giờ:</strong> Ca {selectedShift}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                            Hủy Bỏ
                        </Button>
                        <Button onClick={handleConfirmAppointment} className="bg-blue-600 hover:bg-blue-700">
                            Xác Nhận Đặt Lịch
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}