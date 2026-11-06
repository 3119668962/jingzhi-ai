import React from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  CalendarClock,
  Check,
  CircleAlert,
  Database,
  Edit3,
  FolderLock,
  GraduationCap,
  LockKeyhole,
  MapPin,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserRound,
} from 'lucide-react';
import {
  CategoryIcon,
  ProgressBar,
  RadarChart,
  ScoreRing,
  SourceNotice,
} from '../components/ui';
import {
  GOAL_DIRECTIONS,
  SKILLS,
  SKILL_LEVELS,
  WEEKDAY_LABELS,
  getMajorGroup,
  getProfileCompletion,
} from '../data/profile';

const toMinutes = (time) => {
  const [hour, minute] = String(time || '0:0').split(':').map(Number);
  return hour * 60 + minute;
};

function completionChecklist(profile) {
  return [
    { label: '基础信息与专业', done: Boolean(profile.name && profile.school && profile.major) },
    {
      label: '能力自评',
      done: Object.values(profile.skills || {}).filter((level) => Number(level) > 0).length >= 10,
    },
    { label: '证书或竞赛经历', done: Boolean(profile.certificates?.length || profile.experiences?.length) },
    { label: '课程时间表', done: Boolean(profile.courses?.length) },
    { label: '目标与时间偏好', done: Boolean(profile.goals?.directions?.length && profile.goals?.months?.length) },
  ];
}

