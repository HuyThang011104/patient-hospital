import type { WorkScheduleStatus } from "@/types";

export interface IDoctorWorkSchedule {
  id: number;
  doctor_id: number;
  shift_id: number;
  room_id: number;
  work_date: Date; // date trong SQL
  status: WorkScheduleStatus; // ENUM('Scheduled','Completed','Cancelled')
}
