/**
 * ABITY — Habit & Academic Tracking Platform
 * Interactive Mobile Application Engine v5.0 (iOS Long-Press 3D Rearrange Mode)
 */

// --- Audio Synthesizer (Zero External Dependencies) ---
const SoundEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playClick() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  },
  playSuccess() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.15, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    } catch (e) {}
  },
  playChime() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);
    } catch (e) {}
  },
  playLift() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }
};

// --- Daily Quotes Collection ---
const DailyQuotes = [
  "Discipline turns ideas into a portfolio.",
  "Small daily habits compound into academic excellence.",
  "Consistency is the bridge between goals and accomplishment.",
  "Focus on the process, and the results will take care of themselves.",
  "Morning clarity sets the tone for daily mastery.",
  "Every master was once a beginner who didn't quit.",
  "Design your day with intention, focus, and purpose."
];

// --- Persistent App State ---
const STORAGE_KEY = 'abity_app_state_v5';

const AppState = {
  currentScreen: 'home',
  theme: 'light',
  userName: 'Add Name',
  userBio: 'Add Bio / Course',
  userProfilePic: null,
  portfolioUrl: '',
  selectedCalDate: 15,
  isRearrangeMode: false,
  draggedHabitIndex: null,
  longPressTimer: null,
  habits: [
    { id: 'sleep', iconImg: 'Icons/sleep.png', title: 'Sleep', sub: '7 – 8 hrs', days: [false, false, false, false, false, false, false] },
    { id: 'study', iconImg: 'Icons/study.png', title: 'Study', sub: 'Focused work', days: [false, false, false, false, false, false, false] },
    { id: 'workout', iconImg: 'Icons/workout.png', title: 'Workout', sub: 'Move. Feel good.', days: [false, false, false, false, false, false, false] },
    { id: 'assignments', iconImg: 'Icons/assignment.png', title: 'Assignments', sub: 'Complete daily', days: [false, false, false, false, false, false, false] },
    { id: 'portfolio', iconImg: 'Icons/portfolio.png', title: 'Portfolio', sub: 'Build & refine', days: [false, false, false, false, false, false, false] },
    { id: 'design', iconImg: 'Icons/design concepts.png', title: 'Design Concepts', sub: 'Learn / Explore', days: [false, false, false, false, false, false, false] }
  ],
  todos: [
    { id: 1, text: 'Complete class notes', done: false },
    { id: 2, text: 'Work on project', done: false },
    { id: 3, text: 'Read a research paper', done: false },
    { id: 4, text: 'Practice Figma', done: false },
    { id: 5, text: 'Finish assignment', done: false },
    { id: 6, text: 'Plan tomorrow', done: false }
  ],
  libraryFolders: [
    { id: 1, name: 'UX/UI Design', count: 4, icon: '🎨' },
    { id: 2, name: 'Academic Papers', count: 6, icon: '📑' },
    { id: 3, name: 'Design Systems', count: 3, icon: '📐' },
    { id: 4, name: 'Psychology & Focus', count: 2, icon: '🧠' }
  ],
  booksList: [
    { id: 1, title: 'Atomic Habits', author: 'James Clear', folder: 'Psychology & Focus', link: 'https://jamesclear.com/atomic-habits' },
    { id: 2, title: 'Don’t Make Me Think', author: 'Steve Krug', folder: 'UX/UI Design', link: 'https://sensible.com' },
    { id: 3, title: 'Refactoring UI', author: 'Adam Wathan & Steve Schoger', folder: 'Design Systems', link: 'https://refactoringui.com' },
    { id: 4, title: 'Interaction Design Patterns', author: 'Academic Reference', folder: 'Academic Papers', link: '#' }
  ],
  assignmentFolders: [
    { id: 1, name: 'Semester 4 Projects', count: 5, icon: '📁' },
    { id: 2, name: 'Figma Case Studies', count: 3, icon: '🎨' },
    { id: 3, name: 'Research Submissions', count: 2, icon: '📄' }
  ],
  assignmentsList: [
    { id: 1, title: 'Habit Tracker High-Fi Prototype', course: 'UI Design Lab', due: '18 Sept 2025', status: 'Submitted' },
    { id: 2, title: 'Information Architecture Hierarchy', course: 'UX Research', due: '22 Sept 2025', status: 'In Progress' },
    { id: 3, title: 'Typography & Color Harmony Paper', course: 'Visual Design', due: '25 Sept 2025', status: 'Drafting' }
  ],
  breathing: {
    running: false,
    interval: null,
    phase: 'Breathe In',
    secondsLeft: 4,
    cycle: 1
  }
};

