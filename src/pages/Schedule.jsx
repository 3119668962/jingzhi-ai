import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Check,
  CircleAlert,
  Clock3,
  MapPin,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import { EmptyState, Modal, ProgressBar, SourceNotice } from '../components/ui';
import { detectCourseConflicts } from '../lib/matcher';
import { COMPETITIONS } from '../data/competitions';
import { WEEKDAY_LABELS } from '../data/profile';

const DAY_START = 8 * 60;
const DAY_END = 21 * 60 + 30;
const TOTAL_MINUTES = DAY_END - DAY_START;
const GRID_HOURS = 13.5;

const COURSE_COLORS = [
  { accent: '#2C6BED', soft: '#EBF2FF' },
  { accent: '#0E9F8F', soft: '#E7F8F5' },
  { accent: '#7C5CE6', soft: '#F1EDFF' },
  { accent: '#DD8525', soft: '#FFF3E5' },
  { accent: '#D75B87', soft: '#FDECF2' },
  { accent: '#2D8BBF', soft: '#EAF5FB' },
];

const toMinutes = (time) => {
  const [hour, minute] = String(time || '0:0').split(':').map(Number);
  return hour * 60 + minute;
};

const percentOfDay = (time) => ((toMinutes(time) - DAY_START) / TOTAL_MINUTES) * 100;

function dateInfo(date) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return { weekday: 0, label: date, monthDay: date, weekdayLabel: '日期待确认' };
  const weekday = ((parsed.getDay() + 6) % 7) + 1;
  return {
    weekday,
    label: `${parsed.getMonth() + 1}月${parsed.getDate()}日`,
    monthDay: `${parsed.getMonth() + 1}/${parsed.getDate()}`,
    weekdayLabel: WEEKDAY_LABELS[weekday - 1],
  };
}

