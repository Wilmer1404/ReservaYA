export interface AuthResponse {
  token: string;
  userRole: 'ADMIN' | 'USER';
  institutionId: number;
  userId: number;
  userName: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  institutionName: string;
  institutionType: string;
  institutionEmailDomain?: string;
  adminName: string;
  adminEmail: string;
  adminPassword?: string;
}
