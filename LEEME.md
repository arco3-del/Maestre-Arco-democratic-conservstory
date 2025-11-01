# El Conservatorio Maestre Arco

**Autor, Arquitecto y Productor:** Richard Felipe Urbina

**Pitch:** Por cada genio musical que la historia nos ha permitido conocer, ¿cuántos talentos se han quedado en silencio por falta de un mentor? Maestre Arco no es una aplicación; es el primer conservatorio digital del mundo con un mentor de IA en su corazón, construido para devolver la voz a los artistas silenciados.

## ✨ Visión

El Conservatorio Maestre Arco es una revolucionaria Aplicación Web Progresiva (PWA) diseñada para democratizar el acceso a educación musical y artística de clase mundial. Utiliza una sofisticada arquitectura de IA híbrida para proporcionar feedback personalizado y en tiempo real, haciendo que la mentoría experta sea accesible para todos, en cualquier lugar. Nuestra misión es derribar las barreras económicas y geográficas que históricamente han limitado la educación artística.

## 🚀 El Conservatorio: Un Viaje Sala por Sala

La experiencia de usuario es un viaje a través de "salas" con un propósito específico, cada una guiada por un mentor de IA experto.

1.  **Inscripción y Plan Personalizado:** Un diagnóstico conversacional donde **Gemini 2.5 Pro** crea un plan de estudios único de 10 módulos adaptado al estudiante.

2.  **Taller del Mentor:** El estudiante elige a su mentor de IA personal y genera una Extensión de Chrome completamente funcional impulsada por **Gemini Nano** que encarna la personalidad de su mentor.

3.  **Dashboard:** El centro de mando del estudiante, con su progreso, mensajes de toda la facultad y acceso rápido a todas las salas.

4.  **Sala de Práctica:** Un espacio de práctica general donde **Maestre Arco (Gemini 2.5 Pro)** realiza un análisis multimodal de video y audio para dar feedback técnico experto.

5.  **Salón de Voz:** Un estudio especializado para cantantes, con análisis de afinación en tiempo real y coaching vocal en vivo de la **Maestra Gloria Spirit (API Gemini Live)**.

6.  **Salón de Composición:** Una suite creativa con un teclado de notación musical personalizado donde los estudiantes componen melodías. **Maestre Arco (Gemini 2.5 Pro)** proporciona un análisis pedagógico de su creación.

7.  **Salón del Conocimiento:** Una biblioteca infinita donde el **Maestro Arath Bajali (Gemini 2.5 Flash con Google Search)** actúa como un curador experto, proporcionando respuestas con fuentes citadas a preguntas complejas.

8.  **Aula Magna:** El escenario para las evaluaciones formales, realizadas como una conversación de audio bidireccional en tiempo real con **Maestre Arco (API Gemini Live)**.

9.  **Salón de Kinder:** Un espacio lúdico y seguro para que los más pequeños exploren instrumentos y sonidos, guiados por la **Maestra Dulzura Music** y una voz amigable (**API de TTS**).

10. **Salón de Credenciales:** El espacio donde los estudiantes forjan su identidad artística, generando un avatar holográfico único con **Imagen 4**.

## 🧠 El Cuerpo Docente (Los Mentores de IA)

El corazón del conservatorio es su facultad de élite, cada uno con una personalidad única impulsada por *system prompts* y voces a medida.

*   **Maestre Arco:** El Director disciplinado, enfocado en la técnica como camino a la libertad.
*   **Maestra Gloria Spirit:** La Coach Vocal apasionada, enfocada en la emoción y la técnica saludable.
*   **Maestro Rostit:** El Maestro de Artes Visuales honesto, enfocado en el arte como un espejo del ser.
*   **Maestro Arath Bajali:** El Teórico intelectual, enfocado en deconstruir conceptos y desafiar la percepción.
*   **Maestra Dulzura Music:** La guía carismática de la infancia temprana, enfocada en la alegría y el descubrimiento lúdico.

## 🏗️ Arquitectura Técnica y Stack Tecnológico

Maestre Arco es una implementación de libro de texto de una arquitectura de IA híbrida.

*   **Capa Nube (PWA):** Aprovecha toda la potencia de los modelos en la nube de Google para análisis profundos y generación de contenido.
    *   **Frontend:** React, TypeScript, Tailwind CSS
    *   **Modelos de IA:** `Gemini 2.5 Pro`, `Gemini 2.5 Flash`, `API Gemini Live`, `Imagen 4`, `gemini-2.5-flash-preview-tts`.
    *   **APIs Web:** Web Audio API, MediaRecorder API, Web Speech API.

*   **Capa Dispositivo (Extensión de Chrome):** Utiliza el modelo en el dispositivo **Gemini Nano** a través de las APIs de IA integradas de Chrome (`window.ai`) para tareas rápidas, privadas y sin conexión.

## 🛠️ Instalación y Ejecución

1.  **Clona el repositorio.**
2.  **Configura tu Clave de API:** La aplicación requiere una clave de API de Google AI. Configúrala como una variable de entorno llamada `API_KEY`.
3.  **Ejecuta la aplicación:** Abre `index.html` en un navegador web moderno que soporte las APIs web necesarias (como Google Chrome).

---
*Este proyecto fue únicamente creado, diseñado, producido y ejecutado por **Richard Felipe Urbina**.*
