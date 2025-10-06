import type { LeaveRequestStatus } from "@/types";

export interface ILeaveRequest {
  id: number;
  doctor_id: number;
  request_date: Date; // date trong SQL
  start_date: Date; // date trong SQL
  end_date: Date; // date trong SQL
  reason: string | null;
  status: LeaveRequestStatus; // ENUM('Pending','Approved','Rejected')
}
