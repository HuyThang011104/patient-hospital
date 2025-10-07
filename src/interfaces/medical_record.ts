import type { IDoctor } from "./doctor";

export interface IMedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  diagnosis: string | null;
  treatment: string | null;
  record_date: Date; // datetime, có default là current_timestamp()
  doctor: IDoctor;
}
