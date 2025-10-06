import type { DoctorRole, DoctorStatus, Gender } from "@/types";
import type { ISpecialty } from "./specialty";

export interface IDoctor {
  id: number;
  specialty_id: number;
  full_name: string;
  username: string;
  password: string;
  phone: string | null;
  birth_date: Date | null; // date trong SQL
  gender: Gender; // ENUM('Male','Female','Other')
  status: DoctorStatus; // ENUM('Active','Inactive','On_Leave')
  email: string | null;
  join_date: Date | null | ""; // date trong SQL
  role: DoctorRole; // ENUM('Admin','Doctor','Staff')
  address: string | null;
  specialty: ISpecialty | null;
}
