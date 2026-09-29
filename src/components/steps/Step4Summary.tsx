import React, { useState } from 'react';
import {
  StudentIdentity,
  RequestTypeConfig,
  SpecificAppealDetails,
  UploadedFileItem,
  Language,
} from '../../types';
import { REQUEST_TYPES } from '../../config/academicData';
import { t } from '../../utils/translations';
import {
  User,
  GraduationCap,
  Layers,
  Phone,
  Mail,
  FileText,
  Paperclip,
  CheckCircle2,
  Edit3,
  ArrowLeft,
  Send,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Clock,
  MapPin,
} from 'lucide-react';

interface Step4SummaryProps {
  identity: StudentIdentity;
  selectedTypeId: string;
  specificDetails?: SpecificAppealDetails;
  uploadedFiles: Record<string, UploadedFileItem>;
  onEditStep: (stepNumber: number) => void;
  onConfirmAndSend: () => void;
  isSubmitting: boolean;
  lang: Language;
}

export const Step4Summary: React.FC<Step4SummaryProps> = ({
  identity,
  selectedTypeId,
  specificDetails,
  uploadedFiles,
  onEditStep,
  onConfirmAndSend,
  isSubmitting,
  lang,
}) => {
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const selectedType =
    REQUEST_TYPES.find((rt) => rt.id === selectedTypeId) || REQUEST_TYPES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    onConfirmAndSend();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(2) + ' Mo';
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Banner Header */}
        <div className="bg-[#0f2544] text-white p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182638] text-xs font-semibold text-[#93c5fd] mb-3 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {lang === 'FR'
                ? 'Étape 4 sur 5 • Contrôle de conformité avant envoi'
                : 'Step 4 of 5 • Final Review & Confirmation'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-white">
            {t(lang, 'step4Title')}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            {t(lang, 'step4Desc')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* BLOC 1: IDENTITÉ DE L'ÉTUDIANT */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-[#0f2544]">
                <User className="w-5 h-5 text-[#2563eb]" />
                <h3 className="font-bold text-base">{t(lang, 'blockIdentity')}</h3>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="px-3 py-1 rounded-lg text-xs font-bold text-[#2563eb] hover:bg-blue-50 border border-blue-200 flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t(lang, 'btnModify')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase">
                  {lang === 'FR' ? 'Nom & Prénom' : 'Full Name'}
                </span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block truncate">
                  {identity.nom} {identity.prenom}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase">
                  {lang === 'FR' ? 'Numéro Matricule' : 'Student ID'}
                </span>
                <span className="font-mono-matricule font-bold text-[#2563eb] text-sm mt-0.5 block">
                  {identity.matricule}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase">
                  {lang === 'FR' ? 'Filière / Département' : 'Department'}
                </span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block truncate">
                  {identity.filiere}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase">
                  {lang === 'FR' ? 'Classe / Niveau' : 'Class Level'}
                </span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                  {identity.classe}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase">
                  {lang === 'FR' ? 'Téléphone de contact' : 'Phone'}
                </span>
                <span className="font-mono-matricule text-slate-800 text-sm mt-0.5 block">
                  {identity.telephone}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase">
                  {lang === 'FR' ? 'Courriel' : 'Email'}
                </span>
                <span className="text-slate-800 text-sm mt-0.5 block truncate">
                  {identity.email}
                </span>
              </div>
            </div>
          </div>

          {/* BLOC 2: TYPE DE REQUÊTE & MOTIF */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-[#0f2544]">
                <FileText className="w-5 h-5 text-[#2563eb]" />
                <h3 className="font-bold text-base">{t(lang, 'blockRequestType')}</h3>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="px-3 py-1 rounded-lg text-xs font-bold text-[#2563eb] hover:bg-blue-50 border border-blue-200 flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t(lang, 'btnModify')}</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedType.badge}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {lang === 'FR' ? selectedType.title : selectedType.titleEn}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'FR' ? selectedType.description : selectedType.descriptionEn}
                  </p>
                </div>
                <div className="text-right sm:shrink-0">
                  <span className="text-xs text-slate-400 block">Délai estimé</span>
                  <span className="text-sm font-bold text-slate-700">
                    {selectedType.estimatedDelayDays}
                  </span>
                </div>
              </div>

              {/* Specific appeal details if applicable */}
              {selectedType.hasSpecificFields && specificDetails && (
                <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/60 p-3 rounded-lg text-xs space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-slate-400 block font-semibold">Semestre :</span>
                      <span className="font-bold text-slate-800">{specificDetails.semester}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Matière / UE :</span>
                      <span className="font-bold text-slate-800">{specificDetails.course}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Enseignant :</span>
                      <span className="font-bold text-slate-800">
                        {specificDetails.teacher || 'Non spécifié'}
                      </span>
                    </div>
                  </div>

                  {specificDetails.currentGrade && (
                    <div className="flex items-center gap-4 pt-1">
                      <span className="text-slate-600">
                        Note affichée : <strong className="font-mono-matricule text-red-600">{specificDetails.currentGrade}</strong>
                      </span>
                      {specificDetails.expectedGrade && (
                        <span className="text-slate-600">
                          Note attendue : <strong className="font-mono-matricule text-emerald-600">{specificDetails.expectedGrade}</strong>
                        </span>
                      )}
                    </div>
                  )}

                  <div className="pt-1">
                    <span className="text-slate-400 block font-semibold">Motif circonstancié :</span>
                    <p className="italic text-slate-700 mt-0.5 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                      « {specificDetails.explanation} »
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BLOC 3: PIÈCES JOINTES */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-[#0f2544]">
                <Paperclip className="w-5 h-5 text-[#2563eb]" />
                <h3 className="font-bold text-base">{t(lang, 'blockDocuments')}</h3>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(3)}
                className="px-3 py-1 rounded-lg text-xs font-bold text-[#2563eb] hover:bg-blue-50 border border-blue-200 flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t(lang, 'btnModify')}</span>
              </button>
            </div>

            <div className="space-y-2">
              {selectedType.requiredDocuments.map((reqDoc) => {
                const file = uploadedFiles[reqDoc.id];
                return (
                  <div
                    key={reqDoc.id}
                    className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-800 block truncate">
                          {reqDoc.name}
                        </span>
                        <span className="text-slate-500 font-mono-matricule">
                          {file?.fileName} ({file ? formatFileSize(file.fileSize) : ''})
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                      Conforme
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BLOC 4: JURIDIQUE & CONSENTEMENT OBLIGATOIRE */}
          <div className="rounded-2xl border-2 border-slate-300 p-5 sm:p-6 bg-white space-y-4">
            <div className="flex items-start gap-3">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => {
                  setConsentChecked(e.target.checked);
                  if (e.target.checked) setConsentError(false);
                }}
                className="w-5 h-5 mt-0.5 rounded text-[#2563eb] focus:ring-[#2563eb] accent-[#2563eb] cursor-pointer shrink-0"
              />
              <label
                htmlFor="consent-checkbox"
                className="text-xs sm:text-sm text-slate-800 leading-relaxed cursor-pointer font-medium"
              >
                {t(lang, 'consentCheckboxText')}
              </label>
            </div>

            {consentError && (
              <p className="text-xs text-red-600 flex items-center gap-1.5 font-medium pl-8">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{t(lang, 'errConsentRequired')}</span>
              </p>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="w-full sm:w-auto h-12 px-6 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t(lang, 'btnBack')}</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#0f2544] hover:bg-[#2563eb] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-70 disabled:cursor-wait"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t(lang, 'btnSubmitting')}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t(lang, 'btnConfirmAndSend')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
