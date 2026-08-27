import React, { useState } from 'react';

export default function Services({ isOffline, bookedSlots, setBookedSlots, triggerToast }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [bookingEmail, setBookingEmail] = useState("");

    const selectCalendarDay = (day) => {
        if (isOffline) {
            if (triggerToast) triggerToast("⚠️ Session slots schedules require an active connection.", "#ef4444");
            return;
        }
        const booked = bookedSlots[day] || [];
        if (booked.length >= 4) {
            if (triggerToast) triggerToast("Day fully booked by student sessions.", "#ef4444");
            return;
        }
        setSelectedDate(day);
        setSelectedTimeSlot(null);
    };

    const handleBookingSubmit = (e) => {
        e.preventDefault();
        if (isOffline) {
            if (triggerToast) triggerToast("⚠️ Network unavailable. Unable to dispatch session reservation.", "#ef4444");
            return;
        }
        if (!selectedDate || !selectedTimeSlot) {
            if (triggerToast) triggerToast("Please choose an available date and calendar hour format.", "#ef4444");
            return;
        }
        setBookedSlots(prev => {
            const next = { ...prev };
            if (!next[selectedDate]) next[selectedDate] = [];
            next[selectedDate] = [...next[selectedDate], selectedTimeSlot];
            return next;
        });
        if (triggerToast) triggerToast(`Mentorship scheduled on July ${selectedDate} at ${selectedTimeSlot}. Invoice sent to ${bookingEmail}`);
        setBookingEmail("");
        setSelectedDate(null);
        setSelectedTimeSlot(null);
    };

    return (
        <section className="services-page-container">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle" style={{ color: "hsl(var(--text-secondary))", marginBottom: "24px" }}>Book visual guidance sessions or purchase premium enterprise coaching</p>

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
    );
}
