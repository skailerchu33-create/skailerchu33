import React, { useState, useEffect } from 'react';

export default function Settings({ currentUser, setCurrentUser, cms, setCms, triggerToast }) {
    const [cmsTitleInput, setCmsTitleInput] = useState(cms.heroTitle || "");
    const [cmsParaInput, setCmsParaInput] = useState(cms.heroPara || "");
    const [prefName, setPrefName] = useState(currentUser ? currentUser.name : "");

    useEffect(() => {
        if (cms) {
            setCmsTitleInput(cms.heroTitle);
            setCmsParaInput(cms.heroPara);
        }
    }, [cms]);

    useEffect(() => {
        if (currentUser) {
            setPrefName(currentUser.name);
        }
    }, [currentUser]);

    const saveCMSContent = (e) => {
        e.preventDefault();
        const nextCms = { heroTitle: cmsTitleInput, heroPara: cmsParaInput };
        setCms(nextCms);
        localStorage.setItem('df_cms', JSON.stringify(nextCms));
        if (triggerToast) triggerToast("CMS Content updated immediately across nodes!");
    };

    const saveUserPreferences = (e) => {
        e.preventDefault();
        if (!prefName.trim()) {
            if (triggerToast) triggerToast("Full name cannot be empty.", "#ef4444");
            return;
        }
        setCurrentUser(p => {
            const next = { ...p, name: prefName };
            localStorage.setItem('df_logged_user', JSON.stringify(next));
            return next;
        });
        if (triggerToast) triggerToast("Preferences written immediately.");
    };

    return (
        <section className="settings-page-container">
            <h2 className="section-title">Configuration & Admin</h2>
            <p className="section-subtitle" style={{ color: "hsl(var(--text-secondary))", marginBottom: "24px" }}>Manage user preferences and CMS text content</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <div className="glass-card">
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
    );
}
