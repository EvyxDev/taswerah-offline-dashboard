declare type TShift = {
  id: number;
  branch_id: number;
  name: string;
  from: string; // HH:mm or HH:mm:ss
  to: string; // HH:mm or HH:mm:ss
  created_at: string;
  updated_at: string;
};

declare type TCreateShiftBody = {
  name: string;
  from: string; // HH:mm
  to: string; // HH:mm
};

declare type TUpdateShiftBody = Partial<TCreateShiftBody>;
