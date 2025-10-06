export interface ICertificate {
  id: number;
  doctor_id: number;
  name: string;
  issued_by: string | null;
  issue_date: Date | null;
  expiry_date: Date | null;
}
