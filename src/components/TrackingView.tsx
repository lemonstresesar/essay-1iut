import React, { useState, useEffect } from 'react';
import { AcademicRequest, RequestStatus, Language } from '../types';
import {
  findRequestByIdOrQuery,
  updateRequestStatus,
  getAllRequests,
} from '../utils/storage';
import { t } from '../utils/translations';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  User,
  School,
  Calendar,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Download,
  Printer,
  Copy,
  Check,
  QrCode,
  AlertCircle,
  ArrowRight,
  FileCheck,
  Send,
  Building,
} from 'lucide-react';

interface TrackingViewProps {
  initialCode?: string;
  onNavigateSubmit: () => void;
  lang: Language;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  initialCode = '',
  onNavigateSubmit,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialCode);
  const [currentRequest, setCurrentRequest] = useState<AcademicRequest | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setSearchQuery(initialCode);
      const found = findRequestByIdOrQuery(initialCode);
      setCurrentRequest(found);
      setHasSearched(true);
    } else {
      // Default to the first found request for demo richness
      const requests = getAllRequests();
      if (requests.length > 0) {
        setCurrentRequest(requests[0]);
        setSearchQuery(requests[0].id);
        setHasSearched(true);
      }
    }
  }, [initialCode]);

  const handleSearch = (queryToUse?: string) => {
    const q = queryToUse !== undefined ? queryToUse : searchQuery;
    if (!q.trim()) return;
    const found = findRequestByIdOrQuery(q);
    setCurrentRequest(found);
    setHasSearched(true);
  };

  const handleSimulateStatus = (status: RequestStatus) => {
    if (!currentRequest) return;
    let note = currentRequest.decisionNote;
    if (status === 'validee') {
      note =
        '« Votre attestation ou acte officiel a été visé et validé avec succès par la commission académique. Vous pouvez télécharger l’exemplaire certifié ou vous présenter au Guichet 3 de la Scolarité avec votre carte d’étudiant physique. »';
    } else if (status === 'en_cours') {
      note =
        'Dossier en cours d’examen par le Chef de Département et le collège d’enseignants. Délai résiduel moyen estimé : 24 heures ouvrées.';
    } else if (status === 'refusee') {
      note =
        '« Demande non recevable : Pièce justificative manquante ou non conforme aux états comptables universitaires. Veuillez vous rapprocher du secrétariat ou renouveler la demande avec les justificatifs certifiés. »';
    }

    const updated = updateRequestStatus(currentRequest.id, status, note);
    if (updated) {
      setCurrentRequest(updated);
    }
  };

  const copyVerificationCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadOfficialPdf = () => {
    if (!currentRequest) return;
    const certText = `================================================================================
RÉPUBLIQUE DU CAMEROUN                   REPUBLIC OF CAMEROON
Paix - Travail - Patrie                 Peace - Work - Fatherland
--------------------------------------------------------------------------------
UNIVERSITÉ DE DOUALA                    UNIVERSITY OF DOUALA
INSTITUT UNIVERSITAIRE DE TECHNOLOGIE   UNIVERSITY INSTITUTE OF TECHNOLOGY
Direction de la Scolarité & des Diplômes Academic & Records Office
================================================================================
          ACTE OFFICIEL DÉMATÉRIALISÉ & CERTIFIÉ CONFORME
================================================================================
DOSSIER RÉFÉRENCE : ${currentRequest.id} (${currentRequest.reference})
ÉTUDIANT         : ${currentRequest.identity.nom} ${currentRequest.identity.prenom}
MATRICULE        : ${currentRequest.identity.matricule}
FILIÈRE          : ${currentRequest.identity.filiere} (${currentRequest.identity.classe})
OBJET DE L'ACTE  : ${currentRequest.requestTypeTitle}
STATUT           : ${currentRequest.status.toUpperCase()}
DÉCISION         : ${currentRequest.decisionNote || 'Approuvé sans réserve.'}
SIGNATAIRE       : ${currentRequest.assignedValidator} (${currentRequest.validatorTitle})
DATE VISA        : ${currentRequest.decisionDate || currentRequest.createdAt}
SCEAU NUMÉRIQUE  : SHA-256: d49a712e881bc391f9450a8b
CLÉ CONTRÔLE     : ${currentRequest.verificationCode}
================================================================================`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentRequest.requestTypeTitle.replace(/\s+/g, '_')}_${currentRequest.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Search & Controls Banner */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-[#0f2544]">
              {t(lang, 'trackPageTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t(lang, 'trackPageSubtitle')}
            </p>
          </div>

          {/* Interactive Demo State Switcher (As seen on mockup Image 3) */}
          {currentRequest && (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200 self-start md:self-auto">
              <span className="text-[11px] font-bold text-slate-500 uppercase px-2">
                {t(lang, 'trackSimulateTitle')}
              </span>
              <button
                type="button"
                onClick={() => handleSimulateStatus('validee')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentRequest.status === 'validee'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Validée
              </button>
              <button
                type="button"
                onClick={() => handleSimulateStatus('en_cours')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentRequest.status === 'en_cours'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                En cours
              </button>
              <button
                type="button"
                onClick={() => handleSimulateStatus('refusee')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentRequest.status === 'refusee'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Refusée
              </button>
            </div>
          )}
        </div>

        {/* Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(lang, 'trackInputPlaceholder')}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
            />
          </div>

          <button
            type="submit"
            className="h-12 px-6 rounded-xl bg-[#0f2544] hover:bg-[#2563eb] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <span>{t(lang, 'trackLookupBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
          <span>{lang === 'FR' ? 'Exemples rapides :' : 'Quick examples:'}</span>
          {['REQ-2024-0047', 'REQ-2024-0112', 'REQ-2024-0048', 'REQ-2024-0050', '21G00892'].map(
            (ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setSearchQuery(ex);
                  handleSearch(ex);
                }}
                className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0f2544] font-mono-matricule font-semibold transition-colors"
              >
                #{ex}
              </button>
            )
          )}
        </div>
      </div>

      {/* RESULT DISPLAY IF FOUND */}
      {currentRequest ? (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header Card with Identifiant & Status Badge */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-[#0f2544] via-[#2563eb] to-emerald-500" />
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Identifiant officiel du dossier
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
                  </div>
                  <div className="flex flex-wrap items-baseline gap-3 mt-1">
                    <h2 className="text-2xl sm:text-3xl font-bold font-mono-matricule text-[#0f2544]">
                      #{currentRequest.id}
                    </h2>
                    <span className="font-mono-matricule text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {currentRequest.reference}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {currentRequest.status === 'validee' && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-bold shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{t(lang, 'statusValidee')}</span>
                    </div>
                  )}
                  {currentRequest.status === 'en_cours' && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-sm font-bold shadow-xs">
                      <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                      <span>{t(lang, 'statusEnCours')}</span>
                    </div>
                  )}
                  {currentRequest.status === 'refusee' && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-800 border border-red-200 text-sm font-bold shadow-xs">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>{t(lang, 'statusRefusee')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata 6-column grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white text-[#2563eb] flex items-center justify-center shrink-0 border border-slate-200">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-semibold block">Date de soumission</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">{currentRequest.createdAt}</span>
                    <span className="text-slate-500">Heure du Cameroun</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white text-[#2563eb] flex items-center justify-center shrink-0 border border-slate-200">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-400 uppercase font-semibold block">Catégorie & Objet</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5 truncate">{currentRequest.requestTypeTitle}</span>
                    <span className="text-slate-500">Année académique en cours</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white text-[#2563eb] flex items-center justify-center shrink-0 border border-slate-200">
                    <School className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-400 uppercase font-semibold block">Département d’attache</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5 truncate">{currentRequest.identity.filiere}</span>
                    <span className="text-slate-500">{currentRequest.identity.classe} (Campus Ndogbong)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white text-[#2563eb] flex items-center justify-center shrink-0 border border-slate-200">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-400 uppercase font-semibold block">Étudiant demandeur</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5 truncate">
                      {currentRequest.identity.nom} {currentRequest.identity.prenom}
                    </span>
                    <span className="font-mono-matricule text-[#2563eb] font-bold">
                      Matricule : {currentRequest.identity.matricule}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white text-[#2563eb] flex items-center justify-center shrink-0 border border-slate-200">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-400 uppercase font-semibold block">Responsable assigné</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5 truncate">{currentRequest.assignedValidator}</span>
                    <span className="text-slate-500 truncate block">{currentRequest.validatorTitle}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white text-[#2563eb] flex items-center justify-center shrink-0 border border-slate-200">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-semibold block">Temps de traitement</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">{currentRequest.processingTimeHours} heures</span>
                    <span className="text-slate-500">Délais réglementaires : max 72h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Tracker Workflow: 4 Steps */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-[#0f2544]">
                  {t(lang, 'trackTimelineTitle')}
                </h3>
                <p className="text-xs text-slate-500">
                  Traçabilité horodatée conforme au protocole d’archivage numérique de l’Université de Douala
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Horodatage certifié RFC 3161</span>
              </div>
            </div>

            {/* 4 Steps timeline grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1: Déposée */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t(lang, 'trackStep1Name')}</p>
                    <span className="text-[11px] font-semibold text-emerald-700">{currentRequest.createdAt}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Téléversement reçu et quittance de scolarité archivée.
                </p>
              </div>

              {/* Step 2: En cours d'examen */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  currentRequest.status !== 'en_cours'
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-300/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentRequest.status === 'validee'
                        ? 'bg-emerald-600 text-white'
                        : currentRequest.status === 'refusee'
                        ? 'bg-slate-400 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {currentRequest.status === 'validee' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Clock className="w-4 h-4 animate-spin" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t(lang, 'trackStep2Name')}</p>
                    <span className="text-[11px] font-semibold text-slate-600">Décanat IUT</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Contrôle académique & conformité au Décanat IUT.
                </p>
              </div>

              {/* Step 3: Traitée & Validée */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  currentRequest.status === 'validee'
                    ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-400/20'
                    : currentRequest.status === 'refusee'
                    ? 'bg-red-50/60 border-red-200'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentRequest.status === 'validee'
                        ? 'bg-emerald-600 text-white'
                        : currentRequest.status === 'refusee'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {currentRequest.status === 'validee' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : currentRequest.status === 'refusee' ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      '3'
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {currentRequest.status === 'refusee' ? '3. Rejetée' : t(lang, 'trackStep3Name')}
                    </p>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {currentRequest.decisionDate || 'En attente'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {currentRequest.status === 'validee'
                    ? 'Signature certifiée apposée par le Chef de Division.'
                    : currentRequest.status === 'refusee'
                    ? 'Dossier rejeté avec notification des motifs.'
                    : 'Arbitrage formel et notification d’avis.'}
                </p>
              </div>

              {/* Step 4: Retrait / Délivrance */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  currentRequest.status === 'validee'
                    ? 'bg-blue-50/60 border-blue-200'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentRequest.status === 'validee'
                        ? 'bg-[#0f2544] text-white shadow-sm'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t(lang, 'trackStep4Name')}</p>
                    <span className="text-[11px] font-bold text-[#2563eb]">
                      {currentRequest.status === 'validee' ? 'Disponible immédiat' : 'À venir'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Guichet 3 Scolarité ou téléchargement direct certifié.
                </p>
              </div>
            </div>
          </div>

          {/* Split Content: Decision Card & Downloads on Left, QR & Campus on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Decision & Instructions Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Avis académique motivé
                    </span>
                    <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-[#0f2544]">
                      {t(lang, 'trackDecisionTitle')}
                    </h3>
                  </div>
                </div>

                {/* Highlight Decision Box */}
                <div
                  className={`p-5 rounded-xl border space-y-2 ${
                    currentRequest.status === 'validee'
                      ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                      : currentRequest.status === 'refusee'
                      ? 'bg-red-50/50 border-red-200 text-slate-900'
                      : 'bg-amber-50/40 border-amber-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {currentRequest.status === 'validee' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                    {currentRequest.status === 'en_cours' && (
                      <Clock className="w-5 h-5 text-amber-600" />
                    )}
                    {currentRequest.status === 'refusee' && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-bold text-sm text-[#0f2544]">
                      {currentRequest.status === 'validee'
                        ? 'Dossier approuvé avec mention favorable par le Chef de Scolarité'
                        : currentRequest.status === 'refusee'
                        ? 'Demande non recevable — Motif administratif notifié'
                        : 'Dossier en vérification d’éligibilité académique'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-white/70 p-3.5 rounded-lg border border-slate-200/60">
                    {currentRequest.decisionNote ||
                      'En attente des conclusions du conseil pédagogique.'}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2563eb]" />
                    <span>
                      Document muni d’un QR Code d’authentification infalsifiable et d’une clé cryptographique 256-bit vérifiable en ligne.
                    </span>
                  </div>
                </div>

                {/* Validator Signoff Badge */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0f2544] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      ST
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">
                        {currentRequest.assignedValidator}
                      </span>
                      <span className="text-slate-500 block">{currentRequest.validatorTitle}</span>
                      <span className="font-mono-matricule text-[#2563eb] text-[11px]">
                        Signé numériquement le {currentRequest.decisionDate || currentRequest.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="self-end sm:self-center">
                    <span className="px-3 py-1 rounded bg-slate-200 text-[#0f2544] font-bold text-[11px] uppercase tracking-wider">
                      {currentRequest.status === 'validee'
                        ? 'Visa Approuvé'
                        : currentRequest.status === 'refusee'
                        ? 'Visa Rejeté'
                        : 'Visa En Attente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Downloads & Available Acts Section */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-[#0f2544]">
                    {t(lang, 'trackAvailableDocsTitle')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Les pièces officielles sont protégées par le sceau universitaire et conservées 5 ans sur les serveurs institutionnels.
                  </p>
                </div>

                {/* Act Row */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#2563eb] flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm truncate">
                          {currentRequest.requestTypeTitle.replace(/\s+/g, '_')}_
                          {currentRequest.id.replace('#', '')}.pdf
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Original certifié
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>Format : PDF/A (Archivage pérenne)</span>
                        <span>•</span>
                        <span className="font-mono-matricule text-slate-700">SHA-256 : d49a...81bc</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadOfficialPdf}
                    className="px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger l’acte</span>
                  </button>
                </div>

                {/* Secondary Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>{t(lang, 'btnPrint')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onNavigateSubmit}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0f2544] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Déposer une nouvelle requête</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* QR Code Authenticity Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 text-center space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#2563eb]">
                    <QrCode className="w-4 h-4" />
                    <span>{t(lang, 'trackAuthTitle')}</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Actif
                  </span>
                </div>

                {/* Mock QR Code Pattern SVG */}
                <div className="p-4 bg-slate-50 rounded-xl inline-block border border-slate-200 shadow-inner">
                  <svg
                    className="w-40 h-40 mx-auto text-[#0f2544]"
                    viewBox="0 0 160 160"
                    fill="currentColor"
                  >
                    <rect x="10" y="10" width="40" height="40" rx="4" />
                    <rect x="18" y="18" width="24" height="24" fill="white" rx="2" />
                    <rect x="24" y="24" width="12" height="12" />
                    <rect x="110" y="10" width="40" height="40" rx="4" />
                    <rect x="118" y="18" width="24" height="24" fill="white" rx="2" />
                    <rect x="124" y="24" width="12" height="12" />
                    <rect x="10" y="110" width="40" height="40" rx="4" />
                    <rect x="18" y="118" width="24" height="24" fill="white" rx="2" />
                    <rect x="24" y="124" width="12" height="12" />
                    <rect x="60" y="15" width="8" height="8" />
                    <rect x="75" y="15" width="16" height="8" />
                    <rect x="60" y="30" width="24" height="8" />
                    <rect x="90" y="30" width="8" height="16" />
                    <rect x="60" y="45" width="12" height="8" />
                    <rect x="15" y="60" width="16" height="8" />
                    <rect x="35" y="60" width="16" height="16" />
                    <rect x="60" y="60" width="8" height="8" />
                    <rect x="75" y="60" width="24" height="8" />
                    <rect x="105" y="60" width="16" height="8" />
                    <rect x="130" y="60" width="16" height="16" />
                    <rect x="15" y="80" width="8" height="20" />
                    <rect x="30" y="80" width="16" height="8" />
                    <rect x="55" y="75" width="12" height="20" />
                    <rect x="75" y="75" width="8" height="16" />
                    <rect x="90" y="75" width="16" height="8" />
                    <rect x="115" y="80" width="30" height="8" />
                    <rect x="60" y="100" width="16" height="8" />
                    <rect x="85" y="95" width="8" height="24" />
                    <rect x="100" y="100" width="20" height="8" />
                    <rect x="130" y="100" width="15" height="15" />
                    <rect x="60" y="115" width="12" height="16" />
                    <rect x="80" y="125" width="25" height="8" />
                    <rect x="110" y="120" width="15" height="15" />
                    <rect x="135" y="125" width="12" height="18" />
                    <rect x="60" y="140" width="30" height="8" />
                    <rect x="100" y="142" width="20" height="8" />
                  </svg>
                  <span className="text-[10px] font-bold text-[#2563eb] block mt-1">
                    IUT-DLA • SECURE
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-left">
                  <span className="text-slate-400 font-semibold block uppercase">
                    Clé de contrôle numérique :
                  </span>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                    <span className="font-mono-matricule font-bold text-[#0f2544] text-xs">
                      {currentRequest.verificationCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyVerificationCode(currentRequest.verificationCode)}
                      className="text-[#2563eb] hover:text-[#0f2544] p-1 rounded transition-colors"
                      title="Copier la clé"
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Employeurs, ambassades et universités peuvent vérifier ce titre sur :{' '}
                    <span className="text-[#2563eb] font-semibold">requete.iut-douala.cm/verif</span>
                  </p>
                </div>
              </div>

              {/* Physical Withdrawal Location Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400 mb-1">
                    <MapPin className="w-4 h-4 text-[#2563eb]" />
                    <span>{t(lang, 'trackPickupLocationTitle')}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#0f2544]">Campus de Ndogbong</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pavillon Administratif A, Rez-de-chaussée, Hall des Usagers (Guichet 3)
                  </p>
                </div>

                {/* Campus Visual Representation Box */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#0f2544] to-[#1e3a8a] text-white space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#93c5fd]" />
                    <span className="text-xs font-bold">Guichet Scolarité Dématérialisé</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Retrait direct sans file d’attente sur présentation du code{' '}
                    <strong className="text-white font-mono-matricule">{currentRequest.id}</strong>.
                  </p>
                </div>

                <div className="space-y-2 text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Affluence estimée :</span>
                    <span className="font-bold text-emerald-600">Faible (&lt; 5 min)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-1/4" />
                  </div>
                </div>
              </div>

              {/* Assistance Card */}
              <div className="bg-[#eff6ff] rounded-2xl p-5 border border-blue-200 space-y-2 text-xs">
                <span className="font-bold text-[#0f2544] block">Besoin d’aide sur ce dossier ?</span>
                <p className="text-slate-600 leading-relaxed">
                  Contactez directement la permanence par courriel à{' '}
                  <span className="font-semibold text-[#2563eb]">scolarite@iut-douala.cm</span> en
                  rappelant le code <strong className="font-mono-matricule">{currentRequest.id}</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        /* NOT FOUND STATE */
        <div className="bg-white rounded-2xl p-12 text-center shadow-xs border border-slate-200 space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{t(lang, 'trackNotFoundTitle')}</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {t(lang, 'trackNotFoundDesc')}
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={onNavigateSubmit}
              className="px-6 py-2.5 rounded-xl bg-[#0f2544] hover:bg-[#2563eb] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              Déposer une nouvelle requête
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
