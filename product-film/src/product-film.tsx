import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
} from 'remotion';
import './styles.css';

export const FILM_FPS = 30;
export const FILM_FRAMES = 150 * FILM_FPS;

type FilmScene = {
  id: string;
  from: number;
  duration: number;
  chapter: string;
  caption: string;
  voice: string;
};

const scenes: FilmScene[] = [
  {
    id: 'cold-open', from: 0, duration: 300, chapter: 'A clearer next step',
    caption: 'Falling behind rarely begins with one moment. It can take shape across the marks already recorded, and the assessments still to come.',
    voice: 'Falling behind rarely begins with one moment. It can take shape across the marks already recorded, and the assessments still to come.',
  },
  {
    id: 'shift', from: 300, duration: 420, chapter: 'From insight to action',
    caption: 'Descriptive analytics shows what has happened. Predictive analytics asks what may happen. Prescriptive analytics explores what action could help.',
    voice: 'Descriptive analytics shows what has happened. Predictive analytics asks what may happen. Prescriptive analytics explores what action could help.',
  },
  {
    id: 'assessment-setup', from: 720, duration: 480, chapter: 'A picture built from assessment data',
    caption: 'The student assistant starts with an assessment plan. A student records the assessments in their module, then adds marks as they become available.',
    voice: 'The student assistant starts with an assessment plan. A student records the assessments in their module, then adds marks as they become available.',
  },
  {
    id: 'academic-profile', from: 1200, duration: 450, chapter: 'See where you stand',
    caption: 'The academic profile brings the entered marks together as current participation, academic standing, and completed and remaining assessments.',
    voice: 'The academic profile brings the entered marks together as current participation, academic standing, and completed and remaining assessments.',
  },
  {
    id: 'improvement-options', from: 1650, duration: 510, chapter: 'Explore possible improvement plans',
    caption: 'Next, the student explores improvement scenarios. For each feasible plan, the tool shows a target participation mark and the required marks for selected remaining assessments.',
    voice: 'Next, the student explores improvement scenarios. For each feasible plan, the tool shows a target participation mark and the required marks for selected remaining assessments.',
  },
  {
    id: 'summary', from: 2160, duration: 240, chapter: 'A summary to take away',
    caption: 'The summary brings together marks, profile and scenarios. Students can export assessment data as C. S. V.',
    voice: 'The summary brings together marks, profile and scenarios. Students can export assessment data as C. S. V.',
  },
  {
    id: 'privacy', from: 2400, duration: 330, chapter: 'Separate by design',
    caption: 'The tools remain separate by design. Student workflow data stays in the student tool. Lecturer module data is held separately in memory. They do not share data.',
    voice: 'The tools remain separate by design. Student workflow data stays in the student tool. Lecturer module data is held separately in memory. They do not share data.',
  },
  {
    id: 'lecturer-dashboard', from: 2730, duration: 480, chapter: 'A lecturer’s cohort view',
    caption: 'On the lecturer side, a class dashboard summarises participation across the cohort. Its at-risk flag is based on a clear rule: even the best-case mark cannot reach the pass threshold.',
    voice: 'On the lecturer side, a class dashboard summarises participation across the cohort. Its at-risk flag is based on a clear rule: even the best-case mark cannot reach the pass threshold.',
  },
  {
    id: 'student-plan', from: 3210, duration: 480, chapter: 'Plan for a reachable target',
    caption: 'On an individual student view, the lecturer can see the feasible range and choose a target within it. The system calculates the minimum mark needed across the remaining assessments.',
    voice: 'On an individual student view, the lecturer can see the feasible range and choose a target within it. The system calculates the minimum mark needed across the remaining assessments.',
  },
  {
    id: 'cohort-plan', from: 3690, duration: 330, chapter: 'Plan at cohort level',
    caption: 'At cohort level, lecturers explore assessment weights against a target average. The tool shows proposed weights and the result.',
    voice: 'At cohort level, lecturers explore assessment weights against a target average. The tool shows proposed weights and the result.',
  },
  {
    id: 'impact', from: 4020, duration: 240, chapter: 'Make the next step clearer',
    caption: 'Together, these tools support a more proactive approach, making next steps clearer for students and lecturers.',
    voice: 'Together, these tools support a more proactive approach, making next steps clearer for students and lecturers.',
  },
  {
    id: 'end-card', from: 4260, duration: 240, chapter: '',
    caption: '',
    voice: 'Academic Performance Feedback Management Information System. Gosego Sebaetse. Thamsanqa Ndlakuse.',
  },
];

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const fadeIn = (frame: number, duration = 22) => interpolate(frame, [0, duration], [0, 1], clamp);

