/**
 * AuraFlow App - UI Controller and Interactions
 */

// Initialize our Agent
const agent = new PeriodAgent();

// UI Elements mapping
const elements = {
    appContainer: document.getElementById("app-container"),
    welcomeView: document.getElementById("welcome-view"),
    formView: document.getElementById("form-view"),
    dashboardView: document.getElementById("dashboard-view"),
    safetyView: document.getElementById("safety-view"),
    
    // Header & Profiles
    profileSelector: document.getElementById("profile-selector"),
    btnNewProfile: document.getElementById("btn-new-profile"),
    btnEditProfile: document.getElementById("btn-edit-profile"),
    btnDeleteProfile: document.getElementById("btn-delete-profile"),
    
    // Forms
    profileForm: document.getElementById("profile-form"),
    formTitle: document.getElementById("form-title"),
    formSubtitle: document.getElementById("form-subtitle"),
    formName: document.getElementById("form-name"),
    formAge: document.getElementById("form-age"),
    formLmp: document.getElementById("form-lmp"),
    formCycleLength: document.getElementById("form-cycle-length"),
    formDetails: document.getElementById("form-details"),
    formSubmitBtn: document.getElementById("form-submit-btn"),
    formCancelBtn: document.getElementById("form-cancel-btn"),
    
    // Dashboard fields
    displayName: document.getElementById("display-name"),
    displayAge: document.getElementById("display-age"),
    displayLmp: document.getElementById("display-lmp"),
    displayCycleLength: document.getElementById("display-cycle-length"),
    
    // Cycle circle metrics
    cycleDayNumber: document.getElementById("cycle-day-number"),
    phaseBadge: document.getElementById("phase-badge"),
    cycleProgressCircle: document.getElementById("cycle-progress-circle"),
    daysToNextPeriod: document.getElementById("days-to-next-period"),
    nextPeriodDateText: document.getElementById("next-period-date-text"),
    
    // Report fields
    hormoneSummaryText: document.getElementById("hormone-summary-text"),
    moodPredictionText: document.getElementById("mood-prediction-text"),
    bestFoodText: document.getElementById("best-food-text"),
    thoughtsList: document.getElementById("thoughts-list"),
    tasksList: document.getElementById("tasks-list"),
    
    // History logs
    historyLogs: document.getElementById("history-logs"),
    
    // Dynamic logging inside dashboard
    logForm: document.getElementById("log-form"),
    logNotesInput: document.getElementById("log-notes-input")
};

// Event Listeners initialization
function initEventListeners() {
    // Profile Switcher
    elements.profileSelector.addEventListener("change", (e) => {
        const selected = e.target.value;
        if (selected) {
            agent.setActiveProfile(selected);
            showDashboardForActiveProfile();
        } else {
            showWelcome();
        }
    });

    // Profile buttons
    elements.btnNewProfile.addEventListener("click", () => {
        showForm(null); // Clear form for new profile
    });
    
    elements.btnEditProfile.addEventListener("click", () => {
        const active = agent.getActiveProfile();
        if (active) showForm(active);
    });

    elements.btnDeleteProfile.addEventListener("click", () => {
        const active = agent.getActiveProfile();
        if (active && confirm(`Are you sure you want to delete profile "${active.name}"?`)) {
            agent.deleteProfile(active.name);
            populateProfileSelector();
            const remaining = agent.getActiveProfile();
            if (remaining) {
                showDashboardForActiveProfile();
            } else {
                showWelcome();
            }
        }
    });

    // Onboarding Form actions
    elements.profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const profileData = {
            name: elements.formName.value,
            age: elements.formAge.value,
            lmpDate: elements.formLmp.value,
            cycleLength: elements.formCycleLength.value,
            extraDetails: elements.formDetails.value
        };

        const result = agent.upsertProfile(profileData);
        if (result.success) {
            populateProfileSelector(result.profile.name);
            showDashboardForActiveProfile();
        } else {
            alert(result.error || "Failed to save profile");
        }
    });

    elements.formCancelBtn.addEventListener("click", () => {
        const active = agent.getActiveProfile();
        if (active) {
            showDashboardForActiveProfile();
        } else {
            showWelcome();
        }
    });

    // Quick log update from Dashboard
    elements.logForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const active = agent.getActiveProfile();
        if (!active) return;

        const newNotes = elements.logNotesInput.value.trim();
        if (!newNotes) return;

        // Run safety check on the log input
        const safetyCheck = agent.checkSafety(newNotes);
        if (!safetyCheck.safe) {
            handleSafetyTrigger(safetyCheck);
            return;
        }

        // Add to active profile
        active.extraDetails = newNotes;
        
        // Push a history entry
        active.history.unshift({
            lmpDate: active.lmpDate,
            cycleLength: active.cycleLength,
            recordedAt: new Date().toISOString(),
            extraDetails: newNotes
        });

        agent.saveProfiles();
        elements.logNotesInput.value = "";
        showDashboardForActiveProfile();
    });
}