// Save AppState to LocalStorage
function saveStateToStorage() {
  try {
    const serialized = {
      userName: AppState.userName,
      userBio: AppState.userBio,
      userProfilePic: AppState.userProfilePic,
      portfolioUrl: AppState.portfolioUrl,
      habits: AppState.habits,
      todos: AppState.todos,
      libraryFolders: AppState.libraryFolders,
      booksList: AppState.booksList,
      assignmentFolders: AppState.assignmentFolders,
      assignmentsList: AppState.assignmentsList,
      theme: AppState.theme
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

// Load AppState from LocalStorage
function loadStateFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.userName !== undefined) AppState.userName = data.userName;
      if (data.userBio !== undefined) AppState.userBio = data.userBio;
      if (data.userProfilePic !== undefined) AppState.userProfilePic = data.userProfilePic;
      if (data.portfolioUrl !== undefined) AppState.portfolioUrl = data.portfolioUrl;
      if (data.habits && Array.isArray(data.habits)) AppState.habits = data.habits;
      if (data.todos && Array.isArray(data.todos)) AppState.todos = data.todos;
      if (data.libraryFolders && Array.isArray(data.libraryFolders)) AppState.libraryFolders = data.libraryFolders;
      if (data.booksList && Array.isArray(data.booksList)) AppState.booksList = data.booksList;
      if (data.assignmentFolders && Array.isArray(data.assignmentFolders)) AppState.assignmentFolders = data.assignmentFolders;
      if (data.assignmentsList && Array.isArray(data.assignmentsList)) AppState.assignmentsList = data.assignmentsList;
      if (data.theme) {
        AppState.theme = data.theme;
        document.body.setAttribute('data-theme', AppState.theme);
        const toggleBtn = document.getElementById('btn-theme-toggle');
        if (toggleBtn) toggleBtn.textContent = AppState.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
      }
    }
  } catch (e) {
    console.warn('LocalStorage load failed:', e);
  }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  loadStateFromStorage();
  renderDailyQuote();
  renderProfileImages();
  renderHabits();
  renderTodos();
  renderCalendar();
  renderLibrary();
  renderAssignments();
  renderProgressOverview();
  initBreathingTool();
  initThemeToggle();
  initDeviceControls();
  updateTimeAndGreeting();
  loadProfileSettings();
});

// --- Daily Quote ---
function renderDailyQuote() {
  const quoteEl = document.getElementById('home-daily-quote');
  if (!quoteEl) return;
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const quote = DailyQuotes[dayOfYear % DailyQuotes.length];
  quoteEl.textContent = quote;
}

// --- Dynamic Greeting & Real-time Clock ---
function updateTimeAndGreeting() {
  const hour = new Date().getHours();
  let greeting = 'GOOD MORNING,';
  if (hour >= 12 && hour < 17) greeting = 'GOOD AFTERNOON,';
  else if (hour >= 17) greeting = 'GOOD EVENING,';
  
  const greetEl = document.getElementById('home-greeting-label');
  if (greetEl) greetEl.textContent = greeting;

  const updateClock = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const clockEl = document.getElementById('device-clock');
    if (clockEl) clockEl.textContent = timeStr;
  };
  updateClock();
  setInterval(updateClock, 30000);
}

// --- Profile Pictures ---
function renderProfileImages() {
  const heroCard = document.getElementById('user-hero-photo-placeholder');
  const profileAvatar = document.getElementById('profile-screen-avatar');

  if (AppState.userProfilePic) {
    if (heroCard) {
      heroCard.innerHTML = `<img src="${AppState.userProfilePic}" class="hero-uploaded-img" alt="Future Self">`;
    }
    if (profileAvatar) {
      profileAvatar.innerHTML = `<img src="${AppState.userProfilePic}" alt="User Avatar">`;
    }
  } else {
    if (heroCard) {
      heroCard.innerHTML = `
        <div class="user-hero-empty-state">
          <div class="hero-empty-plus-icon">+</div>
          <span class="hero-empty-caption">upload your<br>future self</span>
        </div>
      `;
    }
    if (profileAvatar) {
      profileAvatar.innerHTML = `<span>👩‍🎓</span>`;
    }
  }
}

function triggerProfilePicUpload() {
  SoundEngine.playClick();
  const fileInput = document.getElementById('profile-pic-file-input');
  if (fileInput) fileInput.click();
}

function handleProfilePicSelected(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      AppState.userProfilePic = e.target.result;
      renderProfileImages();
      saveStateToStorage();
      SoundEngine.playSuccess();
      showToast('✓ Future self profile picture updated!');
    };
    reader.readAsDataURL(file);
  }
}

