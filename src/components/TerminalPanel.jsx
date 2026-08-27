import React, { useState, useEffect, useRef } from 'react';

export default function TerminalPanel({
    activeCode,
    streak,
    lastLoginDate,
    loginLogsLength,
    latestVisit,
    isOffline,
    toggleTheme,
    runSandboxCode
}) {
    const [logs, setLogs] = useState([
        { text: "DevFluent Virtual Shell Terminal System v1.0", type: "sys-success" },
        { text: "Type 'help' to review shell instructions.", type: "" }
    ]);
    const [inp, setInp] = useState("");
    const logsEndRef = useRef(null);

    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs]);

    const addLine = (text, type = "") => {
        setLogs(prev => [...prev, { text, type }]);
    };

    const handleCommand = (e) => {
        if (e.key !== 'Enter') return;
        const cmd = inp.trim();
        setInp("");
        if (!cmd) return;

        addLine(`devfluent@shell:~$ ${cmd}`, "cmd-echo");

        const parts = cmd.split(' ');
        const main = parts[0].toLowerCase();
        const arg = parts.slice(1).join(' ');

        switch (main) {
            case 'help':
                addLine(
                    `Supported Shell instructions commands:\n` +
                    `  help                  - Show this support instructions dialogue.\n` +
                    `  clear                 - Clear output history lines buffer.\n` +
                    `  ls                    - List active virtual assets elements.\n` +
                    `  cat <filename>        - Display text logs buffers of a file.\n` +
                    `  run                   - Compiles and runs JavaScript from the active workspace sandbox.\n` +
                    `  streak                - Check current study streak logging data counts.\n` +
                    `  theme <light/dark>    - Changes core workspace theme color parameters.\n` +
                    `  system                - Display CPU, memory and configurations.`,
                    'sys-success'
                );
                break;

            case 'clear':
                setLogs([]);
                break;

            case 'ls':
                addLine(
                    `Workspace elements files:\n` +
                    `  - index.html\n` +
                    `  - index.css\n` +
                    `  - app.jsx\n` +
                    `  - data.js\n` +
                    `  - terminal.jsx\n` +
                    `  - helper.jsx\n` +
                    `  - checkout.jsx`,
                    'sys-success'
                );
                break;

            case 'cat':
                if (!arg) {
                    addLine(`error: specify target filename (e.g. cat app.jsx)`, 'sys-fail');
                    break;
                }
                if (arg === 'app.jsx' || arg === 'index.css' || arg === 'index.html' || arg === 'data.js' || arg === 'terminal.jsx') {
                    addLine(`[Simulated Buffer read stream of ${arg}]:`, 'sys-success');
                    addLine(`/* Content of ${arg} is loaded successfully */\n// System online.`, '');
                } else {
                    addLine(`cat: error opening ${arg}: file path not found.`, 'sys-fail');
                }
                break;

            case 'run':
                addLine(`Executing index thread compilation in sandbox environment...`, '');
                if (runSandboxCode) {
                    const output = runSandboxCode(activeCode);
                    if (output.success) {
                        addLine(output.logs || `Execution completed successfully (empty output).`, 'sys-success');
                    } else {
                        addLine(output.logs, 'sys-fail');
                    }
                } else {
                    addLine(`error: compiler runtime unavailable.`, 'sys-fail');
                }
                break;

            case 'streak':
                addLine(
                    `Study progress dataset stats:\n` +
                    `  Daily Streak: ${streak} days\n` +
                    `  Registry record: ${lastLoginDate}\n` +
                    `  Logs cached count: ${loginLogsLength} entries\n` +
                    `  Latest visit: ${latestVisit}`,
                    'sys-success'
                );
                break;

            case 'theme':
                if (arg === 'light' || arg === 'dark') {
                    if (toggleTheme) {
                        toggleTheme(arg);
                        addLine(`Switched theme color configurations to ${arg}.`, 'sys-success');
                    } else {
                        addLine(`error: theme utility unavailable.`, 'sys-fail');
                    }
                } else {
                    addLine(`usage: theme [light/dark]`, 'sys-fail');
                }
                break;

            case 'system':
                addLine(
                    `Compiler environment: NodeJS Sandbox Browser VM\n` +
                    `Memory usage: 82.1MB / 1024.0MB\n` +
                    `Offline simulated status: ${isOffline ? 'ACTIVE' : 'CONNECTED'}\n` +
                    `Latent response: 8ms`,
                    'sys-success'
                );
                break;

            default:
                addLine(`bash: command mapping not found: ${main}. Type 'help' to review shell options.`, 'sys-fail');
        }
    };

    return (
        <div className="terminal-shell-wrapper">
            <div className="terminal-shell-header">
                <div style={{ display: "flex", gap: "6px" }}>
                    <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }}></span>
                    <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }}></span>
                    <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }}></span>
                </div>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>devfluent@localhost:~</span>
            </div>
            <div className="terminal-shell-body">
                <div id="terminal-shell-logs" className="terminal-shell-logs">
                    {logs.map((l, i) => (
                        <div key={i} className={`term-line ${l.type}`}>
                            {l.text}
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                </div>
                <div className="terminal-shell-input-line">
                    <span className="terminal-shell-prompt">devfluent@shell:~$</span>
                    <input
                        type="text"
                        id="terminal-shell-keyboard"
                        className="terminal-shell-input"
                        value={inp}
                        onChange={(e) => setInp(e.target.value)}
                        onKeyDown={handleCommand}
                        autoComplete="off"
                        spellCheck="false"
                    />
                </div>
            </div>
        </div>
    );
}
