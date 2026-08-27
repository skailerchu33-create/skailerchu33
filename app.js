// DevFluent Main Application Script

// --- 1. Mock Database Infrastructure & Storage Systems ---
const DEFAULT_TUTORIALS = [
  {
    id: 1,
    title: "Understanding Javascript Execution Scope",
    description: "Deep dive into variable lookup chains, execution contexts, lexical scope structures, and global registers.",
    difficulty: "Beginner",
    duration: "5 min",
    category: "JS Core",
    code: `// Lesson: Execution Scope Demo\nlet globalVar = "I am global";\n\nfunction scopeTest() {\n  let localVar = "I am local";\n  console.log("Global access:", globalVar);\n  console.log("Local access:", localVar);\n  return "Lexical Scope Validated!";\n}\n\nconsole.log(scopeTest());`,
    videoTitle: "Lexical Scope Visual Compilation",
    downloaded: false,
    comments: [
      { author: "Sarah Connor", date: "2026-07-10 14:32", text: "This visual timeline really helped clarify how functions capture variables!" },
      { author: "Markus V", date: "2026-07-11 09:12", text: "Does this compile differently inside node.js engines?" }
    ]
  },
  {
    id: 2,
    title: "Javascript Closures and Memory Retention",
    description: "Learn how references to outer lexical scopes are retained even after the outer function finishes executing.",
    difficulty: "Intermediate",
    duration: "8 min",
    category: "JS Advanced",
    code: `// Lesson: Closures Generator\nfunction createCounter() {\n  let count = 0;\n  return {\n    increment: function() {\n      count++;\n      return count;\n    }\n  };\n}\n\nconst counter = createCounter();\nconsole.log("First increment:", counter.increment());\nconsole.log("Second increment:", counter.increment());`,
    videoTitle: "Closures & Garbage Collection",
    downloaded: false,
    comments: [
      { author: "Alan Turing", date: "2026-07-12 11:05", text: "Fascinating explanation of scope memory persistence." }
    ]
  },
  {
    id: 3,
    title: "Asynchronous Code execution and Event Loops",
    description: "An interactive breakdown of microtask queues, callstack execution, setTimeout and async-await resolution pipelines.",
    difficulty: "Advanced",
    duration: "12 min",
    category: "Asynchronous",
    code: `// Lesson: Event Loop Simulation\nconsole.log("1. Script start");\n\nsetTimeout(() => {\n  console.log("4. Timeout callback (Macrotask)");\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log("3. Promise resolve (Microtask)");\n});\n\nconsole.log("2. Script end");`,
    videoTitle: "Asynchronous Event Loop Syncing",
    downloaded: false,
    comments: []
  }
];

const SHOP_PRODUCTS = [
  { id: "pro_upgrade", title: "DevFluent Premium Pro Plan", price: 29.00, desc: "Lifetime access to advanced algorithms tutorials and system architecture schemas." },
  { id: "offline_usb", title: "Offline Study Hardware Pack", price: 49.00, desc: "Includes pre-configured USB Flash drive containing 10GB of video tutorials offline." },
  { id: "ai_token_pack", title: "AI Assistant Tokens Upgrade", price: 15.00, desc: "Adds 5,000 deep analysis tokens to query complex framework logs with the AI agent." }
];

// App State Registry
let state = {
  activePage: 'home',
  tutorials: [],
  cart: [],
  currentUser: null,
  offlineMode: false,
  selectedDate: null,
  selectedTimeSlot: null,
  activeSandboxTutorialId: null,
  activePaymentMethod: 'stripe',
  bookedSlots: {
    '15': ['09:00 AM'],
    '18': ['11:30 AM', '02:00 PM']
  },
  // Custom CMS content defaults
  cms: {
    heroTitle: "Master Code In Depth & Offline",
    heroPara: "Gain structural engineering concepts using step-by-step visualized tutorials. Sync to your local device to continue studying in remote regions or on flight."
  },
  progress: {
    streak: 0,
    lastLoginDate: "",
    loginLogs: []
  },
  lessonsData: {},
  quizData: {}
};

// --- 2. Initializers & Bootloaders ---
document.addEventListener('DOMContentLoaded', () => {
  loadOrCreateLocalStore();

  // Initialize Daily progress streak and syllabus data
  initUserProgress();
  initLessonsAndQuizzes();

  renderAppUI();

  // Set initial text from CMS state
  applyCMSContentToUI();

  // Handle offline initial status dot
  updateOfflineButtonUI();
});

function loadOrCreateLocalStore() {
  // Load tutorials from storage or load defaults
  const cachedTutorials = localStorage.getItem('df_tutorials');
  if (cachedTutorials) {
    state.tutorials = JSON.parse(cachedTutorials);
  } else {
    state.tutorials = JSON.parse(stringifyAndCopy(DEFAULT_TUTORIALS));
    saveTutorialsState();
  }

  // Load User Session
  const cachedUser = localStorage.getItem('df_logged_user');
  if (cachedUser) {
    state.currentUser = JSON.parse(cachedUser);
    updateUserSessionUI();
  }

  // Load CMS Content
  const cachedCMS = localStorage.getItem('df_cms');
  if (cachedCMS) {
    state.cms = JSON.parse(cachedCMS);
  } else {
    localStorage.setItem('df_cms', JSON.stringify(state.cms));
  }

  // Load Lessons cache
  const cachedLessons = localStorage.getItem('df_lessons_data');
  if (cachedLessons) {
    state.lessonsData = JSON.parse(cachedLessons);
  } else {
    state.lessonsData = JSON.parse(JSON.stringify(LESSON_SUBJECTS));
    localStorage.setItem('df_lessons_data', JSON.stringify(state.lessonsData));
  }

  // Load Quiz cache
  state.quizData = JSON.parse(JSON.stringify(QUIZ_SUBJECTS));
}

function saveTutorialsState() {
  localStorage.setItem('df_tutorials', JSON.stringify(state.tutorials));
}

function stringifyAndCopy(obj) {
  return JSON.stringify(obj);
}

// --- 3. Rendering Engines ---
function renderAppUI() {
  renderTutorialsGrid();
  renderShopProducts();
  renderCalendar();
  renderCart();
}