// Populate the profiles drop down
function populateProfileSelector(selectedName = null) {
    elements.profileSelector.innerHTML = '<option value="">-- Choose Profile --</option>';
    const profiles = agent.profiles;
    
    let activeName = selectedName || agent.currentProfileName;
    
    Object.keys(profiles).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        if (name === activeName) {
            opt.selected = true;
        }
        elements.profileSelector.appendChild(opt);
    });

    // Toggle actions based on selection
    if (activeName && profiles[activeName]) {
        elements.btnEditProfile.style.display = "inline-flex";
        elements.btnDeleteProfile.style.display = "inline-flex";
    } else {
        elements.btnEditProfile.style.display = "none";
        elements.btnDeleteProfile.style.display = "none";
    }
}

// Show specific view helper
function switchView(viewName) {
    const views = [elements.welcomeView, elements.formView, elements.dashboardView, elements.safetyView];
    views.forEach(v => v.classList.remove("active"));
    
    if (viewName === "welcome") elements.welcomeView.classList.add("active");
    if (viewName === "form") elements.formView.classList.add("active");
    if (viewName === "dashboard") elements.dashboardView.classList.add("active");
    if (viewName === "safety") elements.safetyView.classList.add("active");
}

// Render Welcome
function showWelcome() {
    document.body.removeAttribute("data-phase");
    elements.profileSelector.value = "";
    elements.btnEditProfile.style.display = "none";
    elements.btnDeleteProfile.style.display = "none";
    switchView("welcome");
}

// Render form
function showForm(profile = null) {
    if (profile) {
        elements.formTitle.textContent = "Edit Profile Details";
        elements.formSubtitle.textContent = "Update cycle metrics and periods details to tailor reports.";
        elements.formName.value = profile.name;
        elements.formName.disabled = true; // Key field
        elements.formAge.value = profile.age;
        elements.formLmp.value = profile.lmpDate;
        elements.formCycleLength.value = profile.cycleLength;
        elements.formDetails.value = profile.extraDetails || "";
        elements.formSubmitBtn.textContent = "Save Changes";
        elements.formCancelBtn.style.display = "inline-flex";
    } else {
        elements.formTitle.textContent = "Tell AuraFlow About Yourself";
        elements.formSubtitle.textContent = "We customize all insights, foods, and exercises to your cycle phase.";
        elements.formName.value = "";
        elements.formName.disabled = false;
        elements.formAge.value = "26";
        elements.formLmp.value = new Date().toISOString().split('T')[0];
        elements.formCycleLength.value = "28";
        elements.formDetails.value = "";
        elements.formSubmitBtn.textContent = "Begin AuraFlow";
        // Hide cancel if no profiles are registered
        if (Object.keys(agent.profiles).length === 0) {
            elements.formCancelBtn.style.display = "none";
        } else {
            elements.formCancelBtn.style.display = "inline-flex";
        }
    }
    switchView("form");
}

// Handle safety guardrail trigger
function handleSafetyTrigger(safetyResult) {
    switchView("safety");
    document.body.removeAttribute("data-phase");
}

