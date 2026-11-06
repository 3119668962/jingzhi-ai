import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  Download,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  Plus,
  Sparkles,
  Target,
  Trash2,
  Upload,
  UserRound,
  WandSparkles,
} from 'lucide-react';
import {
  ALL_MAJORS,
  DEGREES,
  EMPTY_PROFILE,
  GOAL_DIRECTIONS,
  GRADE_OPTIONS,
  SKILL_LEVELS,
  SKILLS,
  TARGET_LEVELS,
  TIMETABLE_TEMPLATE,
  WEEKDAY_LABELS,
  parseTimetableCsv,
} from '../data/profile';
import { Logo, Toggle } from '../components/ui';

const STEPS = [
  { title: '基础信息', caption: '认识你', icon: UserRound },
  { title: '能力与证书', caption: '了解实力', icon: Award },
  { title: '课程时间表', caption: '找到你的时间', icon: CalendarDays },
  { title: '目标与偏好', caption: '明确方向', icon: Target },
];

const CERT_SUGGESTIONS = ['CET-4', 'CET-6', '全国计算机等级考试二级', '华为 HCIA', '软考中级', '普通话二甲', '雅思 6.5', '初级会计'];
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function cloneProfile(source) {
  const base = source || EMPTY_PROFILE;
  return {
    ...EMPTY_PROFILE,
    ...base,
    skills: { ...EMPTY_PROFILE.skills, ...(base.skills || {}) },
    certificates: [...(base.certificates || [])],
    experiences: [...(base.experiences || [])],
    courses: [...(base.courses || [])],
    goals: {
      ...EMPTY_PROFILE.goals,
      ...(base.goals || {}),
      directions: [...(base.goals?.directions || [])],
    },
  };
}

