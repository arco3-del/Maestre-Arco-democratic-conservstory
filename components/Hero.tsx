
import React, { useState, useRef } from 'react';
import { generateHolographicAvatar } from '../services/geminiService';
import type { AppState } from '../App';
import { VoiceInputButton } from './shared/VoiceInputButton';

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>;
const Alert: React.FC<{ message: string }> = ({ message }) => <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg" role="alert">{message}</div>;

export const ProfileView: React.FC<{ onNavigate: (state: AppState) => void; }> = ({ onNavigate }) => {
    const [prompt, setPrompt] = useState('A highly detailed, photorealistic holographic portrait of a passionate female pianist with curly brown hair, smiling gently, wearing a classic black concert gown. The background is a futuristic conservatory hall with glowing musical notes floating in the air. Ethereal, cinematic lighting.');
    const [generatedAvatar, setGeneratedAvatar] = useState<string | null>('https://picsum.photos/seed/hologram/512'); // Default placeholder
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const avatarContainerRef = useRef<HTMLDivElement>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a description for your avatar.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const base64Image = await generateHolographicAvatar(prompt);
            setGeneratedAvatar(`data:image/jpeg;base64,${base64Image}`);
        } catch (e: any) {
            setError(e.message || "Failed to generate avatar. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!avatarContainerRef.current) return;
        const { left, top, width, height } = avatarContainerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const rotateY = (x - width / 2) / (width / 2) * 15; // Max rotation 15deg
        const rotateX = -(y - height / 2) / (height / 2) * 15; // Max rotation 15deg

        const glareX = (x / width) * 100;
        const glareY = (y / height) * 100;
        
        avatarContainerRef.current.style.setProperty('--glare-x', `${glareX}%`);
        avatarContainerRef.current.style.setProperty('--glare-y', `${glareY}%`);

        avatarContainerRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
        if (!avatarContainerRef.current) return;
        avatarContainerRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold">Salón de Credenciales</h1>
                <p className="text-lg text-amber-400 mt-2">Your Holographic Identity and Achievements</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 flex flex-col items-center [perspective:1000px]">
                    <h2 className="text-2xl font-bold mb-4 text-center">Your Holographic Self</h2>
                    <div
                         ref={avatarContainerRef}
                         onMouseMove={handleMouseMove}
                         onMouseLeave={handleMouseLeave}
                         className="relative w-full max-w-sm aspect-square p-2 rounded-lg bg-gray-800/50 border border-amber-500/30 shadow-2xl shadow-amber-500/10 holographic-border-shimmer transition-transform duration-200"
                         style={{
                             backgroundImage: 'linear-gradient(to right, rgba(251, 191, 36, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(251, 191, 36, 0.05) 1px, transparent 1px)',
                             backgroundSize: '2rem 2rem',
                             transformStyle: 'preserve-3d'
                         }}>
                        <div className="relative w-full h-full flex items-center justify-center rounded-md overflow-hidden">
                           {isLoading ? (
                                <div className="flex flex-col items-center text-center">
                                    <Spinner />
                                    <p className="mt-4 text-amber-400">Generating...</p>
                                </div>
                           ) : generatedAvatar ? (
                                <img src={generatedAvatar} alt="Generated Holographic Avatar" className="w-full h-full object-cover" />
                           ) : (
                               <div className="text-center text-gray-500">
                                   <p>Your avatar will appear here.</p>
                               </div>
                           )}
                           <div className="pointer-events-none absolute inset-0 rounded-md" style={{
                                background: 'radial-gradient(circle at var(--glare-x) var(--glare-y), rgba(255, 255, 255, 0.1), transparent 40%)'
                           }}></div>
                        </div>
                         <div className="absolute -bottom-2 -left-2 -right-2 h-1 bg-amber-400 blur-md"></div>
                         <div className="absolute -top-2 -left-2 -right-2 h-1 bg-cyan-400 blur-md"></div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                     <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 mb-8">
                         <h3 className="text-xl font-bold text-amber-400 mb-3">Generate Your Avatar</h3>
                         <p className="text-gray-400 text-sm mb-4">Describe your appearance or the artistic persona you want to project. The AI will create your unique holographic portrait.</p>
                         <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={4}
                                className="w-full bg-gray-900/50 border border-gray-600 rounded-md p-3 pr-10 text-white focus:ring-amber-500 focus:border-amber-500"
                                placeholder="e.g., A male violinist with silver hair, in a rainy, neon-lit city..."
                            />
                            <VoiceInputButton 
                                onTranscript={(transcript) => setPrompt(prev => prev ? `${prev} ${transcript}`: transcript)} 
                                className="absolute top-3 right-3"
                            />
                         </div>
                         <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4 bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-md hover:bg-amber-600 disabled:bg-gray-600 transition-colors">
                             {isLoading ? 'Generating...' : 'Generate Identity'}
                         </button>
                         {error && <div className="mt-4"><Alert message={error} /></div>}
                     </div>

                     <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                         <h3 className="text-xl font-bold text-amber-400 mb-4">Credentials & Honors</h3>
                         <div className="space-y-3">
                             <p className="text-white"><strong className="font-semibold text-gray-300">Student Name:</strong> Artist</p>
                             <p className="text-white"><strong className="font-semibold text-gray-300">Enrolled:</strong> {new Date().toLocaleDateString()}</p>
                             <p className="text-white"><strong className="font-semibold text-gray-300">Discipline:</strong> Music & Visual Arts</p>
                             <p className="text-white"><strong className="font-semibold text-gray-300">Status:</strong> <span className="text-green-400">Active</span></p>
                             <div className="pt-3 border-t border-gray-700">
                                 <h4 className="font-semibold text-gray-300">Achievements:</h4>
                                 <ul className="list-disc list-inside text-gray-400 mt-2">
                                     <li>Module 1: Foundations - Completed</li>
                                     <li>Module 2: Theory I - Completed</li>
                                     <li>Weekly Challenge: "Baroque Improvisation" - First Place</li>
                                 </ul>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};
