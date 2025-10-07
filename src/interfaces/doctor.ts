import type { DoctorRole, DoctorStatus, Gender } from "@/types";
import type { ISpecialty } from "./specialty";

export interface IDoctor {
  id: string;
  specialty_id: string;
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