function makeId() {
  return `event-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function loadForDay(courses, day) {
  return courses
    .filter((course) => Number(course.day) === day)
    .reduce((sum, course) => sum + Math.max(0, toMinutes(course.end) - toMinutes(course.start)) / 60, 0);
}

function emptyForm() {
  return {
    compId: '',
    title: '',
    date: '',
    start: '09:00',
    end: '11:00',
    location: '',
    note: '',
  };
}

export default function Schedule({
  profile,
  events,
  onAddSchedule,
  onRemoveSchedule,
  onOpenCompetition,
  notify,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const courses = profile.courses || [];
  const conflicts = useMemo(() => detectCourseConflicts(courses, events), [courses, events]);
  const conflictEventIds = useMemo(() => new Set(conflicts.map((conflict) => conflict.eventId)), [conflicts]);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`)),
    [events],
  );

  const weeklyHours = courses.reduce(
    (sum, course) => sum + Math.max(0, toMinutes(course.end) - toMinutes(course.start)) / 60,
    0,
  );
  const today = new Date().toISOString().slice(0, 10);

  const compLookup = useMemo(
    () => Object.fromEntries(COMPETITIONS.map((item) => [item.id, item])),
    [],
  );

  const openModal = () => {
    setForm(emptyForm());
    setFormError('');
    setModalOpen(true);
  };

  const handleCompChange = (compId) => {
    const comp = compLookup[compId];
    setForm((current) => ({
      ...current,
      compId,
      title: comp ? `${comp.short} 比赛` : current.title,
      location: comp ? comp.mode : current.location,
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setFormError('请填写赛程名称。');
      return;
    }
    if (!form.date) {
      setFormError('请选择比赛日期。');
      return;
    }
    if (form.end <= form.start) {
      setFormError('结束时间需要晚于开始时间。');
      return;
    }
    onAddSchedule({
      id: makeId(),
      compId: form.compId,
      title: form.title.trim(),
      date: form.date,
      start: form.start,
      end: form.end,
      location: form.location.trim(),
      note: form.note.trim(),
      type: 'competition',
    });
    setModalOpen(false);
    notify('赛程已登记，系统已重新检测课程冲突', 'success');
  };

  const removeEvent = (event) => {
    onRemoveSchedule(event.id);
  };

  return (
    <div className="page schedule-page">
      <section className="schedule-overview">
        <div className="schedule-overview-copy">
          <span className="section-eyebrow">SCHEDULE COLLISION</span>
          <h2>把课程、备赛与竞赛放进同一张时间表</h2>
          <p>按赛事所在星期的时段投影到课程表中，直接看见潜在重叠，并为每一处冲突给出协调建议。</p>
          <div className="schedule-overview-actions">
            <button type="button" className="btn btn-primary" onClick={openModal}>
              <CalendarPlus size={16} />
              登记赛事赛程
            </button>
            <span className="schedule-tip">
              <Check size={13} />
              已登记赛程会自动更新对应赛事的「时间匹配」评分
            </span>
          </div>
        </div>
        <div className="schedule-summary-grid">
          <div className="schedule-summary-card">
            <span className="summary-icon is-blue"><CalendarDays size={17} /></span>
            <strong>{courses.length}</strong>
            <span>门课程 / 周</span>
            <em>{weeklyHours.toFixed(1)} 小时</em>
          </div>
          <div className="schedule-summary-card">
            <span className="summary-icon is-teal"><Clock3 size={17} /></span>
            <strong>{events.length}</strong>
            <span>项已登记赛程</span>
            <em>{events.filter((event) => event.date >= today).length} 项待进行</em>
          </div>
          <div className={`schedule-summary-card ${conflicts.length ? 'is-alert' : ''}`}>
            <span className="summary-icon is-red"><CircleAlert size={17} /></span>
            <strong>{conflicts.length}</strong>
            <span>处课程冲突</span>
            <em>{conflictEventIds.size} 个赛程受影响</em>
          </div>
        </div>
      </section>

      <div className="schedule-layout">
        <section className="panel calendar-card">
          <div className="calendar-head">
            <div>
              <span className="section-eyebrow">WEEKLY TIMETABLE</span>
              <h2>一周课程与赛事投影</h2>
            </div>
            <div className="calendar-legend">
              <span><i className="legend-course" /> 课程</span>
              <span><i className="legend-event" /> 赛事</span>
              <span><i className="legend-conflict" /> 冲突</span>
            </div>
          </div>
          <div className="calendar-note">赛程按比赛日期所在星期投影到周视图，具体日期以右侧赛程清单为准。</div>
          <div className="calendar-scroll">
            <div className="week-calendar">
              <div className="calendar-corner" />
              {WEEKDAY_LABELS.map((label, index) => (
                <div className={`calendar-day-head ${index >= 5 ? 'is-weekend' : ''}`} key={label}>
                  <strong>{label.replace('周', '')}</strong>
                  <span>{loadForDay(courses, index + 1).toFixed(1)}h</span>
                </div>
              ))}

              <div className="calendar-time-axis">
                {Array.from({ length: 14 }, (_, index) => 8 + index).map((hour) => (
                  <span key={hour} style={{ top: `${((hour * 60 - DAY_START) / TOTAL_MINUTES) * 100}%` }}>
                    {String(hour).padStart(2, '0')}:00
                  </span>
                ))}
              </div>

              {WEEKDAY_LABELS.map((label, index) => {
                const day = index + 1;
                const dayCourses = courses.filter((course) => Number(course.day) === day);
                const dayEvents = events.filter((event) => dateInfo(event.date).weekday === day);
                return (
                  <div className={`calendar-day-column ${index >= 5 ? 'is-weekend' : ''}`} key={label}>
                    {dayCourses.map((course, courseIndex) => {
                      const color = COURSE_COLORS[courseIndex % COURSE_COLORS.length];
                      const top = percentOfDay(course.start);
                      const height = percentOfDay(course.end) - top;
                      return (
                        <div
                          className="course-block"
                          key={course.id}
                          style={{
                            top: `${Math.max(0, top)}%`,
                            height: `${Math.max(4, height)}%`,
                            background: color.soft,
                            borderLeftColor: color.accent,
                            color: color.accent,
                          }}
                          title={`${course.name} · ${course.start}–${course.end}${course.location ? ` · ${course.location}` : ''}`}
                        >
                          <strong>{course.name}</strong>
                          <span>{course.start}–{course.end}</span>
                          {course.location && <em>{course.location}</em>}
                        </div>
                      );
                    })}
                    {dayEvents.map((event) => {
                      const info = dateInfo(event.date);
                      const top = percentOfDay(event.start);
                      const height = percentOfDay(event.end) - top;
                      const hasConflict = conflictEventIds.has(event.id);
                      return (
                        <div
                          className={`calendar-event-block ${hasConflict ? 'is-conflict' : ''}`}
                          key={event.id}
                          style={{ top: `${Math.max(0, top)}%`, height: `${Math.max(4.5, height)}%` }}
                          title={`${event.title} · ${event.date} ${event.start}–${event.end}`}
                        >
                          <strong>{hasConflict ? '冲突 · ' : ''}{event.title}</strong>
                          <span>{info.monthDay} · {event.start}–{event.end}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="schedule-side">
          <section className={`panel conflict-summary-card ${conflicts.length ? 'has-conflict' : ''}`}>
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">CONFLICT CHECK</span>
                <h3>冲突检测结果</h3>
              </div>
              <span className={`conflict-badge ${conflicts.length ? 'is-danger' : 'is-ok'}`}>
                {conflicts.length ? `${conflicts.length} 处` : '通过'}
              </span>
            </div>
            {conflicts.length ? (
              <div className="conflict-brief-list">
                {conflicts.slice(0, 3).map((conflict) => (
                  <div className="conflict-brief" key={`${conflict.eventId}-${conflict.courseName}`}>
                    <span className="conflict-brief-mark"><CircleAlert size={14} /></span>
                    <div>
                      <strong>{conflict.courseName}</strong>
                      <p>{conflict.eventTitle}</p>
                      <span>{conflict.weekday && WEEKDAY_LABELS[conflict.weekday - 1]} {conflict.overlap} 重叠</span>
                    </div>
                  </div>
                ))}
                {conflicts.length > 3 && (
                  <span className="conflict-more">另有 {conflicts.length - 3} 处冲突，见下方协调建议。</span>
                )}
              </div>
            ) : (
              <div className="conflict-clear is-large">
                <span><Check size={17} /></span>
                <div>
                  <strong>没有检测到时间重叠</strong>
                  <p>当前课程表与已登记赛程可以并存。赛事日期更新后请重新登记。</p>
                </div>
              </div>
            )}
          </section>

          <section className="panel load-card">
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">WEEKLY LOAD</span>
                <h3>课程负载</h3>
              </div>
              <span className="load-total">{weeklyHours.toFixed(1)}h</span>
            </div>
            <div className="load-list">
              {WEEKDAY_LABELS.map((label, index) => {
                const hours = loadForDay(courses, index + 1);
                return (
                  <div className="load-row" key={label}>
                    <span>{label}</span>
                    <ProgressBar value={(hours / 8) * 100} height={6} accent={hours > 6 ? '#DD8525' : '#2C6BED'} />
                    <em>{hours.toFixed(1)}h</em>
                  </div>
                );
              })}
            </div>
            <p className="load-hint">按每日 8 小时课程上限估算负载，便于避开高密度日安排备赛。</p>
          </section>

          <section className="schedule-side-note">
            <span><CalendarPlus size={16} /></span>
            <div>
              <strong>登记赛事有什么用？</strong>
              <p>系统会用真实比赛时段计算时间匹配分与课程冲突，并在推荐结果中提前提醒。</p>
            </div>
          </section>
        </aside>
      </div>

      {conflicts.length > 0 && (
        <section className="panel conflict-detail-section">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">RESOLUTION GUIDE</span>
              <h2>冲突协调建议</h2>
              <p>冲突不代表不能参赛，优先确认签到、线上参赛与调课可能性。</p>
            </div>
            <span className="conflict-count-mark">{conflicts.length} 处重叠</span>
          </div>
          <div className="conflict-detail-grid">
            {conflicts.map((conflict) => {
              const event = events.find((item) => item.id === conflict.eventId);
              const comp = event?.compId ? compLookup[event.compId] : null;
              return (
                <article className="conflict-detail-card" key={`${conflict.eventId}-${conflict.courseName}`}>
                  <div className="conflict-detail-top">
                    <span className="conflict-detail-icon"><CircleAlert size={16} /></span>
                    <div>
                      <strong>{conflict.eventTitle}</strong>
                      <span>{conflict.date} · {conflict.eventStart}–{conflict.eventEnd}</span>
                    </div>
                    <em>重叠 {conflict.minutes} 分钟</em>
                  </div>
                  <div className="conflict-versus">
                    <div>
                      <span>课程</span>
                      <strong>{conflict.courseName}</strong>
                      <em>{conflict.courseStart}–{conflict.courseEnd}{conflict.courseLocation ? ` · ${conflict.courseLocation}` : ''}</em>
                    </div>
                    <span className="versus-mark">×</span>
                    <div>
                      <span>赛事</span>
                      <strong>{conflict.eventTitle}</strong>
                      <em>{conflict.eventStart}–{conflict.eventEnd}</em>
                    </div>
                  </div>
                  <p className="conflict-suggestion">{conflict.suggestion}</p>
                  {comp && (
                    <button type="button" className="text-link" onClick={() => onOpenCompetition(comp)}>
                      查看赛事详情
                      <ArrowRight size={14} />
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="panel event-table-panel">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">MY COMPETITION CALENDAR</span>
            <h2>已登记赛程</h2>
            <p>{events.length ? `共 ${events.length} 项，按比赛日期排序。` : '登记具体比赛时间后，系统才能进行精准冲突检测。'}</p>
          </div>
          <button type="button" className="btn btn-primary btn-small" onClick={openModal}>
            <Plus size={15} />
            添加赛程
          </button>
        </div>
        {sortedEvents.length ? (
          <div className="event-table">
            <div className="event-table-head">
              <span>赛事</span>
              <span>日期 / 时间</span>
              <span>地点</span>
              <span>冲突状态</span>
              <span />
            </div>
            {sortedEvents.map((event) => {
              const info = dateInfo(event.date);
              const eventConflicts = conflicts.filter((conflict) => conflict.eventId === event.id);
              const comp = compLookup[event.compId];
              return (
                <div className="event-table-row" key={event.id}>
                  <div className="event-table-name">
                    <strong>{event.title}</strong>
                    {comp && <span>{comp.short} · 目录第 {String(comp.no).padStart(2, '0')} 项</span>}
                    {event.note && <em>{event.note}</em>}
                  </div>
                  <div>
                    <strong>{event.date}</strong>
                    <span>{info.weekdayLabel} · {event.start}–{event.end}</span>
                  </div>
                  <div>
                    <span className="event-location"><MapPin size={13} />{event.location || '待确认'}</span>
                  </div>
                  <div>
                    <span className={`event-state ${eventConflicts.length ? 'is-danger' : 'is-ok'}`}>
                      {eventConflicts.length ? `${eventConflicts.length} 处冲突` : '无冲突'}
                    </span>
                  </div>
                  <div className="event-table-actions">
                    {comp && (
                      <button type="button" className="icon-button subtle" onClick={() => onOpenCompetition(comp)} aria-label="查看赛事详情">
                        <ArrowRight size={15} />
                      </button>
                    )}
                    <button type="button" className="icon-button subtle is-danger" onClick={() => removeEvent(event)} aria-label="删除赛程">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={CalendarDays}
            title="还没有登记赛事赛程"
            description="添加比赛日期与具体时段，系统会自动检测课程冲突，并把结果反馈到推荐评分。"
            action={
              <button type="button" className="btn btn-primary btn-small" onClick={openModal}>
                <CalendarPlus size={15} />
                登记第一项赛程
              </button>
            }
          />
        )}
      </section>

      <SourceNotice />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="登记赛事赛程"
        subtitle="填写真实比赛时段，用于课程冲突检测与时间匹配计算"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              <CalendarPlus size={15} />
              加入时间表
            </button>
          </>
        }
      >
        {formError && <div className="inline-error">{formError}</div>}
        <div className="event-form">
          <label className="field field-wide">
            <span>关联赛事 <small>可选</small></span>
            <select value={form.compId} onChange={(event) => handleCompChange(event.target.value)}>
              <option value="">不关联目录赛事</option>
              {COMPETITIONS.map((comp) => (
                <option value={comp.id} key={comp.id}>
                  #{String(comp.no).padStart(2, '0')} · {comp.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field field-wide">
            <span>赛程名称 <em>*</em></span>
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="如：蓝桥杯校内选拔赛"
            />
          </label>
          <label className="field">
            <span>比赛日期 <em>*</em></span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
          </label>
          <label className="field">
            <span>地点</span>
            <input
              value={form.location}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
              placeholder="线上 / 实验楼 401"
            />
          </label>
          <label className="field">
            <span>开始时间 <em>*</em></span>
            <input
              type="time"
              value={form.start}
              onChange={(event) => setForm({ ...form, start: event.target.value })}
            />
          </label>
          <label className="field">
            <span>结束时间 <em>*</em></span>
            <input
              type="time"
              value={form.end}
              onChange={(event) => setForm({ ...form, end: event.target.value })}
            />
          </label>
          <label className="field field-wide">
            <span>备注 <small>可选</small></span>
            <textarea
              rows={3}
              value={form.note}
              onChange={(event) => setForm({ ...form, note: event.target.value })}
              placeholder="如：需提前 30 分钟签到，需携带学生证。"
            />
          </label>
          <div className="event-form-hint field-wide">
            <Users size={14} />
            提示：若赛程尚未公布，可先按往年节奏预留时间，官网确认后再修改。
          </div>
        </div>
      </Modal>
    </div>
  );
}
