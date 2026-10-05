export interface ApiResponse<T> {
  statusCode?: number;
  StatusCode?: number;
  success?: boolean;
  Success?: boolean;
  message?: string;
  Message?: string;
  errorCode?: string | null;
  ErrorCode?: string | null;
  data?: T | null;
  Data?: T | null;
  errors?: string[] | null;
  Errors?: string[] | null;
  traceId?: string | null;
  TraceId?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