// --- Navigation Engine ---
function switchScreen(screenId) {
  SoundEngine.playClick();
  AppState.currentScreen = screenId;

  const splashEl = document.getElementById('screen-splash');
  if (splashEl && screenId !== 'splash') {
    splashEl.style.display = 'none';
  }

  document.querySelectorAll('.app-screen').forEach(scr => {
    scr.classList.remove('active');
  });
  const targetScreen = document.getElementById(`screen-${screenId}`);
  if (targetScreen) targetScreen.classList.add('active');

  document.querySelectorAll('.nav-tab-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === screenId);
  });

  if (screenId === 'insights') {
    renderProgressOverview();
  }
}

// --- Weekly Tracker & Habit Tracker Interlinked ---
function calculateWeeklyProgress() {
  const totalHabits = AppState.habits.length;
  if (totalHabits === 0) {
    updateWeeklyChart([0, 0, 0, 0, 0, 0, 0], 0);
    return;
  }

  const dailyPercentages = [0, 1, 2, 3, 4, 5, 6].map(dayIdx => {
    const doneCount = AppState.habits.filter(h => h.days[dayIdx]).length;
    return Math.round((doneCount / totalHabits) * 100);
  });

  let totalChecks = 0;
  let doneChecks = 0;
  AppState.habits.forEach(h => {
    h.days.forEach(d => {
      totalChecks++;
      if (d) doneChecks++;
    });
  });

  const overallPercentage = totalChecks > 0 ? Math.round((doneChecks / totalChecks) * 100) : 0;
  updateWeeklyChart(dailyPercentages, overallPercentage);
}

