import type { Gender } from "@/types";

// Database table types
export interface Patient {
  id: string;
  full_name: string;
  personal_id: string;
  birth_date: string;
  gender: Gender;
  phone: string;
  address: string;
  email: string;
  insurance_provider?: string;
  policy_number?: string;
  insurance_validity?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty_id: string;
  specialty_name: string;
  department_id: string;
  department_name: string;
  photo?: string;
  availability: string[];
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface Specialty {
  id: string;
  name: string;
  department_id: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  department_name: string;
  date: string;
  shift: "Morning" | "Afternoon" | "Evening";
  status: "Pending" | "Completed" | "Cancelled";
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  appointment_id: string;
  visit_date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  medical_record_id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctor_name: string;
  date: string;
}

export interface LabTest {
  id: string;
  medical_record_id: string;
  test_type: string;
  result: string;
  date: string;
  normal_range?: string;
}

export interface Payment {
  id: string;
  patient_id: string;
  amount: number;
  date: string;
  method: "Cash" | "Card" | "Insurance";
  status: "Pending" | "Paid" | "Cancelled";
  appointment_id?: string;
  description: string;
}
