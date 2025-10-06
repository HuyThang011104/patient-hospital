import type { EquipmentStatus } from "@/types";

export interface IEquipment {
  id: number;
  name: string;
  quantity: number | null;
  location: string | null;
  status: EquipmentStatus; // ENUM('Available','In_Use','Maintenance')
}
