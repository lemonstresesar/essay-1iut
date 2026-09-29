import { AcademicRequest, RequestStatus } from '../types';
import { INITIAL_MOCK_REQUESTS } from '../config/academicData';

const STORAGE_KEY = 'requete_iut_requests_v1';

export function getAllRequests(): AcademicRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REQUESTS));
      return INITIAL_MOCK_REQUESTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REQUESTS));
      return INITIAL_MOCK_REQUESTS;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading localStorage for requests:', e);
    return INITIAL_MOCK_REQUESTS;
  }
}

export function saveRequest(request: AcademicRequest): void {
  try {
    const existing = getAllRequests();
    // Add to the beginning
    const updated = [request, ...existing.filter((r) => r.id !== request.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving request to localStorage:', e);
  }
}

export function findRequestByIdOrQuery(query: string): AcademicRequest | null {
  if (!query || !query.trim()) return null;
  const clean = query.trim().toUpperCase().replace('#', '');
  const requests = getAllRequests();

  return (
    requests.find((r) => {
      const idMatch = r.id.toUpperCase().replace('#', '') === clean;
      const refMatch = r.reference.toUpperCase().includes(clean);
      const matriculeMatch = r.identity.matricule.toUpperCase() === clean;
      const nameMatch = `${r.identity.nom} ${r.identity.prenom}`.toUpperCase().includes(clean);
      return idMatch || refMatch || matriculeMatch || nameMatch;
    }) || null
  );
}

export function updateRequestStatus(
  id: string,
  newStatus: RequestStatus,
  decisionNote?: string
): AcademicRequest | null {
  try {
    const requests = getAllRequests();
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const current = requests[index];
    const updated: AcademicRequest = {
      ...current,
      status: newStatus,
      decisionNote: decisionNote ?? current.decisionNote,
      decisionDate: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      deliveryAvailable: newStatus === 'validee',
      updatedAt: 'À l’instant',
    };

    requests[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    return updated;
  } catch (e) {
    console.error('Error updating request status:', e);
    return null;
  }
}

export function generateTrackingCode(): string {
  // Format REQ-2026-XXXX (4 random digits)
  const random4 = Math.floor(1000 + Math.random() * 9000);
  return `REQ-2026-${random4}`;
}

export function generateOfficialReference(): string {
  const random3 = Math.floor(100 + Math.random() * 900);
  return `UD/IUT/SCOL/2026/T${Math.floor(1 + Math.random() * 4)}-${random3}`;
}

export function generateVerificationKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `IUT-VERIF-${Math.floor(1000 + Math.random() * 9000)}-${rand.charAt(0)}`;
}

export function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