function updateWeeklyChart(dailyPcts, overallPct) {
  const badgeEl = document.getElementById('weekly-track-badge');
  if (badgeEl) badgeEl.innerHTML = `↑ ${overallPct}%`;

  const xCoords = [10, 33, 56, 80, 103, 126, 150];
  const points = dailyPcts.map((pct, i) => {
    const y = 68 - (pct / 100) * 50;
    return { x: xCoords[i], y };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const cx = (points[i].x + points[i + 1].x) / 2;
    pathD += ` Q ${points[i].x} ${points[i].y}, ${cx} ${(points[i].y + points[i + 1].y) / 2} T ${points[i + 1].x} ${points[i + 1].y}`;
  }

  const fillD = `${pathD} L 150 80 L 10 80 Z`;

  const chartContainer = document.getElementById('weekly-chart-svg-wrap');
  if (chartContainer) {
    chartContainer.innerHTML = `
      <defs>
        <linearGradient id="chartGradDynamic" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FE763C" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#FE763C" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <path d="${fillD}" fill="url(#chartGradDynamic)"/>
      <path d="${pathD}" stroke="#FE763C" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      ${points.map((p, idx) => `
        <circle cx="${p.x}" cy="${p.y}" r="${idx === points.length - 1 ? '4' : '3'}" fill="#FE763C" ${idx === points.length - 1 ? 'stroke="#FFF" stroke-width="1.5"' : ''}/>
      `).join('')}
    `;
  }
}

// --- iOS 3D Long-Press & Drag Rearrange Engine ---
function renderHabits() {
  const container = document.getElementById('habit-matrix-list');
  const cardEl = document.querySelector('.habit-matrix-card');
  if (!container) return;

  if (cardEl) {
    cardEl.classList.toggle('rearrange-active', AppState.isRearrangeMode);
  }

  if (AppState.habits.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:16px;color:var(--text-tertiary);font-size:11px;">
        No habits yet. Tap "+" above to create your first habit!
      </div>
    `;
    calculateWeeklyProgress();
    return;
  }

  container.innerHTML = AppState.habits.map((h, habitIdx) => `
    <div class="habit-row-item" 
         id="habit-row-${habitIdx}"
         draggable="${AppState.isRearrangeMode}"
         onmousedown="startLongPress(event, ${habitIdx})"
         onmouseup="cancelLongPress()"
         onmouseleave="cancelLongPress()"
         ontouchstart="startLongPress(event, ${habitIdx})"
         ontouchend="cancelLongPress()"
         ontouchcancel="cancelLongPress()"
         ondragstart="handleHabitDragStart(event, ${habitIdx})"
         ondragover="handleHabitDragOver(event)"
         ondrop="handleHabitDrop(event, ${habitIdx})"
         ondragend="handleHabitDragEnd(event)"
         title="${AppState.isRearrangeMode ? 'Drag to rearrange or tap ✕ to delete' : 'Hold / Long-press for 3D rearrange mode'}">
      
      <div class="habit-meta-col">
        <!-- Floating iOS Delete Badge (Appears ONLY in Long-Press 3D mode) -->
        <div class="habit-icon-wrap-relative">
          <div class="habit-3d-delete-badge" 
               onclick="event.stopPropagation(); deleteHabit(${habitIdx})" 
               title="Delete habit">✕</div>
          <img src="${h.iconImg}" class="habit-meta-img-icon" alt="${h.title}" onerror="this.src='Icons/arrow.png'">
        </div>

        <div class="habit-meta-info">
          <span class="habit-meta-title">${h.title}</span>
          <span class="habit-meta-sub">${h.sub}</span>
        </div>
      </div>

      ${h.days.map((checked, dayIdx) => `
        <div class="habit-day-bubble ${checked ? 'checked' : ''}" 
             onclick="event.stopPropagation(); toggleHabitDay(${habitIdx}, ${dayIdx})"
             title="Day ${dayIdx + 1} - ${checked ? 'Completed' : 'Pending'}">
        </div>
      `).join('')}

    </div>
  `).join('');

  calculateWeeklyProgress();
}

// Long-Press Trigger for 3D Rearrange State
function startLongPress(e, idx) {
  // If user clicks directly on a habit-day-bubble or delete badge, skip long press
  if (e.target.classList.contains('habit-day-bubble') || e.target.classList.contains('habit-3d-delete-badge')) {
    return;
  }

  cancelLongPress();
  AppState.longPressTimer = setTimeout(() => {
    enterRearrangeMode(idx);
  }, 420); // 420ms long-press threshold
}

function cancelLongPress() {
  if (AppState.longPressTimer) {
    clearTimeout(AppState.longPressTimer);
    AppState.longPressTimer = null;
  }
}

function enterRearrangeMode(initialIdx) {
  AppState.isRearrangeMode = true;
  SoundEngine.playLift();
  renderHabits();
  
  // Apply 3D lift animation to the row that was long-pressed
  const rowEl = document.getElementById(`habit-row-${initialIdx}`);
  if (rowEl) {
    rowEl.classList.add('is-3d-lifted');
    setTimeout(() => {
      rowEl.classList.remove('is-3d-lifted');
    }, 600);
  }

  showToast('✨ 3D Rearrange Mode active! Drag to reorder or tap ✕ to delete.');
}

function exitRearrangeMode() {
  SoundEngine.playClick();
  AppState.isRearrangeMode = false;
  renderHabits();
  saveStateToStorage();
  showToast('✓ Habit order saved');
}

function toggleHabitDay(habitIdx, dayIdx) {
  if (AppState.isRearrangeMode) return; // Prevent checking in rearrange mode
  AppState.habits[habitIdx].days[dayIdx] = !AppState.habits[habitIdx].days[dayIdx];
  if (AppState.habits[habitIdx].days[dayIdx]) {
    SoundEngine.playSuccess();
    triggerCelebration();
  } else {
    SoundEngine.playClick();
  }
  renderHabits();
  saveStateToStorage();
}

// Drag & Drop handlers
function handleHabitDragStart(e, idx) {
  if (!AppState.isRearrangeMode) return;
  AppState.draggedHabitIndex = idx;
  SoundEngine.playLift();
  const target = document.getElementById(`habit-row-${idx}`);
  if (target) target.classList.add('is-dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleHabitDragOver(e) {
  if (!AppState.isRearrangeMode) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleHabitDrop(e, targetIdx) {
  if (!AppState.isRearrangeMode) return;
  e.preventDefault();
  const sourceIdx = AppState.draggedHabitIndex;
  if (sourceIdx !== null && sourceIdx !== targetIdx) {
    SoundEngine.playSuccess();
    const item = AppState.habits.splice(sourceIdx, 1)[0];
    AppState.habits.splice(targetIdx, 0, item);
    renderHabits();
    saveStateToStorage();
    showToast('✨ Habit rearranged!');
  }
}

function handleHabitDragEnd(e) {
  AppState.draggedHabitIndex = null;
  document.querySelectorAll('.habit-row-item').forEach(el => {
    el.classList.remove('is-dragging');
  });
}

function openAddHabitModal() {
  SoundEngine.playClick();
  const title = prompt('Enter New Habit Name (e.g. Read Research Papers, Morning Yoga):');
  if (!title || !title.trim()) return;
  const sub = prompt('Enter Frequency / Goal (e.g. 30 mins daily):', 'Daily goal');
  
  AppState.habits.push({
    id: 'custom-' + Date.now(),
    iconImg: 'Icons/arrow.png',
    title: title.trim(),
    sub: sub ? sub.trim() : 'Daily goal',
    days: [false, false, false, false, false, false, false]
  });

  renderHabits();
  saveStateToStorage();
  SoundEngine.playSuccess();
  showToast(`✓ Added habit "${title}" with progress arrow!`);
}

function deleteHabit(index) {
  SoundEngine.playClick();
  const habit = AppState.habits[index];
  if (confirm(`Remove habit "${habit.title}"?`)) {
    AppState.habits.splice(index, 1);
    renderHabits();
    saveStateToStorage();
    showToast('🗑️ Habit removed');
  }
}

// --- Detailed Progress Overview ---
function renderProgressOverview() {
  const container = document.getElementById('progress-detailed-overview-box');
  if (!container) return;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const totalHabits = AppState.habits.length;

  const dailyPercentages = [0, 1, 2, 3, 4, 5, 6].map(dayIdx => {
    const doneCount = totalHabits > 0 ? AppState.habits.filter(h => h.days[dayIdx]).length : 0;
    const pct = totalHabits > 0 ? Math.round((doneCount / totalHabits) * 100) : 0;
    return { day: days[dayIdx], pct, doneCount, totalHabits };
  });

  let totalDone = 0;
  let totalPossible = totalHabits * 7;
  AppState.habits.forEach(h => h.days.forEach(d => { if (d) totalDone++; }));
  const overallPct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  container.innerHTML = `
    <div class="progress-stat-cards-grid">
      <div class="stat-metric-card">
        <div class="stat-metric-val">${overallPct}%</div>
        <div class="stat-metric-label">Weekly Completion</div>
      </div>
      <div class="stat-metric-card">
        <div class="stat-metric-val">${totalDone} / ${totalPossible}</div>
        <div class="stat-metric-label">Habits Checked</div>
      </div>
    </div>

    <div class="progress-daily-breakdown-box">
      <div style="font-size:13px;font-weight:800;color:var(--text-primary);margin-bottom:12px;">
        Daily Completion Breakdown
      </div>
      ${dailyPercentages.map(d => `
        <div class="progress-day-bar-row">
          <span style="width:75px;font-weight:600;color:var(--text-secondary);">${d.day.slice(0, 3)}:</span>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${d.pct}%;"></div>
          </div>
          <span style="width:35px;text-align:right;font-weight:700;color:var(--color-primary);">${d.pct}%</span>
        </div>
      `).join('')}
    </div>
  `;
}

// --- To-Do List ---
function renderTodos() {
  const container = document.getElementById('todo-list-container');
  const watermarkContainer = document.getElementById('todo-watermark-holder');
  if (!container) return;

  if (AppState.todos.length === 0) {
    container.innerHTML = `
      <div class="todo-empty-state">
        <img src="Icons/sad.png" class="todo-empty-img" alt="No tasks">
        <span class="todo-empty-text">No tasks left for today!</span>
      </div>
    `;
    if (watermarkContainer) watermarkContainer.innerHTML = '';
  } else {
    if (watermarkContainer) {
      watermarkContainer.innerHTML = `<img src="Icons/forest.png" class="todo-watermark-icon" alt="Focus Forest">`;
    }

    container.innerHTML = AppState.todos.map((t) => `
      <div class="todo-item-row ${t.done ? 'completed' : ''}" 
           onclick="toggleTodo(${t.id})" 
           oncontextmenu="handleTodoContextMenu(event, ${t.id})"
           title="Click to toggle, hover / right-click to delete">
        <div class="todo-checkbox">
          ${t.done ? '<span style="color:#FFF;font-size:9px;font-weight:900;">✓</span>' : ''}
        </div>
        <span class="todo-text">${t.text}</span>
        <button class="todo-item-delete-btn" onclick="event.stopPropagation(); deleteTodo(${t.id})" title="Delete Task">✕</button>
      </div>
    `).join('');
  }
}

function toggleTodo(id) {
  const item = AppState.todos.find(t => t.id === id);
  if (item) {
    item.done = !item.done;
    if (item.done) SoundEngine.playSuccess();
    else SoundEngine.playClick();
    renderTodos();
    saveStateToStorage();
  }
}

function deleteTodo(id) {
  SoundEngine.playClick();
  AppState.todos = AppState.todos.filter(t => t.id !== id);
  renderTodos();
  saveStateToStorage();
  showToast('🗑️ Task removed');
}

function handleTodoContextMenu(e, id) {
  e.preventDefault();
  if (confirm('Delete this task?')) {
    deleteTodo(id);
  }
}

function addNewTodoPrompt() {
  SoundEngine.playClick();
  const task = prompt('Enter new Academic / Daily Task:');
  if (task && task.trim().length > 0) {
    AppState.todos.push({ id: Date.now(), text: task.trim(), done: false });
    renderTodos();
    saveStateToStorage();
    SoundEngine.playSuccess();
  }
}

// --- Calendar ---
function renderCalendar() {
  const calGrid = document.getElementById('calendar-dates-grid');
  if (!calGrid) return;

  let html = '';
  for (let i = 1; i <= 30; i++) {
    const isActive = i === AppState.selectedCalDate;
    const hasProgress = i <= 16;
    html += `
      <div class="cal-date-cell ${isActive ? 'active' : ''}" onclick="selectCalendarDate(${i})">
        <span>${i}</span>
        ${hasProgress ? '<span class="cal-dot"></span>' : ''}
      </div>
    `;
  }
  calGrid.innerHTML = html;
  renderCalendarDateDetails();
}

function selectCalendarDate(day) {
  SoundEngine.playClick();
  AppState.selectedCalDate = day;
  renderCalendar();
}

function renderCalendarDateDetails() {
  const container = document.getElementById('cal-selected-history');
  if (!container) return;

  const completionRate = Math.min(100, Math.max(40, 50 + (AppState.selectedCalDate * 7) % 50));
  container.innerHTML = `
    <div class="cal-history-title">
      <span>Progress for Sept ${AppState.selectedCalDate}, 2025</span>
      <span style="color:var(--color-primary);">${completionRate}% Complete</span>
    </div>
    <div style="font-size:11px;color:var(--text-secondary);margin-bottom:8px;">
      Habits completed: <strong>${Math.round((completionRate/100) * AppState.habits.length)} of ${AppState.habits.length}</strong>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      ${AppState.habits.slice(0, 4).map(h => `
        <div style="display:flex;align-items:center;gap:8px;font-size:11px;background:rgba(255,255,255,0.7);padding:6px 10px;border-radius:8px;">
          <img src="${h.iconImg}" class="cal-history-icon" style="width:16px;height:16px;object-fit:contain;">
          <span>${h.title}</span>
          <span style="margin-left:auto;color:var(--color-primary);font-weight:700;">✓ Completed</span>
        </div>
      `).join('')}
    </div>
  `;
}

// --- Library ---
function renderLibrary() {
  const foldersEl = document.getElementById('library-folders-container');
  const booksEl = document.getElementById('library-books-container');
  if (!foldersEl || !booksEl) return;

  foldersEl.innerHTML = AppState.libraryFolders.map(f => `
    <div class="folder-card" onclick="filterBooksByFolder('${f.name}')">
      <div class="folder-icon">${f.icon}</div>
      <div class="folder-name">${f.name}</div>
      <div class="folder-count">${f.count} items</div>
    </div>
  `).join('');

  booksEl.innerHTML = AppState.booksList.map(b => `
    <div class="book-item-card">
      <div class="book-cover-thumb">📖</div>
      <div style="flex:1;">
        <div style="font-size:12px;font-weight:700;color:var(--text-primary);">${b.title}</div>
        <div style="font-size:10px;color:var(--text-secondary);">${b.author} • <span style="color:var(--color-primary);">${b.folder}</span></div>
      </div>
      <a href="${b.link}" target="_blank" onclick="event.stopPropagation();SoundEngine.playClick();" style="color:var(--color-primary);font-size:13px;text-decoration:none;font-weight:800;">↗</a>
    </div>
  `).join('');
}

function filterBooksByFolder(folderName) {
  SoundEngine.playClick();
  showToast(`📁 Viewing folder: ${folderName}`);
}

function addNewBookFolder() {
  SoundEngine.playClick();
  const name = prompt('Enter Folder Name (e.g. Machine Learning, Typography):');
  if (name && name.trim()) {
    AppState.libraryFolders.push({ id: Date.now(), name: name.trim(), count: 0, icon: '📁' });
    renderLibrary();
    SoundEngine.playSuccess();
  }
}

function addNewBookLink() {
  SoundEngine.playClick();
  const title = prompt('Enter Book / Reference Title:');
  if (!title || !title.trim()) return;
  const author = prompt('Enter Author / Source:') || 'Academic Resource';
  const link = prompt('Enter Reference URL / Link:', 'https://') || '#';

  AppState.booksList.push({ id: Date.now(), title: title.trim(), author, folder: 'UX/UI Design', link });
  renderLibrary();
  SoundEngine.playSuccess();
}

// --- Portfolio Flow ---
function handlePortfolioClick() {
  SoundEngine.playClick();
  if (AppState.portfolioUrl && AppState.portfolioUrl.trim().length > 0) {
    const url = AppState.portfolioUrl.trim();
    const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
    showToast('🚀 Opening external portfolio in new tab...');
  } else {
    const link = prompt('Welcome! Please enter your external portfolio link (Behance, Dribbble, Website):', 'https://');
    if (link && link.trim().length > 0) {
      AppState.portfolioUrl = link.trim();
      saveStateToStorage();
      loadProfileSettings();
      const fullUrl = AppState.portfolioUrl.startsWith('http://') || AppState.portfolioUrl.startsWith('https://') ? AppState.portfolioUrl : `https://${AppState.portfolioUrl}`;
      window.open(fullUrl, '_blank');
    }
  }
}

