import type { WorkScheduleStatus } from "@/types";
import type { IShift } from "./shift";
import type { IDoctor } from "./doctor";
import type { IRoom } from "./room";

export interface IDoctorWorkSchedule {
  id: string;
  doctor_id: string;
  shift_id: string;
  room_id: string;
  work_date: Date; // date trong SQL
  status: WorkScheduleStatus; // ENUM('Scheduled','Completed','Cancelled')
  shift: IShift;
  doctor: IDoctor;
  room: IRoom[];
}