const AnimatedNumber: React.FC<{value: number; decimals?: number; suffix?: string; delay?: number; duration?: number}> = ({value, decimals = 0, suffix = '', delay = 10, duration = 42}) => {
  const frame = useCurrentFrame();
  const shown = interpolate(frame, [delay, delay + duration], [0, value], {...clamp, easing: Easing.out(Easing.cubic)});
  return <>{shown.toFixed(decimals)}{suffix}</>;
};

const Lift: React.FC<{children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties}> = ({children, delay = 0, className = '', style = {}}) => {
  const frame = useCurrentFrame();
  const progress = spring({frame: Math.max(0, frame - delay), fps: FILM_FPS, config: {damping: 18, stiffness: 82, mass: 0.8}});
  return <div className={className} style={{opacity: progress, transform: `translateY(${(1 - progress) * 24}px)`, ...style}}>{children}</div>;
};

const Header: React.FC<{lecturer?: boolean; subtitle?: string}> = ({lecturer = false, subtitle}) => (
  <div className="app-header">
    <div className="brand-mark" aria-hidden="true"><span>↗</span></div>
    <div className="brand-copy">
      <div className="brand-title">{lecturer ? 'NWU Student Performance Assistant' : 'NWU Student Performance Assistant'}</div>
      <div className="brand-subtitle">{subtitle || (lecturer ? 'CS101 — Sample module (simulated data) · Academic Performance Monitoring System' : 'Academic Performance Monitoring System')}</div>
    </div>
    <div className="header-controls"><span>◐</span><span>⚙</span><span>☰</span></div>
  </div>
);

const Shell: React.FC<{children: React.ReactNode; lecturer?: boolean; page?: string; className?: string}> = ({children, lecturer = false, page, className = ''}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 220], [1, 1.022], clamp);
  return (
    <div className={`product-screen ${lecturer ? 'lecturer-screen' : 'student-screen'} ${className}`} style={{transform: `scale(${zoom})`}}>
      <Header lecturer={lecturer} />
      <div className="app-content">
        {page && <div className="back-link">‹ &nbsp;Back <span>{page}</span></div>}
        {children}
      </div>
    </div>
  );
};

const ScreenCard: React.FC<{title: string; children: React.ReactNode; className?: string}> = ({title, children, className = ''}) => (
  <div className={`screen-card ${className}`}><div className="screen-card-title">{title}</div><div className="screen-card-body">{children}</div></div>
);

const Pill: React.FC<{children: React.ReactNode; kind?: string}> = ({children, kind = ''}) => <span className={`pill ${kind}`}>{children}</span>;

const Intro: React.FC<{eyebrow: string; title: string; copy: string}> = ({eyebrow, title, copy}) => (
  <div className="page-intro"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{copy}</p></div>
);

const DataTable: React.FC<{headers: string[]; rows: React.ReactNode[][]}> = ({headers, rows}) => (
  <table className="data-table"><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table>
);

