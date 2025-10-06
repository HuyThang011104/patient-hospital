import type { BedStatus } from "@/types";

export interface IBed {
  id: number;
  room_id: number;
  bed_number: string;
  status: BedStatus; // ENUM('Available','Occupied','Maintenance')
}
