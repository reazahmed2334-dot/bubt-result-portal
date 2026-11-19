
'use client';

import { useState } from 'react';
import {
  Search,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  ArrowUpRight,
  RotateCcw,
  FileText,
  CircleHelp,
  Menu
} from 'lucide-react';

export default function Home() {
  const [studentId, setStudentId] = useState('');
  const [selected, setSelected] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const results = selected?.results || [];
  const courses = results.flatMap(result =>
    result.courses.map(course => ({
      ...course,
      semester: result.semester
    }))
  );

  const totals = courses
    .map(course => Number(course.total))
    .filter(value => Number.isFinite(value));

  const average = totals.length
    ? (totals.reduce((sum, value) => sum + value, 0) / totals.length).toFixed(2)
    : '—';

  async function lookup(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSelected(null);
    setSearched(false);

    try {
      const response = await fetch('/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: studentId.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to find your result.');
      }

      setSelected(data);
      setSearched(true);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStudentId('');
    setSelected(null);
    setSearched(false);
    setError('');
  }

  function displayMark(value) {
    return value === null || value === undefined || value === ''
      ? '—'
      : value;
  }

  function displayMidterm(course) {
    if (course.midterm_status === 'absent') return 'Absent';
    if (course.midterm_status === 'not_on_sheet') return 'Not on sheet';
    return displayMark(course.midterm);
  }

  return (
    <main>
      <div className="topbar">
        <div className="topbar-inner">
          <span>Academic Information Portal</span>
          <span className="topbar-right">
            <span className="status-dot" />
            Fall 2026 · Intake 64 · Section 4
          </span>
        </div>
      </div>

      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-mark">B</div>
            <div>
              <div className="brand-name">
                BUBT <span>RESULT PORTAL</span>
              </div>
              <div className="brand-sub">
                STUDENT ACADEMIC SERVICES
              </div>
            </div>
          </div>
          <div className="header-tag">
            <ShieldCheck size={16} /> Section 4 student access
          </div>
          <button className="mobile-menu" aria-label="Menu">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            STUDENT RESULT SERVICES
          </div>
          <h1>
            Your academic progress,
            <br />
            <em>all in one place.</em>
          </h1>
          <p className="hero-copy">
            A simple way to access your examination performance
            and course-wise results for Fall 2026.
          </p>
          <div className="hero-meta">
            <span><GraduationCap size={17} /> BBA Programme</span>
            <span><BookOpen size={17} /> Intake 64 · Section 4</span>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="deco-circle circle-one" />
          <div className="deco-circle circle-two" />
          <div className="deco-grid" />
        </div>
      </section>

      <section className="content-wrap">
        <div className="lookup-card">
          <div className="card-heading">
            <div>
              <div className="section-kicker">RESULT LOOKUP</div>
              <h2>Find your result</h2>
              <p>Enter your student ID to view your academic record.</p>
            </div>
            <div className="lookup-icon"><Search size={23} /></div>
          </div>

          <form onSubmit={lookup} className="search-form">
            <label htmlFor="student-id">STUDENT ID</label>
            <div className="input-row">
              <div className="input-wrap">
                <Search size={18} />
                <input
                  id="student-id"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  placeholder="Enter your Student ID"
                  autoComplete="off"
                  required
                  disabled={loading}
                />
              </div>
              <button className="search-button" type="submit" disabled={loading}>
                {loading ? 'Checking...' : 'Check result'}
                <ArrowUpRight size={17} />
              </button>
            </div>
            <div className="form-hint">
              <ShieldCheck size={14} />
              Enter your registered Student ID.
            </div>
          </form>

          {searched && error && (
            <div className="error-message" role="alert">{error}</div>
          )}
        </div>
        {selected && (
          <section className="result-panel" aria-live="polite">
            <div className="result-top">
              <div>
                <div className="section-kicker">ACADEMIC STATEMENT</div>
                <h2>Student result</h2>
                <p>
                  {results[0]?.semester || 'Semester'} · Intake {selected.student.intake} · Section {selected.student.section}
                </p>
              </div>
              <span className="published"><span /> Published</span>
            </div>

            <div className="student-details">
              <div><span>STUDENT NAME</span><strong>{selected.student.name}</strong></div>
              <div><span>STUDENT ID</span><strong>{selected.student.studentId}</strong></div>
              <div><span>PROGRAMME</span><strong>{selected.student.program}</strong></div>
              <div><span>SEMESTER</span><strong>{results[0]?.semester || '—'}</strong></div>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <span>CGPA</span>
                <strong>{results[0]?.cgpa ?? '—'}</strong>
                <small>Cumulative grade point average</small>
              </div>
              <div className="stat-box">
                <span>COURSES</span>
                <strong>{courses.length}</strong>
                <small>Published courses</small>
              </div>
              <div className="stat-box">
                <span>AVERAGE MARKS</span>
                <strong>{average}</strong>
                <small>Based on available total marks</small>
              </div>
            </div>

            <div className="table-heading">
              <div>
                <h3>Course-wise performance</h3>
                <p>Only available assessment marks are displayed.</p>
              </div>
              <FileText size={20} />
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>COURSE</th>
                    <th>CLASS TEST</th>
                    <th>MIDTERM</th>
                    <th>FINAL</th>
                    <th>TOTAL</th>
                    <th>GRADE</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <tr key={`${course.course_code}-${index}`}>
                      <td>
                        <strong>{course.course_code}</strong>
                        <small>{course.course_title}</small>
                      </td>
                      <td>{displayMark(course.class_test)}</td>
                      <td>{displayMidterm(course)}</td>
                      <td>{displayMark(course.final_exam)}</td>
                      <td className="total-cell">{displayMark(course.total)}</td>
                      <td>
                        <span className="grade-pill">
                          {displayMark(course.letter_grade)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="result-footer">
              <span><ShieldCheck size={15} /> Published academic record</span>
              <button onClick={reset} className="reset-button">
                <RotateCcw size={15} /> New search
              </button>
            </div>
          </section>
        )}

        <div className="info-row">
          <div className="info-card">
            <div className="info-icon"><ShieldCheck size={20} /></div>
            <div>
              <strong>Student-focused access</strong>
              <p>Designed for the academic records of Intake 64, Section 4.</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon"><FileText size={20} /></div>
            <div>
              <strong>Course-wise details</strong>
              <p>View available assessment components and course marks.</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon"><CircleHelp size={20} /></div>
            <div>
              <strong>Need assistance?</strong>
              <p>Contact your class representative for result-related queries.</p>
            </div>
          </div>
        </div>

        <div className="demo-note">
          <div>
            <strong>Result information</strong>
            <p>Results are displayed after they have been published by the portal administrator.</p>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-brand">BUBT <span>RESULT PORTAL</span></div>
          <p>Intake 64 · Section 4 · Fall 2026</p>
          <small>Independent student project prototype · Not an official university website</small>
        </div>
      </footer>
    </main>
  );
}
