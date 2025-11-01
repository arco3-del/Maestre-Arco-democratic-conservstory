# Flujo de la Aplicación: El Conservatorio Maestre Arco

Este documento describe el viaje completo del usuario a través de las distintas "salas" del Conservatorio Maestre Arco, detallando el nombre de cada sala, la experiencia del usuario y las funciones del mundo real que se ejecutan.

---

### **Sala 1: Pantalla de Bienvenida**

*   **Nombre de la Sala:** Pantalla de Bienvenida.
*   **Experiencia del Usuario:** Es el primer impacto. El usuario es recibido en un ambiente cinemático e inmersivo. Una cita de bienvenida de Maestre Arco establece el tono inspirador y accesible del conservatorio.
*   **Funcionamiento Real:**
    *   Un botón de audio utiliza `generateSpeechFromText` para llamar a `gemini-2.5-flash-preview-tts` (Voz: `Kore`), convirtiendo el texto en la voz de Maestre Arco.

---

### **Sala 2: Proceso de Inscripción y Diagnóstico**

*   **Nombre de la Sala:** Proceso de Inscripción.
*   **Experiencia del Usuario:** Un flujo guiado, sencillo y rápido que recopila información esencial sobre el estudiante.
*   **Funcionamiento Real:**
    *   La función `generatePersonalizedPlan` realiza una llamada real a **Gemini 2.5 Pro**, solicitando un plan de estudios de 10 módulos en formato JSON estructurado.

---

### **Sala 3: Taller del Mentor (Laboratorio de Extensiones)**

*   **Nombre de la Sala:** Taller del Mentor.
*   **Experiencia del Usuario:** El usuario elige a su mentor de IA personal de entre la facultad. La aplicación explica el "qué, porqué y para qué" de esta herramienta para su dominio profesional y genera el código para una extensión de Chrome imbuida con la personalidad del mentor elegido.
*   **Funcionamiento Real:**
    *   El código de `popup.js` se genera dinámicamente con un *system prompt* específico del mentor. La extensión utiliza **Gemini Nano** (`window.ai.services.prompt.execute`) para coaching personalizado en el navegador.

---

### **Sala 4: Dashboard**

*   **Nombre de la Sala:** Dashboard.
*   **Experiencia del Usuario:** El centro de mando con progreso, mensajes de toda la facultad (incluyendo a Dulzura Music) y acceso rápido a todas las salas.
*   **Funcionamiento Real:**
    *   Actúa como el navegador principal de la aplicación. Las voces de los mensajes son generadas con `generateSpeechFromText` usando la voz única de cada maestro.

---

### **Sala 5: Currículum Personalizado**

*   **Nombre de la Sala:** Currículum Personalizado.
*   **Experiencia del Usuario:** La visualización de su camino de aprendizaje, diseñado por la IA.
*   **Funcionamiento Real:**
    *   Renderiza los datos JSON recibidos de `generatePersonalizedPlan`.

---

### **Sala 6: Sala de Práctica**

*   **Nombre de la Sala:** Sala de Práctica.
*   **Experiencia del Usuario:** Práctica general supervisada por Maestre Arco, con análisis técnico y preciso.
*   **Funcionamiento Real:**
    *   `getMultimodalPracticeFeedback` envía video/audio a **Gemini 2.5 Pro**, con un prompt para actuar como Maestre Arco. La voz es `Kore`.

---

### **Sala 7: Salón de Voz**

*   **Nombre de la Sala:** Salón de Voz.
*   **Experiencia del Usuario:** Estudio vocal virtual dirigido por la Maestra Gloria Spirit, con coaching apasionado en tiempo real.
*   **Funcionamiento Real:**
    *   El audio se transmite a la **API Gemini Live** (`gemini-2.5-flash-native-audio-preview-09-2025`). El *system prompt* instruye al modelo a adoptar la personalidad de Gloria Spirit.

---

### **Sala 8: Salón de Kinder**

*   **Nombre de la Sala:** Salón de Kinder.
*   **Experiencia del Usuario:** Un espacio lúdico y seguro para niños, guiado por la voz cálida y carismática de la Maestra Dulzura Music.
*   **Funcionamiento Real:**
    *   Las instrucciones y el feedback son generados por `generateSpeechFromText` (Voz: `Puck`) usando `gemini-2.5-flash-preview-tts`.

---

### **Sala 9: Salón de Composición**

*   **Nombre de la Sala:** Salón de Composición.
*   **Experiencia del Usuario:** El culmen del viaje: un taller creativo donde el estudiante usa un teclado musical personalizado para escribir en un pentagrama digital y recibe feedback de Maestre Arco.
*   **Funcionamiento Real:**
    *   Una interfaz personalizada permite al usuario crear una secuencia de símbolos musicales. La función `analyzeComposition` envía esta secuencia a **Gemini 2.5 Pro** para obtener un análisis pedagógico con la voz de Maestre Arco.

---

### **Sala 10: Aula Magna**

*   **Nombre de la Sala:** Aula Magna.
*   **Experiencia del Usuario:** Evaluación formal en vivo con el director, Maestre Arco.
*   **Funcionamiento Real:**
    *   La conexión con la **API Gemini Live** tiene un *system prompt* que define la personalidad de Maestre Arco (Voz: `Kore`) como un evaluador justo.

---

### **Sala 11: Salón del Conocimiento**

*   **Nombre de la Sala:** Salón del Conocimiento.
*   **Experiencia del Usuario:** Biblioteca infinita con el tutor experto: el Maestro Arath Bajali.
*   **Funcionamiento Real:**
    *   `getKnowledgeHallResponse` envía la pregunta a **Gemini 2.5 Flash** con `googleSearch`. El *system prompt* instruye al modelo a actuar como Arath Bajali (Voz: `Charon`).

---

### **Sala 12: Salón de Credenciales**

*   **Nombre de la Sala:** Salón de Credenciales.
*   **Experiencia del Usuario:** Forja su identidad artística generando un avatar holográfico.
*   **Funcionamiento Real:**
    *   `generateHolographicAvatar` utiliza **imagen-4.0-generate-001** para crear un retrato.