// --- Assignments ---
function renderAssignments() {
  const foldersEl = document.getElementById('assignment-folders-container');
  const listEl = document.getElementById('assignment-items-container');
  if (!foldersEl || !listEl) return;

  foldersEl.innerHTML = AppState.assignmentFolders.map(f => `
    <div class="folder-card" onclick="SoundEngine.playClick();showToast('📂 Folder: ${f.name}')">
      <div class="folder-icon">${f.icon}</div>
      <div class="folder-name">${f.name}</div>
      <div class="folder-count">${f.count} files</div>
    </div>
  `).join('');

  listEl.innerHTML = AppState.assignmentsList.map(a => `
    <div class="assignment-item-box">
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--text-primary);">${a.title}</div>
        <div style="font-size:10px;color:var(--text-secondary);">${a.course} • Due: ${a.due}</div>
        <span class="assignment-tag">${a.status}</span>
      </div>
      <button class="btn-secondary" style="padding:6px 10px;font-size:11px;" onclick="SoundEngine.playSuccess();showToast('📤 Work file attached!')">
        Upload ⬆
      </button>
    </div>
  `).join('');
}

function addNewAssignmentFolder() {
  SoundEngine.playClick();
  const name = prompt('Enter Assignment Folder Name (e.g. Semester 4 Final Submissions):');
  if (name && name.trim()) {
    AppState.assignmentFolders.push({ id: Date.now(), name: name.trim(), count: 0, icon: '📁' });
    renderAssignments();
    SoundEngine.playSuccess();
  }
}

