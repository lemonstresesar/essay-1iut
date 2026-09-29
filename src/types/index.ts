export type Language = 'FR' | 'EN';

export interface StudentIdentity {
  nom: string;
  prenom: string;
  matricule: string;
  filiere: string;
  classe: string;
  telephone: string;
  email: string;
}

export interface RequiredDocumentConfig {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFormats: string[]; // e.g. ['pdf', 'jpg', 'png']
  maxSizeMb: number;
}

export interface RequestTypeConfig {
  id: string;
  title: string;
  titleEn: string;
  code: string;
  description: string;
  descriptionEn: string;
  iconName: string;
  badge: string;
  estimatedDelayDays: string;
  requiredDocuments: RequiredDocumentConfig[];
  hasSpecificFields?: boolean;
}

export interface SpecificAppealDetails {
  semester: string;
  course: string;
  teacher: string;
  currentGrade?: string;
  expectedGrade?: string;
  explanation: string;
}

export interface UploadedFileItem {
  docConfigId: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  fileDataUrl?: string;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
}

export type RequestStatus = 'en_cours' | 'validee' | 'refusee' | 'en_instruction';

export interface AcademicRequest {
  id: string; // e.g. REQ-2026-0047
  reference: string; // e.g. UD/IUT/SCOL/2026/T4-088
  createdAt: string; // ISO or formatted date
  updatedAt: string;
  identity: StudentIdentity;
  requestTypeId: string;
  requestTypeTitle: string;
  specificDetails?: SpecificAppealDetails;
  documents: {
    docConfigId: string;
    docName: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  }[];
  status: RequestStatus;
  assignedValidator: string;
  validatorTitle: string;
  processingTimeHours: number;
  decisionNote?: string;
  decisionDate?: string;
  verificationCode: string;
  physicalLocation: string;
  deliveryAvailable: boolean;
}
