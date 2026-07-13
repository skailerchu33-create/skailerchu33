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
  }
};

// --- 2. Initializers & Bootloaders ---
document.addEventListener('DOMContentLoaded', () => {
  loadOrCreateLocalStore();
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
  console.log = function(...args) {
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
  const q = query.toLowerCase();
  
  if (q.includes('scope')) {
    return `JavaScript scoping defines the accessibility of variables. Highlights:\n1. Lexical Scope: Functions nested internally hold access properties to outer variables.\n2. Global Context: Variables defined outside functions map to global objects.\n3. Block Scope: const and let restrict mapping scope block rules contextually.`;
  }
  if (q.includes('closure')) {
    return `A closure is formed whenever a inner nesting function keeps holds/references to its parent scope even after returning. Common pattern:\n\nfunction init() {\n  let cache = 0;\n  return () => ++cache;\n}`;
  }
  if (q.includes('momo') || q.includes('mtn') || q.includes('orange') || q.includes('webhook')) {
    return `African mobile money (MTN / Orange Money) relies heavily on callback webhooks, since users complete verification via USSD popup prompts directly on their SIM card:\n1. Submit POST request initiating billing to gateway API.\n2. Gateway requests user credential inputs.\n3. Callback URL triggers transaction notifications synchronously.`;
  }
  
  return `Analyzing query: "${query}"...\nNo direct template match. I suggest investigating variable bindings, recursion triggers, and API callback validation rules within DevFluent docs. Let me know if you would like me to output a code solution!`;
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
  const fmtDate = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

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
