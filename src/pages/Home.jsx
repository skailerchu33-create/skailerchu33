import React, { useState, useEffect, useRef } from 'react';

export default function Home({
    searchQuery,
    isOffline,
    tutorials,
    setTutorials,
    cms,
    triggerToast,
    currentUser,
    sandboxCode,
    setSandboxCode,
    sandboxConsole,
    setSandboxConsole,
    activeSandboxId,
    setActiveSandboxId,
    setActiveTab
}) {
    const [videoProgress, setVideoProgress] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [newCommentText, setNewCommentText] = useState("");

    const videoInterval = useRef(null);

    // Video progress simulator interval
    useEffect(() => {
        if (isVideoPlaying && activeSandboxId) {
            videoInterval.current = setInterval(() => {
                setVideoProgress(p => {
                    const next = p + (0.5 * playbackSpeed);
                    if (next >= 100) {
                        if (triggerToast) triggerToast("Tutorial finished! Test code running in block.");
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
    }, [isVideoPlaying, activeSandboxId, playbackSpeed, triggerToast]);

    const activeTutorial = tutorials.find(t => t.id === activeSandboxId);

    const filteredTutorials = tutorials.filter(t => {
        const term = searchQuery.toLowerCase();
        return t.title.toLowerCase().includes(term) ||
            t.description.toLowerCase().includes(term) ||
            t.category.toLowerCase().includes(term);
    });

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

    const handleToggleSync = (tutId) => {
        if (isOffline) {
            if (triggerToast) triggerToast("⚠️ Reconnect to download assets into local cache storage.", "#ef4444");
            return;
        }
        setTutorials(prev => {
            const next = prev.map(t => t.id === tutId ? { ...t, downloaded: !t.downloaded } : t);
            localStorage.setItem('df_tutorials', JSON.stringify(next));
            const active = next.find(t => t.id === tutId);
            if (active.downloaded) {
                if (triggerToast) triggerToast("Module synced. Audio tracks and code schemas ready offline.");
            } else {
                if (triggerToast) triggerToast("Local module sync removed.", "#ef4444");
            }
            return next;
        });
    };

    return (
        <div className="home-layout-container">
            <div className="hero-grid">
                <div className="hero-left">
                    <span className="badge">Next-Gen Code Sandbox</span>
                    <h1>{cms.heroTitle}</h1>
                    <p>{cms.heroPara}</p>
                    <div style={{ display: "flex", gap: "16px" }}>
                        <button className="btn btn-primary" onClick={() => {
                            setActiveSandboxId(1);
                            setSandboxCode(tutorials[0]?.code || "");
                            setTimeout(() => document.getElementById('sandbox-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                        }}>
                            Start Learning
                        </button>
                        <button className="btn btn-secondary" onClick={() => setActiveTab('about')}>
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
                                    if (isOffline && !tut.downloaded) {
                                        if (triggerToast) triggerToast("⚠️ This module is not synced offline. Toggle Online Mode in header to fetch.", "#ef4444");
                                        return;
                                    }
                                    setActiveSandboxId(tut.id);
                                    setSandboxCode(tut.code);
                                    setVideoProgress(0);
                                    setIsVideoPlaying(false);
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
                                    if (isOffline && !tut.downloaded) {
                                        if (triggerToast) triggerToast("⚠️ This module is not synced offline. Toggle Online Mode in header to fetch.", "#ef4444");
                                        return;
                                    }
                                    setActiveSandboxId(tut.id);
                                    setSandboxCode(tut.code);
                                    setVideoProgress(0);
                                    setIsVideoPlaying(false);
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
                                    const now = new Date();
                                    const formatPad = (n) => n.toString().padStart(2, '0');
                                    const dateStr = now.toISOString().split('T')[0] + " " + formatPad(now.getHours()) + ":" + formatPad(now.getMinutes());
                                    const c = { author: currentUser ? currentUser.name : "Anonymous Dev", date: dateStr, text: newCommentText };
                                    setTutorials(prev => {
                                        const next = prev.map(t => t.id === activeSandboxId ? { ...t, comments: [c, ...t.comments] } : t);
                                        localStorage.setItem('df_tutorials', JSON.stringify(next));
                                        return next;
                                    });
                                    setNewCommentText("");
                                    if (triggerToast) triggerToast("Comment published into guild thread!");
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
                            <div className="sandbox-console" style={{ color: sandboxConsole && sandboxConsole.includes('error') ? '#ef4444' : '#10b981' }}>{sandboxConsole}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
