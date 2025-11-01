import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality } from '@google/genai';
import { decode, decodeAudioData, createBlob } from '../../utils/audioUtils';

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
const Alert: React.FC<{ message: string }> = ({ message }) => <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg" role="alert">{message}</div>;

// Pitch detection and visualization logic
const PitchVisualizer: React.FC<{ stream: MediaStream | null }> = ({ stream }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        if (!stream || !canvasRef.current) return;

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');

        const draw = () => {
            if (!canvasCtx) return;
            animationFrameRef.current = requestAnimationFrame(draw);
            
            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = 'rgb(31, 41, 55)';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(251, 191, 36)';
            canvasCtx.beginPath();

            const sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;
                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }
                x += sliceWidth;
            }
            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameRef.current!);
            source.disconnect();
            audioContext.close();
        };
    }, [stream]);

    return <canvas ref={canvasRef} className="w-full h-32 bg-gray-800 rounded-lg border border-gray-700"></canvas>;
};


export const VocalStudioView: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'finished'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [coachFeedback, setCoachFeedback] = useState("When you're ready, press 'Start Session' for real-time vocal coaching with Maestra Gloria Spirit.");
    
    const sessionRef = useRef<LiveSession | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const cleanup = useCallback(() => {
        if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
        if (audioContextRef.current?.state !== 'closed') audioContextRef.current?.close();
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        if (sessionRef.current) sessionRef.current.close();
        
        scriptProcessorRef.current = null;
        audioContextRef.current = null;
        streamRef.current = null; // Clear the stream to stop the visualizer
        sessionRef.current = null;
        setStatus('idle');
    }, []);

    const startSession = async () => {
        setStatus('connecting');
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setCoachFeedback('Connected! Let\'s begin with a simple warm-up. Sing a comfortable "ah" sound and hold it.');
                        setStatus('active');
                    },
                    onmessage: (message: LiveServerMessage) => {
                        if (message.serverContent?.outputTranscription) {
                            const text = message.serverContent.outputTranscription.text;
                             setCoachFeedback(prev => prev.endsWith(' ') ? prev + text : prev + ' ' + text);
                        }
                         if (message.serverContent?.turnComplete) {
                            setCoachFeedback(prev => prev + " "); // Add space for next sentence
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setError('Connection to the Vocal Studio was lost.');
                        cleanup();
                    },
                    onclose: () => setStatus('finished'),
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    outputAudioTranscription: {},
                    inputAudioTranscription: {}, // To allow the model to hear and respond
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
                    },
                    systemInstruction: 'You are Maestra Gloria Spirit, a world-class vocal coach. Your persona is passionate, soulful, and deeply encouraging. You are providing real-time feedback as a student sings vocal exercises. Keep your feedback focused on both healthy technique and emotional expression (e.g., "Feel the note, don\'t just sing it!", "Yes, that\'s the correct placement!", "More support from your diaphragm, darling!", "Let your soul shine through that note!"). Respond in short, helpful, passionate phrases, but only provide audio output for your voice.',
                },
            });
            
            sessionRef.current = await sessionPromise;
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Set up audio processing for Gemini
            const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContext({ sampleRate: 16000 });
            const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
            scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (event) => {
                const inputData = event.inputBuffer.getChannelData(0);
                sessionPromise.then(session => session.sendRealtimeInput({ media: createBlob(inputData) }));
            };
            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(audioContextRef.current.destination);

        } catch (err) {
            console.error(err);
            setError("Could not start the session. Please check microphone permissions.");
            cleanup();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold">Salón de Voz</h2>
                <p className="text-lg text-gray-400 mt-2">Real-time Vocal Coaching with Maestra Gloria Spirit</p>
            </div>
            
            <div className="max-w-3xl mx-auto bg-gray-800/50 p-8 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-amber-400 mb-4">Live Pitch Visualizer</h3>
                <PitchVisualizer stream={streamRef.current} />

                <div className="mt-8 text-center bg-gray-900/50 p-6 rounded-lg min-h-[100px] flex items-center justify-center border border-gray-700">
                     <p className="text-lg text-white italic">"{coachFeedback}"</p>
                </div>
                 {error && <div className="my-4"><Alert message={error} /></div>}

                 <div className="mt-8 text-center">
                    {status === 'idle' && (
                        <button onClick={startSession} className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-8 rounded-full text-lg">
                            Start Session
                        </button>
                    )}
                    {status === 'connecting' && (
                         <button disabled className="bg-gray-600 text-white font-bold py-3 px-8 rounded-full text-lg flex items-center justify-center mx-auto">
                            <Spinner /> <span className="ml-2">Connecting...</span>
                        </button>
                    )}
                     {status === 'active' && (
                        <button onClick={cleanup} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg">
                            End Session
                        </button>
                    )}
                     {status === 'finished' && (
                        <div className="animate-fade-in">
                           <p className="text-green-400 mb-4">Session finished. Great work today!</p>
                           <button onClick={startSession} className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-8 rounded-full text-lg">
                                Start Another Session
                           </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
