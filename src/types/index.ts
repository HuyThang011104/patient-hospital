// Định nghĩa các kiểu dữ liệu Enum (Tùy chọn, dựa trên các ENUM trong SQL)

/**
 * Trạng thái của một cuộc hẹn.
 */
export type AppointmentStatus = "Pending" | "Completed" | "Cancelled";

/**
 * Trạng thái của một giường bệnh.
 */
export type BedStatus = "Available" | "Occupied" | "Maintenance";

/**
 * Giới tính.
 */
export type Gender = "Male" | "Female" | "Other";

/**
 * Trạng thái làm việc của bác sĩ/nhân viên.
 */
export type DoctorStatus = "Active" | "Inactive" | "On_Leave";

/**
 * Vai trò của người dùng (Bác sĩ).
 */
export type DoctorRole = "Admin" | "Doctor" | "Staff";

/**
 * Trạng thái của lịch làm việc.
 */
export type WorkScheduleStatus = "Scheduled" | "Completed" | "Cancelled";

/**
 * Trạng thái của yêu cầu nghỉ phép.
 */
export type LeaveRequestStatus = "Pending" | "Approved" | "Rejected";

/**
 * Trạng thái của bệnh nhân.
 */
export type PatientStatus = "Active" | "Inactive";

/**
 * Phương thức thanh toán.
 */
export type PaymentMethod = "Cash" | "Card" | "Insurance";

/**
 * Trạng thái thanh toán.
 */
export type PaymentStatus = "Pending" | "Paid" | "Cancelled";

/**
 * Loại phòng bệnh.
 */
export type RoomType = "Normal" | "ICU" | "Operating" | "Emergency";

/**
 * Trạng thái của thiết bị.
 */
export type EquipmentStatus = "Available" | "In_Use" | "Maintenance";
