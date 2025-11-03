export interface User {
  id: number;
  name: string;
  code: string;
  expiryDate: string; // Format: "DD/MM/YYYY"
}

export interface Service {
  name: string;
  keyData: string | null; // Will store the full JSON string
  status: 'available' | 'coming_soon';
  gradient: string;
  glowColor: string; // e.g., '52, 211, 153' for green-400
  url?: string;
}