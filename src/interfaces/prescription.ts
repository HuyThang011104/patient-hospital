export interface IPrescription {
  id: number;
  medical_record_id: number;
  medicine_id: number;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
}
