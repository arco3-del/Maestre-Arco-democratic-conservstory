import React, { useState, useEffect, useRef } from 'react';

// FIX: Add types for the Web Speech API which are not included in default TypeScript lib definitions.
// This resolves the "Cannot find name 'SpeechRecognition'" error.
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

interface VoiceInputButtonProps {
    onTranscript: (transcript: string) => void;
    onListeningChange?: (isListening: boolean) => void;
    className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onTranscript, onListeningChange, className }) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US'; // Can be localized

        recognition.onstart = () => {
            setIsListening(true);
            onListeningChange?.(true);
        };

        recognition.onend = () => {
            setIsListening(false);
            onListeningChange?.(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
            onListeningChange?.(false);
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript.trim()) {
                 onTranscript(finalTranscript);
            }
        };
        
        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onTranscript, onListeningChange]);

    const handleToggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch(e) {
                console.error("Could not start recognition", e);
            }
        }
    };

    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        return null; // Don't render if API is not supported
    }

    return (
        <button
            type="button"
            onClick={handleToggleListening}
            className={`transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'} ${className}`}
            title={isListening ? 'Stop dictation' : 'Start dictation'}
        >
            <MicrophoneIcon className="w-5 h-5" />
        </button>
    );
};
