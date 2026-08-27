// DevFluent AI Helper Drawer Component
const { useState, useEffect, useRef } = React;

window.AIHelperDrawer = function AIHelperDrawer({ active, onClose, offlineMode }) {
    const [messages, setMessages] = useState([
        {
            type: "system",
            content: "Hi there! I am the DevFluent local assistant. Feed me any block of code or ask any questions about programming, and I will explain the execution processes and structure."
        }
    ]);
    const [inp, setInp] = useState("");
    const chatScrollerRef = useRef(null);

    useEffect(() => {
        if (chatScrollerRef.current) {
            chatScrollerRef.current.scrollTop = chatScrollerRef.current.scrollHeight;
        }
    }, [messages, active]);

    const generateResponse = (query) => {
        const q = query.toLowerCase().trim();
        const isFrench = q.includes('bonjour') || q.includes('expliqu') || q.includes('comment') || q.includes('aide') || q.includes('variables') || q.includes('boucle') || q.includes('fonction') || q.includes('salut') || q.includes('quoi');

        let response = "";
        if (isFrench) {
            if (q.includes('scope') || q.includes('portee')) {
                response = `La portée (Scope) en JavaScript détermine l'accessibilité des variables:\n1. Portée lexicale: Les fonctions imbriquées ont accès aux variables de leur fonction parent.\n2. Scope global: Variables définies hors de toute fonction.\n3. Scope de bloc: Déclarées avec 'let' et 'const' limitées aux accolades {}.`;
            } else if (q.includes('closure') || q.includes('fermeture')) {
                response = `Une fermeture (Closure) se produit lorsqu'une fonction interne conserve les références des variables de son scope parent, même après que la fonction parent a fini de s'exécuter. Exemple:\n\nfunction genererCompteur() {\n  let total = 0;\n  return () => ++total;\n}`;
            } else if (q.includes('react') || q.includes('hook') || q.includes('etat')) {
                response = `Dans React, les Hooks (comme useState et useEffect) vous permettent de synchroniser l'état et d'exécuter des cycles de rendu sans écrire de classes. useEffect écoute les dépendances pour re-déclencher des actions.`;
            } else if (q.includes('c++') || q.includes('pointeur') || q.includes('adresse')) {
                response = `En C++, les pointeurs (*) stockent les adresses de mémoire hexadécimales de variables. Vous les référencez en utilisant l'opérateur de référence (&). Pensez à 'delete' pour libérer la mémoire allouée dynamiquement sur le tas.`;
            } else if (q.includes('css') || q.includes('flexbox') || q.includes('aligner')) {
                response = `Pour aligner avec CSS Flexbox: utilisez 'justify-content: center' pour l'axe principal et 'align-items: center' pour l'axe secondaire. Pour l'effet Glassmorphism, appliquez 'backdrop-filter: blur(10px)' et des bordures translucides.`;
            } else {
                response = `Analyse de votre question: "${query}"...\nJe comprends le français! Cependant, pour cette requête spécifique, je vous suggère de regarder de plus près la documentation DevFluent.`;
            }
        } else {
            // English
            if (q.includes('scope')) {
                response = `JavaScript scoping defines variable accessibility. Core concepts:\n1. Lexical Scope: Nested functions retain access to outer parental scope variables.\n2. Global Context: Outer variables map to the global thread runtime.\n3. Block Scope: 'let' and 'const' variables bind locally to enclosing curly braces {} blocks.`;
            } else if (q.includes('closure')) {
                response = `A closure references and remembers its outer lexical environment variables even after execution of the outer frame completes. Pattern:\n\nfunction outer() {\n  let cache = 0;\n  return () => ++cache;\n}`;
            } else if (q.includes('react') || q.includes('hook') || q.includes('state')) {
                response = `React updates component trees when hooks state or props mutate. 'useState' holds local data variables, and 'useEffect' coordinates side-effects asynchronously during render loops.`;
            } else if (q.includes('c++') || q.includes('pointer') || q.includes('reference') || q.includes('alloc')) {
                response = `C++ pointers (*) store structural address integers of variables. Address lookup uses address-of operators (&). Heap variables require manual 'new' allocating and 'delete' releasing.`;
            } else if (q.includes('css') || q.includes('flex') || q.includes('grid') || q.includes('glass')) {
                response = `Flexbox aligns rows or columns easily. Glassmorphism combines backing HSL transparencies 'rgba(x,y,z,a)' alongside visual blur rules 'backdrop-filter: blur(12px)'.`;
            } else if (q.includes('momo') || q.includes('mtn') || q.includes('orange') || q.includes('webhook')) {
                response = `African Mobile Money (MoMo Webhook APIs) relies on callbacks for verification. Gateways invoke callback URLs notifying transaction states async because users approve USSD prompts from their mobile SIM card.`;
            } else {
                response = `Query parameters matching check: "${query}"...\nNo exact pre-prompt templates matching this query. Review DevFluent code structures.`;
            }
        }

        const googleQuery = encodeURIComponent(query);
        response += `\n\n🔍 Need deep-dives? Ask on Google Search in one click: [Search "${query}" on Google](https://www.google.com/search?q=${googleQuery})`;
        return response;
    };

    const handleSend = (e) => {
        if (e) e.preventDefault();
        const text = inp.trim();
        if (!text) return;

        setMessages(prev => [...prev, { type: "user", content: text }]);
        setInp("");

        setTimeout(() => {
            const resp = generateResponse(text);
            setMessages(prev => [...prev, { type: "system", content: resp }]);
        }, 600);
    };

    const handlePrePrompt = (text) => {
        setInp(text);
        setMessages(prev => [...prev, { type: "user", content: text }]);
        setTimeout(() => {
            const resp = generateResponse(text);
            setMessages(prev => [...prev, { type: "system", content: resp }]);
        }, 600);
    };

    return (
        <div id="ai-drawer" className={`ai-assistant-drawer ${active ? "active" : ""}`}>
            <div className="ai-drawer-header">
                <div className="ai-drawer-title">
                    <svg style={{ width: "18px", height: "18px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="10" x="3" y="11" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>
                    <span>AI Code Explanation Assistant</span>
                </div>
                <button onClick={onClose} style={{ background: "none", border: "none", color: "hsl(var(--text-muted))", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
            </div>

            <div className="ai-chat-body" id="ai-chat-scroller" ref={chatScrollerRef}>
                {messages.map((m, i) => (
                    <div key={i} className={`ai-message ${m.type}`}>
                        {m.content.includes("🔍") ? (
                            // Basic render helper for google links
                            <div>
                                {m.content.split("\n\n🔍")[0]}
                                <div style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "0.85rem" }}>
                                    🔍 <a href={`https://www.google.com/search?q=${encodeURIComponent(m.content.substring(m.content.indexOf('Search "') + 8, m.content.indexOf('" on Google')))}`} target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--primary-hsl))", fontWeight: "600" }}>
                                        Ask Google Search in one click
                                    </a>
                                </div>
                            </div>
                        ) : m.content}
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: "6px", padding: "0 12px", overflowX: "auto", whiteSpace: "nowrap", marginBottom: "8px" }}>
                <button onClick={() => handlePrePrompt("Explain Scope in Javascript")} style={{ fontSize: "0.72rem", padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)", background: "hsla(var(--text-muted), 0.1)", color: "inherit", cursor: "pointer" }}>
                    💡 Scope
                </button>
                <button onClick={() => handlePrePrompt("Explain closures with dynamic example")} style={{ fontSize: "0.72rem", padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)", background: "hsla(var(--text-muted), 0.1)", color: "inherit", cursor: "pointer" }}>
                    💡 Closures
                </button>
                <button onClick={() => handlePrePrompt("Explain MTN/Orange Mobile Money API webhook checks")} style={{ fontSize: "0.72rem", padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)", background: "hsla(var(--text-muted), 0.1)", color: "inherit", cursor: "pointer" }}>
                    💡 MoMo Webhook
                </button>
            </div>

            <form onSubmit={handleSend} className="ai-chat-input-row">
                <input
                    type="text"
                    id="ai-input-chat"
                    className="input-box"
                    placeholder="Ask AI explain code..."
                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                    value={inp}
                    onChange={(e) => setInp(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary" style={{ padding: "8px 12px", fontSize: "0.85rem" }}>Send</button>
            </form>
        </div>
    );
};
