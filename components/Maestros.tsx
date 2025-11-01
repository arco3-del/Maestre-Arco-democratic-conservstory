import React from 'react';
import { generateSpeechFromText } from '../services/geminiService';
import { AudioPlayerButton } from './shared/AudioPlayerButton';

const MaestroCard: React.FC<{ name: string; title: string; description: string; imageUrl: string; voiceName: string; }> = ({ name, title, description, imageUrl, voiceName }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center transform hover:scale-105 hover:border-amber-400 transition-all duration-300 flex flex-col">
        <img src={imageUrl} alt={`Portrait of ${name}`} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-700 object-cover" />
        <h3 className="text-2xl font-bold mb-1">{name}</h3>
        <p className="text-amber-400 font-semibold mb-3">{title}</p>
        <div className="flex-grow flex items-center">
            <div className="flex items-start gap-2 text-sm text-gray-400 text-left">
                <AudioPlayerButton getAudioData={() => generateSpeechFromText(description, voiceName)} className="flex-shrink-0 mt-1" />
                <p>{description}</p>
            </div>
        </div>
    </div>
);

export const Maestros: React.FC = () => {
    const maestros = [
        {
            name: "Maestre Arco",
            title: "Director | Classical & Contemporary Music",
            description: "Technique is the foundation upon which art is built. We must master the rules so we can break them with intention and beauty.",
            imageUrl: "https://picsum.photos/seed/arco/200",
            voiceName: "Kore"
        },
        {
            name: "Gloria Spirit",
            title: "Maestra of Vocal Arts",
            description: "Your voice is your soul made sound. Learn to release it with passion, but protect it with flawless and healthy technique.",
            imageUrl: "https://picsum.photos/seed/gloria/200",
            voiceName: "Zephyr"
        },
        {
            name: "Rostit",
            title: "Maestro of Painting & Visual Arts",
            description: "The canvas is a mirror. Every brushstroke reveals not just the image, but the artist. Let us paint with honesty and courage.",
            imageUrl: "https://picsum.photos/seed/rostit/200",
            voiceName: "Fenrir"
        },
        {
            name: "Arath Bajali",
            title: "Maestro of Sculpture & Theory",
            description: "Art is not in the marble, but in the space that surrounds it. Let us challenge perception and shape the world with new ideas.",
            imageUrl: "https://picsum.photos/seed/arath/200",
            voiceName: "Charon"
        },
        {
            name: "Dulzura Music",
            title: "Maestra of Early Childhood Music",
            description: "Every sound is a smile waiting to be heard. We plant the seeds of art with joy, play, and endless curiosity.",
            imageUrl: "https://picsum.photos/seed/dulzura/200",
            voiceName: "Puck"
        }
    ];

    return (
        <section id="maestros" className="py-20 bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold">Meet the Conservatory Mentors</h2>
                    <p className="text-lg text-gray-400 mt-2 max-w-3xl mx-auto">
                        An elite faculty of specialists dedicated to your growth, led by Maestre Arco.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {maestros.map(m => <MaestroCard key={m.name} {...m} />)}
                </div>
            </div>
        </section>
    );
};
