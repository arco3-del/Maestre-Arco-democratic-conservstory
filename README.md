# Maestre Arco Conservatory

**Author, Architect, and Producer:** Richard Felipe Urbina

**Pitch:** For every musical genius we know, how many talents have been silenced by the lack of a mentor? Maestre Arco is not just an app; it's the world's first digital conservatory with an AI mentor at its heart, built to give a voice back to the silenced artists.

## ✨ Vision

The Maestre Arco Conservatory is a revolutionary Progressive Web App (PWA) designed to democratize world-class music and art education. It leverages a sophisticated hybrid AI architecture to provide personalized, real-time feedback, making expert mentorship accessible to everyone, everywhere. Our mission is to break down the economic and geographical barriers that have historically limited artistic education.

## 🚀 The Conservatory: A Room-by-Room Journey

The user experience is a journey through purpose-driven "rooms," each guided by an expert AI mentor.

1.  **Onboarding & Personalized Plan:** A conversational diagnostic where **Gemini 2.5 Pro** crafts a unique 10-module curriculum tailored to the student.

2.  **The Mentor's Workshop:** The student chooses a personal AI mentor and generates a fully functional Chrome Extension powered by **Gemini Nano** that embodies their mentor's personality.

3.  **Dashboard:** The student's command center, featuring progress, messages from the entire faculty, and quick access to all rooms.

4.  **Practice Room:** A general practice space where **Maestre Arco (Gemini 2.5 Pro)** performs a multimodal analysis of video and audio to provide expert technical feedback.

5.  **Vocal Studio:** A specialized studio for singers, featuring real-time pitch analysis and live vocal coaching from **Maestra Gloria Spirit (Gemini Live API)**.

6.  **Composition Hall:** A creative suite with a custom music notation keyboard where students compose melodies. **Maestre Arco (Gemini 2.5 Pro)** then provides pedagogical analysis of their creation.

7.  **Knowledge Hall:** An infinite library where **Maestro Arath Bajali (Gemini 2.5 Flash with Google Search)** acts as an expert curator, providing sourced answers to complex questions.

8.  **Aula Magna:** The stage for formal evaluations, conducted as a real-time, bidirectional audio conversation with **Maestre Arco (Gemini Live API)**.

9.  **Kindergarten Room:** A playful, safe space for the youngest learners, guided by **Maestra Dulzura Music** and a friendly voice (**TTS API**).

10. **Credentials Hall:** The space where students forge their artistic identity, generating a unique holographic avatar with **Imagen 4**.

## 🧠 The Faculty of AI Mentors

The heart of the conservatory is its elite faculty, each with a unique personality driven by tailored system prompts and voices.

*   **Maestre Arco:** The disciplined Director, focused on technique as the path to freedom.
*   **Maestra Gloria Spirit:** The passionate Vocal Coach, focused on emotion and healthy technique.
*   **Maestro Rostit:** The honest Visual Arts Master, focused on art as a mirror of the self.
*   **Maestro Arath Bajali:** The intellectual Theorist, focused on deconstructing concepts and challenging perception.
*   **Maestra Dulzura Music:** The charismatic guide for early childhood, focused on joy and playful discovery.

## 🏗️ Technical Architecture & Tech Stack

Maestre Arco is a textbook implementation of a hybrid AI architecture.

*   **Cloud Layer (PWA):** Leverages the full power of Google's cloud models for deep analysis and content generation.
    *   **Frontend:** React, TypeScript, Tailwind CSS
    *   **AI Models:** `Gemini 2.5 Pro`, `Gemini 2.5 Flash`, `Gemini Live API`, `Imagen 4`, `gemini-2.5-flash-preview-tts`.
    *   **Web APIs:** Web Audio API, MediaRecorder API, Web Speech API.

*   **Device Layer (Chrome Extension):** Utilizes the on-device **Gemini Nano** model via Chrome's Built-in AI APIs (`window.ai`) for quick, private, and offline tasks.

## 🛠️ Setup & Running

1.  **Clone the repository.**
2.  **Set up your API Key:** The application requires a Google AI API key. Set it as an environment variable named `API_KEY`.
3.  **Run the application:** Open `index.html` in a modern web browser that supports the necessary web APIs (like Google Chrome).

---
*This project was solely authored, architected, produced, and executed by **Richard Felipe Urbina**.*
