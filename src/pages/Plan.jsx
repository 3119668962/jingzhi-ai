import React, { useMemo } from 'react';
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  CircleAlert,
  Clock3,
  Flag,
  Layers,
  Route,
  Search,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react';
import {
  CategoryBadge,
  CheckItem,
  EmptyState,
  ProgressBar,
  ScoreRing,
  SourceNotice,
} from '../components/ui';
import { buildPreparationPlan } from '../lib/planner';

const PHASE_ICONS = [Search, Target, Timer, Flag];

export default function Plan({
  evaluations,
  recommendations,
  selectedId,
  profile,
  planProgress,
  onSelect,
  onToggleTask,
  onOpenCompetition,
}) {
  const target =
    evaluations.find((item) => item.id === selectedId) ||
    recommendations[0] ||
    evaluations[0] ||
    null;

  const plan = useMemo(
    () => (target ? buildPreparationPlan(target, target, profile) : null),
    [target, profile],
  );

  if (!target || !plan) {
    return (
      <div className="page plan-page">
        <div className="panel">
          <EmptyState
            icon={Route}
            title="还没有可规划的赛事"
            description="先完成画像与智能匹配，选择一项推荐赛事后再生成备赛计划。"
          />
        </div>
      </div>
    );
  }

  const progressForTarget = planProgress[target.id] || {};
  const totalTasks = plan.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const doneTasks = plan.phases.reduce(
    (sum, phase) =>
      sum + phase.tasks.filter((_, index) => progressForTarget[`p${phase.index}-t${index}`]).length,
    0,
  );
  const completion = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="page plan-page">
      <section className="plan-hero panel">
        <div className="plan-hero-main">
          <div className="plan-target-labels">
            <CategoryBadge meta={target.categoryMeta} small />
            <span className={`strategy-pill strategy-${target.strategy?.tone || 'neutral'}`}>
              {target.strategy?.label}
            </span>
            <span className="plan-ai-label"><Sparkles size={12} /> AI 生成路线</span>
          </div>
          <h2>{target.name}</h2>
          <p>
            基于你的能力差距、课程表与每周可投入时间，生成一条 {plan.totalWeeks} 周的可执行路线。
            推荐主攻方向为「{plan.track?.name || '综合主赛道'}」。
          </p>
          <div className="plan-selector-row">
            <label className="plan-selector">
              <span>切换规划赛事</span>
              <div className="select-wrap">
                <select value={target.id} onChange={(event) => onSelect(event.target.value)}>
                  {evaluations.map((item) => (
                    <option value={item.id} key={item.id}>
                      R {Math.round(item.total)} · {item.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </div>
            </label>
            <button type="button" className="btn btn-outline btn-small" onClick={() => onOpenCompetition(target)}>
              查看匹配报告
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div className="plan-hero-score">
          <ScoreRing value={target.total} size={112} strokeWidth={8} label={target.matchLevel} />
          <div className="plan-hero-track">
            <span>首选赛道</span>
            <strong>{plan.track?.name || '综合主赛道'}</strong>
            <em>{plan.track?.fit || target.tracks[0]?.fit || 0}% 适配</em>
          </div>
          <div className="plan-hero-progress">
            <div>
              <span>计划完成度</span>
              <strong>{completion}%</strong>
            </div>
            <ProgressBar value={completion} height={7} accent="#2C6BED" />
          </div>
        </div>
      </section>

      <div className="plan-stat-grid">
        <div className="plan-stat-card">
          <span className="plan-stat-icon is-blue"><Clock3 size={17} /></span>
          <div><span>备赛周期</span><strong>{plan.totalWeeks}<em>周</em></strong></div>
        </div>
        <div className="plan-stat-card">
          <span className="plan-stat-icon is-teal"><CalendarCheck size={17} /></span>
          <div><span>每周投入</span><strong>{plan.weeklyHours}<em>小时</em></strong></div>
        </div>
        <div className="plan-stat-card">
          <span className="plan-stat-icon is-amber"><TrendingUp size={17} /></span>
          <div><span>累计训练</span><strong>{plan.totalHours}<em>小时</em></strong></div>
        </div>
        <div className="plan-stat-card">
          <span className="plan-stat-icon is-green"><Layers size={17} /></span>
          <div><span>已完成任务</span><strong>{doneTasks}<em>/ {totalTasks}</em></strong></div>
        </div>
      </div>

      <div className="plan-layout">
        <div className="plan-main">
          <section className="panel phase-section">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">FOUR-PHASE ROUTE</span>
                <h2>四周段成长路线</h2>
                <p>从诊断到交付，每个阶段都给出明确目标、任务与阶段成果。</p>
              </div>
              <span className="plan-progress-pill">{completion}% 完成</span>
            </div>
            <div className="phase-timeline">
              {plan.phases.map((phase, index) => {
                const Icon = PHASE_ICONS[index] || Target;
                const phaseDone = phase.tasks.filter(
                  (_, taskIndex) => progressForTarget[`p${phase.index}-t${taskIndex}`],
                ).length;
                return (
                  <article
                    className="phase-card"
                    key={phase.name}
                    style={{ '--phase-accent': phase.accent }}
                  >
                    <div className="phase-rail">
                      <span className="phase-dot"><Icon size={17} /></span>
                      {index < plan.phases.length - 1 && <span className="phase-line" />}
                    </div>
                    <div className="phase-body">
                      <div className="phase-head">
                        <div>
                          <span className="phase-kicker">PHASE {String(index + 1).padStart(2, '0')} · {phase.rangeLabel}</span>
                          <h3>{phase.name}</h3>
                          <p>{phase.goal}</p>
                        </div>
                        <div className="phase-side">
                          <span className="phase-output-label">阶段成果</span>
                          <strong>{phase.output}</strong>
                          <em>{phaseDone}/{phase.tasks.length} 已完成</em>
                        </div>
                      </div>
                      <div className="phase-task-list">
                        {phase.tasks.map((task, taskIndex) => {
                          const key = `p${phase.index}-t${taskIndex}`;
                          return (
                            <CheckItem
                              key={key}
                              checked={Boolean(progressForTarget[key])}
                              onClick={() => onToggleTask(target.id, key)}
                            >
                              {task}
                            </CheckItem>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="panel weekly-plan-section">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">WEEK BY WEEK</span>
                <h2>逐周执行清单</h2>
                <p>每周保留固定训练时长，并在阶段末设置可验收的里程碑。</p>
              </div>
            </div>
            <div className="weekly-grid">
              {plan.weeklyPlan.map((week) => (
                <article className="week-card" key={week.week} style={{ '--phase-accent': week.accent }}>
                  <div className="week-card-head">
                    <span>W{String(week.week).padStart(2, '0')}</span>
                    <em>{week.phase}</em>
                  </div>
                  <p>{week.focus}</p>
                  <div className="week-card-foot">
                    <span><Clock3 size={13} />{week.hours} 小时</span>
                    {week.milestone && <strong>里程碑 · {week.milestone}</strong>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="plan-side">
          <section className="panel training-slot-card">
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">TRAINING WINDOWS</span>
                <h3>每周训练时段</h3>
              </div>
              <span className="slot-total">{plan.weeklyHours}h</span>
            </div>
            <p className="slot-caption">已避开课程表冲突，优先安排固定可执行的时间。</p>
            <div className="training-slot-list">
              {plan.weeklySlots.map((slot) => (
                <div className="training-slot" key={slot.id}>
                  <span className="training-slot-day">{slot.dayLabel}</span>
                  <div>
                    <strong>{slot.start}–{slot.end}</strong>
                    <span>{slot.label}</span>
                  </div>
                  <em>{slot.hours}h</em>
                </div>
              ))}
            </div>
            <div className="slot-note">
              <Clock3 size={13} />
              若课程或作息变化，请更新画像中的课程表，计划将自动重排。
            </div>
          </section>

          <section className="panel plan-track-card">
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">TRACK FIT</span>
                <h3>赛道优先级</h3>
              </div>
              <Sparkles size={16} />
            </div>
            <div className="plan-track-list">
              {target.tracks.slice(0, 3).map((track, index) => (
                <div className={`plan-track-row ${index === 0 ? 'is-best' : ''}`} key={track.name}>
                  <span className="plan-track-rank">{index === 0 ? '首选' : `0${index + 1}`}</span>
                  <div>
                    <strong>{track.name}</strong>
                    <ProgressBar value={track.fit} height={5} accent={index === 0 ? '#2C6BED' : '#B9C7DA'} />
                  </div>
                  <em>{track.fit}%</em>
                </div>
              ))}
            </div>
            <p className="track-disclaimer">AI 建议方向，不代表官方赛道设置。</p>
          </section>

          <section className="panel risk-card">
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">RISK WATCH</span>
                <h3>计划风险提醒</h3>
              </div>
              <CircleAlert size={17} />
            </div>
            <ul className="risk-list">
              {plan.riskNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <button
              type="button"
              className="text-link"
              onClick={() => onOpenCompetition(target)}
            >
              查看完整资格与时间判断
              <ArrowRight size={14} />
            </button>
          </section>

          <section className="plan-motivation">
            <span><Flag size={17} /></span>
            <p>把训练排进日历，而不是留给“有空再说”。每周完成固定时段，就已经领先大多数临时参赛的人。</p>
          </section>

          <SourceNotice compact />
        </aside>
      </div>
    </div>
  );
}