function renderTutorialsGrid(filterTerm = '') {
  const container = document.getElementById('tutorials-list-container');
  if (!container) return;
  container.innerHTML = '';

  const term = filterTerm.toLowerCase().trim();
  const filtered = state.tutorials.filter(t =>
    t.title.toLowerCase().includes(term) ||
    t.description.toLowerCase().includes(term) ||
    t.category.toLowerCase().includes(term)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: hsl(var(--text-muted)); padding: 40px 0;">No matching lessons found. Try another search query.</div>`;
    return;
  }

  filtered.forEach(tut => {
    const card = document.createElement('div');
    card.className = 'glass-card tutorial-card';
    card.id = `tut-card-${tut.id}`;

    const downloadBadge = tut.downloaded
      ? `<span class="download-status-badge">✓ Offline Safe</span>`
      : `<span class="download-status-badge">☁️ Cloud Only</span>`;

    card.innerHTML = `
      <div class="thumbnail-wrap">
        ${downloadBadge}
        <div class="video-mock-overlay">
          <div class="play-icon-blob">▶</div>
        </div>
      </div>
      <div class="tutorial-meta">
        <span>${tut.category}</span>
        <span>⏱ ${tut.duration}</span>
      </div>
      <h3>${tut.title}</h3>
      <p>${tut.description}</p>
      <div class="card-footer">
        <span class="badge" style="margin-bottom: 0;">${tut.difficulty}</span>
        <button class="btn btn-secondary" onclick="openSandboxRoom(${tut.id})" style="padding: 6px 12px; font-size: 0.8rem;">
          Open Workspace
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderShopProducts() {
  const container = document.getElementById('shop-products-container');
  if (!container) return;
  container.innerHTML = '';

  SHOP_PRODUCTS.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'glass-card product-card';
    card.innerHTML = `
      <div class="product-img">
        <svg style="width: 32px; height: 32px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      </div>
      <h3 style="font-size: 1rem; margin-top: 8px;">${prod.title}</h3>
      <p style="font-size: 0.8rem; color: hsl(var(--text-secondary)); flex: 1;">${prod.desc}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
        <span class="product-price">$${prod.price.toFixed(2)}</span>
        <button class="btn btn-primary" onclick="addToCart('${prod.id}')" style="padding: 6px 12px; font-size: 0.77rem;">
          Add to Cart
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderCalendar() {
  const container = document.getElementById('calendar-days-container');
  if (!container) return;
  container.innerHTML = '';

  // Day list headers
  const daysHeader = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  daysHeader.forEach(d => {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day-header';
    dayEl.innerText = d;
    container.appendChild(dayEl);
  });

  // Load blank slots for layout aligning (Simulating month July 2026 starts on Wed)
  // July 1 starts on Wed (3 empty boxes)
  for (let i = 0; i < 3; i++) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'calendar-day empty';
    container.appendChild(emptyEl);
  }

  // Days count: 31 days
  for (let d = 1; d <= 31; d++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    dayEl.innerText = d;

    // check if completely booked out
    const bookedForDay = state.bookedSlots[d.toString()] || [];
    if (bookedForDay.length >= 4) {
      dayEl.classList.add('booked');
      dayEl.title = "Fully Booked";
    }

    if (state.selectedDate === d.toString()) {
      dayEl.classList.add('selected');
    }

    dayEl.onclick = () => selectCalendarDay(d.toString());
    container.appendChild(dayEl);
  }
}

function renderCart() {
  const container = document.getElementById('cart-list');
  const checkoutBtn = document.getElementById('checkout-trigger');
  const subtotalEl = document.getElementById('cart-subtotal');

  if (!container) return;
  container.innerHTML = '';

  if (state.cart.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: hsl(var(--text-muted)); font-size: 0.85rem; padding: 24px 0;">Cart is empty</div>`;
    if (checkoutBtn) checkoutBtn.disabled = true;
    if (subtotalEl) subtotalEl.innerText = '$0.00';
    return;
  }

  let total = 0;
  state.cart.forEach(item => {
    const itemTotal = item.product.price * item.quantity;
    total += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <div style="font-weight:600; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.product.title}</div>
        <div style="font-size:0.75rem; color: hsl(var(--text-muted))">$${item.product.price.toFixed(2)} × ${item.quantity}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: 700;">$${itemTotal.toFixed(2)}</span>
        <button onclick="removeFromCart('${item.product.id}')" style="background: none; border: none; color: #ef4444; font-size: 1rem; cursor: pointer;">✕</button>
      </div>
    `;
    container.appendChild(row);
  });

  if (subtotalEl) subtotalEl.innerText = `$${total.toFixed(2)}`;
  if (checkoutBtn) checkoutBtn.disabled = false;

  // Set label inside modal checkout
  const payVals = document.querySelectorAll('.pay-total-val');
  payVals.forEach(el => el.innerText = `$${total.toFixed(2)}`);
}

function renderActiveComments() {
  const listEl = document.getElementById('comments-list-box');
  if (!listEl) return;
  listEl.innerHTML = '';

  const activeTut = state.tutorials.find(t => t.id === state.activeSandboxTutorialId);
  if (!activeTut) return;

  if (activeTut.comments.length === 0) {
    listEl.innerHTML = `<p style="text-align: center; color: hsl(var(--text-muted)); font-size: 0.85rem; padding: 12px 0;">No comments in this guild thread yet. Be the first to post!</p>`;
    return;
  }

  activeTut.comments.forEach(comment => {
    const row = document.createElement('div');
    row.className = 'comment-row';
    const init = comment.author.charAt(0).toUpperCase();

    row.innerHTML = `
      <div class="comment-avatar">${init}</div>
      <div class="comment-main">
        <div class="comment-author-meta">
          <span class="comment-author-name">${comment.author}</span>
          <span class="comment-date">${comment.date}</span>
        </div>
        <p class="comment-txt">${escapeHTML(comment.text)}</p>
      </div>
    `;
    listEl.appendChild(row);
  });
}

function renderOfflineProfilesList() {
  const listing = document.getElementById('offline-modules-listing');
  if (!listing) return;
  listing.innerHTML = '';

  const downloadedTuts = state.tutorials.filter(t => t.downloaded);
  if (downloadedTuts.length === 0) {
    listing.innerHTML = `<p style="font-size: 0.8rem; color: hsl(var(--text-muted)); font-style: italic;">No modules synced yet.</p>`;
    return;
  }

  downloadedTuts.forEach(t => {
    const item = document.createElement('div');
    item.style = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: hsla(var(--text-muted), 0.1); border-radius: var(--radius-sm); border: 1px solid var(--glass-border);';
    item.innerHTML = `
      <div style="font-size: 0.85rem; font-weight: 600;">${t.title}</div>
      <button class="btn btn-secondary" onclick="openSandboxRoom(${t.id})" style="padding: 4px 8px; font-size: 0.7rem;">Play offline</button>
    `;
    listing.appendChild(item);
  });
}

// --- 4. Navigation & Themes ---
function navigateTo(pageId) {
  // Check active section
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => {
    sec.classList.remove('active');
  });

  const targetSec = document.getElementById(`page-${pageId}`);
  if (targetSec) {
    targetSec.classList.add('active');
    state.activePage = pageId;
  }

  // Update navbar visual links
  const navItems = document.querySelectorAll('.sidebar .nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-page') === pageId) {
      item.classList.add('active');
    }
  });

  // Sync profile data list on nav
  if (pageId === 'profile') {
    renderOfflineProfilesList();
  }

  // If setting page loaded, highlight credentials state
  if (pageId === 'settings') {
    const warningEl = document.getElementById('settings-login-warning');
    const actionsEl = document.getElementById('settings-actions-panel');
    if (warningEl && actionsEl) {
      if (state.currentUser) {
        warningEl.style.display = 'none';
        actionsEl.style.opacity = '1';
        actionsEl.style.pointerEvents = 'all';
        document.getElementById('settings-username').value = state.currentUser.name;
      } else {
        warningEl.style.display = 'block';
        actionsEl.style.opacity = '0.5';
        actionsEl.style.pointerEvents = 'none';
        document.getElementById('settings-username').value = '';
      }
    }
  }

  // Close sidebar on mobile after clicking
  const sidebar = document.getElementById('app-sidebar');
  if (window.innerWidth <= 968 && sidebar) {
    sidebar.classList.remove('active');
  }

  // Load context on navigate targets immediately
  if (pageId === 'lessons') {
    loadLessonSubject(currentLessonLang || 'js');
  } else if (pageId === 'quiz') {
    loadQuizSubject(currentQuizSubject || 'js');
  } else if (pageId === 'terminal') {
    setTimeout(() => {
      const termKbd = document.getElementById('terminal-shell-keyboard');
      if (termKbd) termKbd.focus();
    }, 70);
  }

  window.scrollTo(0, 0);
}

function toggleSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('active');
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  const btnText = document.getElementById('theme-lbl');
  const icon = document.getElementById('theme-icon');

  if (isLight) {
    if (btnText) btnText.innerText = "Light";
    if (icon) {
      // sun icon
      icon.innerHTML = `<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`;
    }
  } else {
    if (btnText) btnText.innerText = "Dark";
    if (icon) {
      // moon icon
      icon.innerHTML = `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`;
    }
  }
  showToast("Aesthetic theme color flipped!");
}

function toggleOfflineMode() {
  state.offlineMode = !state.offlineMode;

  const body = document.body;
  const statusLbl = document.getElementById('offline-lbl');

  if (state.offlineMode) {
    body.classList.add('offline-mode');
    if (statusLbl) statusLbl.innerText = "Offline Mode";
    showToast("Offline mode active. Restricting cloud gateways.", "#f59e0b");
  } else {
    body.classList.remove('offline-mode');
    if (statusLbl) statusLbl.innerText = "Online Mode";
    showToast("Reconnected securely. Networks operational.", "#10b981");
  }

  updateOfflineButtonUI();

  // Refresh content grid indicators
  renderTutorialsGrid();

  // If dynamic sandbox room is active, verify state compatibility
  if (state.activeSandboxTutorialId) {
    checkSandboxOfflineCompatibility();
  }
}

function updateOfflineButtonUI() {
  const dot = document.querySelector('.offline-status-dot');
  const btn = document.getElementById('offline-toggle');
  if (!dot || !btn) return;

  if (state.offlineMode) {
    dot.style.background = '#f59e0b';
    dot.style.boxShadow = '0 0 8px #f59e0b';
    btn.style.borderColor = 'hsla(35, 92%, 50%, 0.4)';
  } else {
    dot.style.background = '#10b981';
    dot.style.boxShadow = '0 0 8px #10b981';
    btn.style.borderColor = 'var(--glass-border)';
  }
}

// --- 5. Interactive Sandbox Workspace ---
let simulatedVideoInterval = null;
let simulatedVideoProgressPct = 35;
let isVideoPlaying = false;
let playbackSpeed = 1;

function openSandboxRoom(tutorialId) {
  const tut = state.tutorials.find(t => t.id === tutorialId);
  if (!tut) return;

  // Verify offline restrictions
  if (state.offlineMode && !tut.downloaded) {
    showToast("⚠️ This module is not synced offline. Toggle Online Mode in header to fetch.", "#ef4444");
    return;
  }

  state.activeSandboxTutorialId = tutorialId;
  const room = document.getElementById('sandbox-section');
  if (room) room.style.display = 'block';

  // Fill content
  document.getElementById('sandbox-title').innerText = tut.title;
  document.getElementById('video-sim-title').innerText = `Video: ${tut.videoTitle}`;
  document.getElementById('sandbox-editor-code').value = tut.code;
  document.getElementById('sandbox-console-out').innerText = `> Output compilation clear.\nReady for code execution test.`;

  // Start timeline progress
  simulatedVideoProgressPct = 0;
  updateVideoProgressUI();
  resetVideoScheduler();
  if (isVideoPlaying) {
    startSimulatedVideoTimer();
  } else {
    togglePlayState(); // auto start
  }

  // Load comment streams
  renderActiveComments();

  // Highlight download button text
  updateSyncButtonUI(tut.downloaded);

  // Focus navigation to ensure user views panel
  setTimeout(() => {
    room.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

function closeSandbox() {
  const room = document.getElementById('sandbox-section');
  if (room) room.style.display = 'none';
  state.activeSandboxTutorialId = null;
  resetVideoScheduler();
  isVideoPlaying = false;
}

function updateSyncButtonUI(isDownloaded) {
  const btn = document.getElementById('sim-download-tutorial');
  if (!btn) return;

  if (isDownloaded) {
    btn.innerHTML = `✓ Synced Offline`;
    btn.style.background = 'hsla(160, 80%, 30%, 0.15)';
    btn.style.color = '#10b981';
    btn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
  } else {
    btn.innerHTML = `📥 Download offline`;
    btn.style.background = 'hsla(var(--text-muted), 0.1)';
    btn.style.color = 'inherit';
    btn.style.borderColor = 'var(--glass-border)';
  }
}

function checkSandboxOfflineCompatibility() {
  const tut = state.tutorials.find(t => t.id === state.activeSandboxTutorialId);
  if (!tut) return;

  if (state.offlineMode && !tut.downloaded) {
    showToast("Offline active: Room closed due to lack of local cache sync.", "#ef4444");
    closeSandbox();
  }
}

function simulateLocalSync() {
  const tut = state.tutorials.find(t => t.id === state.activeSandboxTutorialId);
  if (!tut) return;

  if (state.offlineMode && !tut.downloaded) {
    showToast("⚠️ Reconnect to download assets into local cache storage.", "#ef4444");
    return;
  }

  const btn = document.getElementById('sim-download-tutorial');
  if (btn) {
    btn.innerHTML = `<span style="font-size:0.75rem;">Downloading...</span>`;
  }

  setTimeout(() => {
    tut.downloaded = !tut.downloaded;
    saveTutorialsState();
    updateSyncButtonUI(tut.downloaded);
    renderTutorialsGrid();
    renderOfflineProfilesList();

    if (tut.downloaded) {
      showToast("Module synced. Audio tracks and code schemas ready offline.");
    } else {
      showToast("Local module sync removed.", "#ef4444");
    }
  }, 1000);
}

function runSandboxCode() {
  const codeContent = document.getElementById('sandbox-editor-code').value;
  const consoleEl = document.getElementById('sandbox-console-out');
  if (!consoleEl) return;

  consoleEl.innerText = "> Compiling JavaScript runtime...\nTape log outputs stream:\n";

  let consoleLogs = [];
  const originalLog = console.log;
  console.log = function (...args) {
    consoleLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
  };

  try {
    // Basic execution evaluator
    const result = new Function(codeContent)();

    // Retrieve sandbox output
    let outputString = consoleLogs.map(log => `[log] ${log}`).join('\n');
    if (result !== undefined) {
      outputString += `\n[return] => ${result}`;
    }

    consoleEl.innerText = outputString || "> Code ran successfully with empty output.";
    consoleEl.style.color = "#10b981";
  } catch (err) {
    consoleEl.innerText = `[compiler runtime error]: ${err.message}\n` + (err.stack ? err.stack.split('\n')[0] : '');
    consoleEl.style.color = "#ef4444";
  } finally {
    console.log = originalLog; // restore
  }
}

// Simulated Video Utilities
function togglePlayState() {
  const btn = document.getElementById('play-pause-btn-lbl');

  if (isVideoPlaying) {
    isVideoPlaying = false;
    if (btn) btn.innerText = "▶ Play";
    resetVideoScheduler();
  } else {
    isVideoPlaying = true;
    if (btn) btn.innerText = "⏸ Pause";
    startSimulatedVideoTimer();
  }
}

function startSimulatedVideoTimer() {
  resetVideoScheduler();
  simulatedVideoInterval = setInterval(() => {
    simulatedVideoProgressPct += (0.5 * playbackSpeed);
    if (simulatedVideoProgressPct >= 100) {
      simulatedVideoProgressPct = 0;
      showToast("Tutorial finished! Test code running in block.");
    }
    updateVideoProgressUI();
  }, 250);
}

function resetVideoScheduler() {
  if (simulatedVideoInterval) {
    clearInterval(simulatedVideoInterval);
    simulatedVideoInterval = null;
  }
}

function seekVideo(event) {
  const bar = event.currentTarget;
  const rect = bar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const pct = (clickX / rect.width) * 100;
  simulatedVideoProgressPct = Math.min(100, Math.max(0, pct));
  updateVideoProgressUI();
}

function changeSpeed(selectEl) {
  playbackSpeed = parseFloat(selectEl.value || "1");
  if (isVideoPlaying) {
    startSimulatedVideoTimer(); // refresh
  }
}

function updateVideoProgressUI() {
  const prog = document.getElementById('video-sim-progress');
  const timer = document.getElementById('video-timer');
  if (prog) {
    prog.style.width = `${simulatedVideoProgressPct}%`;
  }

  if (timer) {
    const totalSecs = 225; // 3 min 45s
    const currentTotalSecs = Math.floor((simulatedVideoProgressPct / 100) * totalSecs);

    const minutesVal = Math.floor(currentTotalSecs / 60).toString().padStart(2, '0');
    const secondsVal = (currentTotalSecs % 60).toString().padStart(2, '0');

    timer.innerText = `${minutesVal}:${secondsVal} / 03:45`;
  }
}

function startLatestTutorial() {
  openSandboxRoom(1);
}

// --- 6. AI Assistant System ---
function toggleAIChat() {
  const drawer = document.getElementById('ai-drawer');
  if (drawer) {
    drawer.classList.toggle('active');
    if (drawer.classList.contains('active')) {
      document.getElementById('ai-input-chat').focus();
    }
  }
}

function aiPrePrompt(text) {
  const input = document.getElementById('ai-input-chat');
  if (input) {
    input.value = text;
    sendAIMessage();
  }
}

function sendAIMessage(event) {
  if (event) event.preventDefault();

  const input = document.getElementById('ai-input-chat');
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  appendAIMessage(text, 'user');
  input.value = '';

  const scroller = document.getElementById('ai-chat-scroller');
  scroller.scrollTop = scroller.scrollHeight;

  // Simulated thinking delay...
  setTimeout(() => {
    const response = generateAIResponse(text);
    appendAIMessage(response, 'system');
    scroller.scrollTop = scroller.scrollHeight;
  }, 800);
}

function appendAIMessage(content, type) {
  const listEl = document.getElementById('ai-chat-scroller');
  if (!listEl) return;

  const msg = document.createElement('div');
  msg.className = `ai-message ${type}`;
  msg.innerText = content;
  listEl.appendChild(msg);
}

function generateAIResponse(query) {
  const q = query.toLowerCase().trim();
  const isFrench = q.includes('bonjour') || q.includes('expliqu') || q.includes('comment') || q.includes('aide') || q.includes('variables') || q.includes('boucle') || q.includes('fonction') || q.includes('salut') || q.includes('quoi');

  let response = "";

  if (isFrench) {
    if (q.includes('scope') || q.includes('portee')) {
      response = `La portée (Scope) en JavaScript détermine l'accessibilité des variables:\n1. Portée lexicale: Les fonctions imbriquées ont accès aux variables de leur fonction parent.\n2. Scope global: Variables définies hors de toute fonction.\n3. Scope de bloc: Déclarées avec 'let' et 'const' limitées aux accolades {}.`;
    } else if (q.includes('closure') || q.includes('fermeture')) {
      response = `Une fermeture (Closure) se produit lorsqu'une fonction interne conserve les références des variables de son scope parent, même après que la fonction parent a fini de s'exécuter. Exemple:\n\nfunction genererCompteur() {\n  let total = 0;\n  return () => ++total;\n}`;
    } else if (q.includes('react') || q.includes('hook') || q.includes('etat')) {
      response = `Dans React, les Hooks (comme useState et useEffect) vous permettent de synchroniser l'état et d'exécuter des cycles de rendu sans écrire de classes. useEffect écoute les dépendances pour re-déclencher des actions.`;
    } else if (q.includes('c++') || q.includes('pointeur') || q.includes('adresse')) {
      response = `En C++, les pointeurs (*) stockent les adresses de mémoire hexadécimales de variables. Vous les référencez en utilisant l'opérateur de référence (&). Pensez à 'delete' pour libérer la mémoire allouée dynamiquement sur le tas.`;
    } else if (q.includes('css') || q.includes('flexbox') || q.includes('aligner')) {
      response = `Pour aligner avec CSS Flexbox: utilisez 'justify-content: center' pour l'axe principal et 'align-items: center' pour l'axe secondaire. Pour l'effet Glassmorphism, appliquez 'backdrop-filter: blur(10px)' et des bordures translucides.`;
    } else {
      response = `Analyse de votre question: "${query}"...\nJe comprends le français! Cependant, pour cette requête spécifique, je vous suggère de regarder de plus près la documentation DevFluent.`;
    }

    const googleQuery = encodeURIComponent(query);
    response += `\n\n🔍 Besoin d'en savoir plus ? Cliquez ici pour continuer vos recherches: [Rechercher "${query}" sur Google](https://www.google.com/search?q=${googleQuery})`;
    return response;
  }

  // English details
  if (q.includes('scope')) {
    response = `JavaScript scoping defines variable accessibility. Core concepts:\n1. Lexical Scope: Nested functions retain access to outer parental scope variables.\n2. Global Context: Outer variables map to the global thread runtime.\n3. Block Scope: 'let' and 'const' variables bind locally to enclosing curly braces {} blocks.`;
  } else if (q.includes('closure')) {
    response = `A closure references and remembers its outer lexical environment variables even after execution of the outer frame completes. Pattern:\n\nfunction outer() {\n  let cache = 0;\n  return () => ++cache;\n}`;
  } else if (q.includes('react') || q.includes('hook') || q.includes('state')) {
    response = `React updates component trees when hooks state or props mutate. 'useState' holds local data variables, and 'useEffect' coordinates side-effects asynchronously during render loops.`;
  } else if (q.includes('c++') || q.includes('pointer') || q.includes('reference') || q.includes('alloc')) {
    response = `C++ pointers (*) store structural address integers of variables. Address lookup uses address-of operators (&). Heap variables require manual 'new' allocating and 'delete' releasing.`;
  } else if (q.includes('css') || q.includes('flex') || q.includes('grid') || q.includes('glass')) {
    response = `Flexbox aligns rows or columns easily. Glassmorphism combines backing HSL transparencies 'rgba(x,y,z,a)' alongside visual blur rules 'backdrop-filter: blur(12px)'.`;
  } else if (q.includes('momo') || q.includes('mtn') || q.includes('orange') || q.includes('webhook')) {
    response = `African Mobile Money (MoMo Webhook APIs) relies on callbacks for verification. Gateways invoke callback URLs notifying transaction states async because users approve USSD prompts from their mobile SIM card.`;
  } else {
    response = `Query parameters matching check: "${query}"...\nNo exact pre-prompt templates matching this query. Review DevFluent code structures.`;
  }

  const googleQuery = encodeURIComponent(query);
  response += `\n\n🔍 Need deep-dives? Ask on Google Search in one click: [Search "${query}" on Google](https://www.google.com/search?q=${googleQuery})`;
  return response;
}

// --- 7. Booking & Consulting Calendar ---
function selectCalendarDay(dayNumber) {
  if (state.offlineMode) {
    showToast("⚠️ Session slots schedules require an active connection.", "#ef4444");
    return;
  }

  // check if fully booked
  const bookedForDay = state.bookedSlots[dayNumber.toString()] || [];
  if (bookedForDay.length >= 4) {
    showToast("Day fully booked by student sessions.", "#ef4444");
    return;
  }

  state.selectedDate = dayNumber;
  state.selectedTimeSlot = null; // reset

  // Highlight calendar container selection
  renderCalendar();

  // Open scheduler selection pane
  document.getElementById('booking-empty-state').style.display = 'none';
  const pane = document.getElementById('scheduler-details-pane');
  pane.style.display = 'flex';
  document.getElementById('selected-schedule-day').innerText = `${dayNumber}th of July`;

  // Update time slot selection states visually
  const slotsCol = document.querySelectorAll('.time-slot');
  slotsCol.forEach(el => {
    el.classList.remove('selected');
    const slotTime = el.innerText;

    // Check if slot booked already
    if (bookedForDay.includes(slotTime)) {
      el.style.opacity = '0.3';
      el.style.pointerEvents = 'none';
      el.style.fontStyle = 'italic';
    } else {
      el.style.opacity = '1';
      el.style.pointerEvents = 'all';
      el.style.fontStyle = 'normal';
    }
  });
}

function selectTimeSlot(element, slotTime) {
  const slotsCol = document.querySelectorAll('.time-slot');
  slotsCol.forEach(el => el.classList.remove('selected'));

  element.classList.add('selected');
  state.selectedTimeSlot = slotTime;
}

function submitBooking(event) {
  event.preventDefault();

  if (state.offlineMode) {
    showToast("⚠️ Network unavailable. Unable to dispatch session reservation.", "#ef4444");
    return;
  }

  const emailVal = document.getElementById('booking-email').value;
  if (!state.selectedDate || !state.selectedTimeSlot) {
    showToast("Please choose an available date and calendar hour format.", "#ef4444");
    return;
  }

  // Save selection State
  const dayKey = state.selectedDate.toString();
  if (!state.bookedSlots[dayKey]) {
    state.bookedSlots[dayKey] = [];
  }
  state.bookedSlots[dayKey].push(state.selectedTimeSlot);

  // Feedback to user
  showToast(`Mentorship scheduled on July ${dayKey} at ${state.selectedTimeSlot}. Invoice dispatched to ${emailVal}`);

  // Reset Calendar Selection
  state.selectedDate = null;
  state.selectedTimeSlot = null;
  document.getElementById('booking-email').value = '';
  document.getElementById('scheduler-details-pane').style.display = 'none';
  document.getElementById('booking-empty-state').style.display = 'block';

  renderCalendar();
}

// --- 8. Shopping E-Commerce Core & Checkout ---
function addToCart(productId) {
  const productObj = SHOP_PRODUCTS.find(p => p.id === productId);
  if (!productObj) return;

  const existing = state.cart.find(item => item.product.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    state.cart.push({ product: productObj, quantity: 1 });
  }

  renderCart();
  showToast(`${productObj.title} added to cart!`);
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.product.id !== productId);
  renderCart();
}

function openCheckoutModal() {
  if (state.offlineMode) {
    showToast("Checkout requires network connectivity. Connect to verify.", "#ef4444");
    return;
  }

  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.add('active');
    switchPaymentTab(state.activePaymentMethod);
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');

  // Close OTP fields states if any
  document.getElementById('momo-otp-field').style.display = 'none';
  const momoBtn = document.getElementById('momo-primary-btn');
  if (momoBtn) momoBtn.innerText = "Next: Verify Phone Number";
}

function closeCheckoutModalOnOverlay(event) {
  if (event.target.id === 'checkout-modal') {
    closeCheckoutModal();
  }
}

function switchPaymentTab(method) {
  state.activePaymentMethod = method;

  const stripeBtn = document.getElementById('pay-tab-stripe');
  const mtnBtn = document.getElementById('pay-tab-mtn');
  const orangeBtn = document.getElementById('pay-tab-orange');

  const stripeForm = document.getElementById('pay-form-stripe');
  const momoForm = document.getElementById('pay-form-momo');
  const momoBadge = document.getElementById('momo-badge');

  // de-active all active tabs
  [stripeBtn, mtnBtn, orangeBtn].forEach(el => {
    if (el) el.classList.remove('active');
  });

  if (method === 'stripe') {
    if (stripeBtn) stripeBtn.classList.add('active');
    if (stripeForm) stripeForm.style.display = 'flex';
    if (momoForm) momoForm.style.display = 'none';
  } else {
    // momo
    if (momoForm) momoForm.style.display = 'flex';
    if (stripeForm) stripeForm.style.display = 'none';

    if (method === 'mtn') {
      if (mtnBtn) mtnBtn.classList.add('active');
      if (momoBadge) {
        momoBadge.innerText = "MTN MoMo Gateway";
        momoBadge.style.color = "#f59e0b";
        momoBadge.style.background = "rgba(245,158,11, 0.1)";
      }
    } else {
      // Orange Money
      if (orangeBtn) orangeBtn.classList.add('active');
      if (momoBadge) {
        momoBadge.innerText = "Orange Money Checkout";
        momoBadge.style.color = "#f97316";
        momoBadge.style.background = "rgba(249,115,22, 0.1)";
      }
    }

    // Reset Mobile Money fields validation
    document.getElementById('momo-otp-field').style.display = 'none';
    const momoBtnEl = document.getElementById('momo-primary-btn');
    if (momoBtnEl) momoBtnEl.innerText = "Next: Verify Phone Number";
  }
}

function startMomoVerification() {
  const momoBtn = document.getElementById('momo-primary-btn');
  const phone = document.getElementById('momo-phone').value;

  if (phone.length < 8) {
    showToast("Please write a valid mobile number.", "#ef4444");
    return;
  }

  const otpField = document.getElementById('momo-otp-field');
  if (otpField.style.display === 'none') {
    // Show validation challenge window
    momoBtn.innerText = "Sending secure OTP code...";
    setTimeout(() => {
      otpField.style.display = 'flex';
      momoBtn.innerText = `Finalize Mobile Transaction`;
      showToast("OTP token sent simulating network block!");
    }, 600);
  } else {
    // Process payment verification code check
    const otpVal = document.getElementById('momo-otp').value.trim();
    if (otpVal !== '9982') {
      showToast("⚠️ Invalid OTP verification code. Sim: 9982", "#ef4444");
      return;
    }
    processSimulatedPayment(state.activePaymentMethod === 'mtn' ? 'MTN Mobile Money' : 'Orange Money');
  }
}

function processSimulatedPayment(methodName) {
  // Mock transaction processing timer
  showToast(`Authorizing gateway payment over ${methodName}...`);
  closeCheckoutModal();

  setTimeout(() => {
    showToast("💳 Transaction authorized successfully. Welcome to Premium!");

    // check if cart has premium upgrade to toggle active states details
    const hasPremiumUpgrade = state.cart.some(i => i.product.id === 'pro_upgrade');
    if (hasPremiumUpgrade && state.currentUser) {
      state.currentUser.premium = true;
      localStorage.setItem('df_logged_user', JSON.stringify(state.currentUser));
      updateUserSessionUI();
    }

    // clear shopping basket
    state.cart = [];
    renderCart();
  }, 1200);
}

// --- 9. Blog Comment Section helper controllers ---
function addComment(event) {
  event.preventDefault();
  const textEl = document.getElementById('new-comment-text');
  if (!textEl) return;

  const content = textEl.value.trim();
  if (!content) return;

  const activeTut = state.tutorials.find(t => t.id === state.activeSandboxTutorialId);
  if (!activeTut) return;

  // Add layout comments elements dynamically
  const authorName = state.currentUser ? state.currentUser.name : "Anonymous Dev";
  const now = new Date();
  const fmtDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  activeTut.comments.unshift({
    author: authorName,
    date: fmtDate,
    text: content
  });

  saveTutorialsState();
  renderActiveComments();

  // reset input
  textEl.value = '';
  showToast("Comment published into guild thread!");
}

// --- 10. WordPress/Shopify CMS Dynamic content controller ---
function applyCMSContentToUI() {
  const h1 = document.getElementById('cms-hero-title');
  const p = document.getElementById('cms-hero-para');
  if (h1) h1.innerText = state.cms.heroTitle;
  if (p) p.innerText = state.cms.heroPara;

  // Also fill settings input boxes dynamically
  const inputTitle = document.getElementById('cms-input-title');
  const inputPara = document.getElementById('cms-input-para');
  if (inputTitle) inputTitle.value = state.cms.heroTitle;
  if (inputPara) inputPara.value = state.cms.heroPara;
}

function saveCMSContent(event) {
  event.preventDefault();
  const inputTitle = document.getElementById('cms-input-title').value;
  const inputPara = document.getElementById('cms-input-para').value;

  state.cms.heroTitle = inputTitle;
  state.cms.heroPara = inputPara;

  localStorage.setItem('df_cms', JSON.stringify(state.cms));
  applyCMSContentToUI();

  showToast("CMS Content updated immediately across nodes!");
}

// --- 11. Profile User Authentications Manager ---
function switchAuthTab(tabId) {
  const loginTab = document.getElementById('auth-tab-login');
  const signupTab = document.getElementById('auth-tab-signup');
  const resetTab = document.getElementById('auth-tab-reset');

  const loginCard = document.getElementById('auth-card-login');
  const signupCard = document.getElementById('auth-card-signup');
  const resetCard = document.getElementById('auth-card-reset');

  [loginTab, signupTab, resetTab].forEach(el => {
    if (el) el.classList.remove('active');
  });

  if (loginCard) loginCard.style.display = 'none';
  if (signupCard) signupCard.style.display = 'none';
  if (resetCard) resetCard.style.display = 'none';

  if (tabId === 'login') {
    if (loginTab) loginTab.classList.add('active');
    if (loginCard) loginCard.style.display = 'block';
  } else if (tabId === 'signup') {
    if (signupTab) signupTab.classList.add('active');
    if (signupCard) signupCard.style.display = 'block';
  } else {
    // reset
    if (resetTab) resetTab.classList.add('active');
    if (resetCard) resetCard.style.display = 'block';
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-password').value;

  // Basic verification credentials check
  if (pass.length < 4) {
    showToast("Verify passwords encryption keys.", "#ef4444");
    return;
  }

  // Mock register simulation, pulls username from email
  const name = email.split('@')[0];
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  state.currentUser = {
    name: formattedName,
    email: email,
    premium: false
  };

  localStorage.setItem('df_logged_user', JSON.stringify(state.currentUser));
  updateUserSessionUI();

  // Clear forms
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';

  showToast("Logged in securely.");
}

function handleSignupSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;

  state.currentUser = {
    name: name,
    email: email,
    premium: false
  };

  localStorage.setItem('df_logged_user', JSON.stringify(state.currentUser));
  updateUserSessionUI();

  // Clear forms
  document.getElementById('signup-name').value = '';
  document.getElementById('signup-email').value = '';
  document.getElementById('signup-password').value = '';

  showToast("Registration completed. Local database updated.");
}

function handleResetSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('reset-email').value;
  showToast(`Security verification token sent to registry mailbox: ${email}`);
  document.getElementById('reset-email').value = '';
  switchAuthTab('login');
}