function addNewAssignmentWork() {
  SoundEngine.playClick();
  const title = prompt('Enter Assignment Title:');
  if (!title || !title.trim()) return;
  const course = prompt('Enter Course / Subject Name:') || 'General';
  const due = prompt('Enter Due Date (e.g. 28 Sept):') || 'Upcoming';

  AppState.assignmentsList.push({ id: Date.now(), title: title.trim(), course, due, status: 'In Progress' });
  renderAssignments();
  SoundEngine.playSuccess();
}

// --- Profile Settings ---
function loadProfileSettings() {
  const portInput = document.getElementById('profile-portfolio-input');
  if (portInput) {
    portInput.value = AppState.portfolioUrl || '';
    portInput.placeholder = 'Add portfolio link';
  }
  
  const nameInput = document.getElementById('profile-name-input');
  if (nameInput) {
    nameInput.value = AppState.userName === 'Add Name' ? '' : AppState.userName;
    nameInput.placeholder = 'Add Name';
  }

  const bioInput = document.getElementById('profile-bio-input');
  if (bioInput) {
    bioInput.value = AppState.userBio === 'Add Bio / Course' ? '' : AppState.userBio;
    bioInput.placeholder = 'Add Bio / Course';
  }

  const homeName = document.getElementById('home-user-name');
  if (homeName) homeName.textContent = AppState.userName;

  const profName = document.getElementById('profile-display-name');
  if (profName) profName.textContent = AppState.userName;

  const profBio = document.getElementById('profile-display-bio');
  if (profBio) profBio.textContent = AppState.userBio;
}