const StudentSetup: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = (text: string, start: number, length = 24) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((frame - start) / length) * text.length))));
  return <Shell page="Phase 1 — Assessment Setup">
    <Intro eyebrow="Phase 1" title="Develop Your Personal Academic Model" copy="Build your personalised assessment model using your lecturer’s assessment plan." />
    <div className="two-col">
      <ScreenCard title="Student Information">
        <div className="form-grid four">
          <Field label="First Name" value={typed('Amara', 18)} />
          <Field label="Surname" value={typed('Example', 27)} />
          <Field label="Student Number" value={typed('70000001', 38)} />
          <Field label="Module" value={typed('CS101', 52)} />
        </div>
        <div className="fictional-note">Fictional example data for this film</div>
      </ScreenCard>
      <ScreenCard title="Let’s Build Your Assessment Plan">
        <div className="form-grid setup-inputs">
          <Field label="Assessment Category" value="Class Test" select />
          <Field label="Quantity" value="2" />
          <Field label="Weighting (%)" value="60" />
          <button className="button primary small">＋ &nbsp;Add Assessment</button>
        </div>
        <DataTable headers={['Assessment', 'Quantity', 'Weighting (%)', 'Actions']} rows={[
          [<strong>Class Test</strong>, '2', '60%', <button className="delete-button">Delete</button>],
          [<strong>Assignment</strong>, '2', '40%', <button className="delete-button">Delete</button>],
        ]} />
        <div className="validation-ok"><span>✓</span> Total including the weight being entered: 100%. Weighting is correct.</div>
      </ScreenCard>
    </div>
    <div className="button-row"><button className="button primary">Continue to Phase 2</button></div>
    <CursorPointer points={[[0, 1500, 620], [19, 95, 325], [29, 472, 325], [42, 842, 325], [55, 1220, 325], [91, 1205, 414], [112, 810, 575]]} />
  </Shell>;
};

const Field: React.FC<{label: string; value: string; select?: boolean}> = ({label, value, select = false}) => {
  const frame = useCurrentFrame();
  const showCaret = frame > 16 && frame < 82;
  return <div className="form-field"><label>{label}</label><div className={`input-box ${select ? 'select-box' : ''}`}>{value}{select && <span>⌄</span>}{showCaret && !select && <i className="typing-caret" />}</div></div>;
};

const StudentProfile: React.FC = () => <Shell page="Phase 2 — Academic Profile">
  <Intro eyebrow="Phase 2" title="Academic Profile" copy="Enter existing marks, then generate your academic profile." />
  <div className="profile-identity"><span><b>Student:</b> Amara Example</span><span><b>Student Number:</b> 70000001</span><span><b>Module:</b> CS101</span></div>
  <div className="split-wide">
    <ScreenCard title="Assessment Model">
      <DataTable headers={['Assessment', 'Weight']} rows={[
        ['Class Test 1', '30%'], ['Class Test 2', '30%'], ['Assignment 1', '20%'], ['Assignment 2', '20%'],
      ]} />
    </ScreenCard>
    <ScreenCard title="Record Existing Marks">
      <DataTable headers={['Assessment', 'Weight', 'Mark']} rows={[
        ['Class Test 1', '30%', <Pill kind="success">72</Pill>],
        ['Class Test 2', '30%', <Pill kind="success">48</Pill>],
        ['Assignment 1', '20%', <Pill kind="success">60</Pill>],
        ['Assignment 2', '20%', <span className="blank-mark">Enter mark</span>],
      ]} />
      <div className="button-row left"><button className="button primary">Generate Model</button></div>
    </ScreenCard>
  </div>
  <div className="profile-metrics">
    <Metric label="Current participation" value={<AnimatedNumber value={60} decimals={2} suffix="%" />} />
    <Metric label="Academic standing" value="Good" />
    <Metric label="Completed assessments" value="3" />
    <Metric label="Remaining assessments" value="1" />
  </div>
  <CursorPointer points={[[0, 1460, 620], [33, 1240, 410], [57, 1360, 530], [76, 761, 567]]} />
</Shell>;

const Metric: React.FC<{label: string; value: React.ReactNode; detail?: string}> = ({label, value, detail}) => <div className="metric-card"><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>;

const StudentScenarios: React.FC = () => <Shell page="Phase 3 — Improvement Options">
  <Intro eyebrow="Phase 3" title="Improvement Options" copy="Explore feasible ways to improve your participation mark." />
  <div className="profile-identity"><span><b>Student:</b> Amara Example</span><span><b>Module:</b> CS101</span><span><b>Current participation:</b> 60%</span></div>
  <div className="scenario-controls">
    <div><span className="label-muted">Current participation</span><strong>60.00%</strong></div>
    <div className="target-input"><label>Desired Improvement (δ)</label><div className="input-box">5.0%</div></div>
    <div><span className="label-muted">Target participation</span><strong className="purple-value">65.00%</strong></div>
    <button className="button primary">Show Improvement Options</button>
  </div>
  <div className="success-banner">✓ &nbsp; <strong>1</strong>&nbsp; feasible improvement plan found.</div>
  <Lift delay={16} className="scenario-card">
    <div className="scenario-head"><div><span className="eyebrow">Scenario 1</span><h3>Reach a 65.00% target</h3></div><div className="scenario-gain">+5.00%</div></div>
    <div className="scenario-body"><div className="scenario-target"><span>Target participation</span><strong>65.00%</strong></div><div className="required-mark"><span>Assignment 2 required mark</span><strong><AnimatedNumber value={85} suffix="%" /></strong></div></div>
  </Lift>