function handleLogout() {
  state.currentUser = null;
  localStorage.removeItem('df_logged_user');
  updateUserSessionUI();
  showToast("Account session logged out.");
}

function saveUserPreferences(event) {
  event.preventDefault();
  if (!state.currentUser) return;

  const display = document.getElementById('settings-username').value.trim();
  if (!display) {
    showToast("Full name cannot be empty.", "#ef4444");
    return;
  }

  state.currentUser.name = display;
  localStorage.setItem('df_logged_user', JSON.stringify(state.currentUser));
  updateUserSessionUI();

  showToast("Preferences written immediately.");
}

function updateUserSessionUI() {
  const avatarBadge = document.getElementById('user-badge-avatar');
  const nameBadge = document.getElementById('user-badge-name');
  const loggedOutBlock = document.getElementById('logged-out-panel');
  const loggedInBlock = document.getElementById('logged-in-panel');
  const profName = document.getElementById('prof-display-name');
  const profMail = document.getElementById('prof-display-email');

  if (state.currentUser) {
    // Logged In setup controls
    const init = state.currentUser.name.charAt(0).toUpperCase();
    if (avatarBadge) avatarBadge.innerText = init;
    if (nameBadge) nameBadge.innerText = state.currentUser.name;
    if (loggedOutBlock) loggedOutBlock.style.display = 'none';
    if (loggedInBlock) loggedInBlock.style.display = 'block';

    let displayTitle = state.currentUser.name;
    if (state.currentUser.premium) {
      displayTitle += " (👑 Pro)";
    }
    if (profName) profName.innerText = displayTitle;
    if (profMail) profMail.innerText = state.currentUser.email;
  } else {
    // Logged Out setup controls
    if (avatarBadge) avatarBadge.innerText = "G";
    if (nameBadge) nameBadge.innerText = "Guest";
    if (loggedOutBlock) loggedOutBlock.style.display = 'block';
    if (loggedInBlock) loggedInBlock.style.display = 'none';
  }
}

