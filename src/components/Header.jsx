import React from 'react';

export default function Header({
    searchQuery,
    setSearchQuery,
    isDarkMode,
    setIsDarkMode,
    isOffline,
    setIsOffline,
    userSession,
    setActiveTab,
    toggleAIDrawer,
    setIsSidebarActive,
    triggerToast
}) {
    const toggleOfflineMode = () => {
        setIsOffline((prev) => {
            const next = !prev;
            if (next) {
                if (triggerToast) triggerToast("Offline mode active. Restricting cloud gateways.", "#f59e0b");
            } else {
                if (triggerToast) triggerToast("Reconnected securely. Networks operational.", "#10b981");
            }
            return next;
        });
    };

    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const next = !prev;
            if (triggerToast) triggerToast("Aesthetic theme color flipped!");
            return next;
        });
    };

    return (
        <header className="top-header">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <button className="mobile-nav-toggle" onClick={() => setIsSidebarActive((c) => !c)}>
                    <span style={{ fontSize: '1.25rem' }}>≡</span>
                </button>
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search lessons, docs, skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="header-actions">
                <button
                    className="offline-simulator-btn"
                    onClick={toggleOfflineMode}
                    style={{ borderColor: isOffline ? 'hsla(35, 92%, 50%, 0.4)' : 'var(--glass-border)' }}
                >
                    <div
                        className="offline-status-dot"
                        style={{
                            backgroundColor: isOffline ? '#f59e0b' : '#10b981',
                            boxShadow: isOffline ? '0 0 8px #f59e0b' : '0 0 8px #10b981'
                        }}
                    ></div>
                    <span>{isOffline ? "Offline Mode" : "Online Mode"}</span>
                </button>

                <button className="theme-toggle-btn" onClick={toggleTheme}>
                    <span className="emoji-icon">{!isDarkMode ? "☀️" : "🌙"}</span>
                    <span>{!isDarkMode ? "Light" : "Dark"}</span>
                </button>

                <span className="profile-badge" onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer' }}>
                    <div className="profile-avatar">
                        {userSession ? userSession.name.charAt(0).toUpperCase() : "G"}
                    </div>
                    <span className="profile-name">{userSession ? userSession.name : "Guest"}</span>
                </span>
            </div>
        </header>
    );
}
