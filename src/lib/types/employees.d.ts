declare type CreateBranchManagerResponse = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  branch_id: string;
  createdAt: string;
  updatedAt: string;
};

declare type CreateBranchManagerBody = {
  name: string;
  email: string;
  phone: string;
  password: string;
  branch_id: string;
  role?: string;
  status?: string;
};
declare type CreateBranchBody = {
  name: string;
  location: string;
};

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

declare type PhGrapher = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  branch_id: number;
  role: UserRole;
  status: UserStatus;
  branch: Branch;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

declare type CreatePhotographerBody = {
  name: string;
  email?: string;
  password?: string;
};

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

declare type PaginatedPhGraphers = {
  data: PhGrapher[];
  links: PaginationLinks;
  meta: PaginationMeta;
  photographer_count: number;
};

declare type Client = {
  id: number;
  barcode: string;
  phone_number: string;
  branch_id: number;
  last_visit: string;
  created_at: string;
  updated_at: string;
};
