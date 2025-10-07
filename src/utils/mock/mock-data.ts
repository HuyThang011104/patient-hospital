import type {
  Patient,
  Doctor,
  Department,
  Appointment,
  MedicalRecord,
  Prescription,
  LabTest,
  Payment,
} from "@/interfaces/index";

// Mock patient data
export const mockPatient: Patient = {
  id: "1",
  full_name: "John Smith",
  personal_id: "ID123456789",
  birth_date: "1985-06-15",
  gender: "Male",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, Springfield, IL 62701",
  email: "john.smith@email.com",
  insurance_provider: "Blue Cross Blue Shield",
  policy_number: "BC12345678",
  insurance_validity: "2025-12-31",
};

// Mock departments
export const mockDepartments: Department[] = [
  { id: "1", name: "Cardiology", description: "Heart and cardiovascular care" },
  { id: "2", name: "Neurology", description: "Brain and nervous system care" },
  { id: "3", name: "Orthopedics", description: "Bone and joint care" },
  { id: "4", name: "Dermatology", description: "Skin and hair care" },
  { id: "5", name: "Pediatrics", description: "Children's healthcare" },
  { id: "6", name: "Internal Medicine", description: "General adult care" },
];

// Mock doctors
export const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty_id: "1",
    specialty_name: "Cardiologist",
    department_id: "1",
    department_name: "Cardiology",
    availability: ["Morning", "Afternoon"],
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty_id: "2",
    specialty_name: "Neurologist",
    department_id: "2",
    department_name: "Neurology",
    availability: ["Morning", "Evening"],
  },
  {
    id: "3",
    name: "Dr. Emily Davis",
    specialty_id: "3",
    specialty_name: "Orthopedic Surgeon",
    department_id: "3",
    department_name: "Orthopedics",
    availability: ["Afternoon", "Evening"],
  },
  {
    id: "4",
    name: "Dr. Robert Wilson",
    specialty_id: "4",
    specialty_name: "Dermatologist",
    department_id: "4",
    department_name: "Dermatology",
    availability: ["Morning", "Afternoon", "Evening"],
  },
  {
    id: "5",
    name: "Dr. Lisa Brown",
    specialty_id: "5",
    specialty_name: "Pediatrician",
    department_id: "5",
    department_name: "Pediatrics",
    availability: ["Morning", "Afternoon"],
  },
];

// Mock appointments
export const mockAppointments: Appointment[] = [
  {
    id: "1",
    patient_id: "1",
    doctor_id: "1",
    doctor_name: "Dr. Sarah Johnson",
    department_name: "Cardiology",
    date: "2025-10-15",
    shift: "Morning",
    status: "Pending",
    notes: "Regular checkup",
  },
  {
    id: "2",
    patient_id: "1",
    doctor_id: "2",
    doctor_name: "Dr. Michael Chen",
    department_name: "Neurology",
    date: "2025-09-20",
    shift: "Afternoon",
    status: "Completed",
    notes: "Headache consultation",
  },
  {
    id: "3",
    patient_id: "1",
    doctor_id: "4",
    doctor_name: "Dr. Robert Wilson",
    department_name: "Dermatology",
    date: "2025-08-10",
    shift: "Morning",
    status: "Completed",
    notes: "Skin examination",
  },
];

// Mock medical records
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: "1",
    patient_id: "1",
    doctor_id: "2",
    doctor_name: "Dr. Michael Chen",
    appointment_id: "2",
    visit_date: "2025-09-20",
    diagnosis: "Tension headache",
    treatment: "Prescribed pain medication and lifestyle changes",
    notes: "Patient reports improvement with stress management",
  },
  {
    id: "2",
    patient_id: "1",
    doctor_id: "4",
    doctor_name: "Dr. Robert Wilson",
    appointment_id: "3",
    visit_date: "2025-08-10",
    diagnosis: "Mild eczema",
    treatment: "Topical corticosteroid cream, moisturizer routine",
    notes: "Follow up in 4 weeks if no improvement",
  },
];

// Mock prescriptions
export const mockPrescriptions: Prescription[] = [
  {
    id: "1",
    medical_record_id: "1",
    medicine_name: "Ibuprofen 400mg",
    dosage: "400mg",
    frequency: "Twice daily",
    duration: "7 days",
    doctor_name: "Dr. Michael Chen",
    date: "2025-09-20",
  },
  {
    id: "2",
    medical_record_id: "2",
    medicine_name: "Hydrocortisone Cream 1%",
    dosage: "Apply thin layer",
    frequency: "Twice daily",
    duration: "14 days",
    doctor_name: "Dr. Robert Wilson",
    date: "2025-08-10",
  },
];

// Mock lab tests
export const mockLabTests: LabTest[] = [
  {
    id: "1",
    medical_record_id: "1",
    test_type: "Blood Pressure",
    result: "120/80 mmHg",
    date: "2025-09-20",
    normal_range: "90-120/60-80 mmHg",
  },
  {
    id: "2",
    medical_record_id: "2",
    test_type: "Skin Patch Test",
    result: "Negative for common allergens",
    date: "2025-08-10",
  },
];

// Mock payments
export const mockPayments: Payment[] = [
  {
    id: "1",
    patient_id: "1",
    amount: 150.0,
    date: "2025-09-20",
    method: "Insurance",
    status: "Paid",
    appointment_id: "2",
    description: "Neurology consultation",
  },
  {
    id: "2",
    patient_id: "1",
    amount: 200.0,
    date: "2025-08-10",
    method: "Card",
    status: "Paid",
    appointment_id: "3",
    description: "Dermatology consultation",
  },
  {
    id: "3",
    patient_id: "1",
    amount: 175.0,
    date: "2025-10-15",
    method: "Insurance",
    status: "Pending",
    appointment_id: "1",
    description: "Cardiology consultation",
  },
];
