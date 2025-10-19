export interface Examination {
  id: number;
  medical_record_id: number;
  examination_type: string;
  details: string | null; // Sử dụng null vì trường TEXT có thể không bắt buộc hoặc rỗng
  examination_date: Date;
}
