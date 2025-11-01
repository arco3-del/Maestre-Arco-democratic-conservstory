import React from 'react';
import { AppState } from '../App';

interface QuickAccessPanelProps {
    onNavigate: (state: AppState) => void;
}

const AccessButton: React.FC<{ title: string; subtitle: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, subtitle, icon, onClick }) => (
    <button onClick={onClick} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300 text-left w-full flex items-center space-x-4">
        <div className="text-amber-400 text-3xl">{icon}</div>
        <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-gray-400">{subtitle}</p>
        </div>
    </button>
);

const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const MicrophoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0a5 5 0 01-5 5a5 5 0 01-5-5a1 1 0 10-2 0a7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>;
const ScaleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l-6-2m0 0l-3 9" /></svg>;
const LibraryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>;
const BeakerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l.477-2.387a2 2 0 01.547-1.806z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const MusicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V4a1 1 0 00-1-1z" /></svg>;
const QuillIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;


export const QuickAccessPanel: React.FC<QuickAccessPanelProps> = ({ onNavigate }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Conservatory Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccessButton
                    title="Curriculum"
                    subtitle="Your personalized roadmap"
                    icon={<BookOpenIcon />}
                    onClick={() => onNavigate('curriculum')}
                />
                <AccessButton
                    title="Practice Room"
                    subtitle="Multimodal feedback"
                    icon={<MicrophoneIcon />}
                    onClick={() => onNavigate('practice')}
                />
                 <AccessButton
                    title="Composition Hall"
                    subtitle="Create your own music"
                    icon={<QuillIcon />}
                    onClick={() => onNavigate('composition')}
                />
                 <AccessButton
                    title="Aula Magna"
                    subtitle="Live conversational evaluation"
                    icon={<ScaleIcon />}
                    onClick={() => onNavigate('aulaMagna')}
                />
                 <AccessButton
                    title="Knowledge Hall"
                    subtitle="Research with cited sources"
                    icon={<LibraryIcon />}
                    onClick={() => onNavigate('knowledgeHall')}
                />
                <AccessButton
                    title="Vocal Studio"
                    subtitle="Real-time pitch coaching"
                    icon={<MusicIcon />}
                    onClick={() => onNavigate('vocalStudio')}
                />
                 <AccessButton
                    title="Kindergarten"
                    subtitle="Playful first steps"
                    icon={<StarIcon />}
                    onClick={() => onNavigate('kindergarten')}
                />
                 <AccessButton
                    title="Extension Lab"
                    subtitle="Your personal AI assistant"
                    icon={<BeakerIcon />}
                    onClick={() => onNavigate('extensionLab')}
                />
                <AccessButton
                    title="My Profile"
                    subtitle="Holographic credentials"
                    icon={<UserIcon />}
                    onClick={() => onNavigate('profile')}
                />
            </div>
        </div>
    );
};
