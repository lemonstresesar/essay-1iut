import React, { useState } from 'react';
import { AcademicRequest, Language } from '../../types';
import { t } from '../../utils/translations';
import {
  CheckCircle2,
  Copy,
  Check,
  Download,
  Search,
  PlusCircle,
  FileCheck,
  Calendar,
  Clock,
  ShieldCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface Step5ConfirmationProps {
  request: AcademicRequest;
  onTrackRequest: (requestId: string) => void;
  onNewRequest: () => void;
  lang: Language;
}

export const Step5Confirmation: React.FC<Step5ConfirmationProps> = ({
  request,
  onTrackRequest,
  onNewRequest,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(request.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReceipt = () => {
    // Generate an official academic deposit receipt text document
    const receiptContent = `================================================================================
RÉPUBLIQUE DU CAMEROUN                   REPUBLIC OF CAMEROON
Paix - Travail - Patrie                 Peace - Work - Fatherland
--------------------------------------------------------------------------------
UNIVERSITÉ DE DOUALA                    UNIVERSITY OF DOUALA
INSTITUT UNIVERSITAIRE DE TECHNOLOGIE   UNIVERSITY INSTITUTE OF TECHNOLOGY
Direction de la Scolarité & des Études  Academic Affairs & Records Registry
Ndogbong, B.P. 8698 Douala - Cameroun   Ndogbong, P.O. Box 8698 Douala
================================================================================
          RÉCÉPISSÉ OFFICIEL DE DÉPÔT DE REQUÊTE ACADÉMIQUE
                    (SYSTÈME REQUÊTEIUT - SCOLARITÉ)
================================================================================

IDENTIFIANT UNIQUE DE TÉLÉ-SUIVI : ${request.id}
RÉFÉRENCE OFFICIELLE DU REGISTRE  : ${request.reference}
DATE ET HEURE DE SOUMISSION     : ${request.createdAt}
STATUT INITIAL DU DOSSIER       : EN COURS D'INSTRUCTION
CLÉ DE VÉRIFICATION NUMÉRIQUE   : ${request.verificationCode}

--------------------------------------------------------------------------------
1. INFORMATIONS D'IDENTIFICATION DE L'ÉTUDIANT
--------------------------------------------------------------------------------
Nom & Prénom(s)     : ${request.identity.nom} ${request.identity.prenom}
Numéro Matricule    : ${request.identity.matricule}
Département / Filière: ${request.identity.filiere}
Classe & Niveau     : ${request.identity.classe}
Téléphone / WhatsApp: ${request.identity.telephone}
Courriel institution: ${request.identity.email}

--------------------------------------------------------------------------------
2. OBJET ET NATURE DE LA REQUÊTE
--------------------------------------------------------------------------------
Type d'acte sollicité : ${request.requestTypeTitle}
Délai moyen estimé    : 48h à 72h ouvrées
${
  request.specificDetails
    ? `Semestre concerné     : ${request.specificDetails.semester}
Matière / UE          : ${request.specificDetails.course}
Enseignant responsable: ${request.specificDetails.teacher || 'Non spécifié'}
Note affichée / réclam: ${request.specificDetails.currentGrade || 'N/A'} -> ${request.specificDetails.expectedGrade || 'N/A'}
Motif circonstancié   :
${request.specificDetails.explanation}`
    : ''
}

--------------------------------------------------------------------------------
3. PIÈCES JUSTIFICATIVES RATTACHÉES (${request.documents.length} document(s))
--------------------------------------------------------------------------------
${request.documents.map((d, i) => `${i + 1}. [${d.docName}] ${d.fileName} (${(d.fileSize / 1024).toFixed(1)} Ko)`).join('\n')}

--------------------------------------------------------------------------------
4. DISPOSITIONS RÉGLEMENTAIRES & RETRAIT PHYSIQUE
--------------------------------------------------------------------------------
- Conservez précieusement votre code de télé-suivi : ${request.id}
- Ce récépissé fait foi de dépôt dématérialisé auprès de la Scolarité Centrale.
- Consultation en ligne : https://requete.iut-douala.cm/suivi
- Lieu de délivrance physique (si requis) :
  Campus IUT Ndogbong, Pavillon Administratif A, Rez-de-chaussée, Guichet 3.
- Horaires du Guichet : Lundi au Vendredi, 08h00 - 15h30 sans interruption.
- Permanence téléphonique : +237 233 40 24 82
- Courriel : scolarite@iut-douala.cm

Certifié conforme par les services informatiques et le Décanat de l'IUT.
Horodatage cryptographique RFC 3161 actif.
================================================================================
`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recepisse_${request.id}_IUT_Douala.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Success Header Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-50 via-white to-blue-50/40 border-b border-slate-200 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>{lang === 'FR' ? 'Reçu académique généré' : 'Academic Receipt Issued'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-[#0f2544]">
              {t(lang, 'step5Title')}
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              {t(lang, 'step5Subtitle')}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* BIG CARD WITH HIGHLIGHTED TRACKING CODE */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f2544] text-white text-center relative overflow-hidden shadow-lg border border-[#1b365d]">
            <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-[#2563eb]/20 blur-2xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

            <span className="text-xs uppercase tracking-widest text-[#93c5fd] font-bold block mb-2">
              {t(lang, 'trackingCodeLabel')}
            </span>

            {/* Tracking Code Display */}
            <div className="my-2 inline-flex items-center justify-center">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono-matricule tracking-wider text-[#93c5fd] drop-shadow-sm select-all">
                {request.id}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
              {t(lang, 'keepCodeNotice')}
            </p>

            {/* Copy Button */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleCopy}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white scale-105'
                    : 'bg-[#182638] hover:bg-[#2563eb] text-white border border-white/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>{t(lang, 'btnCodeCopied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#93c5fd]" />
                    <span>{t(lang, 'btnCopyCode')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Summary Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block font-semibold uppercase">
                {lang === 'FR' ? 'Statut Initial' : 'Initial Status'}
              </span>
              <span className="inline-flex items-center gap-1.5 font-bold text-amber-700 text-sm mt-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{t(lang, 'statusEnCours')}</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block font-semibold uppercase">
                {lang === 'FR' ? 'Étudiant' : 'Student'}
              </span>
              <span className="font-bold text-slate-900 text-sm mt-1 block truncate">
                {request.identity.nom} {request.identity.prenom}
              </span>
              <span className="font-mono-matricule text-slate-500 text-[11px]">
                {request.identity.matricule}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block font-semibold uppercase">
                {lang === 'FR' ? 'Acte demandé' : 'Request Type'}
              </span>
              <span className="font-bold text-slate-900 text-sm mt-1 block truncate">
                {request.requestTypeTitle}
              </span>
              <span className="text-slate-500 text-[11px]">48h à 72h ouvrées</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="w-full h-12 rounded-xl bg-white border-2 border-slate-300 hover:border-[#0f2544] hover:bg-slate-50 text-[#0f2544] font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#2563eb]" />
              <span>{t(lang, 'btnDownloadReceipt')}</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onTrackRequest(request.id)}
                className="h-12 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{t(lang, 'btnTrackMyRequest')}</span>
              </button>

              <button
                type="button"
                onClick={onNewRequest}
                className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-slate-600" />
                <span>{t(lang, 'btnSubmitNewRequest')}</span>
              </button>
            </div>
          </div>

          {/* Institutional Reassurance Note */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t(lang, 'smsNotice')}</span>
            </span>
            <span className="text-slate-400">Guichet Scolarité • IUT de Douala</span>
          </div>
        </div>
      </div>
    </div>
  );
};
