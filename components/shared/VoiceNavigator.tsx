import React, { useState, useEffect, useRef } from 'react';
import type { AppState } from '../../App';

// Re-using the interface from VoiceInputButton
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: () => void;
    onend: () => void;
    onerror: (event: any) => void;
    onresult: (event: any) => void;
    start: () => void;
    stop: () => void;
}

const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0a5 5 0 01-5 5a5 5 0 01-5-5a1 1 0 10-2 0a7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
    </svg>
);

const COMMAND_MAP: { [key: string]: AppState } = {
    'dashboard': 'dashboard',
    'curriculum': 'curriculum',
    'practice room': 'practice',
    'practice': 'practice',
    'aula magna': 'aulaMagna',
    'knowledge hall': 'knowledgeHall',
    'extension lab': 'extensionLab',
    'lab': 'extensionLab',
    'my profile': 'profile',
    'profile': 'profile',
    'kindergarten': 'kindergarten',
    'kinder': 'kindergarten',
    'voice room': 'vocalStudio',
    'vocal studio': 'vocalStudio',
    'voice studio': 'vocalStudio',
    'composition hall': 'composition',
    'composition': 'composition',
};

interface VoiceNavigatorProps {
    onNavigate: (state: AppState) => void;
}

export const VoiceNavigator: React.FC<VoiceNavigatorProps> = ({ onNavigate }) => {
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Listen for a single command
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setFeedback('Listening...');
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            if(event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                setFeedback('Mic access denied.');
            } else {
                 setFeedback('Sorry, I didn\'t catch that.');
            }
            setIsListening(false);
            setTimeout(() => setFeedback(null), 2500);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            
            if (transcript.includes('go to') || transcript.includes('open') || transcript.includes('show')) {
                // Iterate in a way that prefers longer matches, e.g., "vocal studio" over "studio"
                const sortedKeywords = Object.keys(COMMAND_MAP).sort((a, b) => b.length - a.length);
                for (const keyword of sortedKeywords) {
                    if (transcript.includes(keyword)) {
                        const destination = COMMAND_MAP[keyword];
                        const destinationName = keyword.charAt(0).toUpperCase() + keyword.slice(1);
                        setFeedback(`Navigating to ${destinationName}...`);
                        onNavigate(destination);
                        setTimeout(() => setFeedback(null), 2000);
                        return;
                    }
                }
            }
            
            setFeedback('Command not recognized.');
            setTimeout(() => setFeedback(null), 2500);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onNavigate]);

    const handleToggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Could not start recognition", e);
                setFeedback('Error starting mic.');
            }
        }
    };
    
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="relative group">
                 <button
                    onClick={handleToggleListening}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                        ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-500 text-gray-900 hover:bg-amber-600'}`}
                    aria-label={isListening ? 'Stop voice navigation' : 'Start voice navigation'}
                >
                    <MicrophoneIcon className="w-8 h-8" />
                </button>
                <div className={`absolute bottom-full mb-2 right-1/2 translate-x-1/2 w-max px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md transition-opacity pointer-events-none ${feedback || isListening ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                   {feedback || (isListening ? 'Listening...' : 'Voice Navigation')}
                   <div className="absolute top-full right-1/2 translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                </div>
            </div>
        </div>
    );
};
