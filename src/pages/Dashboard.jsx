import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Check,
  CircleAlert,
  Clock3,
  Compass,
  Route,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  UserRound,
} from 'lucide-react';
import {
  CategoryBadge,
  ProgressBar,
  RadarChart,
  ScoreBars,
  ScoreRing,
  SourceNotice,
} from '../components/ui';
import { RecommendationCard } from '../components/CompetitionCard';
import { buildDashboardInsight } from '../lib/matcher';
import { buildPreparationPlan } from '../lib/planner';
import { SKILLS, GOAL_DIRECTIONS } from '../data/profile';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了';
  if (hour < 11) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

function StatCard({ icon: Icon, label, value, suffix, hint, tone = 'blue' }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <span className="stat-icon"><Icon size={18} /></span>
      <div>
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}<em>{suffix}</em></strong>
      </div>
      <span className="stat-hint">{hint}</span>
    </div>
  );
}

export default function Dashboard({
  profile,
  ranked,
  topRecommendations,
  conflicts,
  favorites,
  onToggleFavorite,
  onOpenCompetition,
  onNavigate,
  onOpenPlan,
}) {
  const top = topRecommendations[0];
  const insight = buildDashboardInsight(profile, topRecommendations);
  const topPlan = top ? buildPreparationPlan(top, top, profile) : null;
  const radarValues = SKILLS.map((skill) => ({
    name: skill.short,
    value: Number(profile.skills?.[skill.id] || 0),
  }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const conflictPreview = conflicts.slice(0, 2);

  return (
    <div className="page dashboard-page">
      <section className="dashboard-hero">
        <div className="hero-grid-texture" aria-hidden="true" />
        <div className="hero-glow hero-glow-a" aria-hidden="true" />
        <div className="hero-glow hero-glow-b" aria-hidden="true" />
        <div className="hero-main">
          <span className="hero-eyebrow">
            <Sparkles size={14} />
            {greeting()}，{profile.name}
          </span>
          <h2>
            把下一个学期，
            <br />
            变成一次<span>有准备的冲刺。</span>
          </h2>
          <p>
            {insight?.headline || `已读取你的「${profile.major}」画像`}
            {insight?.body ? `。${insight.body}` : '，开始匹配最适合你的竞赛。'}
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => onNavigate('discover')}>
              <Sparkles size={16} />
              开始智能匹配
            </button>
            <button type="button" className="btn btn-hero-ghost" onClick={() => onNavigate('profile')}>
              <UserRound size={16} />
              查看我的画像
            </button>
          </div>
          <div className="hero-strengths">
            <span>优势能力</span>
            {(insight?.strongest || []).slice(0, 3).map((skill) => (
              <em key={skill.id}>{skill.name} · Lv.{skill.level}</em>
            ))}
          </div>
        </div>

        <div className="hero-focus">
          <div className="hero-focus-head">
            <span>本轮最值得关注</span>
            {top && <em className="hero-rank">TOP 01</em>}
          </div>
          {top ? (
            <>
              <div className="hero-focus-main">
                <ScoreRing value={top.total} size={104} strokeWidth={8} label={top.matchLevel} />
                <div className="hero-focus-copy">
                  <CategoryBadge meta={top.categoryMeta} small />
                  <h3>{top.short}</h3>
                  <p>{top.name}</p>
                  <span className={`strategy-pill strategy-${top.strategy?.tone || 'neutral'}`}>
                    {top.strategy?.label}
                  </span>
                </div>
              </div>
              <ScoreBars breakdown={top.breakdown} compact />
              <button type="button" className="hero-focus-link" onClick={() => onOpenCompetition(top)}>
                查看完整匹配报告
                <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <div className="hero-focus-empty">
              <Trophy size={24} />
              <p>完成目标方向设置后，这里会出现你的首推赛事。</p>
            </div>
          )}
        </div>
      </section>

      <div className="stat-strip">
        <StatCard
          icon={Target}
          label="匹配赛事"
          value={ranked.counts.matched}
          suffix="项"
          hint={`数据库共 ${ranked.counts.total} 项`}
          tone="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="高度匹配"
          value={ranked.counts.strong}
          suffix="项"
          hint="综合指数 ≥ 80"
          tone="teal"
        />
        <StatCard
          icon={CalendarClock}
          label="课程冲突"
          value={conflicts.length}
          suffix="处"
          hint={conflicts.length ? '需要优先协调' : '当前无重叠'}
          tone={conflicts.length ? 'amber' : 'green'}
        />
        <StatCard
          icon={UserRound}
          label="画像完整度"
          value={ranked.profileCompletion}
          suffix="%"
          hint={ranked.profileCompletion >= 80 ? '画像信息充足' : '继续补充更准确'}
          tone="navy"
        />
      </div>

      {profile.isDemo && (
        <div className="demo-notice">
          <span className="demo-badge">示例画像</span>
          <p>当前使用「林知夏 · 网络工程」示例数据演示完整流程，可在我的画像中编辑为你的真实信息。</p>
          <button type="button" className="text-link" onClick={() => onNavigate('profile')}>
            去编辑
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-left">
          <section className="panel">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">PERSONALIZED PICKS</span>
                <h2>为你优先推荐</h2>
                <p>按 30% 专业 · 30% 能力 · 20% 时间 · 10% 资格 · 10% 发展综合排序</p>
              </div>
              <button type="button" className="text-link" onClick={() => onNavigate('discover')}>
                查看全部 {ranked.counts.matched} 项
                <ArrowRight size={15} />
              </button>
            </div>
            <div className="recommend-list">
              {topRecommendations.slice(0, 2).map((item, index) => (
                <RecommendationCard
                  key={item.id}
                  item={item}
                  index={index}
                  onOpen={onOpenCompetition}
                  favorite={favorites.includes(item.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
              {!topRecommendations.length && (
                <div className="inline-empty large">暂时没有达到阈值的推荐，尝试放宽时间窗口或补充能力信息。</div>
              )}
            </div>
          </section>

          {top && topPlan && (
            <section className="panel plan-preview">
              <div className="section-head">
                <div>
                  <span className="section-eyebrow">PREPARATION ROUTE</span>
                  <h2>「{top.short}」备赛路线</h2>
                  <p>
                    {topPlan.totalWeeks} 周 · 每周约 {topPlan.weeklyHours} 小时 · 推荐赛道 {topPlan.track?.name || '综合主赛道'}
                  </p>
                </div>
                <button type="button" className="btn btn-outline btn-small" onClick={() => onOpenPlan(top.id)}>
                  <Route size={15} />
                  打开备赛计划
                </button>
              </div>
              <div className="phase-mini-list">
                {topPlan.phases.map((phase, index) => (
                  <div className="phase-mini" key={phase.name}>
                    <div className="phase-mini-head">
                      <span className="phase-mini-index">{String(index + 1).padStart(2, '0')}</span>
                      <strong>{phase.name}</strong>
                      <em>{phase.rangeLabel}</em>
                    </div>
                    <p>{phase.goal}</p>
                    <div className="phase-mini-bar">
                      <span style={{ width: `${(index + 1) * 25}%`, background: phase.accent }} />
                    </div>
                    <small>{phase.output}</small>
                  </div>
                ))}
              </div>
              <div className="week-focus-row">
                <span className="week-focus-icon"><Clock3 size={16} /></span>
                <div>
                  <strong>本周先做这件事</strong>
                  <p>{topPlan.weeklyPlan[0]?.focus}</p>
                </div>
                <div className="week-slot">
                  {topPlan.weeklySlots[0]?.dayLabel} {topPlan.weeklySlots[0]?.start}–{topPlan.weeklySlots[0]?.end}
                </div>
              </div>
            </section>
          )}
        </div>

        <aside className="dashboard-side">
          <section className="insight-card">
            <div className="insight-head">
              <span className="insight-icon"><Sparkles size={17} /></span>
              <span>AI 洞察</span>
              <em>端侧生成</em>
            </div>
            <h3>{insight?.headline}</h3>
            <p>{insight?.body}</p>
            <div className="insight-tags">
              {(profile.goals.directions || []).slice(0, 3).map((direction) => (
                <span key={direction}>
                  {GOAL_DIRECTIONS.find((item) => item.id === direction)?.name || direction}
                </span>
              ))}
            </div>
            {top && (
              <div className="insight-topline">
                <div>
                  <span>当前首推</span>
                  <strong>{top.short}</strong>
                </div>
                <div className="insight-score">{Math.round(top.total)}<em>R</em></div>
              </div>
            )}
            <button type="button" className="insight-link" onClick={() => onNavigate('discover')}>
              让 AI 重新评估
              <ArrowUpRight size={15} />
            </button>
          </section>

          <section className="panel conflict-panel">
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">TIME CHECK</span>
                <h3>课程冲突提醒</h3>
              </div>
              <button type="button" className="icon-button subtle" onClick={() => onNavigate('schedule')} aria-label="查看全部冲突">
                <ArrowRight size={16} />
              </button>
            </div>
            {conflictPreview.length ? (
              <div className="mini-conflict-list">
                {conflictPreview.map((conflict) => (
                  <div className="mini-conflict" key={`${conflict.eventId}-${conflict.courseName}`}>
                    <span className="mini-conflict-icon"><CircleAlert size={15} /></span>
                    <div>
                      <strong>{conflict.courseName}</strong>
                      <p>{conflict.eventTitle}</p>
                      <span>{conflict.date} · 重叠 {conflict.overlap}</span>
                    </div>
                  </div>
                ))}
                <button type="button" className="text-link" onClick={() => onNavigate('schedule')}>
                  查看冲突协调建议
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="conflict-clear">
                <span><Check size={16} /></span>
                <div>
                  <strong>暂无时间重叠</strong>
                  <p>已登记赛程与课程表没有直接冲突。</p>
                </div>
              </div>
            )}
          </section>

          <section className="panel radar-panel">
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">CAPABILITY MAP</span>
                <h3>能力雷达</h3>
              </div>
              <span className="radar-scale">1–5 级</span>
            </div>
            <RadarChart values={radarValues} size={266} />
            <div className="radar-legend">
              {radarValues.slice(0, 3).map((skill) => (
                <span key={skill.name}>
                  {skill.name}
                  <em>{skill.value}/5</em>
                </span>
              ))}
            </div>
          </section>

          <button type="button" className="directory-cta" onClick={() => onNavigate('directory')}>
            <span className="directory-cta-icon"><Compass size={20} /></span>
            <div>
              <strong>浏览 84 项赛事库</strong>
              <span>按 10 大类别自由探索</span>
            </div>
            <ArrowRight size={17} />
          </button>
        </aside>
      </div>

      {top && (
        <section className="panel favorites-note">
          <div className="favorites-note-mark"><Trophy size={18} /></div>
          <div>
            <strong>把推荐变成行动</strong>
            <p>
              你已收藏 {favorites.length} 项赛事。先锁定 {top.season.split(' · ')[0]} 的报名窗口，再按备赛计划推进，比临赛前突击更有效。
            </p>
          </div>
          <button type="button" className="btn btn-outline btn-small" onClick={() => onNavigate('plan')}>
            进入备赛计划
            <ArrowRight size={15} />
          </button>
        </section>
      )}

      <SourceNotice />
    </div>
  );
}