export default function Onboarding({ initialProfile, onComplete, onLoadDemo, isEditing = false }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(() => cloneProfile(initialProfile));
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [abilityTab, setAbilityTab] = useState('skills');
  const [courseDraft, setCourseDraft] = useState({
    name: '',
    day: 1,
    start: '08:00',
    end: '09:40',
    location: '',
  });
  const [certDraft, setCertDraft] = useState({ name: '', level: '', date: '' });
  const [expDraft, setExpDraft] = useState({ name: '', award: '', year: '' });
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef(null);

  const update = (patch) => {
    setDraft((current) => ({ ...current, ...patch }));
    setError('');
  };

  const updateGoal = (patch) => {
    setDraft((current) => ({ ...current, goals: { ...current.goals, ...patch } }));
    setError('');
  };

  const setSkill = (skillId, level) => {
    setDraft((current) => ({
      ...current,
      skills: { ...current.skills, [skillId]: level },
    }));
  };

  const toggleDirection = (directionId) => {
    const exists = draft.goals.directions.includes(directionId);
    if (!exists && draft.goals.directions.length >= 4) {
      setError('最多选择 4 个目标方向，聚焦会让推荐更准确。');
      return;
    }
    updateGoal({
      directions: exists
        ? draft.goals.directions.filter((id) => id !== directionId)
        : [...draft.goals.directions, directionId],
    });
  };

  const validateStep = (targetStep) => {
    if (targetStep > 0) {
      if (!draft.name.trim()) return '请填写你的姓名或昵称。';
      if (!draft.school.trim()) return '请填写所在学校。';
      if (!draft.major.trim()) return '请填写或选择专业。';
    }
    if (targetStep === 4) {
      if (!draft.goals.directions.length) return '请至少选择一个目标发展方向。';
      if (!draft.goals.months[0] || !draft.goals.months[1]) return '请选择希望的参赛时间范围。';
    }
    return '';
  };

  const goNext = () => {
    const message = validateStep(step + 1);
    if (message) {
      setError(message);
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      setError('');
      return;
    }
    finish();
  };

  const finish = () => {
    const message = validateStep(4);
    if (message) {
      setError(message);
      return;
    }
    setGenerating(true);
    const profile = {
      ...draft,
      name: draft.name.trim(),
      school: draft.school.trim(),
      major: draft.major.trim(),
      id: draft.id || makeId('profile'),
      profileComplete: true,
      isDemo: !!draft.isDemo,
      updatedAt: new Date().toISOString(),
    };
    window.setTimeout(() => {
      setGenerating(false);
      onComplete?.(profile);
    }, 1300);
  };

  const addCourse = () => {
    if (!courseDraft.name.trim()) {
      setError('请填写课程名称。');
      return;
    }
    if (courseDraft.end <= courseDraft.start) {
      setError('课程结束时间需要晚于开始时间。');
      return;
    }
    update({
      courses: [
        ...draft.courses,
        {
          ...courseDraft,
          id: makeId('course'),
          name: courseDraft.name.trim(),
          weeks: '1-16',
          type: '专业课程',
        },
      ],
    });
    setCourseDraft({ name: '', day: 1, start: '08:00', end: '09:40', location: '' });
    setError('');
  };

  const handleCsvFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const { courses, error: parseError } = parseTimetableCsv(text);
      if (!courses.length) {
        setImportMessage(parseError || '未识别到课程，请检查文件格式。');
      } else {
        update({ courses });
        setImportMessage(`已导入 ${courses.length} 门课程${parseError ? `；${parseError}` : ''}`);
      }
    } catch {
      setImportMessage('文件读取失败，请改为手动添加课程。');
    }
    event.target.value = '';
  };

  const downloadTemplate = () => {
    const blob = new Blob([`\uFEFF${TIMETABLE_TEMPLATE}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = '竞智AI-课程表模板.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const addCertificate = (preset) => {
    const cert = preset ? { name: preset, level: '', date: '' } : certDraft;
    if (!cert.name.trim()) {
      setError('请填写证书名称。');
      return;
    }
    update({
      certificates: [
        ...draft.certificates,
        { id: makeId('cert'), name: cert.name.trim(), level: cert.level, date: cert.date, issuer: '' },
      ],
    });
    setCertDraft({ name: '', level: '', date: '' });
    setError('');
  };

  const addExperience = () => {
    if (!expDraft.name.trim()) {
      setError('请填写竞赛名称。');
      return;
    }
    update({
      experiences: [...draft.experiences, { ...expDraft, id: makeId('exp'), name: expDraft.name.trim() }],
    });
    setExpDraft({ name: '', award: '', year: '' });
    setError('');
  };

  return (
    <div className="onboarding-shell">
      <aside className="onboarding-aside">
        <div className="onboarding-brand">
          <Logo size={43} />
          <div>
            <strong>竞智AI</strong>
            <span>JINGZHI INTELLIGENCE</span>
          </div>
        </div>
        <div className="onboarding-copy">
          <span className="onboarding-eyebrow">
            <Sparkles size={14} />
            AI COMPETITION COPILOT
          </span>
          <h1>
            别让信息差，
            <br />
            定义你的<span>竞赛可能性。</span>
          </h1>
          <p>把专业、能力、课程与目标交给 AI，找到真正适合你的比赛，并把备赛落到每一周。</p>
        </div>
        <div className="onboarding-orbit">
          <div className="orbit-ring orbit-ring-1" />
          <div className="orbit-ring orbit-ring-2" />
          <div className="orbit-core">
            <Logo size={56} />
            <div className="orbit-pulse" />
          </div>
          <div className="orbit-node node-a">
            <span className="node-icon"><GraduationCap size={16} /></span>
            <div><strong>专业画像</strong><em>网络工程 · 大二</em></div>
          </div>
          <div className="orbit-node node-b">
            <span className="node-icon"><Target size={16} /></span>
            <div><strong>能力雷达</strong><em>安全 · 编程 · 协作</em></div>
          </div>
          <div className="orbit-node node-c">
            <span className="node-icon"><WandSparkles size={16} /></span>
            <div><strong>智能推荐</strong><em>匹配度 96</em></div>
          </div>
          <span className="orbit-dot dot-a" />
          <span className="orbit-dot dot-b" />
          <span className="orbit-dot dot-c" />
        </div>
        <div className="onboarding-aside-footer">
          <div className="privacy-chip">
            <LockKeyhole size={15} />
            <span>数据仅保存在本机，不上传至第三方</span>
          </div>
          <div className="onboarding-flow">
            <span>画像</span><ChevronRight size={12} /><span>匹配</span><ChevronRight size={12} /><span>规划</span><ChevronRight size={12} /><span>成长</span>
          </div>
        </div>
      </aside>

      <main className="onboarding-main">
        <div className="onboarding-toolbar">
          <div>
            <span className="toolbar-kicker">{isEditing ? 'EDIT PROFILE' : 'WELCOME TO JINGZHI'}</span>
            <strong>{isEditing ? '更新你的成长画像' : '先花 3 分钟，让 AI 真正认识你'}</strong>
          </div>
          {!isEditing && onLoadDemo && (
            <button type="button" className="demo-button" onClick={onLoadDemo}>
              <Sparkles size={15} />
              载入示例画像
            </button>
          )}
        </div>

        <div className="wizard">
          <div className="wizard-steps">
            {STEPS.map((item, index) => {
              const Icon = item.icon;
              const done = index < step;
              const active = index === step;
              return (
                <button
                  type="button"
                  key={item.title}
                  className={`wizard-step ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}
                  onClick={() => {
                    if (index < step) setStep(index);
                  }}
                >
                  <span className="wizard-step-icon">
                    {done ? <Check size={15} strokeWidth={3} /> : <Icon size={16} />}
                  </span>
                  <span className="wizard-step-copy">
                    <em>STEP {index + 1}</em>
                    <strong>{item.title}</strong>
                  </span>
                  {index < STEPS.length - 1 && <span className="wizard-connector" />}
                </button>
              );
            })}
          </div>

          <div className="wizard-content">
            {step === 0 && (
              <section className="form-section">
                <div className="form-section-head">
                  <span className="section-number">01</span>
                  <div>
                    <h2>你的基础信息</h2>
                    <p>这些信息只用于判断竞赛的专业、学历与年级门槛。</p>
                  </div>
                </div>
                <div className="form-grid two-columns">
                  <label className="field">
                    <span>姓名 / 昵称 <em>*</em></span>
                    <input
                      value={draft.name}
                      onChange={(event) => update({ name: event.target.value })}
                      placeholder="如：林知夏"
                    />
                  </label>
                  <label className="field">
                    <span>所在学校 <em>*</em></span>
                    <input
                      value={draft.school}
                      onChange={(event) => update({ school: event.target.value })}
                      placeholder="如：江南理工大学"
                    />
                  </label>
                  <label className="field">
                    <span>就读专业 <em>*</em></span>
                    <input
                      list="major-options"
                      value={draft.major}
                      onChange={(event) => update({ major: event.target.value })}
                      placeholder="输入或选择专业"
                    />
                    <datalist id="major-options">
                      {ALL_MAJORS.map((major) => <option value={major} key={major} />)}
                    </datalist>
                  </label>
                  <label className="field">
                    <span>班级</span>
                    <input
                      value={draft.className}
                      onChange={(event) => update({ className: event.target.value })}
                      placeholder="选填，如：网工 2302 班"
                    />
                  </label>
                </div>
                <div className="form-grid two-columns">
                  <div className="field">
                    <span>培养层次</span>
                    <div className="segmented">
                      {DEGREES.map((degree) => (
                        <button
                          type="button"
                          key={degree}
                          className={draft.degree === degree ? 'is-selected' : ''}
                          onClick={() => update({ degree })}
                        >
                          {degree}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <span>当前年级</span>
                    <div className="chip-select compact">
                      {GRADE_OPTIONS.map((grade) => (
                        <button
                          type="button"
                          key={grade}
                          className={draft.grade === grade ? 'is-selected' : ''}
                          onClick={() => update({ grade })}
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="privacy-note">
                  <LockKeyhole size={16} />
                  <p><strong>本地优先</strong> 你的画像、课程表与密钥都保存在本机「竞智AI/data」中，不会被上传。</p>
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="form-section">
                <div className="form-section-head">
                  <span className="section-number">02</span>
                  <div>
                    <h2>能力、证书与经历</h2>
                    <p>按真实情况评估即可，AI 会据此判断你与赛道之间的能力差距。</p>
                  </div>
                </div>
                <div className="subtabs">
                  <button type="button" className={abilityTab === 'skills' ? 'is-active' : ''} onClick={() => setAbilityTab('skills')}>
                    能力自评
                  </button>
                  <button type="button" className={abilityTab === 'certs' ? 'is-active' : ''} onClick={() => setAbilityTab('certs')}>
                    证书 <span>{draft.certificates.length}</span>
                  </button>
                  <button type="button" className={abilityTab === 'exp' ? 'is-active' : ''} onClick={() => setAbilityTab('exp')}>
                    竞赛经历 <span>{draft.experiences.length}</span>
                  </button>
                </div>

                {abilityTab === 'skills' && (
                  <div className="skills-editor">
                    <div className="skills-hint">
                      <span><CircleCheck size={15} /> 1–5 级分别对应入门到专家</span>
                      <span>共 {SKILLS.length} 个能力维度</span>
                    </div>
                    <div className="skills-editor-grid">
                      {SKILLS.map((skill) => {
                        const value = Number(draft.skills[skill.id] || 0);
                        return (
                          <div className="skill-editor-card" key={skill.id}>
                            <div className="skill-editor-top">
                              <div>
                                <strong>{skill.name}</strong>
                                <span>{skill.group}</span>
                              </div>
                              <em>{SKILL_LEVELS.find((level) => level.value === value)?.label || '未填写'}</em>
                            </div>
                            <div className="level-dots">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  type="button"
                                  key={level}
                                  className={value >= level ? 'is-filled' : ''}
                                  onClick={() => setSkill(skill.id, level)}
                                  title={`${level} · ${SKILL_LEVELS[level - 1].label}`}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {abilityTab === 'certs' && (
                  <div className="subform">
                    <div className="quick-chip-list">
                      {CERT_SUGGESTIONS.map((cert) => (
                        <button type="button" className="quick-chip" key={cert} onClick={() => addCertificate(cert)}>
                          <Plus size={12} />
                          {cert}
                        </button>
                      ))}
                    </div>
                    <div className="inline-form three">
                      <label className="field">
                        <span>证书名称</span>
                        <input
                          value={certDraft.name}
                          onChange={(event) => setCertDraft({ ...certDraft, name: event.target.value })}
                          placeholder="如：CET-6"
                        />
                      </label>
                      <label className="field">
                        <span>成绩 / 等级</span>
                        <input
                          value={certDraft.level}
                          onChange={(event) => setCertDraft({ ...certDraft, level: event.target.value })}
                          placeholder="如：525 分"
                        />
                      </label>
                      <label className="field">
                        <span>获得时间</span>
                        <input
                          type="month"
                          value={certDraft.date}
                          onChange={(event) => setCertDraft({ ...certDraft, date: event.target.value })}
                        />
                      </label>
                      <button type="button" className="add-square-button" onClick={() => addCertificate()}>
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="entry-list">
                      {draft.certificates.map((cert) => (
                        <div className="entry-row" key={cert.id}>
                          <span className="entry-icon"><Award size={17} /></span>
                          <div><strong>{cert.name}</strong><span>{cert.level || '未填写成绩'} {cert.date ? `· ${cert.date}` : ''}</span></div>
                          <button
                            type="button"
                            className="icon-button subtle"
                            onClick={() => update({ certificates: draft.certificates.filter((item) => item.id !== cert.id) })}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                      {!draft.certificates.length && <div className="inline-empty">还没有证书，可从上方快捷添加。</div>}
                    </div>
                  </div>
                )}

                {abilityTab === 'exp' && (
                  <div className="subform">
                    <div className="inline-form three">
                      <label className="field">
                        <span>竞赛名称</span>
                        <input
                          value={expDraft.name}
                          onChange={(event) => setExpDraft({ ...expDraft, name: event.target.value })}
                          placeholder="如：蓝桥杯"
                        />
                      </label>
                      <label className="field">
                        <span>获奖 / 参与情况</span>
                        <input
                          value={expDraft.award}
                          onChange={(event) => setExpDraft({ ...expDraft, award: event.target.value })}
                          placeholder="如：省赛二等奖"
                        />
                      </label>
                      <label className="field">
                        <span>年份</span>
                        <input
                          value={expDraft.year}
                          onChange={(event) => setExpDraft({ ...expDraft, year: event.target.value })}
                          placeholder="如：2026"
                        />
                      </label>
                      <button type="button" className="add-square-button" onClick={addExperience}>
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="entry-list">
                      {draft.experiences.map((exp) => (
                        <div className="entry-row" key={exp.id}>
                          <span className="entry-icon is-green"><BookOpen size={17} /></span>
                          <div><strong>{exp.name}</strong><span>{[exp.award, exp.year].filter(Boolean).join(' · ') || '参与经历'}</span></div>
                          <button
                            type="button"
                            className="icon-button subtle"
                            onClick={() => update({ experiences: draft.experiences.filter((item) => item.id !== exp.id) })}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                      {!draft.experiences.length && <div className="inline-empty">没有竞赛经历也没关系，系统会从潜力维度进行判断。</div>}
                    </div>
                  </div>
                )}
              </section>
            )}

            {step === 2 && (
              <section className="form-section">
                <div className="form-section-head">
                  <span className="section-number">03</span>
                  <div>
                    <h2>上传或录入课程表</h2>
                    <p>用于检测竞赛时间与上课时间是否冲突，并生成不撞课的备赛安排。</p>
                  </div>
                </div>
                <div className="timetable-tools">
                  <button type="button" className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                    <span className="upload-icon"><Upload size={19} /></span>
                    <div>
                      <strong>导入 CSV 课程表</strong>
                      <span>支持课程名称、星期、开始/结束时间</span>
                    </div>
                    <span className="upload-action">选择文件</span>
                  </button>
                  <input ref={fileInputRef} type="file" accept=".csv,.txt" hidden onChange={handleCsvFile} />
                  <button type="button" className="template-download" onClick={downloadTemplate}>
                    <Download size={15} />
                    下载模板
                  </button>
                </div>
                {importMessage && <div className="inline-info">{importMessage}</div>}

                <div className="course-add-form">
                  <label className="field field-wide">
                    <span>课程名称</span>
                    <input
                      value={courseDraft.name}
                      onChange={(event) => setCourseDraft({ ...courseDraft, name: event.target.value })}
                      placeholder="如：网络安全技术"
                    />
                  </label>
                  <label className="field">
                    <span>星期</span>
                    <select
                      value={courseDraft.day}
                      onChange={(event) => setCourseDraft({ ...courseDraft, day: Number(event.target.value) })}
                    >
                      {WEEKDAY_LABELS.map((label, index) => (
                        <option value={index + 1} key={label}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>开始</span>
                    <input
                      type="time"
                      value={courseDraft.start}
                      onChange={(event) => setCourseDraft({ ...courseDraft, start: event.target.value })}
                    />
                  </label>
                  <label className="field">
                    <span>结束</span>
                    <input
                      type="time"
                      value={courseDraft.end}
                      onChange={(event) => setCourseDraft({ ...courseDraft, end: event.target.value })}
                    />
                  </label>
                  <label className="field">
                    <span>地点</span>
                    <input
                      value={courseDraft.location}
                      onChange={(event) => setCourseDraft({ ...courseDraft, location: event.target.value })}
                      placeholder="选填"
                    />
                  </label>
                  <button type="button" className="add-course-button" onClick={addCourse}>
                    <Plus size={17} />
                    添加
                  </button>
                </div>

                <div className="course-list-head">
                  <strong>已录入课程</strong>
                  <span>{draft.courses.length} 门 · 每周约 {draft.courses.reduce((sum, course) => {
                    const [sh, sm] = course.start.split(':').map(Number);
                    const [eh, em] = course.end.split(':').map(Number);
                    return sum + (eh + em / 60) - (sh + sm / 60);
                  }, 0).toFixed(1)} 小时</span>
                </div>
                <div className="course-list">
                  {draft.courses.map((course) => (
                    <div className="course-row" key={course.id}>
                      <span className="course-day">{WEEKDAY_LABELS[course.day - 1]}</span>
                      <div className="course-row-main">
                        <strong>{course.name}</strong>
                        <span>{course.start}–{course.end} {course.location ? `· ${course.location}` : ''}</span>
                      </div>
                      <em>{course.type || '课程'}</em>
                      <button
                        type="button"
                        className="icon-button subtle"
                        onClick={() => update({ courses: draft.courses.filter((item) => item.id !== course.id) })}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  {!draft.courses.length && (
                    <div className="inline-empty large">
                      暂无课程。导入 CSV 或手动添加，系统才能进行时间冲突检测。
                    </div>
                  )}
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="form-section">
                <div className="form-section-head">
                  <span className="section-number">04</span>
                  <div>
                    <h2>你的目标与偏好</h2>
                    <p>目标决定推荐方向，时间与投入决定计划能否真正执行。</p>
                  </div>
                </div>
                <div className="field">
                  <span>希望发展的方向 <em>*</em> <small>最多选择 4 个</small></span>
                  <div className="goal-grid">
                    {GOAL_DIRECTIONS.map((direction) => {
                      const selected = draft.goals.directions.includes(direction.id);
                      return (
                        <button
                          type="button"
                          key={direction.id}
                          className={`goal-card ${selected ? 'is-selected' : ''}`}
                          onClick={() => toggleDirection(direction.id)}
                        >
                          <span className="goal-check">{selected && <Check size={12} strokeWidth={3} />}</span>
                          <strong>{direction.name}</strong>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-grid two-columns top-gap">
                  <div className="field">
                    <span>参赛目标等级</span>
                    <div className="segmented wrap">
                      {TARGET_LEVELS.map((level) => (
                        <button
                          type="button"
                          key={level}
                          className={draft.goals.targetLevel === level ? 'is-selected' : ''}
                          onClick={() => updateGoal({ targetLevel: level })}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <span>希望参赛时间 <em>*</em></span>
                    <div className="month-range">
                      <select
                        value={draft.goals.months[0]}
                        onChange={(event) => updateGoal({ months: [Number(event.target.value), draft.goals.months[1]] })}
                      >
                        {MONTHS.map((month) => <option value={month} key={month}>{month} 月</option>)}
                      </select>
                      <span>至</span>
                      <select
                        value={draft.goals.months[1]}
                        onChange={(event) => updateGoal({ months: [draft.goals.months[0], Number(event.target.value)] })}
                      >
                        {MONTHS.map((month) => <option value={month} key={month}>{month} 月</option>)}
                      </select>
                    </div>
                    <small className="field-hint">可跨年选择，如 11 月至次年 3 月</small>
                  </div>
                </div>

                <div className="hours-field">
                  <div className="hours-head">
                    <div>
                      <span>每周可投入备赛时间</span>
                      <small>系统会避开课程，安排可执行的训练时段</small>
                    </div>
                    <strong>{draft.goals.weeklyHours} <em>小时 / 周</em></strong>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="30"
                    step="1"
                    value={draft.goals.weeklyHours}
                    onChange={(event) => updateGoal({ weeklyHours: Number(event.target.value) })}
                  />
                  <div className="range-labels"><span>4h 轻量备赛</span><span>15h 平衡</span><span>30h 高强度</span></div>
                </div>

                <div className="weekend-toggle-row">
                  <div>
                    <strong>尽量保留周末休息</strong>
                    <span>开启后，训练时段优先安排在工作日晚间</span>
                  </div>
                  <Toggle
                    checked={draft.goals.avoidWeekends}
                    onChange={(value) => updateGoal({ avoidWeekends: value })}
                    label="尽量保留周末休息"
                  />
                </div>

                <label className="field top-gap">
                  <span>你的参赛动机 <small>选填，但会让推荐理由更懂你</small></span>
                  <textarea
                    rows={3}
                    value={draft.goals.motivation}
                    onChange={(event) => updateGoal({ motivation: event.target.value })}
                    placeholder="例如：希望在网络安全方向积累真实项目与竞赛成果，为保研和实习做准备。"
                  />
                </label>
              </section>
            )}
          </div>

          {error && <div className="wizard-error">{error}</div>}
          <div className="wizard-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => (step === 0 ? null : setStep(step - 1))}
              disabled={step === 0}
            >
              <ArrowLeft size={16} />
              上一步
            </button>
            <div className="wizard-footer-side">
              <span>已完成 {step} / 4</span>
              <button type="button" className="btn btn-primary" onClick={goNext}>
                {step === STEPS.length - 1 ? (
                  <>
                    <Sparkles size={16} />
                    生成我的 AI 画像
                  </>
                ) : (
                  <>
                    继续
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {generating && (
          <div className="profile-generating">
            <div className="generating-orbit">
              <div />
              <div />
              <div />
              <Logo size={52} />
              <LoaderCircle size={96} className="generating-spinner" />
            </div>
            <h3>正在生成你的竞赛画像</h3>
            <p>提取专业方向 · 评估能力结构 · 对齐目标偏好</p>
          </div>
        )}
      </main>
    </div>
  );
}
