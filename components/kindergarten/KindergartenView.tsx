import React, { useState, useCallback, useRef } from 'react';
import { generateSpeechFromText } from '../../services/geminiService';
import { AudioPlayerButton } from '../shared/AudioPlayerButton';

const instruments = [
  { name: 'Piano', emoji: '🎹', sound: 'https://storage.googleapis.com/music-practice-tool/piano_c4.mp3', fact: 'The piano has 88 keys!' },
  { name: 'Guitar', emoji: '🎸', sound: 'https://storage.googleapis.com/music-practice-tool/guitar_e4.mp3', fact: 'A guitar usually has 6 strings.' },
  { name: 'Violin', emoji: '🎻', sound: 'https://storage.googleapis.com/music-practice-tool/violin_a4.mp3', fact: 'The violin is the highest-pitched string instrument.' },
  { name: 'Drums', emoji: '🥁', sound: 'https://storage.googleapis.com/music-practice-tool/drum_snare.mp3', fact: 'Drums help us keep the rhythm.' },
  { name: 'Trumpet', emoji: '🎺', sound: 'https://storage.googleapis.com/music-practice-tool/trumpet_c5.mp3', fact: 'You buzz your lips to make a sound on a trumpet.' },
  { name: 'Saxophone', emoji: '🎷', sound: 'https://storage.googleapis.com/music-practice-tool/saxophone_a4.mp3', fact: 'The saxophone is made of brass but is a woodwind instrument.' },
];

const InstrumentButton: React.FC<{ instrument: typeof instruments[0]; onPlay: (instrument: typeof instruments[0]) => void; }> = ({ instrument, onPlay }) => (
    <button 
        onClick={() => onPlay(instrument)}
        className="bg-gray-800/50 p-6 rounded-2xl border-2 border-gray-700 text-center transform hover:scale-110 hover:border-amber-400 transition-all duration-300 flex flex-col items-center justify-center aspect-square"
    >
        <span className="text-7xl mb-4">{instrument.emoji}</span>
        <span className="text-2xl font-bold text-white">{instrument.name}</span>
    </button>
);

export const KindergartenView: React.FC = () => {
    const [activeInstrument, setActiveInstrument] = useState<typeof instruments[0] | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const playSound = useCallback((instrument: typeof instruments[0]) => {
        setActiveInstrument(instrument);
        if (audioRef.current) {
            audioRef.current.src = instrument.sound;
            audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        }
    }, []);

    const welcomeMessage = "Welcome little artists! I'm Maestra Dulzura. Touch an instrument to hear its beautiful sound and learn a fun secret about it!";

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in text-center">
            <audio ref={audioRef} />
            <div className="mb-12">
                <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#fcd34d' }}>
                    Salón de Kinder
                </h1>
                <div className="flex items-center justify-center gap-3 max-w-2xl mx-auto">
                    <AudioPlayerButton 
                        getAudioData={() => generateSpeechFromText(welcomeMessage, 'Puck')} 
                        className="flex-shrink-0"
                    />
                    <p className="text-lg text-gray-300">{welcomeMessage}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                {instruments.map(inst => (
                    <InstrumentButton key={inst.name} instrument={inst} onPlay={playSound} />
                ))}
            </div>

            {activeInstrument && (
                <div className="max-w-2xl mx-auto bg-gray-800/70 p-6 rounded-xl border border-amber-500/50 animate-fade-in">
                     <div className="flex items-center justify-center gap-3">
                        <AudioPlayerButton 
                            getAudioData={() => generateSpeechFromText(activeInstrument.fact, 'Puck')} 
                            className="flex-shrink-0"
                        />
                        <p className="text-xl text-amber-400 font-semibold">{activeInstrument.fact}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
