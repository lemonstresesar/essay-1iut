import React, { useState, useEffect, useRef } from 'react';
import { RequestTypeConfig, SpecificAppealDetails, Language } from '../../types';
import { REQUEST_TYPES } from '../../config/academicData';
import { normalizeString } from '../../utils/storage';
import { t } from '../../utils/translations';
import {
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  FileText,
  School,
  Award,
  HelpCircle,
  Shuffle,
  BookOpen,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface Step2RequestTypeProps {
  selectedTypeId: string;
  specificDetails?: SpecificAppealDetails;
  onSelectType: (typeId: string) => void;
  onUpdateDetails: (details: SpecificAppealDetails) => void;
  onNext: () => void;
  onBack: () => void;
  lang: Language;
}

export const Step2RequestType: React.FC<Step2RequestTypeProps> = ({
  selectedTypeId,
  specificDetails,
  onSelectType,
  onUpdateDetails,
  onNext,
  onBack,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedType = REQUEST_TYPES.find((rt) => rt.id === selectedTypeId);

  // Appeal details internal state with default fallbacks
  const [appealData, setAppealData] = useState<SpecificAppealDetails>(
    specificDetails || {
      semester: 'Semestre 3 (S3)',
      course: '',
      teacher: '',
      currentGrade: '',
      expectedGrade: '',
      explanation: '',
    }
  );

  const [detailsErrors, setDetailsErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (specificDetails) {
      setAppealData(specificDetails);
    }
  }, [specificDetails]);

  // Filter types insensitive to case and accents
  const filteredTypes = REQUEST_TYPES.filter((type) => {
    if (!searchQuery.trim()) return true;
    const queryNorm = normalizeString(searchQuery);
    const titleNorm = normalizeString(type.title + ' ' + type.titleEn);
    const descNorm = normalizeString(type.description + ' ' + type.descriptionEn);
    return titleNorm.includes(queryNorm) || descNorm.includes(queryNorm);
  });

  // Handle keyboard navigation for the live suggestions list
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsDropdownOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < filteredTypes.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : filteredTypes.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredTypes.length) {
        selectType(filteredTypes[activeSuggestionIndex].id);
      } else if (filteredTypes.length > 0) {
        selectType(filteredTypes[0].id);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const selectType = (typeId: string) => {
    onSelectType(typeId);
    setIsDropdownOpen(false);
    setSearchQuery('');
    setActiveSuggestionIndex(-1);
  };

  const handleAppealChange = (field: keyof SpecificAppealDetails, value: string) => {
    const updated = { ...appealData, [field]: value };
    setAppealData(updated);
    onUpdateDetails(updated);

    if (field === 'course' && value.trim()) {
      setDetailsErrors((prev) => ({ ...prev, course: '' }));
    }
    if (field === 'explanation' && value.trim().length >= 20) {
      setDetailsErrors((prev) => ({ ...prev, explanation: '' }));
    }
  };

  const isNextValid = (): boolean => {
    if (!selectedTypeId) return false;
    if (selectedType?.hasSpecificFields) {
      if (!appealData.course.trim()) return false;
      if (!appealData.explanation.trim() || appealData.explanation.trim().length < 20) {
        return false;
      }
    }
    return true;
  };

  const handleNextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType?.hasSpecificFields) {
      const errs: Record<string, string> = {};
      if (!appealData.course.trim()) {
        errs.course = t(lang, 'errCourse');
      }
      if (!appealData.explanation.trim() || appealData.explanation.trim().length < 20) {
        errs.explanation = t(lang, 'errExplanation');
      }
      if (Object.keys(errs).length > 0) {
        setDetailsErrors(errs);
        return;
      }
    }
    onNext();
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'school':
        return <School className="w-6 h-6 text-[#2563eb]" />;
      case 'workspace_premium':
        return <Award className="w-6 h-6 text-[#2563eb]" />;
      case 'alt_route':
        return <Shuffle className="w-6 h-6 text-[#2563eb]" />;
      case 'contact_support':
        return <HelpCircle className="w-6 h-6 text-[#2563eb]" />;
      case 'rate_review':
        return <BookOpen className="w-6 h-6 text-[#2563eb]" />;
      default:
        return <FileText className="w-6 h-6 text-[#2563eb]" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Banner Header */}
        <div className="bg-[#0f2544] text-white p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182638] text-xs font-semibold text-[#93c5fd] mb-3 border border-white/10">
            <span>
              {lang === 'FR' ? 'Étape 2 sur 5 • Recherche & Sélection' : 'Step 2 of 5 • Request Selection'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-white">
            {t(lang, 'step2Title')}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            {t(lang, 'step2Desc')}
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* SEARCH BAR (Big Search Input with Magnifier) */}
          <div className="space-y-2 relative">
            <label
              htmlFor="type-search"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between"
            >
              <span>{lang === 'FR' ? 'Rechercher un acte ou objet' : 'Search request type'}</span>
              <span className="text-[11px] font-normal text-slate-400">
                {lang === 'FR' ? 'Navigation au clavier (↑ / ↓ + Entrée)' : 'Keyboard nav (↑ / ↓ + Enter)'}
              </span>
            </label>

            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
              <input
                id="type-search"
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                  setActiveSuggestionIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder={t(lang, 'searchTypePlaceholder')}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium shadow-xs focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none transition-all placeholder:text-slate-400"
                autoComplete="off"
              />
            </div>

            {/* LIVE SUGGESTIONS DROPDOWN */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-30 max-h-72 overflow-y-auto">
                {filteredTypes.length > 0 ? (
                  <ul ref={listRef} className="py-2 divide-y divide-slate-100">
                    {filteredTypes.map((type, index) => {
                      const isHighlighted = index === activeSuggestionIndex;
                      const isChosen = type.id === selectedTypeId;

                      return (
                        <li
                          key={type.id}
                          onClick={() => selectType(type.id)}
                          onMouseEnter={() => setActiveSuggestionIndex(index)}
                          className={`px-4 py-3 cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                            isHighlighted
                              ? 'bg-[#eff6ff] text-[#0f2544]'
                              : isChosen
                              ? 'bg-slate-50'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                              {getIcon(type.iconName)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">
                                {lang === 'FR' ? type.title : type.titleEn}
                              </p>
                              <p className="text-xs text-slate-500 line-clamp-1">
                                {lang === 'FR' ? type.description : type.descriptionEn}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-semibold text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded">
                              {type.estimatedDelayDays}
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    <p className="font-semibold text-slate-700">{t(lang, 'noTypeFound')}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {lang === 'FR'
                        ? 'Essayez avec "attestation", "relevé", "réclamation" ou "certificat"'
                        : 'Try searching "attendance", "transcript", "appeal" or "certificate"'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Choice Pills if nothing is selected or for instant selection */}
          {!selectedType && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                {lang === 'FR' ? 'Accès rapide aux types disponibles :' : 'Quick select options:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {REQUEST_TYPES.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => selectType(type.id)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#2563eb] hover:bg-[#eff6ff]/30 cursor-pointer transition-all flex flex-col justify-between group shadow-xs"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                        {getIcon(type.iconName)}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                        {lang === 'FR' ? type.title : type.titleEn}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {lang === 'FR' ? type.description : type.descriptionEn}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-[#2563eb]">{type.estimatedDelayDays}</span>
                      <span className="text-[#2563eb] group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHOSEN TYPE PRESENTATION CARD */}
          {selectedType && (
            <div className="rounded-2xl border-2 border-[#2563eb] bg-[#eff6ff]/40 p-5 sm:p-6 shadow-sm relative animate-in fade-in zoom-in-98 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-sm">
                    {getIcon(selectedType.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb] bg-white px-2 py-0.5 rounded shadow-xs border border-blue-200">
                        {selectedType.badge}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{selectedType.estimatedDelayDays}</span>
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#0f2544]">
                      {lang === 'FR' ? selectedType.title : selectedType.titleEn}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-xl">
                      {lang === 'FR' ? selectedType.description : selectedType.descriptionEn}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">
                        {lang === 'FR' ? 'Documents à fournir à l’étape 3 :' : 'Documents required at step 3:'}
                      </span>
                      {selectedType.requiredDocuments.map((doc, idx) => (
                        <span
                          key={doc.id}
                          className="bg-white px-2.5 py-0.5 rounded border border-slate-200 text-slate-700 font-medium"
                        >
                          {idx + 1}. {doc.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Change button */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectType('');
                    setIsDropdownOpen(true);
                    if (searchInputRef.current) {
                      searchInputRef.current.focus();
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t(lang, 'btnChangeType')}</span>
                </button>
              </div>
            </div>
          )}

          {/* CONTEXTUAL FIELDS FOR GRADE APPEALS (Réclamation de notes) */}
          {selectedType?.hasSpecificFields && (
            <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-[#0f2544] font-bold text-sm border-b border-slate-200/80 pb-3">
                <BookOpen className="w-4 h-4 text-[#2563eb]" />
                <span>{t(lang, 'appealSpecificTitle')}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Semestre */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t(lang, 'labelSemester')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={appealData.semester}
                    onChange={(e) => handleAppealChange('semester', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:ring-2 focus:ring-[#2563eb]/20"
                  >
                    <option>Semestre 1 (S1)</option>
                    <option>Semestre 2 (S2)</option>
                    <option>Semestre 3 (S3)</option>
                    <option>Semestre 4 (S4)</option>
                    <option>Semestre 5 (S5)</option>
                    <option>Semestre 6 (S6)</option>
                  </select>
                </div>

                {/* Matière / UE */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                    <span>
                      {t(lang, 'labelCourse')} <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-400">
                      Ex: Algorithmique (UE Info 311)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={appealData.course}
                    onChange={(e) => handleAppealChange('course', e.target.value)}
                    placeholder="Ex: Algorithmique & Structures de Données (UE 311)"
                    className={`w-full px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                      detailsErrors.course
                        ? 'border-red-400 bg-red-50/30'
                        : 'border-slate-300 bg-white focus:border-[#2563eb]'
                    }`}
                  />
                  {detailsErrors.course && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{detailsErrors.course}</span>
                    </p>
                  )}
                </div>

                {/* Enseignant responsable */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t(lang, 'labelTeacher')}
                  </label>
                  <input
                    type="text"
                    value={appealData.teacher}
                    onChange={(e) => handleAppealChange('teacher', e.target.value)}
                    placeholder="Ex: Dr. Ndongo / Pr. Eyenga"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900"
                  />
                </div>

                {/* Note affichée */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t(lang, 'labelCurrentGrade')}
                  </label>
                  <input
                    type="text"
                    value={appealData.currentGrade}
                    onChange={(e) => handleAppealChange('currentGrade', e.target.value)}
                    placeholder="Ex: 07.5/20"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 font-mono-matricule"
                  />
                </div>

                {/* Note attendue */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t(lang, 'labelExpectedGrade')}
                  </label>
                  <input
                    type="text"
                    value={appealData.expectedGrade}
                    onChange={(e) => handleAppealChange('expectedGrade', e.target.value)}
                    placeholder="Ex: 14/20"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 font-mono-matricule"
                  />
                </div>
              </div>

              {/* Explication détaillée / Motif circonstancié */}
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t(lang, 'labelExplanation')} <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs font-mono-matricule text-slate-400">
                    {appealData.explanation.length} / 800 {t(lang, 'charCount')}
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={800}
                  value={appealData.explanation}
                  onChange={(e) => handleAppealChange('explanation', e.target.value)}
                  placeholder={t(lang, 'phExplanation')}
                  className={`w-full p-3.5 rounded-xl border text-sm font-medium transition-all ${
                    detailsErrors.explanation
                      ? 'border-red-400 bg-red-50/30'
                      : 'border-slate-300 bg-white focus:border-[#2563eb]'
                  }`}
                />
                {detailsErrors.explanation && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{detailsErrors.explanation}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Navigation Buttons */}
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
              disabled={!isNextValid()}
              onClick={handleNextSubmit}
              className={`w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                isNextValid()
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
