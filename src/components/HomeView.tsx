import React, { useState } from 'react';
import { Language, AcademicRequest } from '../types';
import { t } from '../utils/translations';
import { findRequestByIdOrQuery, getAllRequests } from '../utils/storage';
import {
  Search,
  PlusCircle,
  FileCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  ArrowRight,
  TrendingDown,
  Users,
  Smile,
  FileText,
  School,
  AlertCircle,
  Sparkles,
  QrCode,
  Lock,
} from 'lucide-react';

interface HomeViewProps {
  onNavigateSubmit: () => void;
  onNavigateTrack: (code?: string) => void;
  lang: Language;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateSubmit,
  onNavigateTrack,
  lang,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [previewRequest, setPreviewRequest] = useState<AcademicRequest | null>(() => {
    const list = getAllRequests();
    return list.length > 0 ? list[0] : null;
  });

  const handleQuickLookup = (code: string) => {
    setSearchInput(code);
    const found = findRequestByIdOrQuery(code);
    if (found) {
      setPreviewRequest(found);
    }
  };

  const handleFormSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onNavigateTrack(searchInput.trim());
  };

  return (
    <div className="w-full space-y-12 pb-16">
      {/* HERO SECTION */}
      <section className="relative w-full bg-gradient-to-b from-[#0f2544] via-[#132742] to-[#faf8ff] text-white pt-10 pb-16 overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" width="100%" height="100%">
            <defs>
              <pattern id="home-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#home-grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust Banner & Heading */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#182638] text-xs font-semibold text-[#93c5fd] border border-white/10 mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Portail Officiel des Requêtes • IUT de Douala</span>
              <span className="hidden sm:inline text-slate-400">• Université de Douala</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Plus_Jakarta_Sans'] tracking-tight text-white mb-4 leading-tight">
              {lang === 'FR'
                ? 'Traitement automatisé des requêtes administratives de l’IUT'
                : 'Automated Processing of IUT Administrative Petitions'}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-6">
              {lang === 'FR'
                ? 'Déposez vos réclamations de notes, demandes d’attestations et certificats en toute transparence sans vous déplacer au guichet.'
                : 'Submit grade appeals, certificates of enrollment and transcripts transparently without visiting the physical counter.'}
            </p>

            {/* Zero Account Notice */}
            <div className="w-full max-w-2xl bg-[#182638]/90 rounded-xl px-4 py-3 flex items-center justify-center gap-2.5 text-center border border-white/10 shadow-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-slate-200">
                <strong className="text-white">
                  {lang === 'FR' ? 'Accès direct sans inscription :' : 'Direct access with no account :'}
                </strong>{' '}
                {lang === 'FR'
                  ? 'Aucun compte requis. Conservez précieusement votre code de télé-suivi unique.'
                  : 'No login required. Keep your unique tracking code safely.'}
              </p>
            </div>
          </div>

          {/* Bento Split Layout: Search on Left (8 cols), Instant CTA on Right (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-6xl mx-auto">
            {/* Primary Focus: Search Tracking Box (8 cols) */}
            <div className="lg:col-span-8 bg-white text-[#0f2544] rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-[#0f2544]">
                        Suivre l’état d’avancement de votre dossier
                      </h2>
                      <p className="text-xs text-slate-500">
                        Recherche instantanée en direct de la scolarité centrale
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Guichet Ouvert</span>
                  </span>
                </div>

                {/* Form with input and submit */}
                <form onSubmit={handleFormSearch} className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <div className="flex items-center flex-1 px-3 py-2">
                      <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Code unique (ex: REQ-2024-0047) ou Matricule (ex: 21G00892)"
                        className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 font-mono-matricule"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#0f2544] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Suivre ma requête</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Sample Query Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                    <span className="text-slate-400 font-medium">Exemples récents :</span>
                    {['REQ-2024-0047', 'REQ-2024-0112', '21G00892'].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleQuickLookup(code)}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono-matricule text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        #{code}
                      </button>
                    ))}
                  </div>
                </form>
              </div>

              {/* Dynamic Live Result Mini Console Preview */}
              {previewRequest && (
                <div
                  onClick={() => onNavigateTrack(previewRequest.id)}
                  className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-xl cursor-pointer hover:bg-blue-50/40 transition-colors group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-matricule text-sm font-bold text-[#0f2544]">
                        #{previewRequest.id}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {previewRequest.identity.filiere} ({previewRequest.identity.matricule})
                      </span>
                    </div>

                    <div>
                      {previewRequest.status === 'validee' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Validée</span>
                        </span>
                      )}
                      {previewRequest.status === 'en_cours' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>En cours d’examen</span>
                        </span>
                      )}
                      {previewRequest.status === 'refusee' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                          <span>Refusée</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block font-semibold">Acte sollicité :</span>
                      <span className="font-bold text-slate-800 truncate block">
                        {previewRequest.requestTypeTitle}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Dépôt enregistré :</span>
                      <span className="font-semibold text-slate-700">{previewRequest.createdAt}</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-1 text-[#2563eb] font-bold">
                      <span>Consulter le dossier</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instant Submission Bento Card (4 cols) */}
            <div className="lg:col-span-4 bg-[#0f2544] text-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col justify-between border border-[#1b365d] relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-[#2563eb]/20 blur-xl pointer-events-none" />

              <div>
                <div className="w-12 h-12 rounded-xl bg-[#182638] flex items-center justify-center text-[#93c5fd] mb-4 border border-white/10">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#182638] text-[#93c5fd] text-[11px] font-bold uppercase tracking-wider mb-2">
                  Nouvelle Requête
                </div>
                <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-white mb-2">
                  Pas encore de dossier ?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                  Initiez instantanément votre demande : correction de note, duplicata d’attestation ou certificat en 5 étapes simples.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Zéro justificatif papier à imprimer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Numéro de télé-suivi sécurisé délivré immédiatement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Traçabilité complète jusqu’au retrait au guichet</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={onNavigateSubmit}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Déposer une nouvelle requête</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4-STEP PROCEDURE WORKFLOW (As on mockup Image 5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-bold uppercase mb-2 border border-blue-200">
            <span>Procédure Réglementaire</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-[#0f2544]">
            Comment fonctionne le traitement de votre requête ?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Un processus transparent et rapide de la soumission jusqu’au retrait ou téléchargement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#0f2544] text-white flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="font-bold text-base text-[#0f2544] mb-1">1. Dépôt en ligne</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Formulaire en 5 étapes sans inscription. Téléversement des justificatifs numériques (carte d’étudiant, relevés).
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-400">
              <span className="font-bold text-[#2563eb] block">Temps moyen :</span>
              <span>3 minutes • Code SMS généré</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#0f2544] text-white flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="font-bold text-base text-[#0f2544] mb-1">2. Routage automatique</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Affectation immédiate au Chef de Département compétent ou à la Scolarité Centrale selon l’acte demandé.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-400">
              <span className="font-bold text-[#2563eb] block">Acheminement :</span>
              <span>Aiguillage électronique certifié</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="font-bold text-base text-[#0f2544] mb-1">3. Examen & Avis</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Vérification académique, délibération collégiale et signature numérique par le Chef de Scolarité.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-400">
              <span className="font-bold text-[#2563eb] block">Délibération :</span>
              <span>Contrôle croisé des bordereaux</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                4
              </div>
              <h3 className="font-bold text-base text-[#0f2544] mb-1">4. Téléchargement & Retrait</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mise à disposition du document certifié avec QR Code ou retrait physique Express au Guichet 3 (Pavillon A).
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-400">
              <span className="font-bold text-emerald-700 block">Délivrance :</span>
              <span>PDF certifié ou retrait Guichet</span>
            </div>
          </div>
        </div>
      </section>

      {/* PERFORMANCE METRICS & PHYSICAL GUICHET INFO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: KPIs (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] text-xs font-bold uppercase mb-2">
                Indicateurs de Performance Académique
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-[#0f2544]">
                Efficacité mesurée et transparente
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                La dématérialisation du service de scolarité de l’IUT vise à garantir l’équité des chances et la traçabilité intégrale de chaque requête estudiantine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-[#2563eb] block uppercase">
                  Délai moyen
                </span>
                <span className="text-2xl font-bold text-[#0f2544] block mt-1">48h - 72h</span>
                <span className="text-xs text-emerald-600 font-medium mt-1 block">
                  -35% vs 2023
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-[#2563eb] block uppercase">
                  Requêtes traitées
                </span>
                <span className="text-2xl font-bold text-[#0f2544] block mt-1">1,420+</span>
                <span className="text-xs text-slate-500 font-medium mt-1 block">
                  Semestre en cours
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-emerald-600 block uppercase">
                  Satisfaction
                </span>
                <span className="text-2xl font-bold text-[#0f2544] block mt-1">98.4%</span>
                <span className="text-xs text-emerald-600 font-medium mt-1 block">
                  Audit certifié
                </span>
              </div>
            </div>

            {/* Department list */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Filières raccordées au système :
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  'Génie Informatique',
                  'Génie Électrique (GEII)',
                  'Génie Civil',
                  'Génie Mécanique',
                  'GIM',
                  'GEA',
                ].map((dept) => (
                  <span
                    key={dept}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Guichet & Assistance (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#0f2544]">
                <Building className="w-5 h-5 text-[#2563eb]" />
                <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans']">
                  Permanence physique & Guichet
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Campus IUT Ndogbong, Pavillon Administratif A, Rez-de-chaussée (Guichet 3).
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#2563eb] mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Horaires de retrait :</span>
                  <span className="text-slate-600">Lundi au Vendredi : 08h00 - 15h30</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#2563eb] mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Ligne d’assistance scolarité :</span>
                  <span className="font-mono-matricule text-[#2563eb] font-bold">
                    +237 233 40 24 82
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#2563eb] mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Courriel institutionnel :</span>
                  <span className="text-slate-600">scolarite@iut-douala.cm</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateSubmit}
              className="w-full py-3 rounded-xl bg-[#0f2544] hover:bg-[#2563eb] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Commencer une requête</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
