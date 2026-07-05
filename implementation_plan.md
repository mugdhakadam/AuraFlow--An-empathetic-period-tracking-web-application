# Implementation Plan: AuraFlow - Menstrual Period Buddy & Companion

AuraFlow is an elegant, empathetic period tracking web application and personal wellness assistant designed specifically to support women through their monthly cycles. It provides actionable wellness recommendations, motivational thoughts, mood predictions, and home/work tasks tailored to their current menstrual phase.

---

## Suggested Project Name
**AuraFlow** — *Honoring Your Cycle, Harmonizing Your Life.*

## Problem Statement & Sentimental Value
Every month, a woman's body goes through a sacred, complex, and transformative cycle. Society often expects women to maintain constant productivity, mood, and energy levels every single day. In reality, women are cyclical beings. Their hormones, physical strength, emotional capacity, and nutritional needs shift dynamically across four distinct phases: Menstrual, Follicular, Ovulatory, and Luteal.

Without understanding, this cycle can feel like a source of distress, frustration, and confusion. **AuraFlow** is created to change this narrative. By bridging science and empathy, AuraFlow acts as a digital companion that listens, tracks, and guides. It helps women align their nutrition, workload, and self-care with their body's natural chemistry, turning a monthly challenge into a source of personal empowerment, harmony, and self-love.

---

## Architectural Diagram

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

## Technology Details
1. **Core Language & Framework**: Pure Frontend Single Page App (SPA) using HTML5, CSS3, and modern ES6+ Javascript.
2. **Styling & Aesthetics**: 
   - **Glassmorphism CSS**: Semi-transparent panels, blur effects, smooth gradients, and elegant shadows.
   - **Dynamic Styling**: The color palette of the application dynamically shifts to reflect the user's current cycle phase:
     - *Menstrual Phase*: Deep Crimson / Soft Rose (representing rest, warmth, and release).
     - *Follicular Phase*: Sage Green / Spring Blossom (representing renewal, energy, and growth).
     - *Ovulatory Phase*: Radiant Coral / Sunny Amber (representing high energy, social connection, and confidence).
     - *Luteal Phase*: Midnight Lavender / Soft Gold (representing nesting, reflection, and winding down).
   - **Typography**: Playfair Display (for elegant serif headers) and Plus Jakarta Sans / Inter (for clean, legible body text).
   - **Icons**: Lucide Icons (delivered via CDN) for modern, crisp vector icons.
3. **Empathetic Agent**: A dedicated Javascript module that acts as the "Companion Agent" to track history, compute phase-specific scores, handle user inputs, and check logs.
4. **Data Persistence**: HTML5 LocalStorage to securely store profiles, cycle history logs, and symptom tracking without external servers, maintaining complete user privacy.

---

## User Review Required

> [!IMPORTANT]
> **Safety Guardrails First**: The app includes a Safety Guardrail Engine. If a user enters thoughts or notes expressing self-harm, depression, or violence (e.g., "hurt myself", "give up", "die"), the agent will block dangerous output, offer an immediate gentle screen emphasizing self-care, and display helpful mental health resources (e.g., hotlines, supportive advice) in a non-judgmental way.

Please review the proposed design of the interface, color mappings, and structure.

---

## Proposed Changes

We will create a brand new application under the workspace directory: `c:\Users\mugdh\OneDrive\Documents\Womens Period Buddy\`.

### Core Application Files

#### [NEW] [index.html](file:///c:/Users/mugdh/OneDrive/Documents/Womens%20Period%20Buddy/index.html)
The main entry point. It will contain:
- App registration forms (Name, Age, LMP date, Typical Cycle Length, period notes).
- Dashboard sections (Current Phase tracker, dynamic calendar representation, daily suggestions, agent chat/history log).
- Support/Safety modal.

#### [NEW] [style.css](file:///c:/Users/mugdh/OneDrive/Documents/Womens%20Period%20Buddy/style.css)
The stylesheet containing:
- CSS variables for all phase-specific themes.
- Root layout, layout components (cards, profile badges, trackers).
- Animations (pulsing flow indicator, page transitions, progress bars).
- Responsive grid and card system.

#### [NEW] [app.js](file:///c:/Users/mugdh/OneDrive/Documents/Womens%20Period%20Buddy/app.js)
The core application controller, containing:
- State management and Profile database logic.
- Lifecycle event handlers (saving/loading profiles, starting a new cycle entry).
- Page rendering, dynamic calendar rendering, theme updates.

#### [NEW] [agent.js](file:///c:/Users/mugdh/OneDrive/Documents/Womens%20Period%20Buddy/agent.js)
The "Empathetic Period Agent" script:
- Contains the prediction model (calculates cycle day, current phase, next period date).
- Mood predictions and recommendation databases (tailored foods, thoughts, work/home tasks for each phase).
- Content filter and safety guardrail checker (using text scan for self-harm / harm keywords).
- Empathy response engine for logging additional symptoms.

---

## Verification Plan

### Automated Tests
Since this is a client-side vanilla JavaScript app, we will verify correctness using manual browser checks and custom assertions in the JS console, or write a simple validation script if needed.

### Manual Verification
1. **Registration & Profile Creation**: Create multiple profiles with different cycle parameters to verify the agent tracks each woman independently.
2. **Phase Calculation & UI Shift**: Test LMP inputs that place the user in each of the 4 phases (Menstrual, Follicular, Ovulatory, Luteal) and confirm the theme, colors, and content dynamically adapt.
3. **Daily Output Verification**: Confirm the UI displays:
   - Mood prediction
   - 5 Motivational thoughts
   - 5 Work/Home tasks
   - Optimal food recommendations
4. **Safety & Guardrail Test**: Type terms containing self-harm keywords ("want to hurt myself", "suicide", "end my life") into the period details note section. Verify that the agent safely flags this, blocks any negative suggestions, and displays the healing/crisis resource card with warm support.