</Shell>;

const StudentSummary: React.FC = () => <Shell page="Phase 4 — Performance Summary">
  <Intro eyebrow="Phase 4" title="Student Performance Summary" copy="A read-only summary of your assessment framework and current results." />
  <div className="profile-identity"><span><b>Student:</b> Amara Example</span><span><b>Student Number:</b> 70000001</span><span><b>Module:</b> CS101</span></div>
  <div className="summary-grid">
    <ScreenCard title="Assessment Framework"><DataTable headers={['Assessment category', 'Number', 'Total weight']} rows={[
      ['Class Test', '2', '60%'], ['Assignment', '2', '40%'],
    ]} /></ScreenCard>
    <ScreenCard title="Existing Assessment Marks"><DataTable headers={['Assessment', 'Weight', 'Mark']} rows={[
      ['Class Test 1', '30%', '72'], ['Class Test 2', '30%', '48'], ['Assignment 1', '20%', '60'], ['Assignment 2', '20%', '—'],
    ]} /></ScreenCard>
  </div>
  <div className="summary-bottom"><div className="summary-profile"><span>Academic profile</span><strong>60.00%</strong><Pill kind="success">Good</Pill></div><div className="summary-profile"><span>Feasible improvement plan</span><strong>+5.00%</strong><small>Assignment 2: 85%</small></div><button className="button primary">↓ &nbsp;Save CSV</button></div>
</Shell>;

const LecturerDashboard: React.FC = () => <Shell lecturer>
  <div className="lecturer-hero"><span className="eyebrow light">CS101</span><h2>Class dashboard</h2><p>Sample module (simulated data) — participation-mark performance for the whole class, including the best-case and worst-case projections for assessments that have not been written yet.</p></div>
  <div className="metric-grid four">
    <Metric label="Class average (participation so far)" value={<AnimatedNumber value={55.36} decimals={2} />} />
    <Metric label="Marks dropped (best N of M)" value={<AnimatedNumber value={16} />} />
    <Metric label="At-risk students" value={<AnimatedNumber value={0} />} />
    <Metric label="Class size" value={<AnimatedNumber value={15} />} />
  </div>
  <ScreenCard title="Quick actions">
    <div className="action-buttons"><button className="button primary">Review at-risk students</button><button className="button secondary">Enter marks</button><button className="button secondary">Manage students</button><button className="button secondary">Cohort planning</button></div>
  </ScreenCard>
  <div className="sample-note">SIMULATED SAMPLE DATA</div>
</Shell>;

const AtRiskView: React.FC = () => <Shell lecturer page="At-risk students">
  <div className="page-heading"><h2>At-risk students</h2><p>Students whose best-case participation mark cannot reach the module threshold of 50%.</p></div>
  <ScreenCard title="No flags"><div className="empty-state"><div className="empty-check">✓</div><strong>No students currently flagged as at-risk.</strong><p>In this simulated cohort, every student’s best-case participation mark can reach the threshold.</p></div></ScreenCard>
  <div className="sample-note">SIMULATED SAMPLE DATA</div>
</Shell>;

const LecturerJourney: React.FC = () => {
  const frame = useCurrentFrame();
  const riskFade = interpolate(frame, [202, 222], [0, 1], clamp);
  return <>
    <div style={{opacity: 1 - riskFade}}><LecturerDashboard /></div>
    <div style={{position: 'absolute', inset: 0, opacity: riskFade}}><AtRiskView /></div>
  </>;
};

