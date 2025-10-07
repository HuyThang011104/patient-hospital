import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ChevronLeft, ChevronRight, Clock, User, MapPin } from 'lucide-react';
import { mockDepartments, mockDoctors } from '@/utils/mock/mock-data';
import { toast } from 'sonner';

interface BookAppointmentProps {
    onPageChange: (page: string) => void;
}

export function BookAppointment({ onPageChange }: BookAppointmentProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedShift, setSelectedShift] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const steps = [
        { number: 1, title: 'Select Department', description: 'Choose medical department' },
        { number: 2, title: 'Select Doctor', description: 'Pick your preferred doctor' },
        { number: 3, title: 'Choose Date & Time', description: 'Select appointment slot' },
        { number: 4, title: 'Confirm Appointment', description: 'Review and confirm' }
    ];

    const filteredDoctors = mockDoctors.filter(doctor =>
        doctor.department_id === selectedDepartment
    );

    const selectedDoctorData = mockDoctors.find(doctor => doctor.id === selectedDoctor);

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

    const handleConfirmAppointment = () => {
        // In a real app, this would call an API
        toast.success('Appointment booked successfully!');
        setShowConfirmation(false);
        onPageChange('my-appointments');
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
            <h2>Select Department</h2>
            <p className="text-muted-foreground">Choose the medical department for your appointment</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockDepartments.map((department) => (
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
            <h2>Select Doctor</h2>
            <p className="text-muted-foreground">Choose your preferred doctor from {mockDepartments.find(d => d.id === selectedDepartment)?.name}</p>

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
                                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                                    <CardDescription>{doctor.specialty_name}</CardDescription>
                                    <div className="flex gap-2 mt-2">
                                        {doctor.availability.map((shift) => (
                                            <Badge key={shift} variant="secondary" className="text-xs">
                                                {shift}
                                            </Badge>
                                        ))}
                                    </div>
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
            <h2>Choose Date & Time</h2>
            <p className="text-muted-foreground">Select your preferred appointment date and time slot</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Select Date</CardTitle>
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
                        <CardTitle className="text-lg">Available Time Slots</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedDate ? (
                            <RadioGroup value={selectedShift} onValueChange={setSelectedShift}>
                                <div className="space-y-3">
                                    {selectedDoctorData?.availability.map((shift) => (
                                        <div key={shift} className="flex items-center space-x-2">
                                            <RadioGroupItem value={shift} id={shift} />
                                            <Label htmlFor={shift} className="flex items-center gap-2 cursor-pointer">
                                                <Clock className="h-4 w-4" />
                                                {shift} Shift
                                                <Badge variant="outline">Available</Badge>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                        ) : (
                            <p className="text-muted-foreground">Please select a date first</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <h2>Confirm Appointment</h2>
            <p className="text-muted-foreground">Please review your appointment details before confirming</p>

            <Card>
                <CardHeader>
                    <CardTitle>Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm text-muted-foreground">Department</Label>
                            <p className="font-medium">{mockDepartments.find(d => d.id === selectedDepartment)?.name}</p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Doctor</Label>
                            <p className="font-medium">{selectedDoctorData?.name}</p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Date</Label>
                            <p className="font-medium">
                                {selectedDate?.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Time</Label>
                            <p className="font-medium">{selectedShift} Shift</p>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <Label className="text-sm text-muted-foreground">Specialty</Label>
                        <p className="font-medium">{selectedDoctorData?.specialty_name}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1>Book Appointment</h1>
                <p className="text-muted-foreground">Schedule your medical appointment in a few simple steps</p>
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
                    Back
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {currentStep === 4 ? 'Book Appointment' : 'Next'}
                    {currentStep < 4 && <ChevronRight className="h-4 w-4 ml-2" />}
                </Button>
            </div>

            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Appointment</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to book this appointment?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-2">
                            <p><strong>Doctor:</strong> {selectedDoctorData?.name}</p>
                            <p><strong>Department:</strong> {mockDepartments.find(d => d.id === selectedDepartment)?.name}</p>
                            <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {selectedShift} Shift</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmAppointment} className="bg-blue-600 hover:bg-blue-700">
                            Confirm Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}