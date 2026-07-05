/**
 * AuraFlow Agent - Wellness Companion Logic & Recommendations
 */

const SAFETY_KEYWORDS = [
    "kill myself", "suicide", "end my life", "want to die",
    "hurt myself", "harm myself", "cutting myself", "give up on life",
    "better off dead", "self-harm", "suicidal", "ending my life",
    "poison myself", "hang myself", "drink bleach", "shoot myself"
];

// Comprehensive Database of Phase-specific insights
const PHASE_DATA = {
    menstrual: {
        name: "Menstrual Phase",
        durationText: "Days 1-5",
        hormones: "Estrogen and progesterone are at their lowest levels. Your body is shedding the uterine lining, requiring significant energy and rest.",
        moodPrediction: "Quiet, reflective, sensitive, and inward-looking. You may feel a deep need for comfort and solitude.",
        thoughts: [
            "Your value is not defined by your productivity. It is okay to rest.",
            "Resting is an active form of self-love and healing.",
            "Honoring your body's need for quiet is a source of strength.",
            "This phase is a natural reset. Release what no longer serves you.",
            "Be gentle with yourself today; you are carrying out a miracle of nature."
        ],
        tasks: [
            "Cancel or reschedule non-essential commitments.",
            "Create a cozy sanctuary at home (fresh blankets, soft lighting).",
            "Perform gentle stretching, yin yoga, or a slow warm walk.",
            "Clear out digital clutter or archive old emails from bed.",
            "Write in a journal about your intentions for the new cycle."
        ],
        foods: "Warm, grounding, and nutrient-dense foods are best. Focus on iron-rich foods, magnesium, and healthy fats. Good choices: Warm soups, bone broth, spinach, lentils, dark chocolate (70%+), ginger tea, and wild-caught salmon."
    },
    follicular: {
        name: "Follicular Phase",
        durationText: "Days 6-12",
        hormones: "Estrogen and Follicle-Stimulating Hormone (FSH) are steadily rising, boosting your brain chemistry and energy levels.",
        moodPrediction: "Optimistic, creative, motivated, and open to new experiences. Social energy is starting to climb.",
        thoughts: [
            "Your mind is fresh and open to endless possibilities.",
            "Embrace the renewal within you. It is time to plant new seeds.",
            "You have the focus and drive to turn your ideas into reality.",
            "Every step forward, no matter how small, is progress.",
            "Your potential is rising just like your energy."
        ],
        tasks: [
            "Brainstorm new projects, ideas, or career goals.",
            "Schedule brainstorming sessions or collaborate with friends.",
            "Try a new workout class or hike a new trail.",
            "Begin planning a trip, a budget, or a home redecoration project.",
            "Clean and organize your physical workspaces to match your fresh mindset."
        ],
        foods: "Light, fresh, and energy-boosting foods. Include fermented foods to help metabolize rising estrogen, and lean proteins. Good choices: Broccoli, sprouts, salads, kimchi, avocado, chicken breast, oats, and refreshing green tea."
    },
    ovulatory: {
        name: "Ovulatory Phase",
        durationText: "Days 13-16",
        hormones: "Estrogen peaks, and Luteinizing Hormone (LH) surges, triggering ovulation. Testosterone is also at its peak, maximizing strength and drive.",
        moodPrediction: "Confident, vibrant, highly social, expressive, and magnetic. Communication flows effortlessly.",
        thoughts: [
            "You are magnetic, expressive, and filled with radiant light.",
            "Speak your truth clearly; the world is ready to listen.",
            "Celebrate your vitality and the beauty of your body.",
            "You are capable of connecting deeply and bringing joy to others.",
            "Trust your strength, your intuition, and your voice."
        ],
        tasks: [
            "Schedule important presentations, interviews, or public speaking.",
            "Go out on dates, social gatherings, or catch up with friends.",
            "Engage in high-intensity workouts (HIIT, strength training, running).",
            "Pitch new ideas to clients or lead team negotiations.",
            "Take vibrant photos, dress up, and celebrate your radiant self."
        ],
        foods: "Cooling, anti-inflammatory, and fiber-rich foods to support the liver in processing the peak estrogen levels. Good choices: Raw vegetables (bell peppers, cucumbers), quinoa, berries, almonds, flaxseeds, and plenty of hydrating infused water."
    },
    luteal: {
        name: "Luteal Phase",
        durationText: "Days 17-28",
        hormones: "Progesterone dominates, promoting nesting and calming, but begins to drop towards the end, which can trigger PMS symptoms.",
        moodPrediction: "Detail-oriented, organized, reflective, and nesting-oriented. You may experience PMS, irritability, or cravings as the phase ends.",
        thoughts: [
            "It is safe to slow down and retreat inward.",
            "Your boundaries are sacred. It is okay to say 'no' to others.",
            "Allow your feelings to flow without judgment; they contain wisdom.",
            "You are creating a safe, comfortable space for your spirit.",
            "Transitions can be challenging, but you are fully capable of handling them."
        ],
        tasks: [
            "Focus on administrative, detail-oriented, or completion tasks.",
            "Declutter closets, drawers, and organize household items.",
            "Pamper yourself with a warm bath, face mask, or self-massage.",
            "Do moderate-intensity workouts like Pilates, brisk walking, or swimming.",
            "Set clear boundaries and protect your evening wind-down time."
        ],
        foods: "Complex carbohydrates and healthy fats to stabilize blood sugar, along with foods rich in B vitamins and magnesium to combat PMS. Good choices: Sweet potatoes, brown rice, bananas, walnuts, pumpkin seeds, dark leafy greens, and chamomile tea."
    }
};

