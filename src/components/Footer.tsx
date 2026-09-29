import React from 'react';
import { Language } from '../types';
import { GraduationCap, MapPin, Clock, Mail, Phone, ExternalLink } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onNavigateSubmit: () => void;
  onNavigateTrack: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onNavigateSubmit,
  onNavigateTrack,
}) => {
  return (
    <footer className="w-full bg-[#0f2544] text-white mt-16 pt-12 pb-8 border-t border-[#1b365d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Column 1: IUT Douala Presentation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-white">
                IUT de Douala
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Institut Universitaire de Technologie — Université de Douala.
              Guichet numérique officiel de soumission, d’arbitrage et de
              délivrance dématérialisée des actes académiques et administratifs.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Système opérationnel • Année 2024 - 2026</span>
            </div>
          </div>

          {/* Column 2: Academic Departments */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#93c5fd] mb-3">
              {lang === 'FR' ? 'Départements Académiques' : 'Academic Departments'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>Génie Informatique (GI)</li>
              <li>Génie Électrique & Info. Industrielle (GEII)</li>
              <li>Génie Civil (GC)</li>
              <li>Génie Mécanique & Productique (GMP)</li>
              <li>Génie Industriel & Maintenance (GIM)</li>
              <li>Gestion des Entreprises & Administrations (GEA)</li>
            </ul>
          </div>

          {/* Column 3: Guichet Scolarité & Location */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#93c5fd] mb-3">
              {lang === 'FR' ? 'Guichet Scolarité' : 'Registry & Office Desk'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#60a5fa] mt-0.5 shrink-0" />
                <span>
                  <strong className="text-white">Lundi - Vendredi :</strong> 08h00 - 15h30
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#60a5fa] mt-0.5 shrink-0" />
                <span>
                  Campus Ndogbong, Pavillon A (Rez-de-chaussée), Guichet 3
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#60a5fa] mt-0.5 shrink-0" />
                <span className="font-mono-matricule">scolarite@iut-douala.cm</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#60a5fa] mt-0.5 shrink-0" />
                <span className="font-mono-matricule">+237 233 40 24 82</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links & Assistance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#93c5fd] mb-3">
              {lang === 'FR' ? 'Assistance & Règlements' : 'Help & Regulations'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={onNavigateSubmit}
                  className="hover:text-white transition-colors text-left"
                >
                  {lang === 'FR' ? 'Déposer une requête sans compte' : 'Submit request (no account)'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateTrack}
                  className="hover:text-white transition-colors text-left"
                >
                  {lang === 'FR' ? 'Vérifier l’état de ma requête' : 'Track request status'}
                </button>
              </li>
              <li className="text-slate-400">
                {lang === 'FR' ? 'Charte des Requêtes et Recours' : 'Student Petitions Charter'}
              </li>
              <li className="text-slate-400">
                {lang === 'FR' ? 'Guide de l’Étudiant IUT de Douala' : 'IUT Douala Student Guide'}
              </li>
              <li className="text-slate-400">
                {lang === 'FR' ? 'Délai d’instruction : 48h - 72h ouvrées' : 'Target delay: 48h - 72h'}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2024-2026 Université de Douala — Institut Universitaire de Technologie. Tous droits réservés.</p>
          <div className="flex items-center gap-3">
            <span>Plateforme Dématérialisée RequêteIUT</span>
            <span aria-hidden="true">·</span>
            <span>Douala, Cameroun</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
