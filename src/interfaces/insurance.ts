export interface IInsurance {
  id: number;
  patient_id: number;
  provider_name: string | null;
  policy_number: string | null;
  valid_from: Date | null; // date trong SQL
  valid_to: Date | null; // date trong SQL
}
