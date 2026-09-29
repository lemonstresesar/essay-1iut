import React, { useState, useEffect } from 'react';
import { AcademicRequest, RequestStatus, Language } from '../types';
import { getAllRequests, updateRequestStatus } from '../utils/storage';
import { DEPARTMENTS } from '../config/academicData';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Gavel,
  FileText,
  User,
  ExternalLink,
  Check,
  AlertCircle,
  X,
  Filter,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ValidatorConsoleProps {
  onSelectRequestForTracking: (code: string) => void;
  lang: Language;
}

export const ValidatorConsole: React.FC<ValidatorConsoleProps> = ({
  onSelectRequestForTracking,
  lang,
}) => {
  const [requests, setRequests] = useState<AcademicRequest[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | RequestStatus>('ALL');

  // Modal State
  const [activeModalRequest, setActiveModalRequest] = useState<AcademicRequest | null>(null);
  const [decisionType, setDecisionType] = useState<
    'valid_direct' | 'valid_instruction' | 'refusal' | 'redirect'
  >('refusal');
  const [decisionNote, setDecisionNote] = useState('');
  const [redirectService, setRedirectService] = useState('geii');

  const reloadRequests = () => {
    setRequests(getAllRequests());
  };

  useEffect(() => {
    reloadRequests();
  }, []);

  const openArbitrationModal = (req: AcademicRequest) => {
    setActiveModalRequest(req);
    setDecisionType('refusal');
    setDecisionNote(
      req.decisionNote ||
        'Note d’examen conforme au bordereau officiel d’émargement paraphé par le jury de délibération. Aucun rectificatif applicable sur le PV semestriel.'
    );
  };

  const closeArbitrationModal = () => {
    setActiveModalRequest(null);
  };

  const handleConfirmDecision = () => {
    if (!activeModalRequest) return;

    let targetStatus: RequestStatus = 'validee';
    let finalNote = decisionNote;

    if (decisionType === 'valid_direct') {
      targetStatus = 'validee';
      finalNote =
        'Dossier approuvé et validé sans réserve par le Chef de Scolarité. Téléchargement de l’acte certifié ouvert.';
    } else if (decisionType === 'valid_instruction') {
      targetStatus = 'validee';
      finalNote = decisionNote.trim() || 'Dossier validé avec instruction administrative.';
    } else if (decisionType === 'refusal') {
      targetStatus = 'refusee';
      finalNote = decisionNote.trim() || 'Demande non recevable : Motif administratif notifié.';
    } else if (decisionType === 'redirect') {
      targetStatus = 'en_cours';
      finalNote = `Dossier réorienté vers le service compétent (${redirectService}) pour instruction spécialisée.`;
    }

    updateRequestStatus(activeModalRequest.id, targetStatus, finalNote);
    reloadRequests();
    closeArbitrationModal();
  };

  // Filtered requests list
  const filteredList = requests.filter((r) => {
    if (selectedDept !== 'ALL' && !r.identity.filiere.includes(selectedDept)) {
      return false;
    }
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) {
      return false;
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchId = r.id.toLowerCase().includes(q);
      const matchMatricule = r.identity.matricule.toLowerCase().includes(q);
      const matchName = `${r.identity.nom} ${r.identity.prenom}`.toLowerCase().includes(q);
      const matchType = r.requestTypeTitle.toLowerCase().includes(q);
      return matchId || matchMatricule || matchName || matchType;
    }
    return true;
  });

  // Calculate statistics
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'en_cours').length;
  const validatedCount = requests.filter((r) => r.status === 'validee').length;
  const rejectedCount = requests.filter((r) => r.status === 'refusee').length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
                Session Académique 2024 / 2026
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono-matricule">
                IUT-DLA • Registre Central
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-[#0f2544]">
              Console d’Arbitrage & Validation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Espace réservé aux chefs de départements et à la Direction de la Scolarité (Dr. Samuel Tita).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#0f2544] text-white flex items-center justify-center font-bold text-xs">
                ST
              </div>
              <div className="text-left text-xs pr-2">
                <span className="font-bold text-slate-900 block leading-tight">Dr. Samuel Tita</span>
                <span className="text-slate-500 text-[11px]">Chef Service Scolarité</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase block">Total Requêtes</span>
            <span className="text-2xl font-bold text-[#0f2544] mt-1 block font-mono-matricule">
              {totalCount}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Dossiers centralisés</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <span className="text-xs font-bold text-amber-800 uppercase block">En attente</span>
            <span className="text-2xl font-bold text-amber-900 mt-1 block font-mono-matricule">
              {pendingCount}
            </span>
            <span className="text-[11px] text-amber-700 mt-1 block">Délai &lt; 48h à instruire</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 uppercase block">Validées</span>
            <span className="text-2xl font-bold text-emerald-900 mt-1 block font-mono-matricule">
              {validatedCount}
            </span>
            <span className="text-[11px] text-emerald-700 mt-1 block">Actes délivrés</span>
          </div>

          <div className="p-4 rounded-xl bg-red-50/60 border border-red-200">
            <span className="text-xs font-bold text-red-800 uppercase block">Refusées</span>
            <span className="text-2xl font-bold text-red-900 mt-1 block font-mono-matricule">
              {rejectedCount}
            </span>
            <span className="text-[11px] text-red-700 mt-1 block">Motif d’irrecevabilité</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrer par N° requête, matricule, nom étudiant..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-[#2563eb]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="ALL">Tous les départements</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.code} value={d.name}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="ALL">Tous statuts</option>
              <option value="en_cours">En attente ({pendingCount})</option>
              <option value="validee">Validée ({validatedCount})</option>
              <option value="refusee">Refusée ({rejectedCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">ID Requête</th>
                <th className="py-3.5 px-4">Étudiant & Matricule</th>
                <th className="py-3.5 px-4">Filière</th>
                <th className="py-3.5 px-4">Type de Requête</th>
                <th className="py-3.5 px-4">Date dépôt</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Action Administrative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredList.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono-matricule font-bold text-[#0f2544]">
                    #{req.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {req.identity.nom} {req.identity.prenom}
                      </span>
                      <span className="font-mono-matricule text-slate-500">
                        {req.identity.matricule} • {req.identity.classe}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {req.identity.filiere}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{req.requestTypeTitle}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono-matricule text-slate-500">
                    {req.createdAt}
                  </td>
                  <td className="py-3.5 px-4">
                    {req.status === 'validee' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Validée</span>
                      </span>
                    )}
                    {req.status === 'en_cours' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>En attente</span>
                      </span>
                    )}
                    {req.status === 'refusee' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold">
                        <XCircle className="w-3 h-3 text-red-600" />
                        <span>Refusée</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openArbitrationModal(req)}
                        className="px-3 py-1.5 rounded-lg bg-[#0f2544] hover:bg-[#2563eb] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Gavel className="w-3.5 h-3.5" />
                        <span>Arbitrer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectRequestForTracking(req.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#2563eb] hover:bg-slate-100 transition-colors"
                        title="Voir fiche étudiante"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ARBITRATION DECISION MODAL (Matching Mockup Image 7) */}
      {activeModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f2544]/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#0f2544] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2563eb] flex items-center justify-center text-white">
                  <Gavel className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#93c5fd]">
                      Décision d’arbitrage académique
                    </span>
                    <span className="font-mono-matricule text-xs bg-white/10 px-2 py-0.2 rounded text-white">
                      #{activeModalRequest.id}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {activeModalRequest.requestTypeTitle}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={closeArbitrationModal}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Snippet */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 text-sm block">
                  {activeModalRequest.identity.nom} {activeModalRequest.identity.prenom}
                </span>
                <span className="font-mono-matricule text-slate-500">
                  Matricule : {activeModalRequest.identity.matricule} • Filière :{' '}
                  {activeModalRequest.identity.filiere} ({activeModalRequest.identity.classe})
                </span>
              </div>
              <div className="text-right sm:shrink-0">
                <span className="text-slate-400 block font-semibold">Date de soumission :</span>
                <span className="font-bold text-slate-700">{activeModalRequest.createdAt}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* If specific appeal explanation exists */}
              {activeModalRequest.specificDetails && (
                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1">
                  <span className="font-bold text-[#0f2544] block">Motif allégué par l’étudiant :</span>
                  <p className="italic text-slate-700 leading-relaxed">
                    « {activeModalRequest.specificDetails.explanation} »
                  </p>
                </div>
              )}

              {/* 4 Decision Tabs */}
              <div>
                <label className="font-bold text-slate-800 text-xs block mb-2">
                  Sélectionnez la Décision Administrative :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecisionType('valid_direct')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      decisionType === 'valid_direct'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <span>Valider direct</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecisionType('valid_instruction')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      decisionType === 'valid_instruction'
                        ? 'border-[#2563eb] bg-blue-50 text-[#0f2544] font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1 text-[#2563eb]" />
                    <span>Avec instruction</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecisionType('refusal')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      decisionType === 'refusal'
                        ? 'border-red-600 bg-red-50 text-red-900 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <XCircle className="w-5 h-5 mx-auto mb-1 text-red-600" />
                    <span>Refuser requête</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecisionType('redirect')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      decisionType === 'redirect'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <RotateCcw className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                    <span>Transférer</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Note Field */}
              {(decisionType === 'valid_instruction' || decisionType === 'refusal') && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs flex items-center justify-between">
                    <span>
                      {decisionType === 'refusal'
                        ? 'Motif obligatoire du refus (Transmis officiellement à l’étudiant) :'
                        : 'Instruction spécifique pour le secrétariat ou l’étudiant :'}
                    </span>
                    <span className="text-slate-400 font-normal">Requis archivage légal</span>
                  </label>
                  <textarea
                    rows={3}
                    value={decisionNote}
                    onChange={(e) => setDecisionNote(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:ring-2 focus:ring-[#2563eb]/20 leading-relaxed"
                  />

                  {/* Frequent Reason Chips */}
                  {decisionType === 'refusal' && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-slate-400 text-[11px]">Motifs fréquents :</span>
                      {[
                        'Bordereau conforme aux notes du jury',
                        'Quittance des droits universitaires non valide',
                        'Délai de recours réglementaire dépassé (7 jours)',
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setDecisionNote(chip)}
                          className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {decisionType === 'redirect' && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs block">
                    Transférer vers le département / service compétent :
                  </label>
                  <select
                    value={redirectService}
                    onChange={(e) => setRedirectService(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium outline-none"
                  >
                    <option value="Chef Dépt. GEII">Département GEII (Chef de Département)</option>
                    <option value="Chef Dépt. GMP">Département GMP (Chef de Département)</option>
                    <option value="Agence Comptable Centrale">Agence Comptable (Droits universitaires)</option>
                    <option value="Décanat / Direction IUT">Direction de l’IUT Douala</option>
                  </select>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Validateur : <strong>Dr. Samuel TITA</strong> (Horodaté auto)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeArbitrationModal}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDecision}
                  className="px-5 py-2 rounded-xl bg-[#0f2544] hover:bg-[#2563eb] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Confirmer la décision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