// --- 12. Utilities & Search Helpers ---
function filterContent() {
  const val = document.getElementById('search-bar').value;
  // Trigger filter list
  renderTutorialsGrid(val);
}

function showToast(message, colorCode = '#10b981') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerText = message;
  toast.style.background = colorCode;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// -------------------------------------------------------------
// --- 13. Upgraded Feature Modules: Progress, Lessons, Quizzes & Shell ---

// --- A. Daily Streak Progress Checker ---
function initUserProgress() {
  let progress = {
    streak: 1,
    lastLoginDate: "",
    loginLogs: []
  };

  const cachedProgress = localStorage.getItem('df_progress_logs');
  if (cachedProgress) {
    progress = JSON.parse(cachedProgress);
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const pad = (n) => n.toString().padStart(2, '0');
  const entryTimeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  let lastLogTime = progress.loginLogs[0];
  let shouldLog = true;
  if (lastLogTime) {
    const diff = now - new Date(lastLogTime.substring(0, 10) + 'T' + lastLogTime.substring(11, 19));
    if (diff < 5000) shouldLog = false; // debounce 5s
  }

  if (shouldLog) {
    progress.loginLogs.unshift(entryTimeStr);
    if (progress.loginLogs.length > 8) {
      progress.loginLogs = progress.loginLogs.slice(0, 8);
    }
  }

  // Calculate streak values
  if (progress.lastLoginDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (progress.lastLoginDate === yesterdayStr) {
      progress.streak++;
      showToast(`🔥 Daily study streak increased to ${progress.streak} days!`);
    } else if (progress.lastLoginDate !== todayStr) {
      progress.streak = 1;
    }
  } else {
    progress.streak = 1;
  }

  progress.lastLoginDate = todayStr;
  localStorage.setItem('df_progress_logs', JSON.stringify(progress));

  state.progress = progress;
  renderProgressUI();
}

function renderProgressUI() {
  const headerStreak = document.getElementById('header-streak-count');
  const profileStreak = document.getElementById('profile-streak-count');
  const logsList = document.getElementById('profile-streak-logs-list');

  if (headerStreak) headerStreak.innerText = state.progress.streak;
  if (profileStreak) profileStreak.innerText = state.progress.streak;

  if (logsList) {
    logsList.innerHTML = '';
    if (state.progress.loginLogs.length === 0) {
      logsList.innerHTML = `<span style="color: hsl(var(--text-muted)); font-style: italic;">No access logs entries.</span>`;
    } else {
      state.progress.loginLogs.forEach((logStr, index) => {
        const row = document.createElement('div');
        row.className = 'streak-log-row';
        row.innerHTML = `
          <span>Session Log #${state.progress.loginLogs.length - index}</span>
          <span style="color: hsl(var(--primary-hsl)); font-weight: 600;">${logStr}</span>
        `;
        logsList.appendChild(row);
      });
    }
  }
}

// --- B. Syllabus Lessons Viewer ---
let currentLessonLang = 'js';

function initLessonsAndQuizzes() {
  // Setup logic placeholders if necessary
}

function loadLessonSubject(lang) {
  currentLessonLang = lang;

  // Highlight sidebar item button
  const btns = document.querySelectorAll('.lessons-cat-btn');
  btns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    }
  });

  const lesson = state.lessonsData[lang];
  if (!lesson) return;

  const viewer = document.getElementById('active-lesson-viewer');
  if (!viewer) return;

  let starsHTML = '';
  for (let i = 1; i <= 5; i++) {
    const starClass = i <= lesson.rating ? 'active' : '';
    starsHTML += `<button class="star-btn ${starClass}" onclick="rateActiveLesson(${i})">★</button>`;
  }

  viewer.innerHTML = `
    <span class="badge" style="margin-bottom: 8px;">${lesson.category}</span>
    <h2 style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; margin: 4px 0 6px;">${lesson.title}</h2>
    <p style="color: hsl(var(--text-secondary)); font-size: 0.88rem; margin-bottom: 20px;">${lesson.subtitle}</p>
    
    <div style="line-height: 1.6; font-size: 0.95rem; color: hsl(var(--text-primary)); margin-bottom: 24px;">
      ${lesson.content}
    </div>

    <h4 style="font-size: 0.85rem; font-family: var(--font-display); font-weight: 700; text-transform: uppercase;">Syllabus Code Sample:</h4>
    <div class="lesson-code-card">${escapeHTML(lesson.code)}</div>

    <div style="display: flex; gap: 12px; margin-bottom: 32px;">
      <button class="btn btn-primary" onclick="sendLessonToSandbox()" style="padding: 10px 18px; font-size: 0.825rem;">
        🚀 Send Code to Workspace Sandbox
      </button>
    </div>

    <div class="rating-stars-container">
      <span class="rating-label">Evaluate Lesson Clarity:</span>
      <div class="rating-stars-wrap">
        ${starsHTML}
      </div>
      <span style="font-size: 0.8rem; color: hsl(var(--text-muted)); margin-left: 8px;">
        (Rating: ${lesson.rating}/5 stars, total: ${lesson.reviewsCount} reviews)
      </span>
    </div>
  `;
}

