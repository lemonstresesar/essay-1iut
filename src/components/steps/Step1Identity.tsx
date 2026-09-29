import React, { useState, useEffect } from 'react';
import { StudentIdentity, Language } from '../../types';
import { DEPARTMENTS, CLASSES } from '../../config/academicData';
import { t } from '../../utils/translations';
import {
  User,
  BadgeAlert,
  GraduationCap,
  Layers,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface Step1IdentityProps {
  identity: StudentIdentity;
  onChange: (updated: StudentIdentity) => void;
  onNext: () => void;
  lang: Language;
}

export const Step1Identity: React.FC<Step1IdentityProps> = ({
  identity,
  onChange,
  onNext,
  lang,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof StudentIdentity, value: string): string => {
    switch (field) {
      case 'nom':
        if (!value.trim()) return t(lang, 'errLastName');
        if (value.trim().length < 2) return t(lang, 'errLastName');
        return '';
      case 'prenom':
        if (!value.trim()) return t(lang, 'errFirstName');
        return '';
      case 'matricule':
        if (!value.trim()) return t(lang, 'errMatricule');
        if (value.trim().length < 4) return t(lang, 'errMatricule');
        return '';
      case 'filiere':
        if (!value) return t(lang, 'errDepartment');
        return '';
      case 'classe':
        if (!value) return t(lang, 'errClass');
        return '';
      case 'telephone':
        if (!value.trim()) return t(lang, 'errPhone');
        if (value.replace(/\D/g, '').length < 8) return t(lang, 'errPhone');
        return '';
      case 'email':
        if (!value.trim()) return t(lang, 'errEmail');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return t(lang, 'errEmail');
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: keyof StudentIdentity, value: string) => {
    const updated = { ...identity, [field]: value };
    onChange(updated);

    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field: keyof StudentIdentity) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, identity[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const isFormValid = (): boolean => {
    const fields: (keyof StudentIdentity)[] = [
      'nom',
      'prenom',
      'matricule',
      'filiere',
      'classe',
      'telephone',
      'email',
    ];
    for (const f of fields) {
      if (validateField(f, identity[f])) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched: Record<string, boolean> = {};
    const newErrors: Record<string, string> = {};
    const fields: (keyof StudentIdentity)[] = [
      'nom',
      'prenom',
      'matricule',
      'filiere',
      'classe',
      'telephone',
      'email',
    ];

    let hasError = false;
    fields.forEach((f) => {
      allTouched[f] = true;
      const err = validateField(f, identity[f]);
      if (err) {
        newErrors[f] = err;
        hasError = true;
      }
    });

    setTouched(allTouched);
    setErrors(newErrors);

    if (!hasError) {
      onNext();
    }
  };

  const valid = isFormValid();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Info Banner */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden mb-8">
        <div className="bg-[#0f2544] text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-[#2563eb]/20 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182638] text-xs font-semibold text-[#93c5fd] mb-3 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {lang === 'FR'
                  ? 'Étape 1 sur 5 • Saisie sans création de compte'
                  : 'Step 1 of 5 • No registration required'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-white">
              {t(lang, 'step1Title')}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              {t(lang, 'step1Desc')}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div className="space-y-1.5">
              <label
                htmlFor="nom"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between"
              >
                <span>
                  {t(lang, 'labelLastName')} <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-slate-400">
                  {lang === 'FR' ? 'Conforme acte de naissance' : 'As on birth cert.'}
                </span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="nom"
                  type="text"
                  value={identity.nom}
                  onChange={(e) => handleFieldChange('nom', e.target.value)}
                  onBlur={() => handleBlur('nom')}
                  placeholder={t(lang, 'phLastName')}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    errors.nom && touched.nom
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-2 focus:ring-red-400'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
                  }`}
                />
              </div>
              {errors.nom && touched.nom && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.nom}</span>
                </p>
              )}
            </div>

            {/* Prénom */}
            <div className="space-y-1.5">
              <label
                htmlFor="prenom"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 block"
              >
                {t(lang, 'labelFirstName')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="prenom"
                  type="text"
                  value={identity.prenom}
                  onChange={(e) => handleFieldChange('prenom', e.target.value)}
                  onBlur={() => handleBlur('prenom')}
                  placeholder={t(lang, 'phFirstName')}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    errors.prenom && touched.prenom
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-2 focus:ring-red-400'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
                  }`}
                />
              </div>
              {errors.prenom && touched.prenom && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.prenom}</span>
                </p>
              )}
            </div>

            {/* Matricule */}
            <div className="space-y-1.5">
              <label
                htmlFor="matricule"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between"
              >
                <span>
                  {t(lang, 'labelMatricule')} <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-semibold text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded">
                  Format IUT
                </span>
              </label>
              <div className="relative">
                <BadgeAlert className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="matricule"
                  type="text"
                  value={identity.matricule}
                  onChange={(e) =>
                    handleFieldChange('matricule', e.target.value.toUpperCase())
                  }
                  onBlur={() => handleBlur('matricule')}
                  placeholder={t(lang, 'phMatricule')}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border font-mono-matricule text-sm font-bold uppercase tracking-wider transition-all ${
                    errors.matricule && touched.matricule
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-2 focus:ring-red-400'
                      : 'border-slate-300 bg-white text-[#0f2544] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
                  }`}
                />
              </div>
              {errors.matricule && touched.matricule ? (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.matricule}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  {lang === 'FR'
                    ? 'Exemple : 21G00892, 22E00411 ou 23I00554'
                    : 'Example: 21G00892, 22E00411 or 23I00554'}
                </p>
              )}
            </div>

            {/* Filière / Département */}
            <div className="space-y-1.5">
              <label
                htmlFor="filiere"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 block"
              >
                {t(lang, 'labelDepartment')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <select
                  id="filiere"
                  value={identity.filiere}
                  onChange={(e) => handleFieldChange('filiere', e.target.value)}
                  onBlur={() => handleBlur('filiere')}
                  className={`w-full pl-10 pr-8 py-2.5 rounded-xl border text-sm font-medium transition-all appearance-none cursor-pointer ${
                    errors.filiere && touched.filiere
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-2 focus:ring-red-400'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
                  }`}
                >
                  <option value="">{t(lang, 'selectDepartmentPlaceholder')}</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.code} value={dept.name}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
              {errors.filiere && touched.filiere && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.filiere}</span>
                </p>
              )}
            </div>

            {/* Classe (DUT 1, DUT 2...) */}
            <div className="space-y-1.5">
              <label
                htmlFor="classe"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 block"
              >
                {t(lang, 'labelClass')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <select
                  id="classe"
                  value={identity.classe}
                  onChange={(e) => handleFieldChange('classe', e.target.value)}
                  onBlur={() => handleBlur('classe')}
                  className={`w-full pl-10 pr-8 py-2.5 rounded-xl border text-sm font-medium transition-all appearance-none cursor-pointer ${
                    errors.classe && touched.classe
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-2 focus:ring-red-400'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
                  }`}
                >
                  <option value="">{t(lang, 'selectClassPlaceholder')}</option>
                  {CLASSES.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {lang === 'FR' ? cls.label : cls.labelEn}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
              {errors.classe && touched.classe && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.classe}</span>
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-1.5">
              <label
                htmlFor="telephone"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between"
              >
                <span>
                  {t(lang, 'labelPhone')} <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-slate-400">
                  {lang === 'FR' ? 'SMS de suivi' : 'SMS updates'}
                </span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="telephone"
                  type="tel"
                  value={identity.telephone}
                  onChange={(e) => handleFieldChange('telephone', e.target.value)}
                  onBlur={() => handleBlur('telephone')}
                  placeholder={t(lang, 'phPhone')}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    errors.telephone && touched.telephone
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-2 focus:ring-red-400'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
                  }`}
                />
              </div>
              {errors.telephone && touched.telephone && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.telephone}</span>
                </p>
              )}
            </div>

            {/* Courriel */}
            <div className="space-y-1.5 md:col-span-2">
              <label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between"
              >
                <span>
                  {t(lang, 'labelEmail')} <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-slate-400">
                  {lang === 'FR' ? 'Copie numérique de l’acte' : 'Digital copy sent here'}
                </span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={identity.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder={t(lang, 'phEmail')}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    errors.email && touched.email
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-2 focus:ring-red-400'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
                  }`}
                />
              </div>
              {errors.email && touched.email && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500 text-center sm:text-left">
              {lang === 'FR'
                ? 'Tous les champs marqués d’un astérisque (*) sont obligatoires.'
                : 'All fields marked with an asterisk (*) are mandatory.'}
            </span>

            <button
              type="submit"
              disabled={!valid}
              className={`w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                valid
                  ? 'bg-[#0f2544] hover:bg-[#2563eb] text-white cursor-pointer shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <span>{t(lang, 'btnValidate')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
