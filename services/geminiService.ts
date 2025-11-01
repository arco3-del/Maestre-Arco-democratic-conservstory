import { GoogleGenAI, Type, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key should be set.
  console.warn("API_KEY environment variable not set. Using a placeholder. The app will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function generatePersonalizedPlan(answers: any): Promise<any> {
  try {
    const textPart = {
      text: `
        Act as an expert music and art pedagogue. Based on the student's answers, generate a 10-module curriculum in JSON format.
        
        Student's answers:
        - Experience: ${answers.experience}
        - Interests: ${answers.instrument}, ${answers.visualArt}
        - Availability: ${answers.timeCommitment}

        The JSON must have a "modules" key which is an array of 10 objects. Each object must have "title", "description", and "duration".
        The plan should be progressive, coherent, and tailored to a student with this profile. For example, a beginner needs solid fundamentals, while a professional needs advanced topics.
        The duration of each module should reflect the student's availability.
      `,
    };

     const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts: [textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  duration: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString);

  } catch (error)
 {
    console.error("Error generating personalized plan:", error);
    throw new Error("Could not generate the personalized curriculum.");
  }
}


export async function getMultimodalPracticeFeedback(videoBase64: string, lessonName: string): Promise<any> {
    try {
        const videoPart = {
            inlineData: {
                mimeType: 'video/webm',
                data: videoBase64,
            },
        };
        const textPart = {
            text: `
              Act as Maestre Arco, an expert and perceptive music teacher. Analyze this student's practice video for the lesson "${lessonName}".
              Provide detailed multimodal feedback in English. Your response MUST be a JSON object following the provided schema. Your tone should be precise, technical, and encouraging.
              
              Analyze two main areas:
              1.  **Audio Analysis:** Evaluate tuning, rhythm, and dynamics.
              2.  **Video Analysis:** Evaluate posture, hand position (if visible), and overall technique.

              For each point, provide a specific and constructive comment. Be encouraging but precise.
              Conclude your feedback by asking in a friendly tone: 'Did you understand this feedback? Do you have any doubts? Let me know if anything is unclear, and we can go over it.'
            `,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [videoPart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        audioFeedback: {
                            type: Type.OBJECT,
                            properties: {
                                tuning: { type: Type.STRING, description: "Feedback on tuning." },
                                rhythm: { type: Type.STRING, description: "Feedback on rhythm and tempo." },
                            },
                        },
                        videoFeedback: {
                           type: Type.OBJECT,
                            properties: {
                                posture: { type: Type.STRING, description: "Feedback on body posture." },
                                technique: { type: Type.STRING, description: "Feedback on visible technique (hands, etc.)." },
                            },
                        },
                        overallComment: { type: Type.STRING, description: "An overall encouraging comment that ends with a question inviting follow-up." }
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error fetching multimodal feedback from Gemini API:", error);
        throw new Error("Could not get multimodal feedback at this time.");
    }
}

export async function getPracticeFollowUp(
  initialFeedback: any,
  chatHistory: { role: string; text: string }[],
  newUserQuestion: string
): Promise<string> {
  try {
    const historyString = chatHistory
      .map((msg) => `${msg.role === 'user' ? 'Student' : 'Maestro'}: ${msg.text}`)
      .join('\n');

    const prompt = `
      You are Maestre Arco, an expert music teacher. You have already provided the following initial multimodal feedback to a student based on a video of their practice:

      INITIAL FEEDBACK:
      - Audio (Tuning): ${initialFeedback.audioFeedback.tuning}
      - Audio (Rhythm): ${initialFeedback.audioFeedback.rhythm}
      - Video (Posture): ${initialFeedback.videoFeedback.posture}
      - Video (Technique): ${initialFeedback.videoFeedback.technique}
      - Overall Comment: ${initialFeedback.overallComment}

      Now, continue the conversation. Here is the conversation history so far:
      ${historyString}

      The student has just asked the following question:
      Student: "${newUserQuestion}"

      Your task is to respond to the student's question in a helpful, encouraging, and clear manner, referencing the initial feedback when necessary. Keep your response conversational and focused on clarifying their doubts.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating follow-up response:", error);
    throw new Error("Could not get a follow-up response at this time.");
  }
}


export async function getKnowledgeHallResponse(chatHistory: { role: string, text: string }[]): Promise<{ text: string, sources: any[] }> {
    try {
        const lastUserQuestion = chatHistory[chatHistory.length - 1].text;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
              Act as Maestro Arath Bajali, the tutor of the Knowledge Hall. Your persona is intellectual, insightful, and you challenge perception.
              You are a knowledge curator: consult the web for the most accurate information, synthesize it in an academic and encouraging manner, and CITE YOUR SOURCES.
              Answer the following student question: "${lastUserQuestion}"
            `,
            config: {
                tools: [{googleSearch: {}}],
            },
        });

        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { text: response.text, sources };

    } catch (error) {
        console.error("Error fetching knowledge hall response from Gemini API:", error);
        return { 
            text: "My apologies, there seems to be a problem connecting to the library. Please try your question again in a moment.",
            sources: []
        };
    }
}

export async function generateHolographicAvatar(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        if (!base64ImageBytes) {
            throw new Error("The model did not return an image. The prompt may have been blocked.");
        }
        return base64ImageBytes;

    } catch (error) {
        console.error("Error generating avatar:", error);
        throw new Error("Could not generate the holographic avatar. The prompt might be too complex or violate safety policies.");
    }
}

export async function generateSpeechFromText(text: string, voiceName: string = 'Kore'): Promise<string> {
    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("The model did not return any audio data.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error generating speech from text:", error);
        throw new Error("Could not generate audio at this time.");
    }
}

export async function analyzeComposition(symbols: string[]): Promise<string> {
  if (symbols.length === 0) {
    return "The staff is empty. Please add some musical symbols before I can analyze your composition.";
  }
  try {
    const compositionText = symbols.join(', '); // e.g., "Quarter Note, Slur, Half Note"
    const prompt = `
      Act as Maestre Arco. A student has composed a short musical phrase represented by the following sequence of symbols: ${compositionText}.
      Provide brief, encouraging, and pedagogical feedback. Comment on the melodic contour, rhythmic interest, and expressive potential.
      Keep the analysis concise and suitable for a developing composer.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing composition:", error);
    throw new Error("Could not analyze the composition at this time.");
  }
}
