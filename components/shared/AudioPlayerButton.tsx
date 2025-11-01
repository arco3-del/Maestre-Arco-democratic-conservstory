import React, { useState, useRef, useEffect, useCallback } from 'react';
import { decode, decodeAudioData } from '../../utils/audioUtils';

const SpeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
    </svg>
);

const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M6 6h12v12H6z"></path>
    </svg>
);

const Spinner: React.FC<{ className?: string }> = ({ className }) => <div className={`animate-spin rounded-full border-b-2 border-amber-400 ${className}`}></div>;

interface AudioPlayerButtonProps {
    getAudioData?: () => Promise<string>; // Fetches base64 audio data
    audioBuffer?: AudioBuffer; // Or uses a pre-loaded buffer
    className?: string;
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({ getAudioData, audioBuffer, className }) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(audioBuffer || null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
        // Initialize AudioContext lazily
        if (!audioContextRef.current) {
            const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                 audioContextRef.current = new AudioContext({ sampleRate: 24000 });
            }
        }
        // Store passed buffer
        if (audioBuffer) {
            audioBufferRef.current = audioBuffer;
        }
        
        // Cleanup on unmount
        return () => {
            audioSourceRef.current?.stop();
            if (audioContextRef.current?.state !== 'closed') {
                // audioContextRef.current?.close(); // Keep context alive for multiple plays
            }
        };
    }, [audioBuffer]);
    
    const play = useCallback(() => {
        if (!audioBufferRef.current || !audioContextRef.current) return;
        
        // Stop any existing playback
        if(audioSourceRef.current) {
            audioSourceRef.current.onended = null;
            audioSourceRef.current.stop();
        }

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.connect(audioContextRef.current.destination);
        source.onended = () => {
            setStatus('idle');
            audioSourceRef.current = null;
        };
        source.start(0);
        audioSourceRef.current = source;
        setStatus('playing');
    }, []);

    const stop = useCallback(() => {
        if (audioSourceRef.current) {
            audioSourceRef.current.stop(); // This will trigger the 'onended' event
        }
    }, []);

    const handleClick = async () => {
        if (!audioContextRef.current) {
            console.error("AudioContext not supported.");
            setStatus('error');
            return;
        }
        
        if(audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        if (status === 'playing') {
            stop();
            return;
        }

        if (audioBufferRef.current) {
            play();
        } else if (getAudioData) {
            setStatus('loading');
            try {
                const base64Audio = await getAudioData();
                const decodedBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
                audioBufferRef.current = decodedBuffer;
                play();
            } catch (err) {
                console.error("Failed to get or decode audio:", err);
                setStatus('error');
            }
        }
    };

    const isDisabled = (!getAudioData && !audioBuffer) || status === 'error';

    const renderIcon = () => {
        switch(status) {
            case 'loading':
                return <Spinner className="w-5 h-5" />;
            case 'playing':
                return <StopIcon className="w-5 h-5 text-red-500" />;
            case 'idle':
            case 'error':
            default:
                 return <SpeakerIcon className="w-5 h-5 text-amber-400" />;
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isDisabled}
            className={`transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            title={status === 'playing' ? 'Stop audio' : 'Play audio'}
        >
            {renderIcon()}
        </button>
    );
};
