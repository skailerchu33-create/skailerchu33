import React from 'react';

export default function About() {
    return (
        <div className="about-layout-container">
            <div className="about-grid">
                <div>
                    <span className="badge">Concept & Vision</span>
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
        </div>
    );
}
