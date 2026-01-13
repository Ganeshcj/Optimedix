
export type Role = 'NURSE' | 'DOCTOR' | 'PATIENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  password?: string;
  role: Role;
  clinicName?: string;
  district?: string;
  state?: string;
  specialization?: string; // For Doctors
  hospitalId?: string; // For Staff
}

export enum DiseaseType {
  NORMAL = 'Normal',
  MILD_DR = 'Mild Diabetic Retinopathy',
  SEVERE_DR = 'Severe Diabetic Retinopathy',
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

export interface EyeAnalysis {
  disease: DiseaseType;
  severity: Severity;
  riskScore: number;
  confidenceScore: number;
  abnormalities: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  medications: { name: string; dosage: string; frequency: string }[];
  followUp: string;
  notes: string;
}

export interface ScreeningResult {
  id: string;
  patientId: string;
  nurseId: string;
  date: string;
  leftEye?: EyeAnalysis;
  rightEye?: EyeAnalysis;
  leftEyeImage?: string;
  rightEyeImage?: string;
  referredToDoctorId?: string;
  status: 'PENDING' | 'REFERRED' | 'REVIEWED';
}

export interface Patient extends User {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diabetesHistory: boolean;
  bloodSugar?: string;
  bp?: string;
  registeredDate: string;
  assignedNurseId?: string;
}
