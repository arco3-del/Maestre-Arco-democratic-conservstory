import React from 'react';
import { generateSpeechFromText } from '../../services/geminiService';
import { AudioPlayerButton } from '../shared/AudioPlayerButton';

const Message: React.FC<{ teacher: string; message: string; time: string; imageUrl: string; voiceName: string; }> = ({ teacher, message, time, imageUrl, voiceName }) => (
    <div className="flex items-start space-x-3 hover:bg-gray-800 p-2 rounded-md">
        <img src={imageUrl} alt={teacher} className="w-10 h-10 rounded-full object-cover"/>
        <div>
            <div className="flex items-baseline space-x-2">
                <h4 className="font-bold text-white">{teacher}</h4>
                <p className="text-xs text-gray-500">{time}</p>
            </div>
            <p className="text-sm text-gray-400 flex items-start gap-2">
                <AudioPlayerButton 
                    getAudioData={() => generateSpeechFromText(message, voiceName)}
                    className="mt-1 flex-shrink-0"
                />
                <span>{message}</span>
            </p>
        </div>
    </div>
);

export const TeacherMessages: React.FC = () => {
    const messages = [
        {
            teacher: "Maestre Arco",
            message: "Excellent progress on your composition. Today we will work on the harmonic transition you found difficult.",
            time: "2h ago",
            imageUrl: "https://picsum.photos/seed/arco/50",
            voiceName: "Kore"
        },
        {
            teacher: "Gloria Spirit",
            message: "Don't forget to warm up! I've updated your morning routine based on yesterday's session in the Vocal Studio.",
            time: "8h ago",
            imageUrl: "https://picsum.photos/seed/gloria/50",
            voiceName: "Zephyr"
        },
        {
            teacher: "Dulzura Music",
            message: "I saw our little artist was exploring the trumpet in the Kindergarten room! Wonderful to see such curiosity.",
            time: "1 day ago",
            imageUrl: "https://picsum.photos/seed/dulzura/50",
            voiceName: "Puck"
        },
        {
            teacher: "Maestro Rostit",
            message: "Your use of color in the last piece was very bold. Shall we explore the chiaroscuro technique today?",
            time: "1 day ago",
            imageUrl: "https://picsum.photos/seed/rostit/50",
            voiceName: "Fenrir"
        },
        {
            teacher: "Arath Bajali",
            message: "I saw your query in the Knowledge Hall. An interesting line of thought. Consider reading 'Ways of Seeing' by John Berger.",
            time: "2 days ago",
            imageUrl: "https://picsum.photos/seed/arath/50",
            voiceName: "Charon"
        }
    ];

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 h-full">
            <h2 className="text-2xl font-bold mb-4 text-amber-400">Messages from your Mentors</h2>
            <div className="space-y-4">
                {messages.map(msg => <Message key={msg.teacher} {...msg} />)}
            </div>
        </div>
    );
};
