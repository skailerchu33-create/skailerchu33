import React, { useMemo, useState, useEffect } from 'react';

const baseSchedule = [
  {
    day: 'Mon',
    items: [
      { time: '08:00', title: 'Math revision', type: 'Study' },
      { time: '10:30', title: 'Lecture notes', type: 'Reading' },
      { time: '15:00', title: 'Group project', type: 'Team' },
      { time: '19:00', title: 'Practice test', type: 'Exam Prep' },
    ],
  },
  {
    day: 'Tue',
    items: [
      { time: '08:30', title: 'Chemistry recap', type: 'Study' },
      { time: '11:00', title: 'AI summary session', type: 'Notes' },
      { time: '14:00', title: 'Problem set', type: 'Practice' },
      { time: '18:30', title: 'Review and quiz', type: 'Revision' },
    ],
  },
  {
    day: 'Wed',
    items: [
      { time: '09:00', title: 'Physics lab review', type: 'Lab' },
      { time: '12:00', title: 'Reading block', type: 'Reading' },
      { time: '16:30', title: 'Project checkpoint', type: 'Project' },
      { time: '20:00', title: 'Light recap', type: 'Short Study' },
    ],
  },
  {
    day: 'Thu',
    items: [
      { time: '07:30', title: 'Essay draft', type: 'Writing' },
      { time: '10:00', title: 'History reading', type: 'Reading' },
      { time: '13:30', title: 'Coding practice', type: 'Practice' },
      { time: '18:00', title: 'Math drill', type: 'Study' },
    ],
  },
  {
    day: 'Fri',
    items: [
      { time: '08:00', title: 'Weekly review', type: 'Revision' },
      { time: '11:30', title: 'Note summary', type: 'AI Assist' },
      { time: '15:00', title: 'Presentation prep', type: 'Presentation' },
      { time: '19:30', title: 'Rest and reset', type: 'Break' },
    ],
  },
  {
    day: 'Sat',
    items: [
      { time: '09:30', title: 'Mock test', type: 'Exam Prep' },
      { time: '12:30', title: 'Homework review', type: 'Study' },
      { time: '16:00', title: 'Planning session', type: 'Planning' },
    ],
  },
];