const IndividualPlan: React.FC = () => {
  const frame = useCurrentFrame();
  const planReveal = interpolate(frame, [84, 108], [0, 1], clamp);
  const chartDraw = interpolate(frame, [18, 64], [0, 1], clamp);
  return <Shell lecturer page="STU001 — CS101" className="student-detail-screen">
    <div className="page-heading compact"><span className="eyebrow">CS101 · SAMPLE STUDENT</span><h2>STU001</h2></div>
    <div className="metric-grid four individual-metrics">
      <Metric label="Participation earned so far" value="54.86" detail="out of 100, counting marks kept" />
      <Metric label="Current standing (counted work)" value="73.14" detail="re-based on work counted so far" />
      <Metric label="Feasible region" value="54.86 – 86.46" detail="lowest and highest final mark" />
      <Metric label="Counted slots still open" value="2" detail="0 marks currently dropped" />
    </div>
    <ScreenCard title="Feasible region of the final participation mark">
      <p className="body-copy">The final participation mark can still land between the minimum and maximum below.</p>
      <div className="region-scale"><span className="region-band" style={{width: `${31.6 * chartDraw}%`}} /><i className="mark-earned" /><i className="mark-pass" /><i className="mark-target" style={{opacity: chartDraw}} /><small>0</small><small>50 pass</small><small>100</small></div>
      <div className="region-legend"><span>● Earned so far 54.86%</span><span>━ Reachable region 54.86–86.46%</span><span>● Pass threshold 50%</span></div>
    </ScreenCard>
    <ScreenCard title="Plan for a target" className="target-panel">
      <div className="target-row"><label>Target final participation mark (%)</label><div className="range-control"><span>54.86%</span><div className="range-track"><i /></div><span>86.46%</span></div><strong>70.66%</strong><button className="button primary small">Plan for this target</button></div>
      <div className="plan-summary">To reach 70.66%, you need at least <strong><AnimatedNumber value={63.21} decimals={2} suffix="%" delay={102} duration={36} /></strong> on each of the 5 remaining items.</div>
      <DataTable headers={['Remaining item', 'Type', 'Minimum required (%)', 'Equivalent mark']} rows={[
        ['Class Test 3', 'Class Test', '63.21', '63.21'], ['Assignment 2', 'Assignment', '63.21', '63.21'], ['Practical', 'Practical', '63.21', '63.21'], ['Attendance 11', 'Attendance', '63.21', '63.21'], ['Attendance 12', 'Attendance', '63.21', '63.21'],
      ]} />
    </ScreenCard>
  </Shell>;
};

const CohortPlan: React.FC = () => <Shell lecturer page="Cohort planning">
  <div className="lecturer-hero compact-hero"><span className="eyebrow light">CS101</span><h2>Cohort planning</h2><p>Explore how a different spread of assessment weights would move the class average.</p></div>
  <Metric label="Current class average (existing weights)" value="63.2" />
  <ScreenCard title="Weight ranges and target">
    <div className="target-row"><label>Target class average (%)</label><div className="range-control"><span>0%</span><div className="range-track"><i /></div><span>100%</span></div><strong>60%</strong><span className="hint">the average the optimiser aims for</span></div>
    <DataTable headers={['Assessment', 'Now', 'Minimum %', 'Maximum %', 'Proposed %']} rows={[
      ['Class Test', '30%', '20', '40', '23.5'], ['Assignment', '20%', '10', '30', '26.5'], ['Practical', '15%', '5', '25', '21.5'], ['Attendance', '35%', '25', '45', '28.5'],
    ]} />
    <div className="validation-ok">Ranges are valid — they can add up to 100%.</div>
    <div className="result-banner"><span>Target reached</span><strong>The proposed weights put the class on the 60.0% target (resulting average 60.0%).</strong></div>
  </ScreenCard>
  <div className="sample-note">SIMULATED SAMPLE DATA · PROPOSED WEIGHTS ARE AN OPTIMISER RESULT</div>
</Shell>;

