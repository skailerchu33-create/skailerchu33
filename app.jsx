// DevFluent Main Application Component
const { useState, useEffect, useRef } = React;

function App() {
    const [activePage, setActivePage] = useState('home');
    const [isSidebarActive, setIsSidebarActive] = useState(false);
    const [isLightMode, setIsLightMode] = useState(false);
    const [offlineMode, setOfflineMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState({ message: '', color: '', visible: false });

    // Persistence States
    const [tutorials, setTutorials] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [cms, setCms] = useState({
        heroTitle: "Master Code In Depth & Offline",
        heroPara: "Gain structural engineering concepts using step-by-step visualized tutorials. Sync to your local device to continue studying in remote regions or on flight."
    });
    const [progress, setProgress] = useState({ streak: 1, lastLoginDate: "", loginLogs: [] });
    const [lessonsData, setLessonsData] = useState({});

    // Feature States
    const [cart, setCart] = useState([]);
    const [checkoutActive, setCheckoutActive] = useState(false);
    const [aiActive, setAiActive] = useState(false);
    const [bookedSlots, setBookedSlots] = useState({ '15': ['09:00 AM'], '18': ['11:30 AM', '02:00 PM'] });
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [bookingEmail, setBookingEmail] = useState("");

    // Sandbox Workspace States
    const [activeSandboxId, setActiveSandboxId] = useState(null);
    const [sandboxCode, setSandboxCode] = useState("");
    const [sandboxConsole, setSandboxConsole] = useState("> Output will render here...");
    const [videoProgress, setVideoProgress] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [newCommentText, setNewCommentText] = useState("");

    // Syllabus & Quiz States
    const [lessonLang, setLessonLang] = useState('js');
    const [quizSub, setQuizSub] = useState('js');
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    // Authentications
    const [authTab, setAuthTab] = useState('login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPass, setSignupPass] = useState('');
    const [resetEmail, setResetEmail] = useState('');

    // CMS Inputs
    const [cmsTitleInput, setCmsTitleInput] = useState(cms.heroTitle);
    const [cmsParaInput, setCmsParaInput] = useState(cms.heroPara);

    // Profile preferences inputs
    const [prefName, setPrefName] = useState('');

    const videoInterval = useRef(null);

    // Bootstrapping
    useEffect(() => {
        // Tutorials
        const cacheTuts = localStorage.getItem('df_tutorials');
        if (cacheTuts) setTutorials(JSON.parse(cacheTuts));
        else {
            setTutorials(window.DEFAULT_TUTORIALS);
            localStorage.setItem('df_tutorials', JSON.stringify(window.DEFAULT_TUTORIALS));
        }

        // User Session
        const cacheUser = localStorage.getItem('df_logged_user');
        if (cacheUser) {
            const u = JSON.parse(cacheUser);
            setCurrentUser(u);
            setPrefName(u.name);
        }

        // CMS
        const cacheCms = localStorage.getItem('df_cms');
        if (cacheCms) {
            const c = JSON.parse(cacheCms);
            setCms(c);
            setCmsTitleInput(c.heroTitle);
            setCmsParaInput(c.heroPara);
        }

        // Lessons Data
        const cacheLessons = localStorage.getItem('df_lessons_data');
        if (cacheLessons) setLessonsData(JSON.parse(cacheLessons));
        else {
            setLessonsData(window.LESSON_SUBJECTS);
            localStorage.setItem('df_lessons_data', JSON.stringify(window.LESSON_SUBJECTS));
        }

        // Daily streak calculations
        let prog = { streak: 1, lastLoginDate: "", loginLogs: [] };
        const cacheProg = localStorage.getItem('df_progress_logs');
        if (cacheProg) prog = JSON.parse(cacheProg);

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const pad = (n) => n.toString().padStart(2, '0');
        const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

        let shouldLog = true;
        if (prog.loginLogs.length > 0) {
            const last = prog.loginLogs[0];
            const diff = now - new Date(last.substring(0, 10) + 'T' + last.substring(11, 19));
            if (diff < 5000) shouldLog = false;
        }

        if (shouldLog) {
            prog.loginLogs.unshift(timeStr);
            if (prog.loginLogs.length > 8) prog.loginLogs = prog.loginLogs.slice(0, 8);
        }

        if (prog.lastLoginDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            if (prog.lastLoginDate === yesterdayStr) {
                prog.streak++;
                triggerToast(`🔥 Daily study streak increased to ${prog.streak} days!`);
            } else if (prog.lastLoginDate !== todayStr) {
                prog.streak = 1;
            }
        } else {
            prog.streak = 1;
        }
        prog.lastLoginDate = todayStr;
        localStorage.setItem('df_progress_logs', JSON.stringify(prog));
        setProgress(prog);
    }, []);

    // Theme Sync
    useEffect(() => {
        if (isLightMode) {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    }, [isLightMode]);

    // Video progress interval
    useEffect(() => {
        if (isVideoPlaying && activeSandboxId) {
            videoInterval.current = setInterval(() => {
                setVideoProgress(p => {
                    const next = p + (0.5 * playbackSpeed);
                    if (next >= 100) {
                        triggerToast("Tutorial finished! Test code running in block.");
                        return 0;
                    }
                    return next;
                });
            }, 250);
        } else {
            if (videoInterval.current) {
                clearInterval(videoInterval.current);
                videoInterval.current = null;
            }
        }
        return () => {
            if (videoInterval.current) clearInterval(videoInterval.current);
        };
    }, [isVideoPlaying, activeSandboxId, playbackSpeed]);

    const triggerToast = (msg, color = '#10b981') => {
        setToast({ message: msg, color, visible: true });
        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    const toggleTheme = (val) => {
        if (val) {
            setIsLightMode(val === 'light');
        } else {
            setIsLightMode(c => !c);
        }
        triggerToast("Aesthetic theme color flipped!");
    };

    const toggleOfflineMode = () => {
        setOfflineMode(prev => {
            const next = !prev;
            if (next) {
                triggerToast("Offline mode active. Restricting cloud gateways.", "#f59e0b");
            } else {
                triggerToast("Reconnected securely. Networks operational.", "#10b981");
            }
            return next;
        });
    };

    // Compile runtime
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
            return { success: true, logs: out || "> Code ran successfully with empty output." };
        } catch (e) {
            console.log = nativeLog;
            return { success: false, logs: `[compiler runtime error]: ${e.message}` };
        }
    };

    const handleRunCodeSubmit = () => {
        const res = runSandboxCode(sandboxCode);
        setSandboxConsole(res.logs);
    };

    // Sync Offline
    const handleToggleSync = (tutId) => {
        if (offlineMode) {
            triggerToast("⚠️ Reconnect to download assets into local cache storage.", "#ef4444");
            return;
        }
        setTutorials(prev => {
            const next = prev.map(t => t.id === tutId ? { ...t, downloaded: !t.downloaded } : t);
            localStorage.setItem('df_tutorials', JSON.stringify(next));
            const active = next.find(t => t.id === tutId);
            if (active.downloaded) {
                triggerToast("Module synced. Audio tracks and code schemas ready offline.");
            } else {
                triggerToast("Local module sync removed.", "#ef4444");
            }
            return next;
        });
    };

    // Cart Handlers
    const addToCart = (pId) => {
        const prod = window.SHOP_PRODUCTS.find(p => p.id === pId);
        if (!prod) return;
        setCart(prev => {
            const exist = prev.find(item => item.product.id === pId);
            let next;
            if (exist) {
                next = prev.map(item => item.product.id === pId ? { ...item, quantity: item.quantity + 1 } : item);
            } else {
                next = [...prev, { product: prod, quantity: 1 }];
            }
            triggerToast(`${prod.title} added to cart!`);
            return next;
        });
    };

    const removeFromCart = (pId) => {
        setCart(prev => prev.filter(item => item.product.id !== pId));
    };

    const cartSubtotal = cart.reduce((acc, it) => acc + (it.product.price * it.quantity), 0);

    // Authentication controllers
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (loginPass.length < 4) {
            triggerToast("Verify passwords encryption keys.", "#ef4444");
            return;
        }
        const name = loginEmail.split('@')[0];
        const fmtName = name.charAt(0).toUpperCase() + name.slice(1);
        const user = { name: fmtName, email: loginEmail, premium: false };
        setCurrentUser(user);
        setPrefName(user.name);
        localStorage.setItem('df_logged_user', JSON.stringify(user));
        triggerToast("Logged in securely.");
        setLoginEmail('');
        setLoginPass('');
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        const user = { name: signupName, email: signupEmail, premium: false };
        setCurrentUser(user);
        setPrefName(user.name);
        localStorage.setItem('df_logged_user', JSON.stringify(user));
        triggerToast("Registration completed. Local database updated.");
        setSignupName('');
        setSignupEmail('');
        setSignupPass('');
    };

    const handleResetSubmit = (e) => {
        e.preventDefault();
        triggerToast(`Security verification token sent to mailbox: ${resetEmail}`);
        setResetEmail('');
        setAuthTab('login');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setPrefName('');
        localStorage.removeItem('df_logged_user');
        triggerToast("Account session logged out.");
    };

    const saveUserPreferences = (e) => {
        e.preventDefault();
        if (!prefName.trim()) {
            triggerToast("Full name cannot be empty.", "#ef4444");
            return;
        }
        setCurrentUser(p => {
            const next = { ...p, name: prefName };
            localStorage.setItem('df_logged_user', JSON.stringify(next));
            return next;
        });
        triggerToast("Preferences written immediately.");
    };

    // CMS
    const saveCMSContent = (e) => {
        e.preventDefault();
        const nextCms = { heroTitle: cmsTitleInput, heroPara: cmsParaInput };
        setCms(nextCms);
        localStorage.setItem('df_cms', JSON.stringify(nextCms));
        triggerToast("CMS Content updated immediately across nodes!");
    };

    // Syllabus Ratings & Sandbox triggers
    const rateLesson = (lang, score) => {
        setLessonsData(prev => {
            const next = { ...prev };
            if (next[lang]) {
                next[lang].rating = score;
                next[lang].reviewsCount++;
            }
            localStorage.setItem('df_lessons_data', JSON.stringify(next));
            return next;
        });
        triggerToast(`★ Rated syllabus ${score}/5 stars!`);
    };

    const sendLessonToSandbox = (lang) => {
        const lesson = lessonsData[lang];
        if (!lesson) return;
        setSandboxCode(lesson.code);
        setActiveSandboxId(1);
        setSandboxConsole(`> Code imported successfully.\nReady to execute compilation tests.`);
        setVideoProgress(0);
        setActivePage('home');
        setTimeout(() => {
            const el = document.getElementById('sandbox-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
    };

    // Quiz evaluation
    const handleQuizAnswer = (qIdx, oIdx) => {
        if (quizSubmitted) return;
        setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    };

    const submitQuiz = () => {
        const qCount = window.QUIZ_SUBJECTS[quizSub].length;
        for (let i = 0; i < qCount; i++) {
            if (quizAnswers[i] === undefined) {
                triggerToast("Please answer all questions before submitting.", "#ef4444");
                return;
            }
        }
        setQuizSubmitted(true);
        triggerToast("Quiz answers processing evaluated.");
    };

    // Calendar 예약
    const selectCalendarDay = (day) => {
        if (offlineMode) {
            triggerToast("⚠️ Session slots schedules require an active connection.", "#ef4444");
            return;
        }
        const booked = bookedSlots[day] || [];
        if (booked.length >= 4) {
            triggerToast("Day fully booked by student sessions.", "#ef4444");
            return;
        }
        setSelectedDate(day);
        setSelectedTimeSlot(null);
    };

    const handleBookingSubmit = (e) => {
        e.preventDefault();
        if (offlineMode) {
            triggerToast("⚠️ Network unavailable. Unable to dispatch session reservation.", "#ef4444");
            return;
        }
        if (!selectedDate || !selectedTimeSlot) {
            triggerToast("Please choose an available date and calendar hour format.", "#ef4444");
            return;
        }
        setBookedSlots(prev => {
            const next = { ...prev };
            if (!next[selectedDate]) next[selectedDate] = [];
            next[selectedDate].push(selectedTimeSlot);
            return next;
        });
        triggerToast(`Mentorship scheduled on July ${selectedDate} at ${selectedTimeSlot}. Invoice sent to ${bookingEmail}`);
        setBookingEmail("");
        setSelectedDate(null);
        setSelectedTimeSlot(null);
    };

    // Checkout Momopay success callback
    const handleCheckoutSuccess = (methodName) => {
        triggerToast(`💳 Transaction authorized successfully over ${methodName}. Welcome to Premium!`);
        const hasPremium = cart.some(i => i.product.id === 'pro_upgrade');
        if (hasPremium && currentUser) {
            setCurrentUser(p => {
                const next = { ...p, premium: true };
                localStorage.setItem('df_logged_user', JSON.stringify(next));
                return next;
            });
        }
        setCart([]);
    };

    // Page Routing definitions
    const activeTutorial = tutorials.find(t => t.id === activeSandboxId);

    const filteredTutorials = tutorials.filter(t => {
        const term = searchTerm.toLowerCase();
        return t.title.toLowerCase().includes(term) ||
            t.description.toLowerCase().includes(term) ||
            t.category.toLowerCase().includes(term);
    });

    return (
        <div className="app-container">
            {/* Dynamic Toast System */}
            {toast.visible && (
                <div id="toast" className="toast-notice" style={{ display: 'block', background: toast.color }}>
                    {toast.message}
                </div>
            )}

            {/* Navigation Sidebar */}
            <aside id="app-sidebar" className={`sidebar ${isSidebarActive ? 'active' : ''}`}>
                <a href="#" className="logo-container" onClick={(e) => { e.preventDefault(); setActivePage('home'); }}>
                    <div className="logo-icon">&lt;/&gt;</div>
                    <div className="logo-text">DevFluent</div>
                </a>

                <nav style={{ flex: 1 }}>
                    <ul className="nav-links">
                        <li className={`nav-item ${activePage === 'home' ? 'active' : ''}`}>
                            <a onClick={() => { setActivePage('home'); setIsSidebarActive(false); }}>
                                <span className="emoji-icon">🏠</span> <span>Home</span>
                            </a>
                        </li>
                        <li className={`nav-item ${activePage === 'about' ? 'active' : ''}`}>
                            <a onClick={() => { setActivePage('about'); setIsSidebarActive(false); }}>
                                <span className="emoji-icon">ℹ️</span> <span>About</span>
                            </a>
                        </li>
                        <li className={`nav-item ${activePage === 'services' ? 'active' : ''}`}>
                            <a onClick={() => { setActivePage('services'); setIsSidebarActive(false); }}>
                                <span className="emoji-icon">💼</span> <span>Services</span>
                            </a>
                        </li>
                        <li className={`nav-item ${activePage === 'shop' ? 'active' : ''}`}>
                            <a onClick={() => { setActivePage('shop'); setIsSidebarActive(false); }}>
                                <span className="emoji-icon">🛒</span> <span>Shop</span>
                            </a>
                        </li>
                        <li className={`nav-item ${activePage === 'contact' ? 'active' : ''}`}>
                            <a onClick={() => { setActivePage('contact'); setIsSidebarActive(false); }}>
                                <span className="emoji-icon">📧</span> <span>Contact</span>
                            </a>
                        </li>
                        <li className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}>
                            <a onClick={() => { setActivePage('settings'); setIsSidebarActive(false); }}>
                                <span className="emoji-icon">⚙️</span> <span>Settings / CMS</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <p style={{ fontSize: "0.75rem", color: "hsl(var(--text-muted))", textAlign: "center" }}>© 2026 DevFluent Inc.</p>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="main-wrapper">
                <header className="top-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <button className="mobile-nav-toggle" onClick={() => setIsSidebarActive(c => !c)}>
                            <span style={{ fontSize: '1.25rem' }}>≡</span>
                        </button>
                        <div className="search-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search lessons, docs, skills..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="offline-simulator-btn" onClick={toggleOfflineMode} style={{ borderColor: offlineMode ? 'hsla(35, 92%, 50%, 0.4)' : 'var(--glass-border)' }}>
                            <div className="offline-status-dot" style={{ backgroundColor: offlineMode ? '#f59e0b' : '#10b981', boxShadow: offlineMode ? '0 0 8px #f59e0b' : '0 0 8px #10b981' }}></div>
                            <span>{offlineMode ? "Offline Mode" : "Online Mode"}</span>
                        </button>

                        <button className="theme-toggle-btn" onClick={() => toggleTheme()}>
                            <span className="emoji-icon">{isLightMode ? "☀️" : "🌙"}</span>
                            <span>{isLightMode ? "Light" : "Dark"}</span>
                        </button>

                        <a className="profile-badge" onClick={() => setActivePage('profile')}>
                            <div className="profile-avatar">{currentUser ? currentUser.name.charAt(0).toUpperCase() : "G"}</div>
                            <span className="profile-name">{currentUser ? currentUser.name : "Guest"}</span>
                        </a>
                    </div>
                </header>

                <main className="content-body">
                    {/* 1. HOME tab */}
                    <section className={`page-section ${activePage === 'home' ? 'active' : ''}`}>
                        <div className="hero-grid">
                            <div className="hero-left">
                                <span className="badge">Next-Gen Code Sandbox</span>
                                <h1>{cms.heroTitle}</h1>
                                <p>{cms.heroPara}</p>
                                <div style={{ display: "flex", gap: "16px" }}>
                                    <button className="btn btn-primary" onClick={() => { setActiveSandboxId(1); setSandboxCode(tutorials[0]?.code || ""); setTimeout(() => document.getElementById('sandbox-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
                                        Start Learning
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => setActivePage('about')}>
                                        Read Concept
                                    </button>
                                </div>
                                <div className="stat-strip">
                                    <div className="stat-item">
                                        <span className="stat-num">12,450+</span>
                                        <span className="stat-lbl">Active Learners</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-num">85</span>
                                        <span className="stat-lbl">Visual Lessons</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-num">99.8%</span>
                                        <span className="stat-lbl">Satisfaction</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hero-right">
                                <div className="floating-graphics-box">
                                    <div className="graphic-element graphic-code">const skills = ['JS', 'React', 'CSS'];</div>
                                    <div className="graphic-element graphic-ai"><span>✨ AI Active</span></div>
                                    <div className="graphic-element graphic-widget">
                                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: 'inline-block', marginRight: '6px' }}></span>
                                        <span>Sync Complete</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700 }}>Interactive Code Lessons</h2>
                            <p style={{ color: "hsl(var(--text-secondary))", fontSize: "0.9rem", marginTop: "4px", marginBottom: "24px" }}>
                                Click a tutorial to enter the interactive workspace & sync.
                            </p>
                        </div>

                        {/* Tutorials list */}
                        <div className="tutorials-grid">
                            {filteredTutorials.length === 0 ? (
                                <div style={{ gridColumn: "1/-1", textAlign: "center", color: "hsl(var(--text-muted))", padding: "40px 0" }}>
                                    No matching lessons found. Try another search query.
                                </div>
                            ) : (
                                filteredTutorials.map(tut => (
                                    <div key={tut.id} className="glass-card tutorial-card">
                                        <div className="thumbnail-wrap">
                                            <span className="download-status-badge">
                                                {tut.downloaded ? "✓ Offline Safe" : "☁️ Cloud Only"}
                                            </span>
                                            <div className="video-mock-overlay" onClick={() => {
                                                if (offlineMode && !tut.downloaded) {
                                                    triggerToast("⚠️ This module is not synced offline. Toggle Online Mode in header to fetch.", "#ef4444");
                                                    return;
                                                }
                                                setActiveSandboxId(tut.id);
                                                setSandboxCode(tut.code);
                                                setTimeout(() => document.getElementById('sandbox-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                                            }}>
                                                <div className="play-icon-blob">▶</div>
                                            </div>
                                        </div>
                                        <div className="tutorial-meta">
                                            <span>{tut.category}</span>
                                            <span>⏱ {tut.duration}</span>
                                        </div>
                                        <h3>{tut.title}</h3>
                                        <p>{tut.description}</p>
                                        <div className="card-footer">
                                            <span className="badge" style={{ marginBottom: 0 }}>{tut.difficulty}</span>
                                            <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => {
                                                if (offlineMode && !tut.downloaded) {
                                                    triggerToast("⚠️ This module is not synced offline. Toggle Online Mode in header to fetch.", "#ef4444");
                                                    return;
                                                }
                                                setActiveSandboxId(tut.id);
                                                setSandboxCode(tut.code);
                                                setTimeout(() => document.getElementById('sandbox-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                                            }}>
                                                Open Workspace
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Active Sandbox Viewer */}
                        {activeSandboxId && activeTutorial && (
                            <div id="sandbox-section" style={{ marginTop: "56px", borderTop: "1px solid var(--glass-border)", paddingTop: "48px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                                    <div>
                                        <span className="badge" style={{ background: "hsla(var(--secondary-hsl), 0.15)", color: "hsl(var(--secondary-hsl))" }}>Visual Sandbox Room</span>
                                        <h3 style={{ fontSize: "1.5rem", fontFamily: "var(--font-display)", fontWeight: "700" }}>{activeTutorial.title}</h3>
                                    </div>
                                    <button className="btn btn-secondary" onClick={() => { setIsVideoPlaying(false); setActiveSandboxId(null); }} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>✕ Close Workspace</button>
                                </div>

                                <div className="sandbox-grid">
                                    <div>
                                        {/* Simulated Player */}
                                        <div className="video-container">
                                            <div id="video-placeholder-graphic" style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #090a0f, #1e2640)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
                                                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                                                    <span style={{ fontSize: '1.5rem', color: 'hsl(var(--primary-hsl))' }}>▶</span>
                                                </div>
                                                <h4 style={{ fontSize: "1.05rem", fontWeight: "600", marginBottom: "4px" }}>Video: {activeTutorial.videoTitle}</h4>
                                                <p style={{ fontSize: "0.8rem", color: "hsl(var(--text-muted))" }}>Simulated visual playback track</p>
                                            </div>

                                            <div className="sim-controls">
                                                <div className="sim-timeline" onClick={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const clickX = e.clientX - rect.left;
                                                    setVideoProgress(Math.min(100, Math.max(0, (clickX / rect.width) * 100)));
                                                }}>
                                                    <div className="sim-progress" style={{ width: `${videoProgress}%` }}></div>
                                                </div>
                                                <div className="sim-btn-row">
                                                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                                        <button onClick={() => setIsVideoPlaying(p => !p)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                                                            {isVideoPlaying ? "⏸ Pause" : "▶ Play"}
                                                        </button>
                                                        <span>
                                                            {Math.floor((videoProgress / 100) * 225 / 60).toString().padStart(2, '0')}:
                                                            {Math.floor((videoProgress / 100) * 225 % 60).toString().padStart(2, '0')} / 03:45
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <select className="video-speed-selector" value={playbackSpeed} onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}>
                                                            <option value="1">1.0x Speed</option>
                                                            <option value="1.5">1.5x Speed</option>
                                                            <option value="2">2.0x Speed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Discussions */}
                                        <div className="comments-container">
                                            <h4 style={{ fontSize: "1.25rem", fontFamily: "var(--font-display)", fontWeight: "700" }}>Discussion Comments</h4>
                                            <p style={{ color: "hsl(var(--text-muted))", fontSize: "0.85rem", marginBottom: "20px" }}>Participate in the study guild chat</p>

                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                if (!newCommentText.trim()) return;
                                                const date = new Date().toISOString().split('T')[0] + " " + new Date().toTimeString().substring(0, 5);
                                                const c = { author: currentUser ? currentUser.name : "Anonymous Dev", date, text: newCommentText };
                                                setTutorials(prev => {
                                                    const next = prev.map(t => t.id === activeSandboxId ? { ...t, comments: [c, ...t.comments] } : t);
                                                    localStorage.setItem('df_tutorials', JSON.stringify(next));
                                                    return next;
                                                });
                                                setNewCommentText("");
                                                triggerToast("Comment published into guild thread!");
                                            }} className="form-group" style={{ gap: "12px" }}>
                                                <textarea className="input-box" value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} placeholder="Write a comment... (Markdown formatting supported)" required style={{ minHeight: "80px" }}></textarea>
                                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                    <button type="submit" className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>Post Comment</button>
                                                </div>
                                            </form>

                                            <div className="comments-list">
                                                {activeTutorial.comments.length === 0 ? (
                                                    <p style={{ textAlign: "center", color: "hsl(var(--text-muted))", fontSize: "0.85rem", padding: "12px 0" }}>No comments in this guild thread yet. Be the first to post!</p>
                                                ) : (
                                                    activeTutorial.comments.map((comment, i) => (
                                                        <div key={i} className="comment-row">
                                                            <div className="comment-avatar">{comment.author.charAt(0).toUpperCase()}</div>
                                                            <div className="comment-main">
                                                                <div className="comment-author-meta">
                                                                    <span className="comment-author-name">{comment.author}</span>
                                                                    <span className="comment-date">{comment.date}</span>
                                                                </div>
                                                                <p className="comment-txt">{comment.text}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sandbox Run interface */}
                                    <div>
                                        <div className="code-editor-panel">
                                            <div className="editor-header">
                                                <span>main.js</span>
                                                <span style={{ color: "hsl(var(--primary-hsl))" }}>JS Exec Terminal</span>
                                            </div>
                                            <textarea
                                                className="editor-textarea"
                                                spellCheck="false"
                                                value={sandboxCode}
                                                onChange={(e) => setSandboxCode(e.target.value)}
                                            />
                                            <div className="editor-footer">
                                                <button className="btn btn-secondary" onClick={() => handleToggleSync(activeSandboxId)} style={{ padding: "6px 12px", fontSize: "0.8rem", borderColor: activeTutorial.downloaded ? 'rgba(16, 185, 129, 0.4)' : 'var(--glass-border)', color: activeTutorial.downloaded ? '#10b981' : 'inherit' }}>
                                                    {activeTutorial.downloaded ? "✓ Synced Offline" : "📥 Download offline"}
                                                </button>
                                                <button className="btn btn-primary" onClick={handleRunCodeSubmit} style={{ padding: "6px 16px", fontSize: "0.85rem" }}>
                                                    🚀 Run Code
                                                </button>
                                            </div>
                                        </div>
                                        <div className="sandbox-console" style={{ color: sandboxConsole.includes('error') ? '#ef4444' : '#10b981' }}>{sandboxConsole}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 2. ABOUT tab */}
                    <section className={`page-section ${activePage === 'about' ? 'active' : ''}`}>
                        <div className="about-grid">
                            <div>
                                <span class="badge">Concept & Vision</span>
                                <h2 className="section-title">Visualizing Complexity, Anywhere</h2>
                                <p style={{ color: "hsl(var(--text-secondary))", lineHeight: "1.6", marginBottom: "16px" }}>
                                    DevFluent was built from the ground up to solve a fundamental barrier in tech education: access to modern high-tech visual explanations. Engineering is often abstract, but DevFluent breaks down structures through code-synced video timelines.
                                </p>
                                <p style={{ color: "hsl(var(--text-secondary))", lineHeight: "1.6", marginBottom: "24px" }}>
                                    Understanding that tech students often reside in low-bandwidth regions, we engineered a state-of-the-art **Offline Sync** pipeline. Download tutorials directly into local web databases to execute, simulate and watch without internet.
                                </p>
                                <div className="glass-card" style={{ padding: "16px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                                    <div style={{ background: "hsla(var(--primary-hsl), 0.15)", padding: "8px", borderRadius: "var(--radius-sm)", color: "hsl(var(--primary-hsl))" }}>
                                        ⚡
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "4px" }}>Target Audience</h4>
                                        <p style={{ fontSize: "0.825rem", color: "hsl(var(--text-muted))" }}>Teachers showing visual slides, students, beginners starting their programming journey, and professionals from ages 15 to 45.</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem" }}>Core Values</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "0.9rem" }}>
                                            <span style={{ color: "hsl(var(--primary-hsl))", fontWeight: "700" }}>✓</span> <span>High performance load times under 2 seconds.</span>
                                        </div>
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "0.9rem" }}>
                                            <span style={{ color: "hsl(var(--primary-hsl))", fontWeight: "700" }}>✓</span> <span>Stripe, MTN, Orange payment processing.</span>
                                        </div>
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "0.9rem" }}>
                                            <span style={{ color: "hsl(var(--primary-hsl))", fontWeight: "700" }}>✓</span> <span>Instant feedback AI assistance sandbox.</span>
                                        </div>
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "0.9rem" }}>
                                            <span style={{ color: "hsl(var(--primary-hsl))", fontWeight: "700" }}>✓</span> <span>WordPress/Shopify style custom CMS nodes.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. SERVICES tab */}
                    <section className={`page-section ${activePage === 'services' ? 'active' : ''}`}>
                        <h2 className="section-title">Our Services</h2>
                        <p className="section-subtitle">Book visual guidance sessions or purchase premium enterprise coaching</p>

                        <div className="services-layout">
                            <div className="services-list">
                                <div className="glass-card">
                                    <span className="badge" style={{ background: "hsla(var(--accent-hsl), 0.15)", color: "hsl(var(--accent-hsl))" }}>1-on-1 Guidance</span>
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "8px" }}>Technical Syllabus Review</h3>
                                    <p style={{ fontSize: "0.9rem", color: "hsl(var(--text-secondary))", marginBottom: "16px" }}>Go through code paradigms live with an expert engineer. Ask questions, analyze structural components.</p>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontFamily: "var(--font-display)", fontWeight: "700", fontSize: "1.1rem" }}>$45.00 / hr</span>
                                        <span style={{ fontSize: "0.8rem", color: "hsl(var(--text-muted))" }}>Booking slot required</span>
                                    </div>
                                </div>

                                <div className="glass-card">
                                    <span className="badge">AI Agent Review</span>
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "8px" }}>Enterprise AI Code Architect</h3>
                                    <p style={{ fontSize: "0.9rem", color: "hsl(var(--text-secondary))", marginBottom: "16px" }}>Deploy our custom AI model within your enterprise network to analyze proprietary codebase trees.</p>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontFamily: "var(--font-display)", fontWeight: "700", fontSize: "1.1rem" }}>$199.00 / mo</span>
                                        <span style={{ fontSize: "0.8rem", color: "hsl(var(--text-muted))" }}>Self-serve Shop</span>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Scheduler */}
                            <div className="glass-card calendar-card">
                                <div className="calendar-header">
                                    <h4 style={{ fontWeight: "700", fontFamily: "var(--font-display)", fontSize: "1.15rem" }}>Reserve Visual Mentoring</h4>
                                    <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "hsl(var(--primary-hsl))" }}>July 2026</span>
                                </div>

                                <div className="calendar-grid">
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                        <div key={day} className="calendar-day-header">{day}</div>
                                    ))}
                                    {[...Array(3)].map((_, i) => (
                                        <div key={`empty-${i}`} className="calendar-day empty"></div>
                                    ))}
                                    {[...Array(31)].map((_, i) => {
                                        const dayNum = (i + 1).toString();
                                        const booked = bookedSlots[dayNum] || [];
                                        const isBookedOut = booked.length >= 4;
                                        const isSelected = selectedDate === dayNum;

                                        return (
                                            <div
                                                key={dayNum}
                                                className={`calendar-day ${isBookedOut ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                                                onClick={() => selectCalendarDay(dayNum)}
                                            >
                                                {dayNum}
                                            </div>
                                        );
                                    })}
                                </div>

                                {selectedDate ? (
                                    <div className="event-scheduler-pane" style={{ display: "flex", flexDirection: "column" }}>
                                        <h5 style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>
                                            Available hours for <span>{selectedDate}th of July</span>:
                                        </h5>
                                        <div className="time-slot-grid">
                                            {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map(slot => {
                                                const isBooked = (bookedSlots[selectedDate] || []).includes(slot);
                                                return (
                                                    <div
                                                        key={slot}
                                                        className={`time-slot ${selectedTimeSlot === slot ? 'selected' : ''}`}
                                                        onClick={() => !isBooked && setSelectedTimeSlot(slot)}
                                                        style={{
                                                            opacity: isBooked ? 0.3 : 1,
                                                            pointerEvents: isBooked ? 'none' : 'auto',
                                                            fontStyle: isBooked ? 'italic' : 'normal'
                                                        }}
                                                    >
                                                        {slot}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <form onSubmit={handleBookingSubmit} className="form-group" style={{ marginTop: "16px" }}>
                                            <label htmlFor="booking-email">Attendee Contact Email</label>
                                            <input
                                                type="email"
                                                id="booking-email"
                                                className="input-box"
                                                placeholder="engineer@domain.com"
                                                value={bookingEmail}
                                                onChange={(e) => setBookingEmail(e.target.value)}
                                                required
                                                style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                                            />
                                            <button type="submit" className="btn btn-primary" style={{ marginTop: "8px", padding: "10px", fontSize: "0.85rem", width: "100%" }}>
                                                Confirm Booking Reservation
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div id="booking-empty-state" style={{ textAlign: "center", padding: "24px 0", color: "hsl(var(--text-muted))", fontSize: "0.85rem" }}>
                                        Select a calendar day above to review schedules
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 4. SHOP tab */}
                    <section className={`page-section ${activePage === 'shop' ? 'active' : ''}`}>
                        <h2 className="section-title">Developer Store</h2>
                        <p className="section-subtitle">Acquire tutorial extensions, offline packs, and support subscriptions</p>

                        <div className="shop-layout">
                            <div className="products-grid">
                                {window.SHOP_PRODUCTS.map(prod => (
                                    <div key={prod.id} className="glass-card product-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div className="product-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '2rem' }}>📦</span>
                                        </div>
                                        <h3 style={{ fontSize: "1rem", marginTop: "8px" }}>{prod.title}</h3>
                                        <p style={{ fontSize: "0.8rem", color: "hsl(var(--text-secondary))", flex: 1 }}>{prod.desc}</p>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                                            <span className="product-price">${prod.price.toFixed(2)}</span>
                                            <button className="btn btn-primary" onClick={() => addToCart(prod.id)} style={{ padding: "6px 12px", fontSize: "0.77rem" }}>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Shopping Cart page element */}
                            <div className="glass-card cart-card">
                                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: "700", paddingBottom: "12px", borderBottom: "1px solid var(--glass-border)" }}>Shopping Cart</h3>

                                <div className="cart-items-list">
                                    {cart.length === 0 ? (
                                        <div style={{ textAlign: "center", color: "hsl(var(--text-muted))", fontSize: "0.85rem", padding: "24px 0" }}>Cart is empty</div>
                                    ) : (
                                        cart.map(item => (
                                            <div key={item.product.id} className="cart-item">
                                                <div>
                                                    <div style={{ fontWeight: 600, maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product.title}</div>
                                                    <div style={{ fontSize: "0.75rem", color: "hsl(var(--text-muted))" }}>${item.product.price.toFixed(2)} × {item.quantity}</div>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <span style={{ fontWeight: 700 }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                                                    <button onClick={() => removeFromCart(item.product.id)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "1rem", cursor: "pointer" }}>✕</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "16px" }}>
                                    <div className="cart-total-row">
                                        <span>Subtotal</span>
                                        <span>${cartSubtotal.toFixed(2)}</span>
                                    </div>
                                    <button className="btn btn-primary" onClick={() => {
                                        if (offlineMode) {
                                            triggerToast("Checkout requires network connectivity. Connect to verify.", "#ef4444");
                                            return;
                                        }
                                        setCheckoutActive(true);
                                    }} style={{ width: "100%", marginTop: "16px", fontSize: "0.9rem" }} disabled={cart.length === 0}>
                                        Checkout and Pay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 5. CONTACT tab */}
                    <section className={`page-section ${activePage === 'contact' ? 'active' : ''}`}>
                        <h2 className="section-title">Get In Touch</h2>
                        <p className="section-subtitle">Reach out for customized content, billing, or enterprise training plans</p>

                        <div className="contact-layout">
                            <div className="glass-card">
                                <form onSubmit={(e) => { e.preventDefault(); triggerToast("Secure message sent simulating encryption logs!"); }} className="form-group" style={{ gap: "20px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                        <div className="form-group">
                                            <label>Your Name</label>
                                            <input type="text" className="input-box" placeholder="Jane Doe" required />
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address</label>
                                            <input type="email" className="input-box" placeholder="jane@example.com" required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Subject</label>
                                        <input type="text" className="input-box" placeholder="Support/Sponsorship request" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Message</label>
                                        <textarea className="input-box" style={{ minHeight: "120px" }} placeholder="Describe your request in detail..." required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Send Secure Message</button>
                                </form>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                <div className="glass-card">
                                    <h4 style={{ fontWeight: 700, marginBottom: "8px", fontFamily: "var(--font-display)" }}>Direct Contact</h4>
                                    <p style={{ fontSize: "0.85rem", color: "hsl(var(--text-secondary))", marginBottom: "12px" }}>For urgent corporate consultations, email directly:</p>
                                    <a href="mailto:office@devfluent.com" style={{ color: "hsl(var(--primary-hsl))", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>office@devfluent.com</a>
                                </div>
                                <div className="glass-card">
                                    <h4 style={{ fontWeight: 700, marginBottom: "8px", fontFamily: "var(--font-display)" }}>Security & Hosting</h4>
                                    <p style={{ fontSize: "0.825rem", color: "hsl(var(--text-muted))" }}>All data submitted is encrypted over transport layer SSL (HTTPS) with simulated RSA password cryptography protocols.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 6. SETTINGS tab */}
                    <section className={`page-section ${activePage === 'settings' ? 'active' : ''}`}>
                        <h2 className="section-title">Configuration & Admin</h2>
                        <p className="section-subtitle">Manage user preferences and CMS text content</p>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                            <div class="glass-card">
                                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "20px" }}>
                                    WordPress-Style Layout Editor (CMS)
                                </h3>
                                <p style={{ fontSize: "0.85rem", color: "hsl(var(--text-muted))", marginBottom: "24px" }}>
                                    Edit variables directly here. Click "Update Site" to apply edits across the homepage immediately.
                                </p>

                                <form onSubmit={saveCMSContent} className="form-group" style={{ gap: "16px" }}>
                                    <div className="form-group">
                                        <label>Hero Banner Title</label>
                                        <input type="text" className="input-box" value={cmsTitleInput} onChange={(e) => setCmsTitleInput(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Hero Secondary Paragraph</label>
                                        <textarea className="input-box" style={{ minHeight: "80px" }} value={cmsParaInput} onChange={(e) => setCmsParaInput(e.target.value)}></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                                        Update Site Content
                                    </button>
                                </form>
                            </div>

                            <div className="glass-card">
                                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "20px" }}>
                                    Account Preferences
                                </h3>
                                {!currentUser ? (
                                    <p id="settings-login-warning" style={{ fontSize: "0.85rem", color: "#f59e0b", marginBottom: "16px" }}>
                                        ⚠️ You are not logged in. Navigate to the "Profile" tab to authenticate.
                                    </p>
                                ) : (
                                    <form onSubmit={saveUserPreferences} className="form-group" style={{ gap: "16px" }}>
                                        <div className="form-group">
                                            <label>Display Full Name</label>
                                            <input type="text" className="input-box" value={prefName} onChange={(e) => setPrefName(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address</label>
                                            <input type="email" className="input-box" value={currentUser.email} disabled />
                                        </div>
                                        <button type="submit" className="btn btn-secondary">
                                            Save Profile Changes
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 7. PROFILE tab */}
                    <section className={`page-section ${activePage === 'profile' ? 'active' : ''}`}>
                        {!currentUser ? (
                            <div id="logged-out-panel" className="auth-panel">
                                <div className="auth-tabs">
                                    <div className={`auth-tab ${authTab === 'login' ? 'active' : ''}`} onClick={() => setAuthTab('login')}>Sign In</div>
                                    <div className={`auth-tab ${authTab === 'signup' ? 'active' : ''}`} onClick={() => setAuthTab('signup')}>Create Account</div>
                                    <div className={`auth-tab ${authTab === 'reset' ? 'active' : ''}`} onClick={() => setAuthTab('reset')}>Reset Password</div>
                                </div>

                                {authTab === 'login' && (
                                    <div className="glass-card auth-form-card">
                                        <form onSubmit={handleLoginSubmit} className="form-group" style={{ gap: "16px" }}>
                                            <div className="form-group">
                                                <label>Email Address</label>
                                                <input type="email" className="input-box" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="name@domain.com" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Password</label>
                                                <input type="password" className="input-box" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="••••••••" required />
                                            </div>
                                            <button type="submit" className="btn btn-primary">Sign In</button>
                                        </form>
                                    </div>
                                )}

                                {authTab === 'signup' && (
                                    <div className="glass-card auth-form-card">
                                        <form onSubmit={handleSignupSubmit} className="form-group" style={{ gap: "16px" }}>
                                            <div className="form-group">
                                                <label>Full Name</label>
                                                <input type="text" className="input-box" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="developer name" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Email Address</label>
                                                <input type="email" className="input-box" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="name@domain.com" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Secure Password</label>
                                                <input type="password" className="input-box" value={signupPass} onChange={(e) => setSignupPass(e.target.value)} placeholder="minimum 6 chars" required minLength="6" />
                                            </div>
                                            <button type="submit" className="btn btn-primary">Register Account</button>
                                        </form>
                                    </div>
                                )}

                                {authTab === 'reset' && (
                                    <div className="glass-card auth-form-card">
                                        <h3 style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)", fontWeight: "700" }}>Password Cryptography Reset</h3>
                                        <p style={{ fontSize: "0.8rem", color: "hsl(var(--text-secondary))", marginBottom: "16px" }}>Enter user email registry block. A reset verification token will be dispatched.</p>
                                        <form onSubmit={handleResetSubmit} className="form-group" style={{ gap: "16px" }}>
                                            <div className="form-group">
                                                <label>Email Address</label>
                                                <input type="email" className="input-box" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="name@domain.com" required />
                                            </div>
                                            <button type="submit" className="btn btn-primary">Dispatched Secured Token</button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div id="logged-in-panel">
                                <div className="hero-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: "32px", gap: "24px" }}>
                                    <div className="glass-card">
                                        <span className="badge">Active Profile Session</span>
                                        <h2 className="section-title" style={{ marginTop: "12px" }}>
                                            {currentUser.name} {currentUser.premium && "(👑 Pro)"}
                                        </h2>
                                        <p style={{ color: "hsl(var(--text-secondary))", fontSize: "0.95rem", marginBottom: "24px" }}>{currentUser.email}</p>
                                        <div style={{ display: "flex", gap: "12px" }}>
                                            <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>Logout Session</button>
                                            <button className="btn btn-primary" onClick={() => setActivePage('settings')} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>CMS Panel</button>
                                        </div>
                                    </div>

                                    <div className="glass-card">
                                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: "700", marginBottom: "12px" }}>Simulated Visual Dashboard</h3>
                                        <p style={{ fontSize: "0.85rem", color: "hsl(var(--text-secondary))", marginBottom: "16px" }}>Local downloaded modules usable offline:</p>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                            {tutorials.filter(t => t.downloaded).length === 0 ? (
                                                <p style={{ fontSize: "0.8rem", color: "hsl(var(--text-muted))", fontStyle: "italic" }}>No modules synced yet.</p>
                                            ) : (
                                                tutorials.filter(t => t.downloaded).map(t => (
                                                    <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "hsla(var(--text-muted), 0.1)", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)" }}>
                                                        <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>{t.title}</div>
                                                        <button className="btn btn-secondary" onClick={() => { setActiveSandboxId(t.id); setSandboxCode(t.code); setActivePage('home'); setTimeout(() => document.getElementById('sandbox-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} style={{ padding: "4px 8px", fontSize: "0.7rem" }}>Play offline</button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Daily Streak Logger panel */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🔥</div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Study Streak</h4>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'hsl(var(--primary-hsl))', margin: '8px 0' }}>
                                            {progress.streak} {progress.streak === 1 ? 'Day' : 'Days'}
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Keep logging in daily to retain memory context.</p>
                                    </div>

                                    <div className="glass-card">
                                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Access logs history</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {progress.loginLogs.map((logStr, index) => (
                                                <div key={index} className="streak-log-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'hsla(var(--text-muted), 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                                                    <span style={{ fontSize: '0.85rem' }}>Session Log #{progress.loginLogs.length - index}</span>
                                                    <span style={{ color: "hsl(var(--primary-hsl))", fontWeight: "600", fontSize: '0.85rem' }}>{logStr}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {/* Upgraded features buttons / models */}
            {/* 8. Web Terminal floating panel */}
            <button className="terminal-helper-btn" onClick={() => setActivePage(activePage === 'terminal' ? 'home' : 'terminal')} style={{ position: 'fixed', bottom: '88px', right: '24px', zIndex: '99', width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(var(--primary-hsl)), hsl(var(--accent-hsl)))', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(9, 137, 239, 0.4)' }}>
                <span style={{ fontWeight: '800', fontFamily: 'monospace', fontSize: '1.2rem' }}>&gt;_</span>
            </button>

            {activePage === 'terminal' && (
                <div style={{ position: 'fixed', bottom: '150px', right: '24px', zIndex: '100', width: '450px', maxWidth: '90vw' }}>
                    <window.TerminalPanel
                        activeCode={sandboxCode}
                        streak={progress.streak}
                        lastLoginDate={progress.lastLoginDate}
                        loginLogsLength={progress.loginLogs.length}
                        latestVisit={progress.loginLogs[0] || 'N/A'}
                        offlineMode={offlineMode}
                        toggleTheme={toggleTheme}
                        runSandboxCode={runSandboxCode}
                    />
                </div>
            )}

            {/* AI Helper floating button */}
            <button className="ai-helper-btn" onClick={() => setAiActive(a => !a)}>
                <span style={{ fontSize: '1.25rem' }}>✨</span>
            </button>

            {/* AI Helper Drawer component */}
            <window.AIHelperDrawer active={aiActive} onClose={() => setAiActive(false)} offlineMode={offlineMode} />

            {/* Payments Overlay modal checkout */}
            <window.CheckoutModal
                active={checkoutActive}
                onClose={() => setCheckoutActive(false)}
                cartTotal={cartSubtotal}
                onPaymentSuccess={handleCheckoutSuccess}
            />
        </div>
    );
}

// Mount the App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
