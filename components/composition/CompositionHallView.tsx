import React, { useState } from 'react';
import { StaffSheet } from './StaffSheet';
import { MusicKeyboard } from './MusicKeyboard';
import { analyzeComposition } from '../../services/geminiService';
import { generateSpeechFromText } from '../../services/geminiService';
import { AudioPlayerButton } from '../shared/AudioPlayerButton';

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

export const CompositionHallView: React.FC = () => {
    const [composition, setComposition] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string | null>("");
    const [isLoading, setIsLoading] = useState(false);

    const addSymbol = (symbol: string) => {
        if (composition.length < 20) { // Limit composition length
            setComposition(prev => [...prev, symbol]);
        }
    };
    
    const deleteLastSymbol = () => {
        setComposition(prev => prev.slice(0, -1));
    };

    const handleAnalyze = async () => {
        setIsLoading(true);
        setFeedback(null);
        try {
            const analysis = await analyzeComposition(composition);
            setFeedback(analysis);
        } catch (error) {
            setFeedback("Sorry, I couldn't analyze the composition right now.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold">Salón de Composición</h2>
                <p className="text-lg text-gray-400 mt-2">The blank page for the new symphonies. Write your music.</p>
            </div>
            
            <div className="max-w-5xl mx-auto">
                <StaffSheet composition={composition} />
                <MusicKeyboard onAddSymbol={addSymbol} onDeleteSymbol={deleteLastSymbol} />

                <div className="mt-8 text-center">
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isLoading || composition.length === 0}
                        className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-8 rounded-full text-lg disabled:bg-gray-600"
                    >
                        {isLoading ? <span className="flex items-center gap-2"><Spinner /> Analyzing...</span> : "Analyze with Maestre Arco"}
                    </button>
                </div>

                {feedback && (
                    <div className="mt-8 max-w-3xl mx-auto bg-gray-800/50 p-6 rounded-lg border border-gray-700 animate-fade-in">
                        <h3 className="text-xl font-bold text-amber-400 mb-3">Maestre Arco's Feedback:</h3>
                        <div className="flex items-start gap-3">
                             <AudioPlayerButton getAudioData={() => generateSpeechFromText(feedback, 'Kore')} className="flex-shrink-0 mt-1" />
                            <p className="text-gray-300 italic">"{feedback}"</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
