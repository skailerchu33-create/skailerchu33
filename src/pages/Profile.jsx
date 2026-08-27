import React, { useState } from 'react';

export default function Profile({
    currentUser,
    setCurrentUser,
    progress,
    setProgress,
    tutorials,
    setActiveSandboxId,
    setSandboxCode,
    setActiveTab,
    triggerToast
}) {
    const [authTab, setAuthTab] = useState('login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPass, setSignupPass] = useState('');
    const [resetEmail, setResetEmail] = useState('');

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (loginPass.length < 4) {
            if (triggerToast) triggerToast("Verify passwords encryption keys.", "#ef4444");
            return;
        }
        const name = loginEmail.split('@')[0];
        const fmtName = name.charAt(0).toUpperCase() + name.slice(1);
        const user = { name: fmtName, email: loginEmail, premium: false };
        setCurrentUser(user);
        localStorage.setItem('df_logged_user', JSON.stringify(user));
        if (triggerToast) triggerToast("Logged in securely.");
        setLoginEmail('');
        setLoginPass('');
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        const user = { name: signupName, email: signupEmail, premium: false };
        setCurrentUser(user);
        localStorage.setItem('df_logged_user', JSON.stringify(user));
        if (triggerToast) triggerToast("Registration completed. Local database updated.");
        setSignupName('');
        setSignupEmail('');
        setSignupPass('');
    };

    const handleResetSubmit = (e) => {
        e.preventDefault();
        if (triggerToast) triggerToast(`Security verification token sent to mailbox: ${resetEmail}`);
        setResetEmail('');
        setAuthTab('login');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('df_logged_user');
        if (triggerToast) triggerToast("Account session logged out.");
    };

    return (
        <section className="profile-page-container">
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
                                <button className="btn btn-primary" onClick={() => setActiveTab('settings')} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>CMS Panel</button>
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
                                            <button className="btn btn-secondary" onClick={() => {
                                                setActiveSandboxId(t.id);
                                                setSandboxCode(t.code);
                                                setActiveTab('home');
                                                setTimeout(() => document.getElementById('sandbox-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                                            }} style={{ padding: "4px 8px", fontSize: "0.7rem" }}>Play offline</button>
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
    );
}
