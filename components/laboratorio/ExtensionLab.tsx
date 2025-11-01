
import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { Maestros } from '../Maestros'; // We can reuse this to get maestro data

const maestroData = [
    {
        id: 'arco',
        name: "Maestre Arco",
        title: "Discipline & Precision",
        imageUrl: "https://picsum.photos/seed/arco/200",
        prompt: "You are Maestre Arco. Your feedback is precise, technical, and encouraging. You focus on the mastery of rules to achieve artistic freedom."
    },
    {
        id: 'gloria',
        name: "Gloria Spirit",
        title: "Passion & Soul",
        imageUrl: "https://picsum.photos/seed/gloria/200",
        prompt: "You are Maestra Gloria Spirit. Your feedback is passionate, focusing on emotion and healthy technique. You believe the voice is the soul made sound."
    },
    {
        id: 'rostit',
        name: "Rostit",
        title: "Honesty & Courage",
        imageUrl: "https://picsum.photos/seed/rostit/200",
        prompt: "You are Maestro Rostit. Your feedback is honest and courageous. You encourage the student to see their art as a mirror of their inner self."
    },
    {
        id: 'arath',
        name: "Arath Bajali",
        title: "Perception & Ideas",
        imageUrl: "https://picsum.photos/seed/arath/200",
        prompt: "You are Maestro Arath Bajali. Your feedback is intellectual and challenges perception. You push the student to shape the world with new ideas."
    }
];

const MaestroCard: React.FC<{ maestro: typeof maestroData[0], onSelect: () => void, isSelected: boolean }> = ({ maestro, onSelect, isSelected }) => (
    <div
        onClick={onSelect}
        className={`bg-gray-800/50 p-6 rounded-lg border-2 text-center transform hover:scale-105 transition-all duration-300 cursor-pointer ${isSelected ? 'border-amber-400 ring-2 ring-amber-400' : 'border-gray-700 hover:border-amber-400'}`}
    >
        <img src={maestro.imageUrl} alt={`Portrait of ${maestro.name}`} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700 object-cover" />
        <h3 className="text-xl font-bold mb-1 text-white">{maestro.name}</h3>
        <p className="text-amber-400 font-semibold">{maestro.title}</p>
    </div>
);


