# AuraFlow 🌸
> **Honoring Your Cycle, Harmonizing Your Life.**

AuraFlow is an elegant, empathetic period tracking web application and personal wellness assistant designed specifically to support women through their monthly cycles. By bridging science and empathy, AuraFlow acts as a digital companion that listens, tracks, and guides, helping women align their nutrition, workload, and self-care with their body's natural chemistry.

---

## 🌟 The Heart of AuraFlow (Problem Statement)
Every month, a woman's body goes through a sacred, complex, and transformative cycle. Society often expects women to maintain constant productivity, mood, and energy levels every single day. In reality, women are cyclical beings. Their hormones, physical strength, emotional capacity, and nutritional needs shift dynamically across four distinct phases: **Menstrual, Follicular, Ovulatory, and Luteal**.

Without understanding, this cycle can feel like a source of distress, frustration, and confusion. **AuraFlow** is created to change this narrative. It turns a monthly challenge into a source of personal empowerment, harmony, and self-love.

### The Role of the Empathetic Companion Agent
At the core of this experience is the **Empathetic Companion Agent**. Unlike standard tracker apps that rely on cold, mechanical calculators, this agent acts as a warm, responsive, and intuitive digital companion. It is designed to:
- **Actively Listen & Adapt**: It analyzes the physical symptoms, mood states, and notes you log daily, synthesizing these inputs to refine its mood predictions and adjust recommendations dynamically.
- **Provide Compassionate Advice**: Rather than demanding constant output, it helps you align your workload and nutrition with your body's current chemistry, suggesting comforting foods, grounding exercises, and phase-tailored daily checklists.
- **Maintain a Protective Presence**: It monitors emotional signals and safety markers. If a user logs thoughts of deep distress or self-harm, the agent steps in to shield them, immediately routing them to warm support and vital crisis resources, demonstrating that they are never truly alone.

---

## ✨ Features
- **Dynamic Phase Themes**: The entire color palette of the application dynamically shifts to reflect your cycle phase:
  - 🩸 *Menstrual Phase (Crimson / Soft Rose)*: representing rest, warmth, and release.
  - 🌱 *Follicular Phase (Sage Green / Spring Blossom)*: representing renewal, energy, and growth.
  - ☀️ *Ovulatory Phase (Radiant Coral / Sunny Amber)*: representing high energy, social connection, and confidence.
  - 🌙 *Luteal Phase (Midnight Lavender / Soft Gold)*: representing nesting, reflection, and winding down.
- **Empathetic Companion Agent**:
  - Dynamically calculates current cycle day and predicts future cycles.
  - Tailors daily wellness reports: hormonal details, mood prediction, and customized nutritional advice.
  - Delivers **5 daily motivational thoughts** and **5 home/work tasks** appropriate to the current hormonal phase.
- **Safety Guardrails**: A robust safety filter scans logging details for thoughts of distress or self-harm. If detected, the agent immediately locks negative output and redirects the user to a gentle, compassionate crisis support screen offering immediate, free, and confidential support services (such as 988 and the Crisis Text Line).
- **Privacy First & Multi-Profile Tracking**:
  - Track multiple profiles independently on the same machine.
  - 100% local persistence via `localStorage`—no data ever leaves your device.

---
## 🤓Note from the Developer Mugdha Kadam
--** As a Technical Program/Product Manager, it is my task to create the application prototypes, provide the details of the harness including the Guardrails, to show how the UI will look like, the Business purpose/Value of the delivery. This is my attempt to portray the same.
As I become more and more into solving these type of problems, I am also working on my technical skills in Python and Agentic Programming. 
With more participation in Hackathons like the Google X Kaggle, I aim to be more and more better in my submissions. 
---


## 🏗️ Architectural Overview

--** Please find the Architecture diagram in the Github repository: https://github.com/mugdhakadam/AuraFlow--An-empathetic-period-tracking-web-application/blob/main/AuraFlow%20-%20Architecture%20Diagram.png
---

```mermaid
graph TD
    subgraph Client Browser (User Interface)
        UI[AuraFlow Dashboard UI] <--> AppLogic[Application Engine / JS Controller]
        UI <--> ThemeManager[Dynamic Phase Theme Engine]
    end

    subgraph Logic & Processing (Empathetic Companion Agent)
        AppLogic --> CycleCalculator[Cycle & Phase Predictor]
        AppLogic --> SafetyGuard[Guardrail & Safety Filter]
        AppLogic --> RecGenerator[Personalized Recommendations Engine]
        
        RecGenerator --> MoodPredictor[Mood Prediction Engine]
        RecGenerator --> TaskGen[Daily Task Generator]
        RecGenerator --> NutritionGen[Phase-Specific Food Recommender]
        RecGenerator --> ThoughtsGen[Uplifting Thoughts & Motivation Generator]
    end

    subgraph Data & Storage (Persistence)
        AppLogic <--> ProfileDb[Profile & History Database - localStorage]
    end

    classDef ui fill:#fff0f5,stroke:#ff69b4,stroke-width:2px;
    classDef logic fill:#e6e6fa,stroke:#9370db,stroke-width:2px;
    classDef db fill:#f0fff0,stroke:#3cb371,stroke-width:2px;
    class UI,ThemeManager ui;
    class AppLogic,CycleCalculator,SafetyGuard,RecGenerator,MoodPredictor,TaskGen,NutritionGen,ThoughtsGen logic;
    class ProfileDb db;
```

---

## 🛠️ Technology Stack
- **Structure**: Semantic HTML5 markup
- **Styling**: Vanilla CSS3 featuring a premium glassmorphic UI, fluid grid layouts, and smooth transition animations
- **Logic**: Vanilla ES6+ Javascript (Single Page Application architecture)
- **Icons**: FontAwesome 6 Vector Icons
- **Database**: Web Storage API (`localStorage`)

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (Node.js v16+ recommended).

### Running the App
1. Clone or copy this repository to your local machine.
2. Open your terminal in the project directory.
3. Start the local server:
   ```bash
   node server.js
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

---

## 📂 Project Structure
- `index.html` - The application structure (onboarding form, main dashboard views, safety resources modal).
- `style.css` - Custom glassmorphic styling, phase color variables, animations, and layouts.
- `app.js` - UI controller, event listeners, view switcher, and storage bindings.
- `agent.js` - Cycle prediction model, safety filter engine, wellness database, and empathetic response generator.
- `server.js` - A lightweight Node.js server to serve the application files correctly.

---

## ⚠️ Medical Disclaimer
AuraFlow is designed for cycle tracking, wellness education, and companion support. It is **not** a medical device and should not be used as a replacement for professional medical advice, diagnosis, treatment, or contraceptive planning. Always consult with a qualified healthcare provider regarding any health questions.
