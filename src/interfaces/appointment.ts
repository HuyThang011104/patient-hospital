import type { AppointmentStatus } from "@/types";

export interface IAppointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: Date; // datetime trong SQL
  shift_id: number | null;
  status: AppointmentStatus; // ENUM('Pending','Completed','Cancelled')
  notes: string | null;
}
