export interface ILabTest {
  id: string;
  examination_id: string;
  test_type: string;
  result: string | null;
  test_date: Date; // datetime, có default là current_timestamp()
  price: number;
}