// Render Dashboard
function showDashboardForActiveProfile() {
    const active = agent.getActiveProfile();
    if (!active) {
        showWelcome();
        return;
    }

    // Safety checks on current profile details
    const safetyCheck = agent.checkSafety(active.extraDetails);
    if (!safetyCheck.safe) {
        handleSafetyTrigger(safetyCheck);
        return;
    }

    const report = agent.generateDailyReport(active.name);
    if (!report) {
        showWelcome();
        return;
    }

    // Update body theme
    document.body.setAttribute("data-phase", report.phaseKey);

    // Profile info display
    elements.displayName.textContent = report.profileName;
    elements.displayAge.textContent = report.age;
    elements.displayLmp.textContent = active.lmpDate;
    elements.displayCycleLength.textContent = report.cycleLength;

    // Phase metrics
    elements.cycleDayNumber.textContent = report.cycleDay;
    elements.phaseBadge.textContent = report.phaseName;
    elements.daysToNextPeriod.textContent = report.daysToNextPeriod;
    elements.nextPeriodDateText.textContent = report.nextPeriodDate;

    // SVG Circular progress bar calculation
    // Circumference = 2 * PI * R where R = 90 -> approx 565.48
    const maxCircumference = 2 * Math.PI * 90;
    const progressPercent = Math.min(report.cycleDay / report.cycleLength, 1);
    const dashOffset = maxCircumference * (1 - progressPercent);
    elements.cycleProgressCircle.style.strokeDasharray = maxCircumference;
    elements.cycleProgressCircle.style.strokeDashoffset = dashOffset;

    // Report content
    elements.hormoneSummaryText.textContent = report.hormonalSummary;
    elements.moodPredictionText.textContent = report.moodPrediction;
    elements.bestFoodText.textContent = report.recommendedFoods;

    // Render lists (Motivational thoughts & Tasks)
    renderList(elements.thoughtsList, report.thoughts, "fa-regular fa-sparkles", "fa-regular fa-sun");
    renderList(elements.tasksList, report.tasks, "fa-regular fa-check-circle", "fa-regular fa-circle");

    // Render logs history
    renderLogsList(active.history);

    // Switch view
    switchView("dashboard");
}

// Render simple lists with icons
function renderList(listContainer, items, iconClass, altIcon) {
    listContainer.innerHTML = "";
    items.forEach(text => {
        const li = document.createElement("li");
        li.className = "rec-item";
        
        const iconWrapper = document.createElement("div");
        iconWrapper.className = "rec-icon-wrapper";
        
        const icon = document.createElement("i");
        // Fallback for fontawesome CDN
        icon.className = iconClass || altIcon || "fa-solid fa-star";
        
        iconWrapper.appendChild(icon);
        
        const textSpan = document.createElement("span");
        textSpan.className = "rec-text";
        textSpan.textContent = text;
        
        li.appendChild(iconWrapper);
        li.appendChild(textSpan);
        listContainer.appendChild(li);
    });
}

// Render logging history list
function renderLogsList(history) {
    elements.historyLogs.innerHTML = "";
    
    if (!history || history.length === 0) {
        elements.historyLogs.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No logs recorded yet.</p>';
        return;
    }

    history.forEach(entry => {
        const item = document.createElement("div");
        item.className = "log-entry";
        
        const header = document.createElement("div");
        header.className = "log-header";
        
        const dateSpan = document.createElement("span");
        const dateObj = new Date(entry.recordedAt);
        dateSpan.textContent = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Phase for this log
        let tempProfile = { lmpDate: entry.lmpDate, cycleLength: entry.cycleLength };
        let metrics = agent.calculateCycleMetrics(tempProfile, dateObj);
        let phaseDisplay = PHASE_DATA[metrics.phase].name;
        
        const phaseSpan = document.createElement("span");
        phaseSpan.className = "log-phase-badge";
        phaseSpan.textContent = `Day ${metrics.cycleDay} (${phaseDisplay})`;
        
        header.appendChild(dateSpan);
        header.appendChild(phaseSpan);
        
        const notes = document.createElement("div");
        notes.className = "log-notes";
        notes.textContent = entry.extraDetails || "Log updated successfully.";
        
        item.appendChild(header);
        item.appendChild(notes);
        elements.historyLogs.appendChild(item);
    });
}

// App bootstrapping
function bootstrap() {
    initEventListeners();
    populateProfileSelector();
    
    // Automatically load active profile if exists
    if (agent.currentProfileName && agent.profiles[agent.currentProfileName]) {
        showDashboardForActiveProfile();
    } else {
        showWelcome();
    }
}

// Run boot on page load
window.addEventListener("DOMContentLoaded", bootstrap);