function rateActiveLesson(score) {
  const lesson = state.lessonsData[currentLessonLang];
  if (!lesson) return;

  lesson.rating = score;
  lesson.reviewsCount++;

  localStorage.setItem('df_lessons_data', JSON.stringify(state.lessonsData));
  loadLessonSubject(currentLessonLang);

  showToast(`★ Rated syllabus ${score}/5 stars!`);
}

function sendLessonToSandbox() {
  const lesson = state.lessonsData[currentLessonLang];
  if (!lesson) return;

  const editor = document.getElementById('sandbox-editor-code');
  if (editor) {
    editor.value = lesson.code;
  }

  navigateTo('home');

  state.activeSandboxTutorialId = 1;
  const room = document.getElementById('sandbox-section');
  if (room) {
    room.style.display = 'block';
    document.getElementById('sandbox-title').innerText = `${lesson.title} Sandbox`;
    document.getElementById('video-sim-title').innerText = `Video: Visual ${lesson.title}`;
    document.getElementById('sandbox-console-out').innerText = `> Code imported successfully.\nReady to execute compilation tests.`;

    simulatedVideoProgressPct = 0;
    updateVideoProgressUI();

    setTimeout(() => {
      room.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}

// --- C. Quiz Evaluator Components ---
let currentQuizSubject = 'js';
let selectedAnswers = {};
let quizSubmitted = false;

function loadQuizSubject(sub) {
  currentQuizSubject = sub;
  selectedAnswers = {};
  quizSubmitted = false;

  const subjects = ['js', 'css', 'html', 'react', 'cpp'];
  subjects.forEach(s => {
    const btn = document.getElementById(`quiz-btn-${s}`);
    if (btn) btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`quiz-btn-${sub}`);
  if (activeBtn) activeBtn.classList.add('active');

  renderQuizUI();
}

function renderQuizUI() {
  const container = document.getElementById('active-quiz-card');
  if (!container) return;
  container.innerHTML = '';

  const questions = state.quizData[currentQuizSubject];
  if (!questions) return;

  let questionsHTML = '';
  questions.forEach((q, qIndex) => {
    let optionsHTML = '';
    q.options.forEach((opt, optIndex) => {
      let optClass = 'quiz-opt-card';
      if (selectedAnswers[qIndex] === optIndex) {
        optClass += ' selected';
      }

      if (quizSubmitted) {
        if (optIndex === q.answer) {
          optClass += ' correct-ans';
        } else if (selectedAnswers[qIndex] === optIndex) {
          optClass += ' incorrect-ans';
        }
      }

      const letter = String.fromCharCode(65 + optIndex);
      optionsHTML += `
        <div class="${optClass}" onclick="selectQuizOption(${qIndex}, ${optIndex})">
          <div class="quiz-opt-label">${letter}</div>
          <div style="font-size: 0.88rem;">${opt}</div>
        </div>
      `;
    });

    questionsHTML += `
      <div class="quiz-question-wrap" style="margin-bottom: 24px; border-bottom: 1px solid var(--glass-border); padding-bottom: 20px;">
        <span style="font-size: 0.77rem; color: hsl(var(--primary-hsl)); font-weight: 700;">TEST QUESTION #${qIndex + 1}:</span>
        <h4 style="font-size: 1.05rem; margin-top: 4px; font-family: var(--font-display); font-weight: 750;">${q.q}</h4>
        <div class="quiz-options-wrapper">
          ${optionsHTML}
        </div>
      </div>
    `;
  });

  let footerHTML = '';
  if (!quizSubmitted) {
    footerHTML = `
      <div style="display: flex; justify-content: flex-end;">
        <button class="btn btn-primary" onclick="submitActiveQuiz()" style="padding: 10px 24px; font-size: 0.85rem;">
          Submit Quiz Answers
        </button>
      </div>
    `;
  } else {
    let correct = 0;
    questions.forEach((q, qIndex) => {
      if (selectedAnswers[qIndex] === q.answer) correct++;
    });
    const pct = Math.round((correct / questions.length) * 100);
    const passed = pct >= 70;
    const badgeColor = passed ? '#10b981' : '#ef4444';
    const badgeBg = passed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';
    const statusText = passed ? 'Passed Evaluation' : 'Revision Suggested';

    footerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 16px; gap: 12px;">
        <span class="badge" style="background: ${badgeBg}; color: ${badgeColor}; font-size: 0.85rem; padding: 6px 12px;">${statusText}</span>
        <div style="text-align: center;">
          <h3 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800;">Grade Result: ${pct}%</h3>
          <p style="color: hsl(var(--text-secondary)); font-size: 0.85rem;">Scored ${correct} correct answers out of ${questions.length}.</p>
        </div>
        <button class="btn btn-secondary" onclick="loadQuizSubject('${currentQuizSubject}')" style="padding: 8px 18px; font-size: 0.8rem;">
          Retry evaluation
        </button>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--glass-border); padding-bottom: 10px;">
      <h3 style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; color: hsl(var(--primary-hsl));">
        Subject quiz: ${currentQuizSubject.toUpperCase()} Topic
      </h3>
      <span class="badge" style="margin-bottom: 0;">${questions.length} questions</span>
    </div>
    ${questionsHTML}
    ${footerHTML}
  `;
}

function selectQuizOption(qIdx, optIdx) {
  if (quizSubmitted) return;
  selectedAnswers[qIdx] = optIdx;
  renderQuizUI();
}

function submitActiveQuiz() {
  const questions = state.quizData[currentQuizSubject];
  for (let i = 0; i < questions.length; i++) {
    if (selectedAnswers[i] === undefined) {
      showToast("Please answer all questions before submitting.", "#ef4444");
      return;
    }
  }
  quizSubmitted = true;
  renderQuizUI();
  showToast("Quiz answers processing evaluated.");
}

// --- D. Unix Shell Cmd Web Terminal simulator ---
function handleTerminalCommand(event) {
  if (event.key !== 'Enter') return;

  const keyboard = document.getElementById('terminal-shell-keyboard');
  if (!keyboard) return;

  const rawCmd = keyboard.value;
  const cmd = rawCmd.trim();
  keyboard.value = '';

  if (!cmd) return;

  appendTerminalLine(`devfluent@shell:~$ ${cmd}`, 'cmd-echo');
  executeTerminalCommand(cmd);
}

function appendTerminalLine(text, className = '') {
  const logsDiv = document.getElementById('terminal-shell-logs');
  if (!logsDiv) return;

  const line = document.createElement('div');
  line.className = `term-line ${className}`;
  line.innerText = text;
  logsDiv.appendChild(line);

  logsDiv.scrollTop = logsDiv.scrollHeight;
}

function executeTerminalCommand(cmdStr) {
  const parts = cmdStr.split(' ');
  const main = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ');

  switch (main) {
    case 'help':
      appendTerminalLine(
        `Supported Shell instructions commands:\n` +
        `  help                  - Show this support instructions dialogue.\n` +
        `  clear                 - Clear output history lines buffer.\n` +
        `  ls                    - List active virtual assets elements.\n` +
        `  cat <filename>        - Display text logs buffers of a file.\n` +
        `  run                   - Compiles and runs JavaScript from the active workspace sandbox.\n` +
        `  streak                - Check current study streak logging data counts.\n` +
        `  theme <light/dark>    - Changes core workspace theme color parameters.\n` +
        `  system                - Display CPU, memory and configurations.`,
        'sys-success'
      );
      break;

    case 'clear':
      const logs = document.getElementById('terminal-shell-logs');
      if (logs) logs.innerHTML = '';
      break;

    case 'ls':
      appendTerminalLine(
        `Workspace elements files:\n` +
        `  - index.html\n` +
        `  - index.css\n` +
        `  - app.js\n` +
        `  - data/lessons.db\n` +
        `  - agents/assistant-intel.bin`,
        'sys-success'
      );
      break;

    case 'cat':
      if (!arg) {
        appendTerminalLine(`error: specify target filename (e.g. cat app.js)`, 'sys-fail');
        break;
      }
      if (arg === 'app.js' || arg === 'index.css' || arg === 'index.html') {
        appendTerminalLine(`[Simulated Buffer read stream of ${arg}]:`, 'sys-success');
        appendTerminalLine(`/* Content of ${arg} is loaded successfully */\n// System online.`, '');
      } else {
        appendTerminalLine(`cat: error opening ${arg}: file path not found.`, 'sys-fail');
      }
      break;

    case 'run':
      const editorText = document.getElementById('sandbox-editor-code').value;
      appendTerminalLine(`Executing index thread compilation in sandbox environment...`, '');

      let consoleOutputs = [];
      const nativeLog = console.log;
      console.log = function (...params) {
        consoleOutputs.push(params.map(p => typeof p === 'object' ? JSON.stringify(p) : p).join(' '));
      };

      try {
        const res = new Function(editorText)();
        let logsString = consoleOutputs.map(o => `[term runtime log] ${o}`).join('\n');
        if (res !== undefined) {
          logsString += `\n[term return registry] => ${res}`;
        }
        appendTerminalLine(logsString || `Execution completed successfully (empty output).`, 'sys-success');
      } catch (err) {
        appendTerminalLine(`[sandbox execution error]: ${err.message}`, 'sys-fail');
      } finally {
        console.log = nativeLog;
      }
      break;

    case 'streak':
      if (state.progress) {
        appendTerminalLine(
          `Study progress dataset stats:\n` +
          `  Daily Streak: ${state.progress.streak} days\n` +
          `  Registry record: ${state.progress.lastLoginDate}\n` +
          `  Logs cached count: ${state.progress.loginLogs.length} entries\n` +
          `  Latest visit: ${state.progress.loginLogs[0] || 'N/A'}`,
          'sys-success'
        );
      } else {
        appendTerminalLine(`Progress offline. Relog on Profile tab.`, 'sys-fail');
      }
      break;

    case 'theme':
      if (arg === 'light' || arg === 'dark') {
        const isCurrentlyLight = document.body.classList.contains('light-mode');
        if ((arg === 'light' && !isCurrentlyLight) || (arg === 'dark' && isCurrentlyLight)) {
          toggleTheme();
          appendTerminalLine(`Switched theme color configurations to ${arg}.`, 'sys-success');
        } else {
          appendTerminalLine(`Theme is already set to ${arg}.`, '');
        }
      } else {
        appendTerminalLine(`usage: theme [light/dark]`, 'sys-fail');
      }
      break;

    case 'system':
      appendTerminalLine(
        `Compiler environment: NodeJS Sandbox Browser VM\n` +
        `Memory usage: 78.4MB / 1024.0MB\n` +
        `Offline simulated status: ${state.offlineMode ? 'ACTIVE' : 'CONNECTED'}\n` +
        `Latent response: 8ms`,
        'sys-success'
      );
      break;

    default:
      appendTerminalLine(`bash: command mapping not found: ${main}. Type 'help' to review shell options.`, 'sys-fail');
  }
}

// Data Templates definitions
const LESSON_SUBJECTS = {
  js: {
    title: "JavaScript Lexicals & Scope",
    subtitle: "Understanding JavaScript engine behaviors",
    category: "JS Core",
    content: "JavaScript engine executes code in a two-pass mechanism: Compilation (lookups) and Execution. Variable bindings are stored inside Execution Context blocks. Functions keep outer scope references by creating closures. Be mindful of garbage collection retention when holding outer references.",
    code: `// Lexical Closures Example\nfunction buildMultiplier(factor) {\n  return function(number) {\n    return number * factor;\n  };\n}\nconst double = buildMultiplier(2);\nconsole.log(double(5)); // returns 10`,
    rating: 0,
    reviewsCount: 3
  },
  css: {
    title: "CSS Flexbox & Layout Paradigms",
    subtitle: "Creating beautiful glassmorphism structures",
    category: "Styling Modules",
    content: "Flexbox aligns content along a single flow (axis). Use 'align-items: center' to position components along the cross axis, and 'justify-content' along the main axis. Glassmorphism combines thin transparent borders, backdrop filters (blur), and variable radial HSL gradients to render state-of-the-art interactive containers.",
    code: `.glass-container {\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  backdrop-filter: blur(12px);\n  border-radius: var(--radius-md);\n  padding: 24px;\n}`,
    rating: 0,
    reviewsCount: 4
  },
  html: {
    title: "HTML5 Semantic Design & SEO Hooks",
    subtitle: "Structure elements for modern accessibility",
    category: "Semantic Web",
    content: "Avoid nesting generic divs recursively. Use semantic tags like 'aside' for sidebars, 'header' for top sections, 'main' for main contexts, and 'section' to separate pages. Provide unique ids for active elements to allow programmatic rendering and browser compliance verification.",
    code: `<!-- Semantic HTML Outline -->\n<aside class="sidebar">\n  <nav>\n    <ul class="nav-links">\n      <li><a href="#">Dashboard</a></li>\n    </ul>\n  </nav>\n</aside>`,
    rating: 0,
    reviewsCount: 2
  },
  react: {
    title: "React.js State Sync & Render Cycles",
    subtitle: "Virtual DOM diffing updates",
    category: "Frontend Frameworks",
    content: "React triggers render updates whenever state changes occur. The Virtual DOM structures compare node components changes, patching browser elements without rewriting the absolute tree. Synchronize updates using useEffect hooks to fetch and cache dynamic structures in offline local stores.",
    code: `// Simple State Sync Hook\nimport React, { useState, useEffect } from 'react';\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    console.log("Count synced:", count);\n  }, [count]);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}`,
    rating: 0,
    reviewsCount: 5
  },
  cpp: {
    title: "C++ Memory Addressing & Pointer Blocks",
    subtitle: "Understand low-level compilation structures",
    category: "System Programming",
    content: "C++ manages memory manually. Variables represent block memory addresses, which can be inspected directly using reference operators (&&). Pointers (*) store the memory address of another variable. Allocating dynamic memory (using 'new') registers addresses directly on the heap and requires manual deletion to avoid memory leakage.",
    code: `// C++ Pointer Addresses Demo\n#include <iostream>\nint main() {\n  int age = 21;\n  int* ptr = &age;\n  std::cout << "Value: " << age << "\\n";\n  std::cout << "Address: " << ptr << "\\n";\n  std::cout << "De-referenced: " << *ptr << "\\n";\n  return 0;\n}`,
    rating: 0,
    reviewsCount: 6
  }
};

const QUIZ_SUBJECTS = {
  js: [
    {
      q: "Which keyword defines block-scoped variables in JavaScript?",
      options: ["var", "let", "global", "scope"],
      answer: 1
    },
    {
      q: "What mechanism is formed when a nested function references variables from its outer lexical scope?",
      options: ["Recursion", "Prototype", "Closure", "Hoisting"],
      answer: 2
    },
    {
      q: "What queue is resolved first in the event loop pipeline?",
      options: ["Macrotask queue", "Microtask queue", "Rendering tasks", "SetTimeout callbacks"],
      answer: 1
    }
  ],
  css: [
    {
      q: "Which property is utilized to blur the backdrop of an element in Glassmorphic designs?",
      options: ["filter: blur()", "backdrop-filter: blur()", "glass-backdrop: blur()", "opacity-blur: true"],
      answer: 1
    },
    {
      q: "What CSS Flexbox declaration centers child items along the cross-axis?",
      options: ["justify-content: center", "align-content: center", "align-items: center", "flex-direction: center"],
      answer: 2
    }
  ],
  html: [
    {
      q: "Which semantic HTML5 tag represents sidebar utility links or secondary tools?",
      options: ["<section>", "<article>", "<aside>", "<div>"],
      answer: 2
    },
    {
      q: "How many H1 tags are recommended per page according to SEO standard guidelines?",
      options: ["Exactly one", "Up to five", "Unlimited", "Zero"],
      answer: 0
    }
  ],
  react: [
    {
      q: "What hook triggers reactive side-effects when dependency values update?",
      options: ["useState", "useMemo", "useEffect", "useCallback"],
      answer: 2
    },
    {
      q: "React component UI updates are triggered by changes in what property?",
      options: ["Variables", "State and Props", "External files", "Virtual DOM directly"],
      answer: 1
    }
  ],
  cpp: [
    {
      q: "What operator retrieves the memory address of a C++ variable?",
      options: ["*", "&", "#", "->"],
      answer: 1
    },
    {
      q: "Which C++ command dynamically requests block allocation on the heap?",
      options: ["malloc", "new", "pointer", "delete"],
      answer: 1
    }
  ]
};