function saveProfileSettings() {
  SoundEngine.playSuccess();
  const portInput = document.getElementById('profile-portfolio-input');
  const nameInput = document.getElementById('profile-name-input');
  const bioInput = document.getElementById('profile-bio-input');

  if (portInput) {
    AppState.portfolioUrl = portInput.value.trim();
  }
  
  if (nameInput) {
    const val = nameInput.value.trim();
    AppState.userName = val.length > 0 ? val : 'Add Name';
  }

  if (bioInput) {
    const val = bioInput.value.trim();
    AppState.userBio = val.length > 0 ? val : 'Add Bio / Course';
  }

  const homeName = document.getElementById('home-user-name');
  if (homeName) homeName.textContent = AppState.userName;

  const profName = document.getElementById('profile-display-name');
  if (profName) profName.textContent = AppState.userName;

  const profBio = document.getElementById('profile-display-bio');
  if (profBio) profBio.textContent = AppState.userBio;

  saveStateToStorage();
  showToast('✓ Profile, Name, & Bio settings saved!');
}

function testPortfolioLink() {
  SoundEngine.playClick();
  const portInput = document.getElementById('profile-portfolio-input');
  const url = portInput ? portInput.value.trim() : AppState.portfolioUrl;
  if (url && url.length > 0) {
    const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
  } else {
    showToast('ℹ️ Please enter a portfolio URL first');
  }
}

