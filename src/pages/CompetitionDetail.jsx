import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  CalendarPlus,
  Check,
  CircleAlert,
  CircleDashed,
  Clock3,
  ExternalLink,
  Flag,
  Info,
  Layers,
  MapPin,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import {
  CategoryBadge,
  CategoryIcon,
  ProgressBar,
  ScoreRing,
  SourceNotice,
} from '../components/ui';
import { buildPreparationPlan } from '../lib/planner';
import { SKILLS, SKILL_LEVELS } from '../data/profile';

const DIMENSION_ICONS = {
  major: Building2,
  ability: Target,
  time: CalendarDays,
  qualification: ShieldCheck,
  value: TrendingUp,
};

const REASON_ICONS = {
  target: Target,
  spark: Sparkles,
  calendar: CalendarDays,
  trend: TrendingUp,
};

const DETAIL_META = [
  { key: 'registration', label: '报名节奏', icon: CalendarDays },
  { key: 'season', label: '赛事窗口', icon: Clock3 },
  { key: 'team', label: '参赛形式', icon: Users },
  { key: 'mode', label: '组织方式', icon: MapPin },
];

function SkillPill({ skill }) {
  return <span className="skill-pill">{skill}</span>;
}

export default function CompetitionDetail({
  item,
  profile,
  favorite,
  onToggleFavorite,
  onBack,
  onOpenPlan,
  onOpenSchedule,
  onOpenExternal,
  planProgress = {},
}) {
  const plan = buildPreparationPlan(item, item, profile);
  const totalTasks = plan.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const doneTasks = plan.phases.reduce(
    (sum, phase) =>
      sum + phase.tasks.filter((_, taskIndex) => planProgress[`p${phase.index}-t${taskIndex}`]).length,
    0,
  );
  const progressRatio = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const dimensionNotes = {
    major: item.scoreDetails.major.note,
    ability: item.scoreDetails.ability.note,
    time: item.scoreDetails.time.note,
    qualification: item.scoreDetails.qualification.note,
    value: item.scoreDetails.value.note,
  };
  const difficulty = Math.round(Number(item.difficulty) || 0);

  return (
    <div className="page detail-page">
      <div className="detail-toolbar">
        <button type="button" className="back-link" onClick={onBack}>
          <ArrowLeft size={16} />
          返回上一页
        </button>
        <div className="detail-toolbar-actions">
          <span className="catalog-mark">目录第 {String(item.no).padStart(2, '0')} 项</span>
          <button
            type="button"
            className={`favorite-button is-labelled ${favorite ? 'is-favorite' : ''}`}
            onClick={() => onToggleFavorite(item.id)}
          >
            <Star size={16} fill={favorite ? 'currentColor' : 'none'} />
            {favorite ? '已收藏' : '收藏'}
          </button>
        </div>
      </div>

      <section className="detail-hero">
        <div className="detail-hero-main">
          <div className="detail-identity">
            <div className="competition-icon is-large" style={{ color: item.categoryMeta.accent, background: item.categoryMeta.soft }}>
              <CategoryIcon category={item.category} size={28} />
            </div>
            <div>
              <div className="title-badges">
                <CategoryBadge meta={item.categoryMeta} />
                <span className={`strategy-pill strategy-${item.strategy?.tone || 'neutral'}`}>
                  {item.strategy?.label}
                </span>
                {item.conflicts.length > 0 && (
                  <span className="soft-danger-pill"><CircleAlert size={12} /> 时间冲突</span>
                )}
              </div>
              <h1>{item.name}</h1>
              <p className="detail-subtitle">
                {item.short} · 主办方 {item.organizer}
              </p>
            </div>
          </div>
          <p className="detail-intro">{item.intro}</p>
          <div className="tag-row">
            {item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
            <span className="tag tag-ghost">{item.fieldsText}</span>
          </div>
          <div className="detail-meta-grid">
            {DETAIL_META.map((meta) => {
              const Icon = meta.icon;
              return (
                <div className="detail-meta" key={meta.key}>
                  <span><Icon size={15} /></span>
                  <div>
                    <em>{meta.label}</em>
                    <strong>{item[meta.key]}</strong>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="detail-hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => onOpenPlan(item.id)}>
              <Route size={16} />
              生成备赛计划
            </button>
            <button type="button" className="btn btn-outline" onClick={onOpenSchedule}>
              <CalendarPlus size={16} />
              登记我的赛程
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => item.website && onOpenExternal(item.website)}
              disabled={!item.website}
              title={item.website ? '打开赛事官网' : item.contact || '暂无公开官网'}
            >
              <ExternalLink size={16} />
              {item.website ? '访问官网' : '暂无官网'}
            </button>
          </div>
        </div>

        <div className="detail-score-card">
          <span className="detail-score-label">综合推荐指数</span>
          <ScoreRing value={item.total} size={138} strokeWidth={9} label={item.matchLevel} />
          <p className="detail-score-formula">R = 30% 专业 + 30% 能力 + 20% 时间 + 10% 资格 + 10% 发展</p>
          <div className="detail-score-mini">
            {item.breakdown.map((entry) => (
              <div key={entry.key}>
                <span>{entry.label}</span>
                <strong>{Math.round(entry.score)}</strong>
                <em>×{Math.round(entry.weight * 100)}%</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="detail-layout">
        <div className="detail-main">
          <section className="panel detail-section">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">WHY THIS MATCH</span>
                <h2>为什么推荐给你</h2>
                <p>四条判断来自你的专业、能力、时间与目标，而不是笼统的热门排行。</p>
              </div>
              <span className="match-level-mark">{item.matchLevel} · {Math.round(item.total)}</span>
            </div>
            <div className="reason-grid">
              {item.reasons.map((reason) => {
                const Icon = REASON_ICONS[reason.icon] || Sparkles;
                return (
                  <article className="reason-card" key={reason.title}>
                    <span className="reason-card-icon"><Icon size={17} /></span>
                    <strong>{reason.title}</strong>
                    <p>{reason.text}</p>
                  </article>
                );
              })}
            </div>
            {item.cautions.length > 0 && (
              <div className="caution-box">
                <span className="caution-box-icon"><CircleAlert size={17} /></span>
                <div>
                  <strong>需要提前确认</strong>
                  <ul>
                    {item.cautions.map((caution) => <li key={caution}>{caution}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </section>

          <section className="panel detail-section">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">SCORE BREAKDOWN</span>
                <h2>五维评分拆解</h2>
                <p>每一维度的得分与实际贡献，方便你判断短板应该补在哪里。</p>
              </div>
            </div>
            <div className="dimension-list">
              {item.breakdown.map((entry) => {
                const Icon = DIMENSION_ICONS[entry.key] || Target;
                return (
                  <div className="dimension-row" key={entry.key}>
                    <span className="dimension-icon"><Icon size={18} /></span>
                    <div className="dimension-main">
                      <div className="dimension-head">
                        <strong>{entry.label}</strong>
                        <span>权重 {Math.round(entry.weight * 100)}%</span>
                      </div>
                      <ProgressBar value={entry.score} height={7} accent={entry.key === 'major' ? '#2C6BED' : entry.key === 'ability' ? '#0E9F8F' : entry.key === 'time' ? '#DD8525' : entry.key === 'qualification' ? '#8664E8' : '#18A878'} />
                      <p>{dimensionNotes[entry.key]}</p>
                    </div>
                    <div className="dimension-score">
                      <strong>{Math.round(entry.score)}</strong>
                      <span>贡献 +{entry.contribution.toFixed(1)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel detail-section">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">ABILITY FIT</span>
                <h2>能力结构与差距</h2>
                <p>按赛项能力要求加权计算，证书与过往经历会带来额外加分。</p>
              </div>
              <span className="ability-boost">
                <Award size={14} />
                证书/经历加分 +{item.scoreDetails.ability.boost}
              </span>
            </div>
            <div className="ability-columns">
              <div>
                <h3 className="mini-section-title"><Check size={15} /> 已具备的能力</h3>
                <div className="ability-list">
                  {item.scoreDetails.ability.matched.slice(0, 6).map((skill) => (
                    <div className="ability-row" key={skill.id}>
                      <div>
                        <strong>{skill.name}</strong>
                        <span>{SKILL_LEVELS.find((level) => level.value === skill.level)?.label || '未填写'} · 要求 Lv.{skill.required}</span>
                      </div>
                      <div className="ability-meter">
                        <ProgressBar value={(skill.level / 5) * 100} height={6} accent="#0E9F8F" />
                        <em>{skill.level}/5</em>
                      </div>
                    </div>
                  ))}
                  {!item.scoreDetails.ability.matched.length && (
                    <div className="inline-empty">暂未发现明显达标的赛项能力，建议从基础项开始补强。</div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="mini-section-title is-warning"><CircleDashed size={15} /> 建议补齐的差距</h3>
                <div className="ability-list">
                  {item.scoreDetails.ability.gaps.slice(0, 6).map((skill) => (
                    <div className="ability-row" key={skill.id}>
                      <div>
                        <strong>{skill.name}</strong>
                        <span>当前 Lv.{skill.level || 0} · 建议 Lv.{skill.required}</span>
                      </div>
                      <div className="ability-meter">
                        <ProgressBar value={(skill.level / 5) * 100} height={6} accent="#DD8525" />
                        <em>{skill.level}/5</em>
                      </div>
                    </div>
                  ))}
                  {!item.scoreDetails.ability.gaps.length && (
                    <div className="ability-done">
                      <Check size={16} />
                      核心能力项均已达到赛项要求。
                    </div>
                  )}
                </div>
              </div>
            </div>
            {item.scoreDetails.ability.matchedCerts.length > 0 && (
              <div className="matched-certs">
                <ShieldCheck size={15} />
                已识别证书优势：{item.scoreDetails.ability.matchedCerts.join('、')}
              </div>
            )}
          </section>

          <section className="panel detail-section">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">TRACK RECOMMENDATION</span>
                <h2>推荐赛道</h2>
                <p>AI 结合你的能力结构与目标方向，对赛事方向进行适配度排序。</p>
              </div>
              <span className="ai-suggest-mark"><Sparkles size={13} /> AI 建议方向</span>
            </div>
            <div className="track-grid">
              {item.tracks.map((track, index) => (
                <article className={`track-card ${index === 0 ? 'is-best' : ''}`} key={track.name}>
                  <div className="track-card-head">
                    <span className="track-rank">{index === 0 ? '首选' : `0${index + 1}`}</span>
                    <strong>{track.name}</strong>
                    {index === 0 && <span className="track-best-badge">最匹配</span>}
                  </div>
                  <p>{track.description}</p>
                  <div className="track-fit">
                    <span>适配度</span>
                    <ProgressBar value={track.fit} height={6} accent={index === 0 ? '#2C6BED' : '#B8C6DA'} />
                    <strong>{track.fit}</strong>
                  </div>
                  <div className="tag-row">
                    {track.skills.map((skill) => <SkillPill key={skill} skill={SKILLS.find((entry) => entry.id === skill)?.name || skill} />)}
                  </div>
                </article>
              ))}
            </div>
            <p className="track-disclaimer">以上为基于画像的 AI 建议方向，不代表赛事官方设置的具体赛道，请以官网赛项说明为准。</p>
          </section>

          <section className="panel detail-section">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">PREPARATION PREVIEW</span>
                <h2>四周段备赛路线</h2>
                <p>{plan.totalWeeks} 周 · 每周约 {plan.weeklyHours} 小时 · 累计约 {plan.totalHours} 小时</p>
              </div>
              <button type="button" className="btn btn-outline btn-small" onClick={() => onOpenPlan(item.id)}>
                <Route size={15} />
                打开完整计划
              </button>
            </div>
            <div className="detail-plan-progress">
              <div>
                <span>当前完成度</span>
                <strong>{doneTasks} / {totalTasks} 项任务</strong>
              </div>
              <ProgressBar value={progressRatio} height={7} accent="#2C6BED" />
              <em>{progressRatio}%</em>
            </div>
            <div className="detail-phase-grid">
              {plan.phases.map((phase, index) => (
                <article className="detail-phase" key={phase.name}>
                  <div className="detail-phase-head">
                    <span className="detail-phase-index" style={{ background: phase.accent }}>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{phase.name}</strong>
                      <em>{phase.rangeLabel}</em>
                    </div>
                  </div>
                  <ul>
                    {phase.tasks.slice(0, 2).map((task, taskIndex) => {
                      const done = Boolean(planProgress[`p${phase.index}-t${taskIndex}`]);
                      return (
                        <li className={done ? 'is-done' : ''} key={task}>
                          {done ? <Check size={12} /> : <span className="phase-task-dot" />}
                          {task}
                        </li>
                      );
                    })}
                  </ul>
                </article>
              ))}
            </div>
            <div className="detail-slot-row">
              <span className="detail-slot-label"><Clock3 size={14} /> 每周建议时段</span>
              {plan.weeklySlots.map((slot) => (
                <span className="detail-slot" key={slot.id}>
                  {slot.dayLabel} {slot.start}–{slot.end}
                </span>
              ))}
            </div>
          </section>

          <section className="panel detail-section">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">SCHEDULE & CONFLICT</span>
                <h2>赛程与课程冲突</h2>
                <p>仅基于你在「时间冲突」中登记的赛程进行检测。</p>
              </div>
              <button type="button" className="btn btn-ghost btn-small" onClick={onOpenSchedule}>
                <CalendarPlus size={15} />
                管理赛程
              </button>
            </div>
            {item.events.length ? (
              <div className="detail-event-list">
                {item.events.map((event) => {
                  const eventConflicts = item.conflicts.filter((conflict) => conflict.eventId === event.id);
                  return (
                    <div className="detail-event" key={event.id}>
                      <span className={`detail-event-icon ${eventConflicts.length ? 'is-danger' : ''}`}>
                        {eventConflicts.length ? <CircleAlert size={17} /> : <CalendarDays size={17} />}
                      </span>
                      <div>
                        <strong>{event.title}</strong>
                        <span>{event.date} · {event.start}–{event.end} · {event.location || '地点待确认'}</span>
                        {eventConflicts.length > 0 && (
                          <em>与《{eventConflicts[0].courseName}》重叠 {eventConflicts[0].overlap}，建议提前申请调课。</em>
                        )}
                      </div>
                      <span className={`event-state ${eventConflicts.length ? 'is-danger' : 'is-ok'}`}>
                        {eventConflicts.length ? '有冲突' : '无冲突'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-event-box">
                <span><CalendarDays size={20} /></span>
                <div>
                  <strong>还没有登记这项赛事的赛程</strong>
                  <p>登记具体的比赛日期与时段后，系统会自动检测与课程表的重叠，并同步调整时间匹配分。</p>
                </div>
                <button type="button" className="btn btn-outline btn-small" onClick={onOpenSchedule}>
                  去登记
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </section>

          <section className="panel detail-section">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">OFFICIAL INFORMATION</span>
                <h2>赛事信息与要求</h2>
                <p>以下为目录与往届公开信息的结构化整理，最终以官网当年通知为准。</p>
              </div>
            </div>
            <div className="info-grid">
              <article className="info-card">
                <span className="info-card-icon"><Trophy size={17} /></span>
                <h3>赛事定位</h3>
                <p>{item.description}</p>
              </article>
              <article className="info-card">
                <span className="info-card-icon is-teal"><Users size={17} /></span>
                <h3>参赛对象</h3>
                <p>{item.eligibility}</p>
              </article>
              <article className="info-card">
                <span className="info-card-icon is-amber"><BookOpen size={17} /></span>
                <h3>报名与材料要求</h3>
                <p>{item.requirements}</p>
              </article>
              <article className="info-card">
                <span className="info-card-icon is-purple"><Award size={17} /></span>
                <h3>发展价值</h3>
                <p>{item.scoreDetails.value.note}。赛事发展价值评分 {Math.round(item.development)}/100。</p>
              </article>
            </div>
            <div className="highlight-list">
              {item.highlights.map((highlight) => (
                <span key={highlight}><Check size={13} />{highlight}</span>
              ))}
            </div>
            <div className="official-contact">
              <div>
                <Info size={15} />
                <span>{item.timeNote}</span>
              </div>
              {item.contact && (
                <div>
                  <Info size={15} />
                  <span>{item.contact}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="detail-side">
          <section className="panel facts-card">
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">QUICK FACTS</span>
                <h3>关键事实</h3>
              </div>
              <CategoryBadge meta={item.categoryMeta} small />
            </div>
            <dl className="facts-list">
              <div><dt><CalendarDays size={14} /> 报名节奏</dt><dd>{item.registration}</dd></div>
              <div><dt><Clock3 size={14} /> 比赛窗口</dt><dd>{item.season.split(' · ')[1] || item.season}</dd></div>
              <div><dt><Users size={14} /> 组队方式</dt><dd>{item.team} · {item.format}</dd></div>
              <div><dt><MapPin size={14} /> 组织形式</dt><dd>{item.mode}</dd></div>
              <div><dt><Building2 size={14} /> 主办方</dt><dd>{item.organizer}</dd></div>
              <div><dt><Layers size={14} /> 专业范围</dt><dd>{item.fieldsText}</dd></div>
              <div><dt><Timer size={14} /> 建议备赛</dt><dd>{item.prepWeeks} 周左右</dd></div>
              <div>
                <dt><Flag size={14} /> 难度</dt>
                <dd className="difficulty-dots">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <i key={level} className={level <= difficulty ? 'is-on' : ''} />
                  ))}
                  <span>{item.difficulty}/5</span>
                </dd>
              </div>
            </dl>
          </section>

          <section className="side-action-card">
            <span className="side-action-mark"><Sparkles size={18} /></span>
            <h3>下一步怎么做？</h3>
            <p>先确认官网报名窗口，再把赛程登记进时间表，最后按四周段路线开始备赛。</p>
            <button type="button" className="btn btn-light btn-block" onClick={() => onOpenPlan(item.id)}>
              <Route size={15} />
              开始备赛规划
            </button>
            <button type="button" className="side-action-ghost" onClick={onOpenSchedule}>
              <CalendarPlus size={14} />
              先登记赛程
            </button>
          </section>

          <section className="panel website-card">
            <span className="section-eyebrow">OFFICIAL LINK</span>
            <h3>报名与通知入口</h3>
            {item.website ? (
              <>
                <p className="website-url">{item.website.replace(/^https?:\/\//, '')}</p>
                <button type="button" className="btn btn-outline btn-small btn-block" onClick={() => onOpenExternal(item.website)}>
                  <ExternalLink size={14} />
                  在浏览器中打开官网
                </button>
              </>
            ) : (
              <p className="website-missing">{item.contact || '该项赛事暂无公开官网，请通过学校通知获取报名入口。'}</p>
            )}
          </section>

          <SourceNotice compact />
        </aside>
      </div>
    </div>
  );
}
