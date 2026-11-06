import { WEEKDAY_LABELS, SKILLS } from '../data/profile';

const SKILL_MAP = Object.fromEntries(SKILLS.map((skill) => [skill.id, skill]));

const toMinutes = (time) => {
  const [hour, minute] = String(time).split(':').map(Number);
  return hour * 60 + minute;
};

const toTime = (minutes) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

function isSlotFree(courses, day, start, end) {
  return !(courses || []).some(
    (course) =>
      Number(course.day) === day &&
      toMinutes(start) < toMinutes(course.end) &&
      toMinutes(end) > toMinutes(course.start),
  );
}

export function buildWeeklySlots(profile) {
  const weeklyHours = Math.max(4, Number(profile?.goals?.weeklyHours || 10));
  const sessionCount = Math.min(4, Math.max(2, Math.ceil(weeklyHours / 2.5)));
  const duration = Math.min(3, Math.max(1.5, Math.round((weeklyHours / sessionCount) * 2) / 2));
  const avoidWeekends = !!profile?.goals?.avoidWeekends;
  const candidates = [];
  [1, 3, 2, 4, 5].forEach((day) => {
    candidates.push({ day, start: '19:00' });
    candidates.push({ day, start: '20:00' });
  });
  if (!avoidWeekends) {
    candidates.push({ day: 6, start: '09:00' }, { day: 6, start: '14:30' }, { day: 7, start: '09:00' }, { day: 7, start: '15:00' });
  }
  const selected = [];
  for (const candidate of candidates) {
    if (selected.length >= sessionCount) break;
    if (selected.some((slot) => slot.day === candidate.day)) continue;
    const end = toTime(toMinutes(candidate.start) + duration * 60);
    if (!isSlotFree(profile?.courses, candidate.day, candidate.start, end)) continue;
    selected.push({ ...candidate, end, hours: duration });
  }
  while (selected.length < 2) {
    const day = selected.length === 0 ? 6 : 7;
    selected.push({ day, start: '09:00', end: toTime(toMinutes('09:00') + duration * 60), hours: duration });
  }
  const labels = ['专项学习', '真题训练', '复盘输出', '联合演练'];
  return selected.map((slot, index) => ({
    ...slot,
    id: `slot-${index}`,
    dayLabel: WEEKDAY_LABELS[slot.day - 1],
    label: labels[index] || '专项训练',
  }));
}

function tasksForPhase(phase, comp, gaps) {
  const gapNames = gaps.slice(0, 2).map((gap) => SKILL_MAP[gap.id]?.name || gap.name);
  const focus = comp.trainingFocus || [];
  if (phase === 0) {
    return [
      `读完官网规则与校赛通知，锁定 3 个关键节点`,
      `核对学历、专业与组队资格，完成参赛路径确认`,
      gapNames.length ? `诊断「${gapNames.join('、')}」能力差距` : '用一套基础题/往届作品完成水平诊断',
      '建立资料库与版本管理，确定每周固定训练时段',
    ];
  }
  if (phase === 1) {
    return [
      gapNames.length ? `专题补强：${gapNames.join(' / ')}` : `强化核心赛项能力：${focus[0] || '专项能力'}`,
      focus[1] || '完成 2 轮赛项专项训练',
      '建立错题/作品迭代记录，每周复盘一次',
      '与队友完成分工和阶段交付物验收',
    ];
  }
  if (phase === 2) {
    return [
      '按真实时限完成 2 次全真模拟',
      focus[2] || '针对薄弱环节做二次专项训练',
      '对照评分标准完成模拟评审',
      '修正时间分配、协作流程与现场风险点',
    ];
  }
  return [
    '完成参赛材料、作品与演示环境的最终检查',
    '进行 2 轮答辩/现场流程模拟',
    focus[3] || '确认设备、网络、证件与备用方案',
    '赛前休息与状态调整，建立赛后复盘清单',
  ];
}

const PHASE_META = [
  { name: '基础诊断', short: '诊断', accent: '#2C6BED', icon: 'search' },
  { name: '核心强化', short: '强化', accent: '#0E9F8F', icon: 'target' },
  { name: '模拟冲刺', short: '模拟', accent: '#DD8525', icon: 'timer' },
  { name: '收官交付', short: '冲刺', accent: '#18A878', icon: 'flag' },
];

export function buildPreparationPlan(comp, evaluation, profile) {
  const totalWeeks = Math.min(12, Math.max(8, comp.prepWeeks || 8));
  const splits = [0.2, 0.4, 0.25, 0.15];
  let startWeek = 1;
  const gaps = evaluation?.scoreDetails?.ability?.gaps || [];
  const phases = splits.map((split, index) => {
    const rawWeeks = totalWeeks * split;
    const weeks = index === 3 ? totalWeeks - (startWeek - 1) : Math.max(1, Math.round(rawWeeks));
    const endWeek = Math.min(totalWeeks, startWeek + weeks - 1);
    const phase = {
      ...PHASE_META[index],
      index,
      startWeek,
      endWeek,
      rangeLabel: startWeek === endWeek ? `第 ${startWeek} 周` : `第 ${startWeek}–${endWeek} 周`,
      tasks: tasksForPhase(index, comp, gaps),
      goal: [
        '明确赛制、资格与个人差距，避免无效备赛',
        '把核心能力转化为稳定的得分/交付能力',
        '在压力下跑通完整流程并修复风险',
        '确保材料、流程与状态全部就绪',
      ][index],
      output: ['诊断表与备赛清单', '专项训练记录与作品迭代版本', '全真模拟复盘报告', '最终作品/材料与应急预案'][index],
    };
    startWeek = endWeek + 1;
    return phase;
  }).filter((phase) => phase.startWeek <= totalWeeks);
  const weeklySlots = buildWeeklySlots(profile);
  const weeklyHours = weeklySlots.reduce((sum, slot) => sum + slot.hours, 0);
  const conflictWarnings = evaluation?.conflicts || [];
  const weeklyPlan = Array.from({ length: totalWeeks }, (_, index) => {
    const week = index + 1;
    const phase = phases.find((item) => week >= item.startWeek && week <= item.endWeek) || phases[phases.length - 1];
    return {
      week,
      range: phase.rangeLabel,
      phase: phase.name,
      accent: phase.accent,
      focus: phase.tasks[(week - 1) % phase.tasks.length],
      hours: weeklyHours,
      milestone:
        week === phase.endWeek
          ? phase.output
          : week === 1
            ? '完成资格核验与报名日历'
            : '',
    };
  });
  const track = evaluation?.tracks?.[0] || comp.tracks?.[0];
  return {
    compId: comp.id,
    compName: comp.name,
    totalWeeks,
    weeklyHours,
    totalHours: Math.round(weeklyHours * totalWeeks),
    phases,
    weeklySlots,
    weeklyPlan,
    track,
    riskNotes: [
      conflictWarnings.length
        ? `有 ${conflictWarnings.length} 个已登记赛程与课程重叠，优先解决：${conflictWarnings[0].courseName}`
        : '当前已登记赛程与课程表暂无时间重叠',
      gaps.length ? `能力短板需在第 2–4 周集中补齐：${gaps.slice(0, 2).map((gap) => gap.name).join('、')}` : '核心能力已达标，训练重心放在稳定性与实战',
      '年度赛程如有更新，报名截止与比赛日期需要重新复核',
    ],
  };
}

export function formatHours(value) {
  return Number.isInteger(value) ? `${value}` : `${value.toFixed(1)}`;
}
