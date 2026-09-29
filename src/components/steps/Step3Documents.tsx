import React, { useState, useRef } from 'react';
import { RequestTypeConfig, UploadedFileItem, Language } from '../../types';
import { REQUEST_TYPES } from '../../config/academicData';
import { t } from '../../utils/translations';
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  FileText,
  ArrowRight,
  ArrowLeft,
  File,
  Info,
} from 'lucide-react';

interface Step3DocumentsProps {
  selectedTypeId: string;
  uploadedFiles: Record<string, UploadedFileItem>;
  onUpdateFiles: (files: Record<string, UploadedFileItem>) => void;
  onNext: () => void;
  onBack: () => void;
  lang: Language;
}

export const Step3Documents: React.FC<Step3DocumentsProps> = ({
  selectedTypeId,
  uploadedFiles,
  onUpdateFiles,
  onNext,
  onBack,
  lang,
}) => {
  const selectedType = REQUEST_TYPES.find((rt) => rt.id === selectedTypeId) || REQUEST_TYPES[0];
  const requiredDocs = selectedType.requiredDocuments;

  // Track active drag zones
  const [dragOverDocId, setDragOverDocId] = useState<string | null>(null);

  // File input refs map
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const validateAndProcessFile = (docId: string, file: File) => {
    const docConfig = requiredDocs.find((d) => d.id === docId);
    if (!docConfig) return;

    // Check size (5MB max)
    const maxBytes = docConfig.maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      const errItem: UploadedFileItem = {
        docConfigId: docId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        status: 'error',
        errorMessage: t(lang, 'fileErrSize'),
      };
      onUpdateFiles({ ...uploadedFiles, [docId]: errItem });
      return;
    }

    // Check extension & mime type
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isAllowedExt = docConfig.acceptedFormats.includes(ext);
    const isAllowedMime =
      file.type.includes('pdf') ||
      file.type.includes('image/jpeg') ||
      file.type.includes('image/png') ||
      file.type.includes('image/jpg');

    if (!isAllowedExt && !isAllowedMime) {
      const errItem: UploadedFileItem = {
        docConfigId: docId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        status: 'error',
        errorMessage: t(lang, 'fileErrFormat'),
      };
      onUpdateFiles({ ...uploadedFiles, [docId]: errItem });
      return;
    }

    // File is valid: read as Data URL for persistence and preview
    const reader = new FileReader();
    reader.onload = () => {
      const successItem: UploadedFileItem = {
        docConfigId: docId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileDataUrl: reader.result as string,
        status: 'success',
      };
      onUpdateFiles({ ...uploadedFiles, [docId]: successItem });
    };
    reader.onerror = () => {
      const errItem: UploadedFileItem = {
        docConfigId: docId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        status: 'error',
        errorMessage: 'Erreur lors de la lecture du fichier.',
      };
      onUpdateFiles({ ...uploadedFiles, [docId]: errItem });
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (docId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverDocId(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(docId, e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(docId, e.target.files[0]);
    }
  };

  const handleRemoveFile = (docId: string) => {
    const updated = { ...uploadedFiles };
    delete updated[docId];
    onUpdateFiles(updated);
    if (fileInputRefs.current[docId]) {
      fileInputRefs.current[docId]!.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(2) + ' Mo';
  };

  // Check if all mandatory documents are loaded successfully
  const areAllRequiredUploaded = (): boolean => {
    return requiredDocs.every((doc) => {
      if (!doc.required) return true;
      const uploaded = uploadedFiles[doc.id];
      return uploaded && uploaded.status === 'success';
    });
  };

  const allReady = areAllRequiredUploaded();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Banner Header */}
        <div className="bg-[#0f2544] text-white p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182638] text-xs font-semibold text-[#93c5fd] mb-3 border border-white/10">
            <span>
              {lang === 'FR' ? 'Étape 3 sur 5 • Pièces Justificatives' : 'Step 3 of 5 • Supporting Documents'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-white">
            {t(lang, 'step3Title')}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            {t(lang, 'step3Desc')} ({lang === 'FR' ? selectedType.title : selectedType.titleEn}).
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Documents Upload Boxes */}
          <div className="space-y-6">
            {requiredDocs.map((doc, index) => {
              const uploaded = uploadedFiles[doc.id];
              const isOver = dragOverDocId === doc.id;
              const isSuccess = uploaded && uploaded.status === 'success';
              const isError = uploaded && uploaded.status === 'error';

              return (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-slate-200 p-5 sm:p-6 bg-slate-50/50 space-y-4"
                >
                  {/* Doc Title & Requirement Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#0f2544] text-white flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                        {doc.required && (
                          <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                            {lang === 'FR' ? 'Obligatoire' : 'Required'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 pl-8">{doc.description}</p>
                    </div>

                    {/* Status Pill Indicator */}
                    <div className="pl-8 sm:pl-0">
                      {isSuccess ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t(lang, 'fileStatusLoaded')}</span>
                        </span>
                      ) : isError ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Erreur de fichier</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
                          <Info className="w-3.5 h-3.5" />
                          <span>{t(lang, 'fileStatusPending')}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* If file is NOT loaded yet (show Drag & Drop Zone) */}
                  {!isSuccess && (
                    <div>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOverDocId(doc.id);
                        }}
                        onDragLeave={() => setDragOverDocId(null)}
                        onDrop={(e) => handleDrop(doc.id, e)}
                        onClick={() => fileInputRefs.current[doc.id]?.click()}
                        className={`relative p-8 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all flex flex-col items-center justify-center group ${
                          isOver
                            ? 'border-[#2563eb] bg-[#eff6ff]'
                            : isError
                            ? 'border-red-300 bg-red-50/20'
                            : 'border-slate-300 bg-white hover:border-[#2563eb] hover:bg-slate-50'
                        }`}
                      >
                        <input
                          ref={(el) => {
                            fileInputRefs.current[doc.id] = el;
                          }}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/*"
                          onChange={(e) => handleFileChange(doc.id, e)}
                          className="hidden"
                        />

                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#eff6ff] group-hover:text-[#2563eb] transition-all">
                          <UploadCloud className="w-6 h-6" />
                        </div>

                        <p className="text-sm font-bold text-slate-800 mb-1">
                          {t(lang, 'dropzoneTitle')}
                        </p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                          {t(lang, 'dropzoneFormats')}
                        </p>

                        <button
                          type="button"
                          className="mt-4 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold shadow-xs hover:bg-slate-50 group-hover:border-[#2563eb] transition-colors"
                        >
                          {t(lang, 'btnBrowse')}
                        </button>
                      </div>

                      {/* Display error message if any */}
                      {isError && uploaded.errorMessage && (
                        <p className="text-xs text-red-600 flex items-center gap-1.5 mt-2 font-medium">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{uploaded.errorMessage}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* If file IS successfully loaded (Display Card with Name, Size, Check & Actions) */}
                  {isSuccess && (
                    <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {uploaded.fileName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-mono-matricule">
                              {formatFileSize(uploaded.fileSize)}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{lang === 'FR' ? 'Fichier vérifié' : 'File verified'}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons: Replace or Delete */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <input
                          ref={(el) => {
                            fileInputRefs.current[doc.id] = el;
                          }}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/*"
                          onChange={(e) => handleFileChange(doc.id, e)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[doc.id]?.click()}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3 text-slate-500" />
                          <span>{t(lang, 'btnReplaceFile')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(doc.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title={t(lang, 'btnDeleteFile')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Validation Warning if not all docs uploaded */}
          {!allReady && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                {t(lang, 'allDocsRequiredWarning')}
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto h-12 px-6 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t(lang, 'btnBack')}</span>
            </button>

            <button
              type="button"
              disabled={!allReady}
              onClick={onNext}
              className={`w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                allReady
                  ? 'bg-[#0f2544] hover:bg-[#2563eb] text-white cursor-pointer shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <span>{t(lang, 'btnNext')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