class PeriodAgent {
    constructor() {
        this.profiles = this.loadProfiles();
        this.currentProfileName = localStorage.getItem("auraFlow_activeProfile") || null;
    }

    // Load profiles from LocalStorage
    loadProfiles() {
        const stored = localStorage.getItem("auraFlow_profiles");
        return stored ? JSON.parse(stored) : {};
    }

    // Save profiles to LocalStorage
    saveProfiles() {
        localStorage.setItem("auraFlow_profiles", JSON.stringify(this.profiles));
    }

    // Set active profile
    setActiveProfile(name) {
        this.currentProfileName = name;
        localStorage.setItem("auraFlow_activeProfile", name);
    }

    // Get active profile data
    getActiveProfile() {
        if (!this.currentProfileName) return null;
        return this.profiles[this.currentProfileName] || null;
    }

    // Create or update a profile
    upsertProfile({ name, age, lmpDate, cycleLength, extraDetails }) {
        // Clean name to use as key
        const key = name.trim();
        if (!key) return { success: false, error: "Name is required" };

        const isNew = !this.profiles[key];

        this.profiles[key] = {
            name: key,
            age: parseInt(age) || 28,
            lmpDate: lmpDate, // yyyy-mm-dd format
            cycleLength: parseInt(cycleLength) || 28,
            extraDetails: extraDetails || "",
            history: this.profiles[key]?.history || [],
            createdAt: this.profiles[key]?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add history record if new or if LMP is different from last recorded
        const profile = this.profiles[key];
        const lastHistory = profile.history[0];
        if (!lastHistory || lastHistory.lmpDate !== lmpDate) {
            profile.history.unshift({
                lmpDate: lmpDate,
                cycleLength: parseInt(cycleLength) || 28,
                recordedAt: new Date().toISOString(),
                extraDetails: extraDetails || ""
            });
        }

        this.saveProfiles();
        this.setActiveProfile(key);
        return { success: true, isNew: isNew, profile: this.profiles[key] };
    }

    // Delete a profile
    deleteProfile(name) {
        if (this.profiles[name]) {
            delete this.profiles[name];
            this.saveProfiles();
            if (this.currentProfileName === name) {
                const remaining = Object.keys(this.profiles);
                if (remaining.length > 0) {
                    this.setActiveProfile(remaining[0]);
                } else {
                    this.currentProfileName = null;
                    localStorage.removeItem("auraFlow_activeProfile");
                }
            }
            return true;
        }
        return false;
    }

    // Check notes for self-harm or violent thoughts (Safety Guardrail)
    checkSafety(text) {
        if (!text) return { safe: true };

        const lowerText = text.toLowerCase();
        for (const word of SAFETY_KEYWORDS) {
            if (lowerText.includes(word)) {
                return {
                    safe: false,
                    matchedKeyword: word,
                    message: "It looks like you might be going through a very difficult time right now. Please know that you are not alone, and there is support available. Your safety and well-being are incredibly important."
                };
            }
        }
        return { safe: true };
    }

    // Compute cycle calculations
    calculateCycleMetrics(profile, targetDate = new Date()) {
        const lmp = new Date(profile.lmpDate + "T00:00:00");
        const today = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

        // Calculate difference in milliseconds and convert to days
        const diffTime = today - lmp;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const cycleLength = profile.cycleLength || 28;

        // Cycle Day: normalize to fit within cycleLength (1-indexed)
        let cycleDay = (diffDays % cycleLength) + 1;
        if (cycleDay <= 0) {
            cycleDay = cycleLength + cycleDay;
        }

        // Determine menstrual phase
        let phase = "luteal";
        if (cycleDay >= 1 && cycleDay <= 5) {
            phase = "menstrual";
        } else if (cycleDay >= 6 && cycleDay <= 12) {
            phase = "follicular";
        } else if (cycleDay >= 13 && cycleDay <= 16) {
            phase = "ovulatory";
        } else {
            phase = "luteal";
        }

        // Days until next period
        const daysToNextPeriod = cycleLength - (cycleDay - 1);
        const nextPeriodDate = new Date(today.getTime() + daysToNextPeriod * 24 * 60 * 60 * 1000);

        return {
            cycleDay: cycleDay,
            phase: phase,
            daysToNextPeriod: daysToNextPeriod,
            nextPeriodDate: nextPeriodDate.toISOString().split('T')[0]
        };
    }

    // Get dynamically tailored report based on phase and current notes
    generateDailyReport(profileName) {
        const profile = this.profiles[profileName];
        if (!profile) return null;

        // Run safety check on notes
        const safetyResult = this.checkSafety(profile.extraDetails);

        const metrics = this.calculateCycleMetrics(profile);
        const phaseInfo = PHASE_DATA[metrics.phase];

        // Synthesize dynamic mood prediction based on phase + symptom notes
        let customMoodPrediction = phaseInfo.moodPrediction;
        if (profile.extraDetails && safetyResult.safe) {
            const detailsLower = profile.extraDetails.toLowerCase();
            if (detailsLower.includes("cramp") || detailsLower.includes("pain") || detailsLower.includes("hurt")) {
                customMoodPrediction += " Physical discomfort (cramping or aches) might make you feel more drained or irritable today. Be extra gentle with your movements.";
            }
            if (detailsLower.includes("tired") || detailsLower.includes("exhausted") || detailsLower.includes("sleepy")) {
                customMoodPrediction += " Fatigue is prominent today. Prioritize rest, limit screen time, and allow yourself to sleep early.";
            }
            if (detailsLower.includes("anxious") || detailsLower.includes("stressed") || detailsLower.includes("worry")) {
                customMoodPrediction += " Elevated stress or anxiety is present. Focus on slow, deep breathing (4-7-8 method) and remember this emotional wave will pass as your hormones shift.";
            }
            if (detailsLower.includes("happy") || detailsLower.includes("excited") || detailsLower.includes("good")) {
                customMoodPrediction += " You're experiencing a lovely boost of positivity! Harness this beautiful mood to connect with others or engage in creative outlets.";
            }
            if (detailsLower.includes("bloat") || detailsLower.includes("heavy")) {
                customMoodPrediction += " Feeling bloated or heavy can be frustrating. Wear loose, comfortable clothing and drink warm herbal tea to soothe digestion.";
            }
        }

        return {
            profileName: profile.name,
            age: profile.age,
            cycleDay: metrics.cycleDay,
            cycleLength: profile.cycleLength,
            phaseKey: metrics.phase,
            phaseName: phaseInfo.name,
            phaseDuration: phaseInfo.durationText,
            hormonalSummary: phaseInfo.hormones,
            moodPrediction: customMoodPrediction,
            thoughts: phaseInfo.thoughts,
            tasks: phaseInfo.tasks,
            recommendedFoods: phaseInfo.foods,
            daysToNextPeriod: metrics.daysToNextPeriod,
            nextPeriodDate: metrics.nextPeriodDate,
            safety: safetyResult
        };
    }
}

// Export for usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PeriodAgent, PHASE_DATA };
} else {
    window.PeriodAgent = PeriodAgent;
    window.PHASE_DATA = PHASE_DATA;
}
