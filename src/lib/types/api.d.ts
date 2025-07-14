// api.d.ts
declare type DatabaseProperies = {
  _id: string;
  createdAt: string;
};

// Type for pagination links
declare type PaginationLinks = {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
};

declare type PaginationMeta = {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
};

declare type SuccessfulResponse<T> = {
  success: true;
  message: string;
  data: T;
};

declare type ErrorResponse = {
  success: boolean;
  message: string;
};

declare type APIResponse<T> = SuccessfulResponse<T> | ErrorResponse;