const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [24, 132], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return <div className="cold-open">
    <div className="cold-kicker">A student’s progress is more than one mark</div>
    <h2>Small signals.<br/><span>One clearer picture.</span></h2>
    <div className="cold-data-card" style={{opacity: rise, transform: `translateY(${(1 - rise) * 26}px)`}}>
      <div className="cold-data-head"><span>ASSESSMENT PROGRESS</span><Pill kind="muted">Example view</Pill></div>
      <div className="signal-row"><span>Class Test 1</span><div className="signal-bar"><i style={{width: `${Math.min(100, rise * 72)}%`}} /></div><strong>Mark recorded</strong></div>
      <div className="signal-row"><span>Class Test 2</span><div className="signal-bar"><i style={{width: `${Math.min(100, rise * 48)}%`}} /></div><strong>Mark recorded</strong></div>
      <div className="signal-row muted-row"><span>Assignment 2</span><div className="signal-bar"><i style={{width: `${Math.min(100, rise * 18)}%`}} /></div><strong>Still to come</strong></div>
      <div className="cold-bottom">A student-entered assessment view</div>
    </div>
  </div>;
};

const ShiftDiagram: React.FC = () => (
  <div className="shift-diagram">
    <div className="shift-lead">A practical progression</div>
    <div className="shift-stages">
      <Lift delay={0} className="shift-stage"><span className="stage-number">01</span><span className="stage-type">DESCRIPTIVE</span><strong>What happened?</strong><p>Recorded marks and participation</p><div className="stage-graphic bars"><i/><i/><i/><i/><i/></div></Lift>
      <div className="shift-connector">→</div>
      <Lift delay={12} className="shift-stage"><span className="stage-number">02</span><span className="stage-type">PREDICTIVE</span><strong>What may happen?</strong><p>A feasible range from current marks</p><div className="stage-graphic range"><i/></div></Lift>
      <div className="shift-connector">→</div>
      <Lift delay={24} className="shift-stage selected"><span className="stage-number">03</span><span className="stage-type">PRESCRIPTIVE</span><strong>What could help?</strong><p>A target and the marks required</p><div className="stage-graphic target">↗</div></Lift>
    </div>
    <div className="shift-footnote">In this prototype: assessment marks → feasible outcomes → a target plan</div>
  </div>
);

const PrivacyScene: React.FC = () => <div className="privacy-scene">
  <div className="privacy-title">Two tools. Separate data.</div>
  <div className="privacy-panes">
    <Lift className="privacy-pane student-pane"><span className="privacy-icon">S</span><span className="eyebrow">STUDENT TOOL</span><h3>Student Performance Assistant</h3><p>Assessment plan, marks, profile and scenarios</p><div className="storage-tag">Browser local storage</div></Lift>
    <div className="no-share"><span>≠</span><small>NO SHARED DATA</small></div>
    <Lift delay={14} className="privacy-pane lecturer-pane"><span className="privacy-icon">L</span><span className="eyebrow">LECTURER TOOL</span><h3>Decision Support System</h3><p>Module data, marks and cohort planning</p><div className="storage-tag">In-memory lecturer data</div></Lift>
  </div>
  <div className="privacy-footnote">The two applications operate independently.</div>
</div>;

const ImpactScene: React.FC = () => <div className="impact-scene">
  <div className="impact-title">A practical step towards proactive support</div>
  <div className="impact-subtitle">One academic picture. Two focused workflows.</div>
  <div className="impact-cards">
    <Lift className="impact-card"><span className="eyebrow">FOR STUDENTS</span><strong>Understand current performance</strong><div className="impact-line"/><p>Explore improvement scenarios from entered assessment marks.</p></Lift>
    <Lift delay={18} className="impact-card"><span className="eyebrow">FOR LECTURERS</span><strong>See cohort signals</strong><div className="impact-line"/><p>Review feasible targets and assessment weight plans.</p></Lift>
  </div>
  <div className="impact-disclaimer">What the prototype calculates today, in separate student and lecturer tools.</div>
</div>;

