import type { AppointmentStatus } from "@/types";
import type { IDoctor } from "./doctor";
import type { IShift } from "./shift";
import type { IPatient } from "./patient";

export interface IAppointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: Date; // datetime trong SQL
  shift_id: number | null;
  status: AppointmentStatus; // ENUM('Pending','Completed','Cancelled')
  notes: string | null;
  doctor: IDoctor;
  shift: IShift;
  patient: IPatient;
}