// --- Breathing Tool ---
function initBreathingTool() {
  const startBtn = document.getElementById('btn-breathing-toggle');
  if (startBtn) startBtn.addEventListener('click', toggleBreathingExercise);
}

function toggleBreathingExercise() {
  const btn = document.getElementById('btn-breathing-toggle');
  const blossom = document.getElementById('breathing-blossom');
  const countDisplay = document.getElementById('breathing-countdown');
  const phaseLabel = document.getElementById('breathing-phase-label');
  const waveBars = document.querySelectorAll('.wave-bar');

  if (AppState.breathing.running) {
    clearInterval(AppState.breathing.interval);
    AppState.breathing.running = false;
    btn.textContent = 'Start Exercising >>';
    phaseLabel.textContent = 'Breathe In';
    countDisplay.textContent = '4';
    if (blossom) blossom.style.transform = 'scale(1)';
    waveBars.forEach(b => b.classList.remove('active'));
    SoundEngine.playClick();
  } else {
    AppState.breathing.running = true;
    btn.textContent = 'Pause Exercise';
    SoundEngine.playChime();

    let step = 0;
    let currentTimer = 4;
    AppState.breathing.cycle = 1;

    const runStep = () => {
      if (currentTimer <= 0) {
        if (step === 0) {
          step = 1;
          currentTimer = 4;
          phaseLabel.textContent = 'Hold';
          SoundEngine.playChime();
        } else if (step === 1) {
          step = 2;
          currentTimer = 6;
          phaseLabel.textContent = 'Breathe Out';
          if (blossom) blossom.style.transform = 'scale(1)';
          SoundEngine.playChime();
        } else {
          step = 0;
          currentTimer = 4;
          AppState.breathing.cycle++;
          phaseLabel.textContent = 'Breathe In';
          if (blossom) blossom.style.transform = 'scale(1.4)';
          SoundEngine.playChime();
        }
      }

      countDisplay.textContent = currentTimer;
      currentTimer--;

      waveBars.forEach((b) => {
        b.classList.toggle('active', Math.random() > 0.4);
      });
    };

    if (blossom) blossom.style.transform = 'scale(1.4)';
    runStep();
    AppState.breathing.interval = setInterval(runStep, 1000);
  }
}

// --- Mood Selector ---
function selectMood(emoji, label, score) {
  SoundEngine.playSuccess();
  document.querySelectorAll('.mood-emoji-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById(`mood-btn-${label.toLowerCase()}`);
  if (activeBtn) activeBtn.classList.add('active');

  const moodLabelEl = document.getElementById('selected-mood-title');
  if (moodLabelEl) moodLabelEl.textContent = label;

  const scoreEl = document.getElementById('mood-score-val');
  if (scoreEl) scoreEl.textContent = score;
}

// --- Celebration ---
function triggerCelebration() {
  const canvas = document.createElement('div');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.width = '8px';
    p.style.height = '8px';
    p.style.backgroundColor = i % 2 === 0 ? '#FE763C' : '#FFD200';
    p.style.borderRadius = '50%';
    p.style.left = '50%';
    p.style.top = '50%';
    p.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    canvas.appendChild(p);

    setTimeout(() => {
      const angle = (i / 24) * 2 * Math.PI;
      const dist = 60 + Math.random() * 80;
      p.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`;
      p.style.opacity = '0';
    }, 10);
  }

  setTimeout(() => canvas.remove(), 700);
}

// --- Theme Toggle ---
function initThemeToggle() {
  const toggleBtn = document.getElementById('btn-theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', AppState.theme);
      toggleBtn.textContent = AppState.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
      saveStateToStorage();
    });
  }
}

// --- Device Controls ---
function initDeviceControls() {
  const frame = document.getElementById('phone-frame');
  const btnFit = document.getElementById('btn-fit-screen');

  if (btnFit && frame) {
    btnFit.addEventListener('click', () => {
      SoundEngine.playClick();
      frame.classList.toggle('fullscreen-mode');
      btnFit.classList.toggle('active');
    });
  }
}

// --- Copy Figma Tokens ---
function copyFigmaTokens() {
  SoundEngine.playSuccess();
  fetch('figma_tokens.json')
    .then(r => r.text())
    .then(data => {
      navigator.clipboard.writeText(data).then(() => {
        showToast('✓ Figma Design Tokens copied to clipboard!');
      });
    })
    .catch(() => {
      showToast('✓ Tokens ready for Figma copy!');
    });
}

function showToast(msg) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #1A1A1A;
      color: #FFF;
      padding: 12px 20px;
      border-radius: 12px;
      border: 1px solid #FE763C;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      z-index: 10000;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2600);
}