const CursorPointer: React.FC<{points: number[][]}> = ({points}) => {
  const frame = useCurrentFrame();
  let segment = 0;
  while (segment < points.length - 2 && frame > points[segment + 1][0]) segment++;
  const [fromFrame, fromX, fromY] = points[segment];
  const [toFrame, toX, toY] = points[segment + 1];
  const progress = interpolate(frame, [fromFrame, toFrame], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const x = interpolate(progress, [0, 1], [fromX, toX]);
  const y = interpolate(progress, [0, 1], [fromY, toY]);
  const click = interpolate(frame, [toFrame - 2, toFrame, toFrame + 3, toFrame + 7], [0, 1, 0.38, 0], clamp);
  return <div className="film-cursor" style={{left: x, top: y}}><i style={{transform: `scale(${1 - click * 0.16})`}}/><span style={{opacity: click}} /></div>;
};

const ChapterTitle: React.FC<{text: string; number: string}> = ({text, number}) => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [0, 22], [-20, 0], clamp);
  return <div className="chapter-title" style={{opacity: fadeIn(frame, 18), transform: `translateY(${slide}px)`}}><span>{number}</span>{text}</div>;
};

const Stage: React.FC<{scene: FilmScene; index: number}> = ({scene, index}) => {
  const frame = useCurrentFrame();
  const camera = interpolate(frame, [0, scene.duration], [0, 1], clamp);
  const endFade = interpolate(frame, [scene.duration - 12, scene.duration], [1, 0], clamp);
  const chapterNumber = String(index + 1).padStart(2, '0');
  if (scene.id === 'end-card') return <EndCard frame={frame} />;

  const screen = scene.id === 'assessment-setup' ? <StudentSetup />
    : scene.id === 'academic-profile' ? <StudentProfile />
    : scene.id === 'improvement-options' ? <StudentScenarios />
    : scene.id === 'summary' ? <StudentSummary />
    : scene.id === 'lecturer-dashboard' ? <LecturerJourney />
    : scene.id === 'student-plan' ? <IndividualPlan />
    : scene.id === 'cohort-plan' ? <CohortPlan />
    : null;

  return <AbsoluteFill className="film-stage" style={{opacity: endFade}}>
    <div className="ambient-glow" />
    <ChapterTitle text={scene.chapter} number={chapterNumber} />
    {scene.id === 'cold-open' && <ColdOpen />}
    {scene.id === 'shift' && <ShiftDiagram />}
    {scene.id === 'privacy' && <PrivacyScene />}
    {scene.id === 'impact' && <ImpactScene />}
    {screen && <div className="screen-outer" style={{transform: `perspective(2300px) rotateY(-3deg) rotateX(0.7deg) scale(${0.965 + camera * 0.014})`, opacity: fadeIn(frame, 16)}}><div className="screen-shadow" />{screen}</div>}
    {scene.caption && <div className="caption-wrap" style={{opacity: interpolate(frame, [7, 20], [0, 1], clamp)}}><span className="caption-dot" />{scene.caption}</div>}
  </AbsoluteFill>;
};

const EndCard: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeIn(frame, 26);
  const lift = interpolate(frame, [0, 28], [22, 0], clamp);
  return <AbsoluteFill className="end-card" style={{opacity}}>
    <div className="end-rule" />
    <h1 style={{transform: `translateY(${lift}px)`}}>Academic Performance<br/>Feedback Management<br/>Information System</h1>
    <div className="end-names" style={{transform: `translateY(${lift}px)`}}>Gosego Sebaetse <span>·</span> Thamsanqa Ndlakuse</div>
  </AbsoluteFill>;
};

const FilmAudio: React.FC = () => {
  const frame = useCurrentFrame();
  const music = interpolate(frame, [0, 90, FILM_FRAMES - 100, FILM_FRAMES], [0, 0.18, 0.18, 0], clamp);
  return <>
    {scenes.map((scene, i) => <Sequence key={scene.id} from={scene.from} durationInFrames={scene.duration}>
      <Audio src={staticFile(`audio/voice-${String(i + 1).padStart(2, '0')}.wav`)} volume={1} />
    </Sequence>)}
    <Audio src={staticFile('audio/music-bed.wav')} volume={music} />
  </>;
};

export const APFISProductFilm: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill className="film-background" />
    {scenes.map((scene, index) => <Sequence key={scene.id} from={scene.from} durationInFrames={scene.duration}>
      <Stage scene={scene} index={index} />
    </Sequence>)}
    <Sequence from={0} durationInFrames={FILM_FRAMES}><FilmAudio /></Sequence>
  </AbsoluteFill>
);
