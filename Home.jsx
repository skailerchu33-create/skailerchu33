import React, { useState } from 'react';

const LESSONS = [
  { id: 1, title: 'Async/Await & Promises', difficulty: 'Intermediate', duration: '15 mins' },
  { id: 2, title: 'Closures & Scope Chain', difficulty: 'Advanced', duration: '20 mins' },
  { id: 3, title: 'Functional JS & Immutability', difficulty: 'Beginner', duration: '10 mins' },
];

export default function Home({ searchQuery = '' }) {
  const [selectedLesson, setSelectedLesson] = useState(LESSONS[0]);
  const [code, setCode] = useState('// Write code here\nconst add = (a, b) => a + b;\nreturn add(10, 20);');
  const [logs, setLogs] = useState([]);

  const runCode = () => {
    try {
      // NOTE: `new Function` executes in the real page context (it can touch
      // the DOM, cookies, network, etc). It's fine for a trusted, single-user
      // learning sandbox, but it is NOT a security boundary. If this app ever
      // needs to run untrusted user-submitted code, run it inside a
      // sandboxed <iframe> (e.g. with the `sandbox` attribute and no
      // `allow-same-origin`) or a Web Worker instead.
      const runFn = new Function(code);
      const result = runFn();
      setLogs((prev) => [...prev, `[SUCCESS]: ${JSON.stringify(result)}`]);
    } catch (err) {
      setLogs((prev) => [...prev, `[ERROR]: ${err.message}`]);
    }
  };

  const filteredLessons = LESSONS.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-layout">
      <h2>Interactive Code Lessons</h2>
      <div className="lessons-list">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`lesson-card ${selectedLesson.id === lesson.id ? 'active' : ''}`}
            onClick={() => setSelectedLesson(lesson)}
          >
            <h3>{lesson.title}</h3>
            <span>{lesson.difficulty} • {lesson.duration}</span>
          </div>
        ))}
      </div>

      <hr />

      <div className="sandbox-container">
        <h3>JS Interactive Sandbox Compiler</h3>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={8}
          className="code-editor"
        />
        <div className="sandbox-actions">
          <button onClick={runCode} className="btn-primary">Execute Script</button>
          <button onClick={() => setLogs([])} className="btn-secondary">Clear Console</button>
        </div>

        <div className="terminal-logs">
          <h4>Execution Output:</h4>
          {logs.map((log, index) => (
            <pre key={index} className="log-line">{log}</pre>
          ))}
        </div>
      </div>
    </div>
  );
}