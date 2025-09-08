type Branch = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  is_active?: boolean;
  location?: string;
  created_at: string;
  updated_at: string;
};

declare type Employee = {
  id: number;
  name: string;
  email: string;
  phone: string;
  branch_id: number;
  total_paid: string;
  role: "staff" | string;
  status: "active" | "inactive" | string;
  branch: Branch;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  stats: {
    total_photos: number;
    total_customers: number;
  };
};

type UserRole = "staff" | "photographer" | "admin" | string;
type UserStatus = "active" | "inactive" | string;

declare type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

declare type PaginationMeta = {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
};

declare type PaginationLinks = {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
};

declare type PaginatedEmployees = {
  data: Employee[];
  links: PaginationLinks;
  meta: PaginationMeta;
  photographer_count: number;
};
declare type Photo = {
  id: number;
  photo: string;
  name: string;
  file_path: string;
  status: string;
  taken_by: Photographer;
  branch: Branch;
  metadata: string | Metadata;
  sync_status: string;
  created_at: string;
  updated_at: string;
};
