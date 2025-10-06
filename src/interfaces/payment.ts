import type { PaymentMethod, PaymentStatus } from "@/types";

export interface IPayment {
  id: number;
  patient_id: number;
  amount: number; // decimal(12,2)
  payment_date: Date | null; // datetime, có default là current_timestamp()
  method: PaymentMethod; // ENUM('Cash','Card','Insurance')
  status: PaymentStatus; // ENUM('Pending','Paid','Cancelled')
}