export const ExtensionLab: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [selectedMaestro, setSelectedMaestro] = useState<typeof maestroData[0] | null>(null);

    const generatePopupJs = (maestroPrompt: string) => `
const promptInput = document.getElementById('prompt');
const sendButton = document.getElementById('send');
const responseDiv = document.getElementById('response');
const mentorNameEl = document.getElementById('mentor-name');

mentorNameEl.textContent = 'Your Mentor: ${selectedMaestro?.name || 'AI'}';

sendButton.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    sendButton.disabled = true;
    responseDiv.textContent = 'Thinking...';

    try {
        const response = await window.ai.services.prompt.execute(
            { prompt: "${maestroPrompt.replace(/"/g, '\\"')} " + prompt },
            { stream: true }
        );
        
        responseDiv.textContent = '';
        for await (const chunk of response) {
            responseDiv.textContent += chunk;
        }

    } catch (e) {
        responseDiv.textContent = 'Error: ' + e.message;
    } finally {
        sendButton.disabled = false;
    }
});`;

    const EXTENSION_FILES = {
        'manifest.json': {
          language: 'json',
          content: `{
    "manifest_version": 3,
    "name": "Conservatory Mentor",
    "version": "1.0",
    "description": "Your chosen AI mentor in your browser, powered by Gemini Nano.",
    "action": {
        "default_popup": "popup.html",
        "default_icon": "icon.png"
    },
    "icons": { "128": "icon.png" },
    "ai": { "services": { "prompt": { "builtIn": "geminiNano" } } }
}`
        },
        'popup.html': {
          language: 'html',
          content: `<!DOCTYPE html>
<html>
<head>
    <title>AI Mentor</title>
    <link href="https://cdn.tailwindcss.com"></script>
    <style>
        body { width: 300px; font-family: sans-serif; background-color: #1f2937; color: white; }
        .container { padding: 16px; }
        #prompt { background-color: #374151; border-color: #4b5563; }
        button { background-color: #f59e0b; color: #111827; }
        button:disabled { background-color: #4b5563; }
    </style>
</head>
<body>
    <div class="container">
        <h1 id="mentor-name" class="text-lg font-bold mb-2">Your Mentor</h1>
        <textarea id="prompt" rows="4" class="w-full p-2 rounded border" placeholder="Ask me anything..."></textarea>
        <button id="send" class="w-full mt-2 py-2 px-4 font-bold rounded">Send</button>
        <div id="response" class="mt-4 p-2 bg-gray-800 rounded text-sm whitespace-pre-wrap"></div>
    </div>
    <script src="popup.js"></script>
</body>
</html>`
        },
        'popup.js': {
          language: 'javascript',
          content: selectedMaestro ? generatePopupJs(selectedMaestro.prompt) : '// Select a mentor to generate this file.'
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="container mx-auto max-w-5xl text-center animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">The Mentor's Workshop</h1>
                <p className="text-xl text-amber-400 mb-8">Choose your personal AI mentor. They will power your browser extension.</p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {maestroData.map(m => (
                        <MaestroCard 
                            key={m.id}
                            maestro={m}
                            isSelected={selectedMaestro?.id === m.id}
                            onSelect={() => setSelectedMaestro(m)}
                        />
                    ))}
                </div>


                {selectedMaestro && (
                    <div className="text-left animate-fade-in">
                        <h3 className="text-2xl font-bold mb-4 text-center">Your Assistant with <span className="text-amber-400">{selectedMaestro.name}</span> is Ready!</h3>
                        
                        <div className="text-left bg-gray-900/50 p-6 rounded-lg border border-amber-500/30 my-8 max-w-4xl mx-auto">
                            <h4 className="text-2xl font-bold text-amber-400 mb-4 text-center">Your Mentor: The What, Why, and How</h4>
                            
                            <div className="space-y-4 text-gray-300">
                                <div>
                                    <h5 className="font-bold text-white">WHAT is this Extension?</h5>
                                    <p className="text-sm">This is a personal AI assistant, powered by the secure Gemini Nano model, that lives directly in your browser. It's not just a tool; it's a direct line to the pedagogical philosophy of the Maestro you've chosen. Because it runs 100% on your device, your interactions are completely private, instant, and available even without an internet connection.</p>
                                </div>
                                
                                <div>
                                    <h5 className="font-bold text-white">WHY is it important for your mastery?</h5>
                                    <p className="text-sm">Professional mastery isn't just about scheduled practice; it's about constant reflection, refinement, and having an expert perspective on demand. This mentor bridges the gap between your formal lessons and your daily creative process. It helps you cultivate a consistent, professional artistic mindset, guided by a world-class specialist 24/7.</p>
                                </div>

                                <div>
                                    <h5 className="font-bold text-white">HOW to use it for professional development:</h5>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li>
                                            <strong>Lyric/Script Analysis:</strong> Paste lyrics you're writing or a monologue you're studying. Ask your mentor for an instant analysis based on their specialty. <em>(e.g., "Gloria, where are the emotional peaks for a vocalist in this text?")</em>
                                        </li>
                                        <li>
                                            <strong>Theory Reinforcement:</strong> Encounter a complex concept online? Ask your mentor for an explanation in their unique style. <em>(e.g., "Arath, deconstruct the concept of polytonality for me.")</em>
                                        </li>
                                        <li>
                                            <strong>Creative Brainstorming:</strong> Feeling stuck? Describe your idea and ask for a conceptual push. <em>(e.g., "Rostit, I'm painting 'loneliness.' What color palettes would evoke this with honesty?")</em>
                                        </li>
                                        <li>
                                            <strong>Professional Communication:</strong> Drafting an email to a gallery or writing your artist bio? Ask your mentor to help you refine your language for maximum impact. <em>(e.g., "Arco, review this bio for clarity and precision.")</em>
                                        </li>
                                        <li>
                                            <strong>Daily Inspiration:</strong> Simply ask your mentor for a thought-provoking exercise or a piece of wisdom to keep your artistic mind sharp throughout the day.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            <div>
                                <h4 className="text-xl font-bold text-amber-400 mb-3">Installation Guide</h4>
                                <ol className="list-decimal list-inside text-gray-300 space-y-3 bg-gray-900/50 p-4 rounded-lg border border-amber-500/30">
                                    <li>Create a new folder on your computer named "MyMentorExtension".</li>
                                    <li>Inside that folder, create three files: <code>manifest.json</code>, <code>popup.html</code>, and <code>popup.js</code>.</li>
                                    <li>Copy and paste the code from each of the code blocks on the right into the corresponding files.</li>
                                    <li>You will also need an icon file named <code>icon.png</code> (128x128px) in the folder.</li>
                                    <li>Open your desktop Chrome browser and go to <code>chrome://extensions</code>.</li>
                                    <li>In the top-right corner, enable <strong>Developer mode</strong>.</li>
                                    <li>Click <strong>"Load unpacked"</strong> which appears on the top-left.</li>
                                    <li>Select the entire "MyMentorExtension" folder. Your mentor is now installed!</li>
                                </ol>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-amber-400 mb-3 text-center md:text-left">Extension Files</h4>
                                <CodeBlock fileName="manifest.json" language="json" code={EXTENSION_FILES['manifest.json'].content} />
                                <CodeBlock fileName="popup.html" language="html" code={EXTENSION_FILES['popup.html'].content} />
                                <CodeBlock fileName="popup.js" language="javascript" code={EXTENSION_FILES['popup.js'].content} />
                            </div>
                        </div>
                        
                        <div className="mt-12 flex justify-center">
                             <button onClick={onComplete} className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-8 rounded-full text-lg">
                                Continue to Dashboard &rarr;
                             </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