const visitData = [40, 52, 68, 60, 82, 90, 76];
const noteCards = [
  'Summarized key points from long lecture notes in under 2 minutes.',
  'Detected the main ideas from the chapter and listed revision priorities.',
  'Converted messy notes into a clear study checklist for the week.',
];

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [resetEmail, setResetEmail] = useState('');

  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [prompt, setPrompt] = useState(
    'Generate a timetable that balances my classes, study time, and revision without overloading my evenings.'
  );
  const [uploadedFile, setUploadedFile] = useState(null);
  const [schedule, setSchedule] = useState(baseSchedule);

  useEffect(() => {
    const savedUser = localStorage.getItem('studyflow_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const currentDaySchedule = useMemo(
    () => schedule.find((item) => item.day === selectedDay) || schedule[0],
    [schedule, selectedDay]
  );

  const totalVisits = visitData.reduce((sum, value) => sum + value, 0);
  const averageVisit = Math.round(totalVisits / visitData.length);
  const adherenceRate = 84;

  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) return;

    const user = {
      name: loginEmail.split('@')[0].charAt(0).toUpperCase() + loginEmail.split('@')[0].slice(1),
      email: loginEmail,
      premium: false,
    };

    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('studyflow_user', JSON.stringify(user));

    setLoginEmail('');
    setLoginPassword('');
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!registerName || !registerEmail || !registerPassword) return;

    const user = {
      name: registerName,
      email: registerEmail,
      premium: false,
    };

    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('studyflow_user', JSON.stringify(user));

    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    window.alert(`Password reset link sent to ${resetEmail}`);
    setResetEmail('');
    setAuthMode('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('studyflow_user');
  };

  const generateTimetable = () => {
    setSchedule((prev) =>
      prev.map((day) => ({
        ...day,
        items: day.items.map((entry, index) => ({
          ...entry,
          title:
            index === 0 && day.day === 'Mon'
              ? 'Focused study block'
              : index === 1 && day.day === 'Tue'
                ? 'AI note review'
                : entry.title,
        })),
      }))
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-badge">StudyFlow</div>

          <div className="auth-header">
            <h1>Student Portal</h1>
            <p>Manage your timetable, notes, and study routines.</p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={authMode === 'login' ? 'auth-tab active' : 'auth-tab'}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === 'signup' ? 'auth-tab active' : 'auth-tab'}
              onClick={() => setAuthMode('signup')}
            >
              Register
            </button>
            <button
              type="button"
              className={authMode === 'reset' ? 'auth-tab active' : 'auth-tab'}
              onClick={() => setAuthMode('reset')}
            >
              Reset
            </button>
          </div>

          {authMode === 'login' && (
            <form className="auth-form" onSubmit={handleLogin}>
              <label>
                Email
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="student@school.edu"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </label>

              <button type="submit" className="primary-btn auth-submit">
                Sign In
              </button>
            </form>
          )}

          {authMode === 'signup' && (
            <form className="auth-form" onSubmit={handleRegister}>
              <label>
                Full Name
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="student@school.edu"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  minLength="6"
                  required
                />
              </label>

              <button type="submit" className="primary-btn auth-submit">
                Create Account
              </button>
            </form>
          )}

          {authMode === 'reset' && (
            <form className="auth-form" onSubmit={handleReset}>
              <label>
                Email
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="student@school.edu"
                  required
                />
              </label>

              <button type="submit" className="primary-btn auth-submit">
                Send Reset Link
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <span>StudyFlow</span>
        </div>

        <nav className="nav">
          {['Overview', 'Timetable', 'Notes', 'Insights'].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveTab(tab)}
            >
              <span>{tab}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <p className="label">Daily Goal</p>
          <h3>4 focused study blocks</h3>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Student dashboard</p>
            <h1>Welcome back, {currentUser?.name || 'Student'}</h1>
          </div>

          <div className="topbar-actions">
            <button className="ghost-btn" type="button">
              Export
            </button>
            <button className="primary-btn" type="button">
              Generate plan
            </button>
            <button className="ghost-btn" type="button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <p>Study hours</p>
            <h2>18.5h</h2>
          </div>
          <div className="stat-card">
            <p>Timetable respect</p>
            <h2>{adherenceRate}%</h2>
          </div>
          <div className="stat-card">
            <p>Platform visits</p>
            <h2>{averageVisit}</h2>
          </div>
          <div className="stat-card">
            <p>Notes summarized</p>
            <h2>127</h2>
          </div>
        </section>

        <section className="content-grid">
          <div className="left-panel">
            <div className="panel-box planner-box">
              <div className="panel-header">
                <div>
                  <p className="label">Planner</p>
                  <h3>Generate study timetable</h3>
                </div>
                <span className="mini-badge">AI</span>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your routine, classes, and preferred study hours"
              />

              <div className="upload-row">
                <label className="upload-box">
                  <input type="file" onChange={(e) => setUploadedFile(e.target.files?.[0] || null)} />
                  <span>{uploadedFile ? uploadedFile.name : 'Upload notes or timetable'}</span>
                </label>
                <button className="primary-btn" onClick={generateTimetable} type="button">
                  Generate
                </button>
              </div>
            </div>

            <div className="panel-box schedule-box">
              <div className="panel-header">
                <div>
                  <p className="label">Timetable</p>
                  <h3>Weekly schedule</h3>
                </div>
              </div>

              <div className="day-tabs">
                {schedule.map((day) => (
                  <button
                    key={day.day}
                    className={selectedDay === day.day ? 'day-tab active' : 'day-tab'}
                    onClick={() => setSelectedDay(day.day)}
                    type="button"
                  >
                    {day.day}
                  </button>
                ))}
              </div>

              <div className="schedule-list">
                {currentDaySchedule.items.map((item) => (
                  <div key={`${item.day}-${item.time}`} className="schedule-item">
                    <span className="time">{item.time}</span>
                    <div className="task-info">
                      <h4>{item.title}</h4>
                      <p>{item.type}</p>
                    </div>
                    <span className="task-tag">{item.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="right-panel">
            <div className="panel-box chart-box">
              <div className="panel-header">
                <div>
                  <p className="label">Usage</p>
                  <h3>Platform entry graph</h3>
                </div>
              </div>

              <div className="chart">
                {visitData.map((value, index) => (
                  <div key={index} className="bar-group">
                    <div className="bar-wrapper">
                      <div className="bar" style={{ height: `${value}%` }} />
                    </div>
                    <span>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span>
                  </div>
                ))}
              </div>

              <div className="chart-summary">
                <strong>{totalVisits}</strong>
                <span>total entries this week</span>
              </div>
            </div>

            <div className="panel-box score-box">
              <div className="panel-header">
                <div>
                  <p className="label">Average</p>
                  <h3>Adherence score</h3>
                </div>
              </div>

              <div className="score-ring" style={{ '--score': `${adherenceRate}%` }}>
                <div className="score-ring-inner">
                  <strong>{adherenceRate}%</strong>
                </div>
              </div>
            </div>

            <div className="panel-box assistant-box">
              <div className="panel-header">
                <div>
                  <p className="label">Assistant</p>
                  <h3>Note summary</h3>
                </div>
                <span className="mini-badge google">G</span>
              </div>

              <div className="assistant-list">
                {noteCards.map((note, index) => (
                  <div key={index} className="assistant-item">
                    <span className="dot" />
                    <p>{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
