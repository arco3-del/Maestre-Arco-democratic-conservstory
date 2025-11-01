import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getMultimodalPracticeFeedback, getPracticeFollowUp } from '../../services/geminiService';
import type { Lesson, AppState } from '../../App';
import { AudioPlayerButton } from '../shared/AudioPlayerButton';
import { generateSpeechFromText } from '../../services/geminiService';

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
const Alert: React.FC<{ message: string }> = ({ message }) => <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg" role="alert">{message}</div>;

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const PracticeRoom: React.FC<{ lesson: Lesson | null; onNavigate: (state: AppState) => void; }> = ({ lesson, onNavigate }) => {
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'finished'>('idle');
  const [feedback, setFeedback] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(60);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'maestro', text: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentLesson = lesson || { id: 'free-practice', name: 'Free Practice', module: 'General', description: 'Warm-ups and general exercises.' };
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const cleanupMedia = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setupMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing media devices.", err);
      setError("Could not access camera and microphone. Please check your browser permissions.");
    }
  }, []);

  useEffect(() => {
    setupMedia();
    return () => {
      cleanupMedia();
    };
  }, [setupMedia, cleanupMedia]);
  
  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus('processing');
  }, []);

  const handleStartRecording = () => {
    if (!streamRef.current) {
        setError("Camera is not available. Try refreshing the page.");
        return;
    }
    setError(null);
    setFeedback(null);
    setChatHistory([]);
    recordedChunksRef.current = [];
    
    const options = { mimeType: 'video/webm; codecs=vp9,opus' };
    try {
        mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
    } catch (e) {
        console.warn("video/webm with vp9/opus not supported, trying default.");
        try {
            mediaRecorderRef.current = new MediaRecorder(streamRef.current);
        } catch (e2) {
             setError("Could not start recording. Your browser might not be supported.");
             return;
        }
    }

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorderRef.current.onstop = async () => {
        const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        try {
            const base64Video = await blobToBase64(videoBlob);
            const aiFeedback = await getMultimodalPracticeFeedback(base64Video, currentLesson.name);
            setFeedback(aiFeedback);
            setStatus('finished');
        } catch (err: any) {
            setError(err.message || 'An error occurred during analysis. Please try again.');
            setStatus('idle');
        }
    };

    mediaRecorderRef.current.start();
    setStatus('recording');
    setRecordingTime(60);

    timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
            if (prev <= 1) {
                handleStopRecording();
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
  };
  
    const handleSendFollowUp = async () => {
        if (!userInput.trim() || !feedback) return;

        const newUserMessage = { role: 'user' as const, text: userInput };
        const updatedHistory = [...chatHistory, newUserMessage];
        setChatHistory(updatedHistory);
        setUserInput('');
        setIsFollowUpLoading(true);

        try {
            const maestroResponseText = await getPracticeFollowUp(feedback, updatedHistory, userInput);
            setChatHistory(prev => [...prev, { role: 'maestro', text: maestroResponseText }]);
        } catch (e) {
            setChatHistory(prev => [...prev, { role: 'maestro', text: "Apologies, I'm having trouble connecting. Please try again in a moment." }]);
        } finally {
            setIsFollowUpLoading(false);
        }
    };


  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold">Multimodal Practice Room</h2>
          <p className="text-lg text-gray-400 mt-2">Current Lesson: <span className="text-amber-400 font-semibold">{currentLesson.name}</span></p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                 <video ref={videoRef} autoPlay muted playsInline className="w-full aspect-video rounded-md bg-gray-900 mb-4"></video>
                 {status === 'recording' ? (
                    <button onClick={handleStopRecording} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full text-lg flex items-center justify-center animate-fade-in">
                        <span className="animate-pulse">Stop Recording</span>
                        <span className="ml-4 bg-red-800/50 text-white text-sm font-mono rounded-md px-2 py-1">{recordingTime}s</span>
                    </button>
                 ) : (
                    <button onClick={handleStartRecording} disabled={status === 'processing'} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full text-lg disabled:bg-gray-600 animate-fade-in">
                        {status === 'processing' ? <span className="flex items-center justify-center"><Spinner /> <span className="ml-2">Analyzing...</span></span> : 'Record Practice (max 60s)'}
                    </button>
                 )}
            </div>
            
            <div className="min-h-[400px]">
                {error && <Alert message={error} />}
                {status === 'idle' && !error && (
                    <div className="text-center p-8 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700 h-full flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-white">Ready for your feedback</h3>
                        <p className="text-gray-400 mt-2">Record a video of your practice to receive a multimodal analysis from Maestre Arco.</p>
                    </div>
                )}
                {status === 'processing' && (
                     <div className="text-center p-8 bg-gray-800/50 rounded-lg h-full flex flex-col justify-center">
                        <div className="mx-auto"><Spinner /></div>
                        <p className="text-gray-400 mt-4">Analyzing your performance...</p>
                    </div>
                )}
                {feedback && status === 'finished' && (
                  <div className="space-y-6">
                      <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 space-y-4 animate-fade-in">
                        <h3 className="text-2xl font-bold text-amber-400 mb-3">Multimodal Feedback:</h3>
                        <div>
                            <h4 className="font-semibold text-lg text-white">🎵 Audio Analysis</h4>
                            <p className="text-sm text-gray-400 mt-1"><strong className="text-gray-300">Tuning:</strong> {feedback.audioFeedback.tuning}</p>
                            <p className="text-sm text-gray-400 mt-1"><strong className="text-gray-300">Rhythm:</strong> {feedback.audioFeedback.rhythm}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-lg text-white">📹 Video Analysis</h4>
                            <p className="text-sm text-gray-400 mt-1"><strong className="text-gray-300">Posture:</strong> {feedback.videoFeedback.posture}</p>
                            <p className="text-sm text-gray-400 mt-1"><strong className="text-gray-300">Technique:</strong> {feedback.videoFeedback.technique}</p>
                        </div>
                         <div className="pt-2 border-t border-gray-700 text-gray-300 italic flex items-start gap-2">
                            <AudioPlayerButton getAudioData={() => generateSpeechFromText(feedback.overallComment, 'Kore')} className="flex-shrink-0 mt-1" />
                            <span>"{feedback.overallComment}"</span>
                         </div>
                      </div>

                      <div className="animate-fade-in">
                          <h3 className="text-xl font-bold mb-3 text-amber-400">Conversation with Maestre Arco</h3>
                          <div className="h-48 bg-gray-900/50 rounded-t-lg p-3 flex flex-col border border-b-0 border-gray-700">
                            <div className="flex-grow space-y-3 overflow-y-auto pr-2">
                              {chatHistory.map((msg, i) => (
                                  <div key={i} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                      {msg.role === 'maestro' && <img src="https://picsum.photos/seed/arco/40" alt="Maestre Arco" className="w-8 h-8 rounded-full flex-shrink-0" />}
                                      <div className={`p-2 rounded-lg max-w-md ${msg.role === 'user' ? 'bg-blue-800' : 'bg-gray-700'}`}>
                                          <div className="flex items-start gap-2">
                                              {msg.role === 'maestro' && <AudioPlayerButton getAudioData={() => generateSpeechFromText(msg.text, 'Kore')} className="flex-shrink-0 mt-0.5" />}
                                              <p className="text-sm text-white">{msg.text}</p>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                              {isFollowUpLoading && (
                                <div className="flex items-start gap-2">
                                  <img src="https://picsum.photos/seed/arco/40" alt="Maestre Arco" className="w-8 h-8 rounded-full flex-shrink-0" />
                                  <div className="p-2 rounded-lg bg-gray-700">
                                    <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                                  </div>
                                </div>
                              )}
                              <div ref={chatEndRef} />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 border border-gray-700 rounded-b-lg p-2 bg-gray-800">
                              <input
                                  type="text"
                                  value={userInput}
                                  onChange={(e) => setUserInput(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && handleSendFollowUp()}
                                  placeholder="Ask a follow-up question..."
                                  className="w-full flex-grow bg-gray-700/50 border border-gray-600 rounded-md p-2 text-white focus:ring-amber-500 focus:border-amber-500"
                                  disabled={isFollowUpLoading}
                              />
                              <button onClick={handleSendFollowUp} disabled={isFollowUpLoading || !userInput.trim()} className="bg-amber-500 text-gray-900 font-bold px-4 py-2 rounded-md hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0">
                                  {isFollowUpLoading ? <Spinner /> : 'Send'}
                              </button>
                          </div>
                      </div>
                  </div>
                )}
            </div>
        </div>
    </div>
  );
};
