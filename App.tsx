import React, { useReducer, useCallback } from 'react';
import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { Dashboard } from './components/dashboard/Dashboard';
import { PersonalizedCurriculumView } from './components/curriculum/PersonalizedCurriculumView';
import { PracticeRoom } from './components/practice/PracticeRoom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AulaMagnaView } from './components/aula-magna/AulaMagnaView';
import { KnowledgeHallView } from './components/knowledge-hall/KnowledgeHallView';
import { ExtensionLab } from './components/laboratorio/ExtensionLab';
import { ProfileView } from './components/Hero';
import { VoiceNavigator } from './components/shared/VoiceNavigator';
import { KindergartenView } from './components/kindergarten/KindergartenView';
import { VocalStudioView } from './components/vocal-studio/VocalStudioView';
import { CompositionHallView } from './components/composition/CompositionHallView';


export type AppState = 'welcome' | 'onboarding' | 'extensionLab' | 'dashboard' | 'curriculum' | 'practice' | 'aulaMagna' | 'knowledgeHall' | 'profile' | 'kindergarten' | 'vocalStudio' | 'composition';
export type Lesson = { id: string; name: string; module: string, description: string };

type State = {
  appState: AppState;
  personalizedPlan: any | null;
  currentLesson: Lesson | null;
};

type Action =
  | { type: 'NAVIGATE_TO'; payload: AppState }
  | { type: 'COMPLETE_WELCOME' }
  | { type: 'COMPLETE_ONBOARDING'; payload: any }
  | { type: 'COMPLETE_EXTENSION_LAB' }
  | { type: 'START_PRACTICE'; payload: Lesson };

const initialState: State = {
  appState: 'welcome',
  personalizedPlan: null,
  currentLesson: null,
};

function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'NAVIGATE_TO':
      return { ...state, appState: action.payload };
    case 'COMPLETE_WELCOME':
      return { ...state, appState: 'onboarding' };
    case 'COMPLETE_ONBOARDING':
      return { ...state, appState: 'extensionLab', personalizedPlan: action.payload };
    case 'COMPLETE_EXTENSION_LAB':
      return { ...state, appState: 'dashboard' };
    case 'START_PRACTICE':
      return { ...state, appState: 'practice', currentLesson: action.payload };
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { appState, personalizedPlan, currentLesson } = state;

  const handleWelcomeComplete = useCallback(() => {
    dispatch({ type: 'COMPLETE_WELCOME' });
  }, []);

  const handleOnboardingComplete = useCallback((plan: any) => {
    dispatch({ type: 'COMPLETE_ONBOARDING', payload: plan });
  }, []);
  
  const handleExtensionLabComplete = useCallback(() => {
    dispatch({ type: 'COMPLETE_EXTENSION_LAB' });
  }, []);

  const navigateTo = useCallback((newState: AppState) => {
    dispatch({ type: 'NAVIGATE_TO', payload: newState });
  }, []);

  const startPracticeSession = useCallback((lesson: Lesson) => {
    dispatch({ type: 'START_PRACTICE', payload: lesson });
  }, []);


  const renderContent = () => {
    switch (appState) {
      case 'onboarding':
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
      case 'extensionLab':
        return <ExtensionLab onComplete={handleExtensionLabComplete} />;
      case 'dashboard':
        return <Dashboard personalizedPlan={personalizedPlan} onNavigate={navigateTo} />;
      case 'curriculum':
        return <PersonalizedCurriculumView plan={personalizedPlan} onStartPractice={startPracticeSession} onNavigate={navigateTo} />;
      case 'practice':
        return <PracticeRoom lesson={currentLesson} onNavigate={navigateTo} />;
      case 'aulaMagna':
        return <AulaMagnaView />;
      case 'knowledgeHall':
        return <KnowledgeHallView />;
      case 'profile':
        return <ProfileView onNavigate={navigateTo} />;
      case 'kindergarten':
        return <KindergartenView />;
      case 'vocalStudio':
        return <VocalStudioView />;
      case 'composition':
        return <CompositionHallView />;
      case 'welcome':
      default:
        return <WelcomeScreen onComplete={handleWelcomeComplete} />;
    }
  };

  const showHeaderAndFooter = appState !== 'welcome' && appState !== 'onboarding' && appState !== 'extensionLab';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      {showHeaderAndFooter && <Header appState={appState} onNavigate={navigateTo} />}
      <main className="flex-grow">
        {renderContent()}
      </main>
      {showHeaderAndFooter && (
        <>
          <Footer />
          <VoiceNavigator onNavigate={navigateTo} />
        </>
      )}
    </div>
  );
};

export default App;
