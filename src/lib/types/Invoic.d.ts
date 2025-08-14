declare type TInvoice = {
  id: number;
  barcode_prefix: string;
  num_photos: number;
  amount: string;
  tax_rate: string;
  tax_amount: string;
  total_amount: string;
  invoice_method: string;
  status: string;
  created_at: string;
  user: TUser;
  branch: Tbransh;
  staff: TStaff;
};
declare type TOrders = {
  id: number;
  barcode_prefix: string;
  total_price: string;
  status: string;
  phone_number: string;
  photos_count: string;
  type: string;
};
declare type TOrdersRespnse = {
  data: TOrders[];
};
