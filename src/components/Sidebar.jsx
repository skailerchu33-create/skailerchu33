import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, isSidebarActive, setIsSidebarActive }) {
    return (
        <aside id="app-sidebar" className={`sidebar ${isSidebarActive ? 'active' : ''}`}>
            <span className="logo-container" onClick={() => { setActiveTab('home'); setIsSidebarActive(false); }} style={{ cursor: 'pointer' }}>
                <div className="logo-icon">&lt;/&gt;</div>
                <div className="logo-text">DevFluent</div>
            </span>

            <nav style={{ flex: 1 }}>
                <ul className="nav-links">
                    <li className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}>
                        <span onClick={() => { setActiveTab('home'); setIsSidebarActive(false); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="emoji-icon">🏠</span> <span>Home</span>
                        </span>
                    </li>
                    <li className={`nav-item ${activeTab === 'about' ? 'active' : ''}`}>
                        <span onClick={() => { setActiveTab('about'); setIsSidebarActive(false); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="emoji-icon">ℹ️</span> <span>About</span>
                        </span>
                    </li>
                    <li className={`nav-item ${activeTab === 'services' ? 'active' : ''}`}>
                        <span onClick={() => { setActiveTab('services'); setIsSidebarActive(false); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="emoji-icon">💼</span> <span>Services</span>
                        </span>
                    </li>
                    <li className={`nav-item ${activeTab === 'shop' ? 'active' : ''}`}>
                        <span onClick={() => { setActiveTab('shop'); setIsSidebarActive(false); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="emoji-icon">🛒</span> <span>Shop</span>
                        </span>
                    </li>
                    <li className={`nav-item ${activeTab === 'contact' ? 'active' : ''}`}>
                        <span onClick={() => { setActiveTab('contact'); setIsSidebarActive(false); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="emoji-icon">📧</span> <span>Contact</span>
                        </span>
                    </li>
                    <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
                        <span onClick={() => { setActiveTab('settings'); setIsSidebarActive(false); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="emoji-icon">⚙️</span> <span>Settings / CMS</span>
                        </span>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-footer">
                <p style={{ fontSize: "0.75rem", color: "hsl(var(--text-muted))", textAlign: "center" }}>© 2026 DevFluent Inc.</p>
            </div>
        </aside>
    );
}
