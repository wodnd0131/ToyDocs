export * from './Meeting.types';
export * from './Issue.types';
export * from './User.types';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProcessingResult {
  success: boolean;
  data?: unknown;
  error?: string;
  processingTime: number;
}