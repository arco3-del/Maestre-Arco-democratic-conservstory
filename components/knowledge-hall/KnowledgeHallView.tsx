import React, { useState, useRef, useEffect } from 'react';
import { getKnowledgeHallResponse } from '../../services/geminiService';
import { VoiceInputButton } from '../shared/VoiceInputButton';
import { AudioPlayerButton } from '../shared/AudioPlayerButton';
import { generateSpeechFromText } from '../../services/geminiService';


const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

interface Message {
    role: 'user' | 'tutor';
    text: string;
    sources?: any[];
}

export const KnowledgeHallView: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'tutor', text: "Welcome to the Knowledge Hall. I am Maestro Arath Bajali. Challenge my perception. What concept shall we deconstruct today? My research is enhanced by Google Search to provide a deeper understanding." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMessage: Message = { role: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        
        try {
            const { text, sources } = await getKnowledgeHallResponse(newMessages.filter(m => m.role === 'user')); // Pass only user messages for context
            setMessages(prev => [...prev, { role: 'tutor', text, sources }]);
        } catch (error) {
             setMessages(prev => [...prev, { role: 'tutor', text: "I'm sorry, an error occurred while connecting to the library." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-150px)] animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold">Knowledge Hall</h2>
                <p className="text-lg text-gray-400 mt-2">Research with Maestro Arath Bajali</p>
            </div>
            
            <div className="flex-grow bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col">
                <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            {msg.role === 'tutor' && <img src="https://picsum.photos/seed/arath/200" alt="Maestro Arath Bajali" className="w-10 h-10 rounded-full flex-shrink-0" />}
                            <div className={`max-w-xl p-4 rounded-lg ${msg.role === 'user' ? 'bg-blue-800' : 'bg-gray-700'}`}>
                                <div className="flex items-start gap-2">
                                    {msg.role === 'tutor' && (
                                        <AudioPlayerButton getAudioData={() => generateSpeechFromText(msg.text, 'Charon')} className="flex-shrink-0 mt-1" />
                                    )}
                                    <p className="text-white whitespace-pre-wrap">{msg.text}</p>
                                </div>
                               {msg.sources && msg.sources.length > 0 && (
                                   <div className="mt-4 pt-2 border-t border-gray-600">
                                       <h4 className="text-xs font-semibold text-gray-400 mb-1">Sources:</h4>
                                       <div className="flex flex-wrap gap-2">
                                           {msg.sources.map((source, idx) => (
                                               source.web && <a href={source.web.uri} key={idx} target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-800 text-blue-300 hover:bg-gray-900 rounded-full px-2 py-1 transition-colors">
                                                   {source.web.title || new URL(source.web.uri).hostname}
                                               </a>
                                           ))}
                                       </div>
                                   </div>
                               )}
                            </div>
                         </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                             <img src="https://picsum.photos/seed/arath/200" alt="Maestro Arath Bajali" className="w-10 h-10 rounded-full flex-shrink-0" />
                             <div className="max-w-xl p-4 rounded-lg bg-gray-700">
                                <Spinner />
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                 <div className="flex items-center space-x-2 border-t border-gray-700 pt-4">
                    <div className="relative flex-grow">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about music theory, an artist, a historical period..."
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-3 pr-10 text-white focus:ring-amber-500 focus:border-amber-500"
                            disabled={isLoading}
                        />
                         <VoiceInputButton 
                            onTranscript={transcript => setInput(prev => prev ? `${prev} ${transcript}`: transcript)}
                            className="absolute top-1/2 right-3 -translate-y-1/2"
                        />
                    </div>
                    <button onClick={handleSend} disabled={isLoading || !input.trim()} className="h-full bg-amber-500 text-gray-900 font-bold px-6 rounded-md hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};
