import React from 'react';
import { SHOP_PRODUCTS } from '../data';

export default function Shop({ cartItems, setCartItems, onCheckout, isOffline, triggerToast }) {
    const addToCart = (pId) => {
        const prod = SHOP_PRODUCTS.find(p => p.id === pId);
        if (!prod) return;
        setCartItems(prev => {
            const exist = prev.find(item => item.product.id === pId);
            let next;
            if (exist) {
                next = prev.map(item => item.product.id === pId ? { ...item, quantity: item.quantity + 1 } : item);
            } else {
                next = [...prev, { product: prod, quantity: 1 }];
            }
            if (triggerToast) triggerToast(`${prod.title} added to cart!`);
            return next;
        });
    };

    const removeFromCart = (pId) => {
        setCartItems(prev => prev.filter(item => item.product.id !== pId));
    };

    const cartSubtotal = cartItems.reduce((acc, it) => acc + (it.product.price * it.quantity), 0);

    return (
        <section className="shop-page-container">
            <h2 className="section-title">Developer Store</h2>
            <p className="section-subtitle" style={{ color: "hsl(var(--text-secondary))", marginBottom: "24px" }}>Acquire tutorial extensions, offline packs, and support subscriptions</p>

            <div className="shop-layout">
                <div className="products-grid">
                    {SHOP_PRODUCTS.map(prod => (
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
                        {cartItems.length === 0 ? (
                            <div style={{ textAlign: "center", color: "hsl(var(--text-muted))", fontSize: "0.85rem", padding: "24px 0" }}>Cart is empty</div>
                        ) : (
                            cartItems.map(item => (
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
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (isOffline) {
                                    if (triggerToast) triggerToast("Checkout requires network connectivity. Connect to verify.", "#ef4444");
                                    return;
                                }
                                onCheckout();
                            }}
                            style={{ width: "100%", marginTop: "16px", fontSize: "0.9rem" }}
                            disabled={cartItems.length === 0}
                        >
                            Checkout and Pay
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
