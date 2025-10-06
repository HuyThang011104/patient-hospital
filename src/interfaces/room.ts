import type { RoomType } from "@/types";

export interface IRoom {
  id: number;
  department_id: number;
  name: string;
  type: RoomType; // ENUM('Normal','ICU','Operating','Emergency')
  floor: string | null;
}