export default function Profile({
  profile,
  settings,
  ranked,
  favorites,
  events,
  appInfo,
  onEdit,
  onNavigate,
  onOpenSettings,
}) {
  const completion = getProfileCompletion(profile);
  const group = getMajorGroup(profile.major);
  const skillGroups = [...new Set(SKILLS.map((skill) => skill.group))];
  const radarValues = SKILLS.map((skill) => ({
    name: skill.short,
    value: Number(profile.skills?.[skill.id] || 0),
  }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
  const directions = (profile.goals?.directions || [])
    .map((id) => GOAL_DIRECTIONS.find((direction) => direction.id === id))
    .filter(Boolean);
  const sortedCourses = [...(profile.courses || [])].sort(
    (a, b) => Number(a.day) - Number(b.day) || a.start.localeCompare(b.start),
  );
  const weeklyHours = (profile.courses || []).reduce(
    (sum, course) => sum + Math.max(0, toMinutes(course.end) - toMinutes(course.start)) / 60,
    0,
  );
  const strongest = [...SKILLS]
    .map((skill) => ({ ...skill, level: Number(profile.skills?.[skill.id] || 0) }))
    .sort((a, b) => b.level - a.level)
    .slice(0, 3);
  const checklist = completionChecklist(profile);
  const engineLabel = settings?.aiEnabled && settings?.hasAiKey ? '大模型增强引擎' : '端侧智能匹配引擎';

  return (
    <div className="page profile-page">
      {profile.isDemo && (
        <div className="demo-notice">
          <span className="demo-badge">示例画像</span>
          <p>当前为「林知夏 · 网络工程」示例数据，可点击编辑替换成你的真实信息，推荐结果会立即刷新。</p>
          <button type="button" className="text-link" onClick={onEdit}>
            编辑为我的信息
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      <section className="profile-hero">
        <div className="profile-hero-main">
          <span className="avatar is-large">{String(profile.name || '同学').slice(-2)}</span>
          <div className="profile-hero-copy">
            <div className="profile-tags">
              <span>{profile.degree}</span>
              <span>{profile.grade}</span>
              <span>{group.label}</span>
              {profile.isDemo && <em>示例数据</em>}
            </div>
            <h2>{profile.name}</h2>
            <p>
              <GraduationCap size={15} />
              {profile.school} · {profile.major}
              {profile.className ? ` · ${profile.className}` : ''}
            </p>
            <div className="profile-strength-row">
              <span>优势能力</span>
              {strongest.map((skill) => (
                <em key={skill.id}>{skill.name} <i>Lv.{skill.level}</i></em>
              ))}
            </div>
          </div>
          <div className="profile-hero-actions">
            <button type="button" className="btn btn-primary" onClick={onEdit}>
              <Edit3 size={15} />
              编辑画像
            </button>
            <button type="button" className="btn btn-outline" onClick={() => onNavigate('discover')}>
              <Sparkles size={15} />
              重新匹配
            </button>
          </div>
        </div>
        <div className="profile-completion">
          <ScoreRing value={completion} size={104} strokeWidth={8} label="画像完整度" tone="teal" />
          <div className="completion-copy">
            <strong>{completion >= 80 ? '画像信息充足' : '还可以更完整'}</strong>
            <p>信息越完整，专业、能力与时间的判断越准确。</p>
            <div className="completion-checks">
              {checklist.map((item) => (
                <span className={item.done ? 'is-done' : ''} key={item.label}>
                  {item.done ? <Check size={11} /> : <span className="completion-dot" />}
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="profile-stat-row">
        <div><Award size={17} /><strong>{profile.certificates?.length || 0}</strong><span>证书</span></div>
        <div><BookOpen size={17} /><strong>{profile.experiences?.length || 0}</strong><span>竞赛经历</span></div>
        <div><CalendarDays size={17} /><strong>{profile.courses?.length || 0}</strong><span>门课程</span></div>
        <div><Star size={17} /><strong>{favorites.length}</strong><span>收藏赛事</span></div>
        <div><CalendarClock size={17} /><strong>{events.length}</strong><span>已登记赛程</span></div>
      </div>

      <div className="profile-layout">
        <div className="profile-main">
          <section className="panel profile-section">
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">BASIC PROFILE</span>
                <h3>基础信息</h3>
              </div>
              <button type="button" className="text-link" onClick={onEdit}>
                修改
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="basic-info-grid">
              <div><span>姓名 / 昵称</span><strong>{profile.name || '未填写'}</strong></div>
              <div><span>所在学校</span><strong>{profile.school || '未填写'}</strong></div>
              <div><span>就读专业</span><strong>{profile.major || '未填写'}</strong></div>
              <div><span>专业族群</span><strong>{group.label}</strong></div>
              <div><span>培养层次</span><strong>{profile.degree}</strong></div>
              <div><span>当前年级</span><strong>{profile.grade}</strong></div>
            </div>
          </section>

          <section className="panel profile-section">
            <div className="section-head compact">
              <div>
                <span className="section-eyebrow">CAPABILITY PROFILE</span>
                <h2>能力画像</h2>
                <p>按 17 个能力维度评估，1 级为入门，5 级为专家。</p>
              </div>
              <button type="button" className="btn btn-outline btn-small" onClick={onEdit}>
                <Edit3 size={14} />
                更新能力
              </button>
            </div>
            <div className="profile-skills-layout">
              <div className="profile-radar">
                <RadarChart values={radarValues} size={282} />
                <span className="radar-caption">雷达展示得分最高的 8 项能力</span>
              </div>
              <div className="profile-skill-groups">
                {skillGroups.map((skillGroup) => (
                  <div className="profile-skill-group" key={skillGroup}>
                    <span className="profile-skill-group-label">{skillGroup}</span>
                    <div className="profile-skill-list">
                      {SKILLS.filter((skill) => skill.group === skillGroup).map((skill) => {
                        const level = Number(profile.skills?.[skill.id] || 0);
                        return (
                          <div className="profile-skill-row" key={skill.id}>
                            <strong>{skill.name}</strong>
                            <div className="level-dots is-readonly">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <span className={level >= value ? 'is-filled' : ''} key={value} />
                              ))}
                            </div>
                            <em>{SKILL_LEVELS.find((item) => item.value === level)?.label || '未填写'}</em>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="profile-two-column">
            <section className="panel profile-section">
              <div className="compact-head">
                <div>
                  <span className="section-eyebrow">CERTIFICATES</span>
                  <h3>证书</h3>
                </div>
                <span className="count-chip">{profile.certificates?.length || 0}</span>
              </div>
              {profile.certificates?.length ? (
                <div className="cert-list">
                  {profile.certificates.map((cert) => (
                    <div className="cert-row" key={cert.id}>
                      <span className="cert-icon"><ShieldCheck size={16} /></span>
                      <div>
                        <strong>{cert.name}</strong>
                        <span>{[cert.level, cert.date, cert.issuer].filter(Boolean).join(' · ') || '已获得'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="inline-empty">暂无证书信息，可在编辑画像时补充。</div>
              )}
            </section>

            <section className="panel profile-section">
              <div className="compact-head">
                <div>
                  <span className="section-eyebrow">EXPERIENCE</span>
                  <h3>竞赛经历</h3>
                </div>
                <span className="count-chip">{profile.experiences?.length || 0}</span>
              </div>
              {profile.experiences?.length ? (
                <div className="experience-list">
                  {profile.experiences.map((experience) => (
                    <div className="experience-row" key={experience.id}>
                      <span className="experience-dot" />
                      <div>
                        <strong>{experience.name}</strong>
                        <span>{[experience.award, experience.year, experience.track].filter(Boolean).join(' · ') || '参与经历'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="inline-empty">暂无竞赛经历，系统会更多参考能力与潜力维度。</div>
              )}
            </section>
          </div>

          <section className="panel profile-section">
            <div className="section-head compact">
              <div>
                <span className="section-eyebrow">TIMETABLE</span>
                <h2>课程时间表</h2>
                <p>{profile.courses?.length || 0} 门课程 · 每周约 {weeklyHours.toFixed(1)} 小时 · 用于冲突检测与训练避让</p>
              </div>
              <button type="button" className="btn btn-outline btn-small" onClick={onEdit}>
                <CalendarDays size={14} />
                管理课程
              </button>
            </div>
            {sortedCourses.length ? (
              <div className="profile-course-table">
                <div className="profile-course-head">
                  <span>课程</span>
                  <span>星期 / 时间</span>
                  <span>地点</span>
                  <span>类型</span>
                </div>
                {sortedCourses.map((course) => (
                  <div className="profile-course-row" key={course.id}>
                    <strong>{course.name}</strong>
                    <span>{WEEKDAY_LABELS[course.day - 1]} · {course.start}–{course.end}</span>
                    <span>{course.location || '未填写'}</span>
                    <span>{course.type || '课程'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="inline-empty large">暂无课程。补充课程表后才能进行精准的冲突检测。</div>
            )}
          </section>
        </div>

        <aside className="profile-side">
          <section className="panel goal-card">
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">GOALS</span>
                <h3>目标与偏好</h3>
              </div>
              <Target size={17} />
            </div>
            <div className="goal-direction-chips">
              {directions.length ? (
                directions.map((direction) => <span key={direction.id}>{direction.name}</span>)
              ) : (
                <em className="goal-missing">尚未选择目标方向</em>
              )}
            </div>
            <div className="goal-detail-list">
              <div><span>目标等级</span><strong>{profile.goals?.targetLevel || '未设置'}</strong></div>
              <div>
                <span>期望参赛时间</span>
                <strong>
                  {profile.goals?.months?.[0]} 月 – {profile.goals?.months?.[1]} 月
                </strong>
              </div>
              <div><span>每周可投入</span><strong>{profile.goals?.weeklyHours || 0} 小时</strong></div>
              <div><span>周末安排</span><strong>{profile.goals?.avoidWeekends ? '尽量保留休息' : '可安排训练'}</strong></div>
            </div>
            {profile.goals?.motivation && (
              <blockquote className="motivation-quote">“{profile.goals.motivation}”</blockquote>
            )}
          </section>

          <section className="panel data-card">
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">LOCAL FIRST</span>
                <h3>数据与引擎</h3>
              </div>
              <LockKeyhole size={17} />
            </div>
            <div className="data-status-row">
              <span className="data-status-icon"><Database size={15} /></span>
              <div>
                <strong>{engineLabel}</strong>
                <span>{settings?.aiEnabled && settings?.hasAiKey ? `模型 ${settings.aiModel}` : '无需密钥，本地即可完整运行'}</span>
              </div>
            </div>
            <div className="data-path-box">
              <span>数据目录</span>
              <strong>{appInfo?.dataDir || '本机竞智AI/data'}</strong>
            </div>
            <div className="data-privacy-row">
              <FolderLock size={14} />
              画像与课程表只保存在本机，不随网络核验上传。
            </div>
            {onOpenSettings && (
              <button type="button" className="btn btn-outline btn-small btn-block" onClick={onOpenSettings}>
                <Settings size={14} />
                打开设置
              </button>
            )}
          </section>

          <section className="profile-next-card">
            <span className="profile-next-mark"><Sparkles size={18} /></span>
            <h3>{ranked?.counts.matched || 0} 项赛事正在等你的下一步</h3>
            <p>画像更新后，推荐指数与备赛路线会立即重新计算。先看看最新匹配结果。</p>
            <button type="button" className="btn btn-light btn-block" onClick={() => onNavigate('discover')}>
              查看智能推荐
              <ArrowRight size={15} />
            </button>
            <button type="button" className="side-action-ghost" onClick={() => onNavigate('plan')}>
              <CalendarClock size={14} />
              继续备赛计划
            </button>
          </section>

          <section className="panel mini-source-card">
            <SourceNotice compact />
          </section>
        </aside>
      </div>
    </div>
  );
}
