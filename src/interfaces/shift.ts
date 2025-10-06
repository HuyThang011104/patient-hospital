export interface IShift {
  id: number;
  name: string;
  start_time: string; // time trong SQL, thường được biểu diễn bằng string 'HH:MM:SS'
  end_time: string; // time trong SQL, thường được biểu diễn bằng string 'HH:MM:SS'
}
