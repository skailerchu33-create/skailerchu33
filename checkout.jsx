// DevFluent Checkout Modal Component
import React, { useState } from 'react';

const SIMULATED_OTP = "9982";

export default function CheckoutModal({ active, onClose, cartTotal = 0, onPaymentSuccess }) {
    const [tab, setTab] = useState("stripe");
    const [phone, setPhone] = useState("677123456");
    const [otp, setOtp] = useState("");
    const [otpVisible, setOtpVisible] = useState(false);
    const [processing, setProcessing] = useState(false);

    if (!active) return null;

    const handleClose = () => {
        setOtpVisible(false);
        setOtp("");
        onClose();
    };

    const handleMomoSubmit = () => {
        if (phone.length < 8) {
            alert("Please enter a valid phone number.");
            return;
        }

        if (!otpVisible) {
            setProcessing(true);
            setTimeout(() => {
                setProcessing(false);
                setOtpVisible(true);
            }, 600);
        } else {
            if (otp !== SIMULATED_OTP) {
                alert(`Invalid OTP verification code. Try: ${SIMULATED_OTP}`);
                return;
            }
            handlePay("Mobile Money (" + (tab === 'mtn' ? 'MTN' : 'Orange') + ")");
        }
    };

    const handlePay = (methodName) => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            onPaymentSuccess(methodName);
            handleClose();
        }, 1200);
    };

    return (
        <div id="checkout-modal" className="modal-overlay active" onClick={(e) => e.target.id === 'checkout-modal' && handleClose()}>
            <div className="modal-content">
                <button className="modal-close" onClick={handleClose}>✕</button>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: "800", marginBottom: "6px" }}>
                    Secure Gateway checkout
                </h3>
                <p style={{ color: "hsl(var(--text-secondary))", fontSize: "0.85rem", marginBottom: "20px" }}>
                    Choose payment option and dispatch transaction
                </p>

                <div className="payment-tab-row">
                    <button className={`payment-tab ${tab === 'stripe' ? 'active' : ''}`} onClick={() => { setTab('stripe'); setOtpVisible(false); }}>
                        💳 Card / Stripe
                    </button>
                    <button className={`payment-tab ${tab === 'mtn' ? 'active' : ''}`} onClick={() => { setTab('mtn'); setOtpVisible(false); }}>
                        📱 MTN Money
                    </button>
                    <button className={`payment-tab ${tab === 'orange' ? 'active' : ''}`} onClick={() => { setTab('orange'); setOtpVisible(false); }}>
                        🍊 Orange Money
                    </button>
                </div>

                {tab === 'stripe' ? (
                    <div id="pay-form-stripe" className="form-group" style={{ gap: "16px", display: "flex", flexDirection: "column" }}>
                        <div className="form-group">
                            <label htmlFor="stripe-card-num">Card Number</label>
                            <input type="text" id="stripe-card-num" className="input-box" defaultValue="4242 4242 4242 4242" readOnly />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <div className="form-group">
                                <label htmlFor="stripe-card-exp">Expiration</label>
                                <input type="text" id="stripe-card-exp" className="input-box" defaultValue="12/28" readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="stripe-card-cvc">CVC</label>
                                <input type="text" id="stripe-card-cvc" className="input-box" defaultValue="123" readOnly />
                            </div>
                        </div>
                        <button
                            onClick={() => handlePay("Stripe Card")}
                            className="btn btn-primary"
                            style={{ width: "100%", marginTop: "10px" }}
                            disabled={processing}
                        >
                            {processing ? "Authorizing Stripe Payment..." : `Complete Stripe Payment ($${cartTotal.toFixed(2)})`}
                        </button>
                    </div>
                ) : (
                    <div id="pay-form-momo" className="form-group" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <span
                            className="badge"
                            style={{
                                background: tab === 'mtn' ? "rgba(245, 158, 11, 0.15)" : "rgba(249, 115, 22, 0.15)",
                                color: tab === 'mtn' ? "#f59e0b" : "#f97316",
                                width: "fit-content"
                            }}
                        >
                            {tab === 'mtn' ? "MTN MoMo Gateway" : "Orange Money Checkout"}
                        </span>
                        <div className="form-group">
                            <label htmlFor="momo-phone">Mobile Phone Number</label>
                            <input
                                type="tel"
                                id="momo-phone"
                                className="input-box"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+237 6xx xxx xxx"
                            />
                        </div>

                        {otpVisible && (
                            <div id="momo-otp-field" className="form-group" style={{ display: "flex", flexDirection: "column", animation: "fadeIn var(--transition-normal) forwards" }}>
                                <label htmlFor="momo-otp">Enter SIM Verification OTP (Simulated Code: {SIMULATED_OTP})</label>
                                <input
                                    type="text"
                                    id="momo-otp"
                                    className="input-box"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 4-digit code"
                                />
                            </div>
                        )}

                        <button
                            id="momo-primary-btn"
                            onClick={handleMomoSubmit}
                            className="btn btn-primary"
                            style={{ width: "100%", marginTop: "10px" }}
                            disabled={processing}
                        >
                            {processing
                                ? "Processing momo network..."
                                : otpVisible
                                    ? "Finalize Mobile Transaction"
                                    : "Next: Verify Phone Number"
                            }
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}