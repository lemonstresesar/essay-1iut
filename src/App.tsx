import React, { useState } from 'react';
import {
  Language,
  StudentIdentity,
  SpecificAppealDetails,
  UploadedFileItem,
  AcademicRequest,
} from './types';
import { REQUEST_TYPES } from './config/academicData';
import {
  saveRequest,
  generateTrackingCode,
  generateOfficialReference,
  generateVerificationKey,
} from './utils/storage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Stepper } from './components/Stepper';
import { Step1Identity } from './components/steps/Step1Identity';
import { Step2RequestType } from './components/steps/Step2RequestType';
import { Step3Documents } from './components/steps/Step3Documents';
import { Step4Summary } from './components/steps/Step4Summary';
import { Step5Confirmation } from './components/steps/Step5Confirmation';
import { TrackingView } from './components/TrackingView';
import { HomeView } from './components/HomeView';
import { ValidatorConsole } from './components/ValidatorConsole';

export default function App() {
  const [lang, setLang] = useState<Language>('FR');
  const [currentView, setCurrentView] = useState<'home' | 'deposer' | 'suivi' | 'admin'>('home');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [targetTrackingCode, setTargetTrackingCode] = useState<string>('');

  // 1. Student Identity State (Step 1)
  const [identity, setIdentity] = useState<StudentIdentity>({
    nom: 'EBWELE NGANDE',
    prenom: 'Patrick Hervé',
    matricule: '21G00892',
    filiere: 'Génie Informatique',
    classe: 'DUT 2',
    telephone: '+237 699 00 12 34',
    email: 'patrick.ebwele@iut-douala.cm',
  });

  // 2. Selected Request Type & Optional Appeal Details (Step 2)
  const [selectedTypeId, setSelectedTypeId] = useState<string>('reclamation');
  const [specificDetails, setSpecificDetails] = useState<SpecificAppealDetails>({
    semester: 'Semestre 3 (S3)',
    course: 'Algorithmique & Structures de Données (UE Info 311)',
    teacher: 'Dr. M. Eyenga',
    currentGrade: '07.5/20',
    expectedGrade: '14.0/20',
    explanation:
      'Suite à la publication du procès-verbal de délibération de la session normale du Semestre 3 (UE Info 311), une note de 07.5/20 m’a été attribuée en examen final, alors que mon émargement et la moyenne des travaux pratiques donnaient une projection favorable. Je sollicite une vérification matérielle de ma copie d’examen.',
  });

  // 3. Uploaded Files Map (Step 3)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFileItem>>({
    doc_carte: {
      docConfigId: 'doc_carte',
      fileName: 'Carte_Etudiant_2024.pdf',
      fileSize: 1258291,
      fileType: 'application/pdf',
      status: 'success',
    },
    doc_releve_ou_epreuve: {
      docConfigId: 'doc_releve_ou_epreuve',
      fileName: 'Releve_Notes_Semestre3.pdf',
      fileSize: 945000,
      fileType: 'application/pdf',
      status: 'success',
    },
  });

  // 4. Submission & Created Request (Step 5)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdRequest, setCreatedRequest] = useState<AcademicRequest | null>(null);

  // Handlers for Navigation & Stepper
  const handleStartDeposit = () => {
    setCurrentView('deposer');
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTracking = (code?: string) => {
    if (code) {
      setTargetTrackingCode(code);
    }
    setCurrentView('suivi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetDeposit = () => {
    setIdentity({
      nom: '',
      prenom: '',
      matricule: '',
      filiere: '',
      classe: '',
      telephone: '',
      email: '',
    });
    setSelectedTypeId('');
    setSpecificDetails({
      semester: 'Semestre 3 (S3)',
      course: '',
      teacher: '',
      currentGrade: '',
      expectedGrade: '',
      explanation: '',
    });
    setUploadedFiles({});
    setCreatedRequest(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmAndSend = () => {
    setIsSubmitting(true);

    // Simulate 1 second network/server processing latency
    setTimeout(() => {
      const code = generateTrackingCode();
      const ref = generateOfficialReference();
      const verifKey = generateVerificationKey();

      const selectedTypeConfig =
        REQUEST_TYPES.find((rt) => rt.id === selectedTypeId) || REQUEST_TYPES[0];

      const now = new Date();
      const formattedDate = now.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const docsArray = Object.values(uploadedFiles)
        .filter((f) => f.status === 'success')
        .map((f) => {
          const config = selectedTypeConfig.requiredDocuments.find((d) => d.id === f.docConfigId);
          return {
            docConfigId: f.docConfigId,
            docName: config ? config.name : f.fileName,
            fileName: f.fileName,
            fileSize: f.fileSize,
            fileType: f.fileType,
          };
        });

      const newReq: AcademicRequest = {
        id: code,
        reference: ref,
        createdAt: formattedDate,
        updatedAt: formattedDate,
        identity: { ...identity },
        requestTypeId: selectedTypeId,
        requestTypeTitle: selectedTypeConfig.title,
        specificDetails: selectedTypeConfig.hasSpecificFields ? { ...specificDetails } : undefined,
        documents: docsArray,
        status: 'en_cours',
        assignedValidator: 'Dr. Samuel TITA',
        validatorTitle: 'Chef Service Scolarité Centrale',
        processingTimeHours: 24,
        decisionNote:
          'Dossier enregistré et transmis au secrétariat académique compétent pour rapprochement des bordereaux.',
        verificationCode: verifKey,
        physicalLocation: 'Campus Ndogbong, Pavillon Administratif A, Guichet 3',
        deliveryAvailable: false,
      };

      // Save to localStorage
      saveRequest(newReq);
      setCreatedRequest(newReq);
      setIsSubmitting(false);
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e]">
      {/* Institutional Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        onToggleLang={setLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-20">
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <HomeView
            onNavigateSubmit={handleStartDeposit}
            onNavigateTrack={handleStartTracking}
            lang={lang}
          />
        )}

        {/* VIEW 2: 5-STEP REQUEST SUBMISSION FORM */}
        {currentView === 'deposer' && (
          <div className="w-full">
            {/* Sticky Stepper Bar */}
            <Stepper
              currentStep={currentStep}
              lang={lang}
              onStepClick={(step) => {
                if (step < 5) setCurrentStep(step);
              }}
              maxAccessibleStep={createdRequest ? 5 : 4}
            />

            {/* Step 1: Identité */}
            {currentStep === 1 && (
              <Step1Identity
                identity={identity}
                onChange={setIdentity}
                onNext={() => {
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                lang={lang}
              />
            )}

            {/* Step 2: Type de Requête */}
            {currentStep === 2 && (
              <Step2RequestType
                selectedTypeId={selectedTypeId}
                specificDetails={specificDetails}
                onSelectType={setSelectedTypeId}
                onUpdateDetails={setSpecificDetails}
                onNext={() => {
                  setCurrentStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBack={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                lang={lang}
              />
            )}

            {/* Step 3: Pièces Jointes */}
            {currentStep === 3 && (
              <Step3Documents
                selectedTypeId={selectedTypeId}
                uploadedFiles={uploadedFiles}
                onUpdateFiles={setUploadedFiles}
                onNext={() => {
                  setCurrentStep(4);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBack={() => {
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                lang={lang}
              />
            )}

            {/* Step 4: Récapitulatif */}
            {currentStep === 4 && (
              <Step4Summary
                identity={identity}
                selectedTypeId={selectedTypeId}
                specificDetails={specificDetails}
                uploadedFiles={uploadedFiles}
                onEditStep={(stepNum) => {
                  setCurrentStep(stepNum);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onConfirmAndSend={handleConfirmAndSend}
                isSubmitting={isSubmitting}
                lang={lang}
              />
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && createdRequest && (
              <Step5Confirmation
                request={createdRequest}
                onTrackRequest={(code) => {
                  handleStartTracking(code);
                }}
                onNewRequest={handleResetDeposit}
                lang={lang}
              />
            )}
          </div>
        )}

        {/* VIEW 3: TRACKING & STATUS VIEW ("Vérifier ma requête") */}
        {currentView === 'suivi' && (
          <TrackingView
            initialCode={targetTrackingCode}
            onNavigateSubmit={handleStartDeposit}
            lang={lang}
          />
        )}

        {/* VIEW 4: VALIDATOR CONSOLE (Administration / Arbitrage) */}
        {currentView === 'admin' && (
          <ValidatorConsole
            onSelectRequestForTracking={(code) => {
              handleStartTracking(code);
            }}
            lang={lang}
          />
        )}
      </main>

      {/* Institutional Academic Footer */}
      <Footer
        lang={lang}
        onNavigateSubmit={handleStartDeposit}
        onNavigateTrack={() => handleStartTracking()}
      />
    </div>
  );
}
