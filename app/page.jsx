'use client';

import { useMemo, useState } from 'react';
import { Search, GraduationCap, BookOpen, ShieldCheck, ArrowUpRight, Download, RotateCcw, ChevronRight, FileText, CircleHelp, Menu } from 'lucide-react';
import { demoResults } from '../data/results';

export default function Home() {
  const [studentId, setStudentId] = useState('');
  const [selected, setSelected] = useState(null);
  const [searched, setSearched] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const totalMarks = useMemo(() => selected?.courses.reduce((sum, c) => sum + c.total, 0) ?? 0, [selected]);
  const average = selected ? Math.round(totalMarks / selected.courses.length) : 0;

  function lookup(e) {
    e.preventDefault();
    const normalized = studentId.trim().toUpperCase();
    const found = demoResults.find((r) => r.studentId.toUpperCase() === normalized);
    setSelected(found || null);
    setSearched(true);
  }
  function reset() { setStudentId(''); setSelected(null); setSearched(false); }

  return (
    <main>
      <div className="topbar"><div className="topbar-inner"><span>Academic Information Portal</span><span className="topbar-right"><span className="status-dot"/> Fall 2026 · Intake 64 · Section 4</span></div></div>
      <header className="header"><div className="header-inner">
        <div className="brand"><div className="brand-mark">B</div><div><div className="brand-name">BUBT <span>RESULT PORTAL</span></div><div className="brand-sub">STUDENT ACADEMIC SERVICES</div></div></div>
        <div className="header-tag"><ShieldCheck size={16}/> Section 4 student access</div>
        <button className="mobile-menu" aria-label="Menu"><Menu size={22}/></button>
      </div></header>

      <section className="hero"><div className="hero-inner">
        <div className="eyebrow"><span className="eyebrow-line"/> STUDENT RESULT SERVICES</div>
        <h1>Your academic progress,<br/><em>all in one place.</em></h1>
        <p className="hero-copy">A simple way to access your examination performance and course-wise results for Fall 2026.</p>
        <div className="hero-meta"><span><GraduationCap size={17}/> BBA Programme</span><span><BookOpen size={17}/> Intake 64 · Section 4</span></div>
      </div><div className="hero-decoration"><div className="deco-circle circle-one"/><div className="deco-circle circle-two"/><div className="deco-grid"/></div></section>

      <section className="content-wrap">
        <div className="lookup-card">
          <div className="card-heading"><div><div className="section-kicker">RESULT LOOKUP</div><h2>Find your result</h2><p>Enter your student ID to view your academic record.</p></div><div className="lookup-icon"><Search size={23}/></div></div>
          <form onSubmit={lookup} className="search-form">
            <label htmlFor="student-id">STUDENT ID</label>
            <div className="input-row"><div className="input-wrap"><Search size={18}/><input id="student-id" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. 64-0001" autoComplete="off" required/></div><button className="search-button" type="submit">Check result <ArrowUpRight size={17}/></button></div>
            <div className="form-hint"><ShieldCheck size={14}/> Enter the ID registered for Intake 64, Section 4.</div>
          </form>
          {searched && !selected && <div className="error-message" role="alert">No demo result found for this Student ID. Please check the ID and try again.</div>}
        </div>

        {selected && <section className="result-panel" aria-live="polite">
          <div className="result-top"><div><div className="section-kicker">ACADEMIC STATEMENT</div><h2>Student result</h2><p>Fall 2026 · Intake 64 · Section 4</p></div><span className="published"><span/> {selected.status}</span></div>
          <div className="student-details"><div><span>STUDENT NAME</span><strong>{selected.name}</strong></div><div><span>STUDENT ID</span><strong>{selected.studentId}</strong></div><div><span>PROGRAMME</span><strong>{selected.program}</strong></div><div><span>SEMESTER</span><strong>{selected.semester}</strong></div></div>
          <div className="stats-grid"><div className="stat-box"><span>CGPA</span><strong>{selected.cgpa}</strong><small> Cumulative grade point average</small></div><div className="stat-box"><span>COURSES</span><strong>{selected.courses.length}</strong><small>Registered courses</small></div><div className="stat-box"><span>AVERAGE MARKS</span><strong>{average}%</strong><small>Across displayed courses</small></div></div>
          <div className="table-heading"><div><h3>Course-wise performance</h3><p>Marks are shown according to the demo dataset.</p></div><FileText size={20}/></div>
          <div className="table-scroll"><table><thead><tr><th>COURSE</th><th>CLASS TEST</th><th>MIDTERM</th><th>FINAL</th><th>TOTAL</th><th>GRADE</th></tr></thead><tbody>{selected.courses.map(c=><tr key={c.code}><td><strong>{c.code}</strong><small>{c.title}</small></td><td>{c.ct}</td><td>{c.mid}</td><td>{c.final}</td><td className="total-cell">{c.total}</td><td><span className="grade-pill">{c.grade}</span></td></tr>)}</tbody></table></div>
          <div className="result-footer"><span><ShieldCheck size={15}/> Demo academic record</span><button onClick={reset} className="reset-button"><RotateCcw size={15}/> New search</button></div>
        </section>}

        <div className="info-row"><div className="info-card"><div className="info-icon"><ShieldCheck size={20}/></div><div><strong>Student-focused access</strong><p>Designed for the academic records of Intake 64, Section 4.</p></div></div><div className="info-card"><div className="info-icon"><FileText size={20}/></div><div><strong>Course-wise details</strong><p>View assessment components and overall course marks.</p></div></div><div className="info-card"><div className="info-icon"><CircleHelp size={20}/></div><div><strong>Need assistance?</strong><p>Contact your class representative for result-related queries.</p></div></div></div>
        <div className="demo-note"><div><strong>Development preview</strong><p>This portal currently contains fictional demo records only. It is not an official BUBT service and does not contain verified student results.</p></div><button onClick={()=>setShowDemo(!showDemo)}>{showDemo ? 'Hide demo IDs' : 'Show demo IDs'} <ChevronRight size={15}/></button></div>
        {showDemo && <div className="demo-ids"><span>Demo ID: <b>64-0001</b></span><span>Demo ID: <b>64-0002</b></span></div>}
      </section>
      <footer><div className="footer-inner"><div className="footer-brand">BUBT <span>RESULT PORTAL</span></div><p>Intake 64 · Section 4 · Fall 2026</p><small>Independent student project prototype · Not an official university website</small></div></footer>
    </main>
  );
}
