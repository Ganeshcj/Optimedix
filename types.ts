
export type Role = 'NURSE' | 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: Role;
  clinicName?: string;
  district?: string;
  state?: string;
}

export enum DiseaseType {
  NORMAL = 'Normal',
  DR = 'Diabetic Retinopathy',
  GLAUCOMA = 'Glaucoma',
  CATARACT = 'Cataract',
  AMD = 'Age-related Macular Degeneration'
}

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface ScreeningResult {
  id: string;
  patientId: string;
  date: string;
  disease: DiseaseType;
  severity: Severity;
  riskScore: number;
  confidenceScore: number;
  abnormalities: string;
  leftEyeImage?: string;
  rightEyeImage?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  diabetesHistory: boolean;
  bloodSugar?: string;
  registeredDate: string;
  lastScreeningDate?: string;
}

export interface AppState {
  currentUser: User | null;
  patients: Patient[];
  results: ScreeningResult[];
  language: 'EN' | 'HI';
}
