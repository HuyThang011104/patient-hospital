import type { IMedicalRecord } from "./medical_record";
import type { IMedicine } from "./medicine";

export interface IPrescription {
  id: string;
  medical_record_id: string;
  medicine_id: string;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  medical_record: IMedicalRecord;
  medicine: IMedicine;
}
