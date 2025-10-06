import type { Gender, PatientStatus } from "@/types";

export interface IPatient {
  id: number;
  full_name: string;
  personal_id: string | null;
  password: string | null;
  phone: string | null;
  birth_date: Date | null; // date trong SQL
  gender: Gender; // ENUM('Male','Female','Other')
  status: PatientStatus; // ENUM('Active','Inactive')
  email: string | null;
  join_date: Date | null; // date trong SQL
  address: string | null;
}
