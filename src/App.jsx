import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AIDrawer from './components/AIDrawer';
import CheckoutModal from './components/CheckoutModal';
import TerminalPanel from './components/TerminalPanel';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

// Data
import { DEFAULT_TUTORIALS } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  // Toast States
  const [toastMessage, setToastMessage] = useState("");
  const [toastBg, setToastBg] = useState("hsla(var(--primary-hsl), 0.9)");
  const [toastTimeoutId, setToastTimeoutId] = useState(null);

  // Tutorials State
  const [tutorials, setTutorials] = useState(() => {
    const saved = localStorage.getItem('df_tutorials');
    return saved ? JSON.parse(saved) : DEFAULT_TUTORIALS;
  });

  // CMS Content State
  const [cms, setCms] = useState(() => {
    const saved = localStorage.getItem('df_cms');
    return saved ? JSON.parse(saved) : {
      heroTitle: "Visual Learning and Sandbox Environments",
      heroPara: "Explore code lexical contexts, pointer allocations, closures generator trees, and simulation playback loops directly inside browser buffers."
    };
  });

  // User session state
  const [userSession, setUserSession] = useState(() => {
    const saved = localStorage.getItem('df_logged_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Booking schedule slots state
  const [bookedSlots, setBookedSlots] = useState(() => {
    const saved = localStorage.getItem('df_booked_slots');
    return saved ? JSON.parse(saved) : {
      '15': ['09:00 AM'],
      '18': ['11:30 AM', '02:00 PM']
    };
  });

  // Daily Streak logs state
  const [progress, setProgress] = useState({
    streak: 1,
    lastLogin: '',
    loginLogs: []
  });

  // Active Sandbox Workspaces states
  const [activeSandboxId, setActiveSandboxId] = useState(null);
  const [sandboxCode, setSandboxCode] = useState("");
  const [sandboxConsole, setSandboxConsole] = useState("> Console output will render here after execution...");

  // Sync booked slots
  useEffect(() => {
    localStorage.setItem('df_booked_slots', JSON.stringify(bookedSlots));
  }, [bookedSlots]);

  // Sync light/dark class on body element
  useEffect(() => {
    if (!isDarkMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isDarkMode]);

  // Toast Functionality
  const triggerToast = (msg, backdrop) => {
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    setToastMessage(msg);
    setToastBg(backdrop || "hsla(var(--primary-hsl), 0.9)");

    const id = setTimeout(() => {
      setToastMessage("");
    }, 2800);
    setToastTimeoutId(id);
  };

  // Streak Tracker Loader
  useEffect(() => {
    const todayStr = new Date().toDateString();
    const localProg = localStorage.getItem('df_user_progress');
    let data;

    if (localProg) {
      data = JSON.parse(localProg);
      if (data.lastLogin !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (data.lastLogin === yesterday.toDateString()) {
          data.streak += 1;
        } else {
          data.streak = 1;
        }
        data.lastLogin = todayStr;
        data.loginLogs.unshift(new Date().toLocaleString());
        if (data.loginLogs.length > 5) data.loginLogs.pop();
        localStorage.setItem('df_user_progress', JSON.stringify(data));
      }
    } else {
      data = {
        streak: 1,
        lastLogin: todayStr,
        loginLogs: [new Date().toLocaleString()]
      };
      localStorage.setItem('df_user_progress', JSON.stringify(data));
    }
    setProgress(data);
  }, []);

  const runSandboxCode = (code) => {
    let logsArray = [];
    const nativeLog = console.log;
    console.log = function (...args) {
      logsArray.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
    };

    try {
      const res = new Function(code)();
      let out = logsArray.map(l => `[log] ${l}`).join('\n');
      if (res !== undefined) out += `\n[return] => ${res}`;
      console.log = nativeLog;
      return { success: true, logs: out || "> Code execution completed synchronously with no visual logs output output." };
    } catch (e) {
      console.log = nativeLog;
      return { success: false, logs: `[compiler error log]: ${e.message}` };
    }
  };

  const handleCheckoutSuccess = (methodName) => {
    setUserSession(prev => {
      if (prev) {
        const updated = { ...prev, premium: true };
        localStorage.setItem('df_logged_user', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
    setCartItems([]);
    triggerToast(`✅ Payment authorized via ${methodName}! Granted Premium Access.`);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            searchQuery={searchQuery}
            isOffline={isOffline}
            tutorials={tutorials}
            setTutorials={setTutorials}
            cms={cms}
            triggerToast={triggerToast}
            currentUser={userSession}
            sandboxCode={sandboxCode}
            setSandboxCode={setSandboxCode}
            sandboxConsole={sandboxConsole}
            setSandboxConsole={setSandboxConsole}
            activeSandboxId={activeSandboxId}
            setActiveSandboxId={setActiveSandboxId}
            setActiveTab={setActiveTab}
          />
        );
      case 'about':
        return <About />;
      case 'services':
        return (
          <Services
            isOffline={isOffline}
            bookedSlots={bookedSlots}
            setBookedSlots={setBookedSlots}
            triggerToast={triggerToast}
          />
        );
      case 'shop':
        return (
          <Shop
            cartItems={cartItems}
            setCartItems={setCartItems}
            onCheckout={() => setIsCheckoutOpen(true)}
            isOffline={isOffline}
            triggerToast={triggerToast}
          />
        );
      case 'contact':
        return <Contact triggerToast={triggerToast} />;
      case 'settings':
        return (
          <Settings
            currentUser={userSession}
            setCurrentUser={setUserSession}
            cms={cms}
            setCms={setCms}
            triggerToast={triggerToast}
          />
        );
      case 'profile':
        return (
          <Profile
            currentUser={userSession}
            setCurrentUser={setUserSession}
            progress={progress}
            setProgress={setProgress}
            tutorials={tutorials}
            setActiveSandboxId={setActiveSandboxId}
            setSandboxCode={setSandboxCode}
            setActiveTab={setActiveTab}
            triggerToast={triggerToast}
          />
        );
      default:
        return <Home searchQuery={searchQuery} />;
    }
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarActive={isSidebarActive}
        setIsSidebarActive={setIsSidebarActive}
      />

      <div className="main-viewport">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          isOffline={isOffline}
          setIsOffline={setIsOffline}
          userSession={userSession}
          setActiveTab={setActiveTab}
          toggleAIDrawer={() => setIsAIDrawerOpen((prev) => !prev)}
          setIsSidebarActive={setIsSidebarActive}
          triggerToast={triggerToast}
        />

        <main className="content-area">{renderPage()}</main>
      </div>

      <AIDrawer isOpen={isAIDrawerOpen} onClose={() => setIsAIDrawerOpen(false)} isOffline={isOffline} />

      {/* Terminal Floating Trigger Fab */}
      <div id="terminal-fab" className="terminal-trigger-fab" onClick={() => setIsTerminalOpen(t => !t)} style={{ cursor: "pointer" }}>
        📟
      </div>

      {isTerminalOpen && (
        <TerminalPanel
          activeCode={sandboxCode}
          streak={progress.streak}
          lastLoginDate={progress.lastLogin}
          loginLogsLength={progress.loginLogs.length}
          latestVisit={progress.loginLogs[0] || 'None'}
          isOffline={isOffline}
          toggleTheme={(theme) => setIsDarkMode(theme === 'dark')}
          runSandboxCode={(code) => {
            const out = runSandboxCode(code);
            setSandboxConsole(out.logs);
            return out;
          }}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          cartItems={cartItems}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Toast Alert Message Popup Block */}
      {toastMessage && (
        <div className="toast active" style={{ backgroundColor: toastBg }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}