import React from 'react';

export default function Contact({ triggerToast }) {
    return (
        <section className="contact-page-container">
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle" style={{ color: "hsl(var(--text-secondary))", marginBottom: "24px" }}>Reach out for customized content, billing, or enterprise training plans</p>

            <div className="contact-layout">
                <div className="glass-card">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (triggerToast) triggerToast("Secure message sent simulating encryption logs!");
                    }} className="form-group" style={{ gap: "20px" }}>
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
    );
}
