import { COMPETITIONS, FIELD_LABELS } from '../data/competitions';
import { GOAL_DIRECTIONS, SKILLS, SKILL_LEVELS, getMajorGroup, getProfileCompletion } from '../data/profile';

const SKILL_MAP = Object.fromEntries(SKILLS.map((skill) => [skill.id, skill]));
const GOAL_MAP = Object.fromEntries(GOAL_DIRECTIONS.map((goal) => [goal.id, goal]));

export const SCORE_WEIGHTS = [
  { key: 'major', label: '专业匹配', weight: 0.3 },
  { key: 'ability', label: '能力匹配', weight: 0.3 },
  { key: 'time', label: '时间匹配', weight: 0.2 },
  { key: 'qualification', label: '资格匹配', weight: 0.1 },
  { key: 'value', label: '发展价值', weight: 0.1 },
];

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const round = (value) => Math.round(value * 10) / 10;

export function expandMonthRange(start, end) {
  const a = Number(start);
  const b = Number(end);
  if (!a || !b) return [];
  if (a <= b) {
    return Array.from({ length: b - a + 1 }, (_, index) => a + index);
  }
  return [...expandMonthRange(a, 12), ...expandMonthRange(1, b)];
}

export function monthsOverlap(a = [], b = []) {
  return a.filter((month) => b.includes(month));
}

function cyclicMonthDistance(month, candidates) {
  if (!candidates.length) return 6;
  return Math.min(
    ...candidates.map((candidate) => {
      const diff = Math.abs(month - candidate);
      return Math.min(diff, 12 - diff);
    }),
  );
}

function getGoalMatches(comp, profile) {
  const directions = (profile?.goals?.directions || []).map((id) => GOAL_MAP[id]).filter(Boolean);
  let fieldMatches = 0;
  let skillMatches = 0;
  const matchedGoals = [];
  for (const direction of directions) {
    const fieldHit = comp.fields.some((field) => direction.fields.includes(field));
    const skillsHit = comp.skills.some((demand) => direction.skills.includes(demand.skill));
    if (fieldHit || skillsHit) matchedGoals.push(direction.name);
    if (fieldHit) fieldMatches += 1;
    if (skillsHit) skillMatches += 1;
  }
  const bonus = Math.min(7, fieldMatches * 2.2 + skillMatches * 1.1);
  return { bonus, matchedGoals: [...new Set(matchedGoals)] };
}

function evaluateMajor(comp, profile) {
  const group = getMajorGroup(profile?.major || '');
  if (comp.open) {
    return {
      score: 97,
      group,
      note: `${comp.fieldsText}，与你的专业背景不冲突，适合跨专业组队`,
    };
  }
  const affinities = comp.fields.map((field) => group.affinity?.[field] ?? group.affinity?.all ?? 0.15);
  const best = Math.max(...affinities, 0.1);
  let score = 26 + best * 72;
  if (comp.fields.includes(group.id)) score += 2;
  const majorText = profile?.major || '';
  if (majorText && (comp.name.includes(majorText) || comp.tags.some((tag) => tag.includes(majorText)))) {
    score += 3;
  }
  score = clamp(score);
  const strongestField = comp.fields.reduce(
    (bestField, field) =>
      (group.affinity?.[field] || 0) > (group.affinity?.[bestField] || 0) ? field : bestField,
    comp.fields[0],
  );
  return {
    score: round(score),
    group,
    note:
      score >= 85
        ? `${FIELD_LABELS[strongestField] || comp.fieldsText}与你的「${profile.major}」培养方向高度重合`
        : score >= 65
          ? `与「${profile.major}」存在交叉能力需求，可通过跨专业组队补位`
          : `并非你的核心对口领域，更适合作为兴趣拓展`,
  };
}

function mathAchievementBoost(comp, profile) {
  const experiences = profile?.experiences || [];
  let bonus = 0;
  const details = [];
  for (const exp of experiences) {
    const name = String(exp.name || '');
    if (!name) continue;
    if ((comp.short && name.includes(comp.short)) || name.includes(comp.name)) {
      bonus += 5;
      details.push(`${exp.name}${exp.award ? `（${exp.award}）` : ''}可直接迁移经验`);
      continue;
    }
    if (comp.tags.some((tag) => name.includes(tag))) {
      bonus += 1.5;
      details.push(`${name}与赛项方向相近`);
    }
  }
  const matchedCerts = [];
  const certText = (profile?.certificates || [])
    .map((cert) => `${cert.name || ''} ${cert.level || ''}`.toLowerCase())
    .join(' | ');
  for (const hint of comp.certHints || []) {
    if (certText.includes(String(hint).toLowerCase())) {
      matchedCerts.push(hint);
    }
  }
  const certBonus = Math.min(5, matchedCerts.length * 2.5);
  return { bonus: bonus + certBonus, details, matchedCerts: [...new Set(matchedCerts)] };
}

function evaluateAbility(comp, profile) {
  const userSkills = profile?.skills || {};
  let weighted = 0;
  let totalWeight = 0;
  const matched = [];
  const gaps = [];
  for (const demand of comp.skills) {
    const level = Number(userSkills[demand.skill] || 0);
    const ratio = Math.min(1, level / Math.max(1, demand.level));
    weighted += ratio * demand.weight;
    totalWeight += demand.weight;
    const skillName = SKILL_MAP[demand.skill]?.name || demand.skill;
    if (ratio >= 0.8) {
      matched.push({ id: demand.skill, name: skillName, level, required: demand.level, ratio });
    } else {
      gaps.push({ id: demand.skill, name: skillName, level, required: demand.level, ratio });
    }
  }
  const base = totalWeight ? (weighted / totalWeight) * 100 : 60;
  const boost = mathAchievementBoost(comp, profile);
  const score = clamp(base + boost.bonus);
  matched.sort((a, b) => b.ratio * b.required - a.ratio * a.required);
  gaps.sort((a, b) => a.ratio - b.ratio);
  return {
    score: round(score),
    base: round(base),
    boost: round(boost.bonus),
    matched,
    gaps,
    details: boost.details,
    matchedCerts: boost.matchedCerts,
    note:
      gaps.length === 0
        ? '核心能力项均达到赛项要求，具备直接参赛基础'
        : `${matched.slice(0, 2).map((item) => item.name).join('、') || '部分能力'}已具备，需优先补齐「${gaps[0]?.name}」`,
  };
}

function evaluateTime(comp, profile, preferredMonths, events = []) {
  const courses = profile?.courses || [];
  const conflicts = detectCourseConflicts(courses, events);
  const target =
    preferredMonths?.length
      ? preferredMonths
      : expandMonthRange(profile?.goals?.months?.[0] || 3, profile?.goals?.months?.[1] || 6);
  const eventMatches = monthsOverlap(target, comp.eventMonths);
  const regMatches = monthsOverlap(target, comp.regMonths);
  let score;
  let note;
  if (eventMatches.length) {
    score = 100;
    note = `比赛窗口与你的期望时间（${target[0]}–${target[target.length - 1]}月）重合`;
  } else if (regMatches.length) {
    score = 84;
    note = `报名窗口落在期望区间，比赛安排在 ${comp.season.split(' · ')[1] || comp.season}`;
  } else {
    const distance = Math.min(
      cyclicMonthDistance(target[0], comp.eventMonths),
      cyclicMonthDistance(target[target.length - 1], comp.eventMonths),
      ...target.map((month) => cyclicMonthDistance(month, comp.eventMonths)),
    );
    score = distance === 1 ? 70 : distance === 2 ? 60 : 50;
    note = `比赛时间与期望窗口相差约 ${distance} 个月，可提前规划下一年度节奏`;
  }
  if (conflicts.length) {
    score = clamp(score - conflicts.length * 12, 30);
    note = `检测到 ${conflicts.length} 处课程重叠，时间匹配已下调`;
  }
  return {
    score: round(score),
    conflicts,
    note,
  };
}

function evaluateQualification(comp, profile) {
  const degree = profile?.degree || '本科';
  const group = getMajorGroup(profile?.major || '');
  if (!comp.degrees.includes(degree)) {
    return {
      score: degree === '专科（高职）' || comp.degrees.includes('专科（高职）') ? 55 : 35,
      eligible: false,
      note: `参赛对象以 ${comp.degrees.join(' / ')} 为主，你的「${degree}」身份需向组委会确认`,
    };
  }
  if (comp.restrictedFields.length && !comp.restrictedFields.includes(group.id)) {
    return {
      score: 38,
      eligible: false,
      note: `赛事对专业身份有明显限制，需确认「${profile.major}」是否在允许范围内`,
    };
  }
  if (comp.requirements.includes('学校推荐') || comp.requirements.includes('已立项')) {
    return {
      score: 76,
      eligible: true,
      note: '基本身份满足，但需通过学校遴选或项目推荐获得参赛资格',
    };
  }
  if (comp.no === 81 || comp.no === 82) {
    return {
      score: 72,
      eligible: true,
      note: '需满足年龄、职业身份与逐级选拔要求，资格审核较严格',
    };
  }
  return {
    score: 100,
    eligible: true,
    note: '学历身份与基础参赛对象要求匹配',
  };
}

function evaluateValue(comp, profile) {
  const goal = getGoalMatches(comp, profile);
  const target = profile?.goals?.targetLevel;
  let extra = goal.bonus;
  if (target === '国家级奖项' && comp.development >= 93) extra += 1;
  if (target === '国际舞台' && comp.difficulty >= 4.3) extra += 1;
  const score = clamp(comp.development + extra);
  return {
    score: round(score),
    goal,
    note:
      goal.matchedGoals.length > 0
        ? `与「${goal.matchedGoals.slice(0, 2).join('、')}」目标同向，成果可沉淀为长期竞争力`
        : '竞赛认可度与发展价值较高，可拓展新的能力方向',
  };
}

function rankTracks(comp, profile) {
  const userSkills = profile?.skills || {};
  const goal = getGoalMatches(comp, profile);
  return [...comp.tracks]
    .map((track) => {
      const values = track.skills.map((skill) => Number(userSkills[skill] || 0) / 5);
      const skillFit = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0.6;
      const goalBoost = track.skills.some((skill) =>
        (profile?.goals?.directions || []).some((id) => GOAL_MAP[id]?.skills.includes(skill)),
      )
        ? 0.08
        : 0;
      return {
        ...track,
        fit: Math.round(clamp((skillFit + goalBoost + (goal.goalMatches ? 0 : 0)) * 100, 35, 98)),
      };
    })
    .sort((a, b) => b.fit - a.fit);
}

function buildReasons(comp, scoreParts) {
  const reasons = [];
  reasons.push({ icon: 'target', title: '专业匹配', text: scoreParts.major.note });
  reasons.push({
    icon: 'spark',
    title: '能力抓手',
    text:
      scoreParts.ability.gaps.length === 0
        ? scoreParts.ability.note
        : `${scoreParts.ability.note}；可结合备赛计划集中补齐。`,
  });
  reasons.push({ icon: 'calendar', title: '时间可行', text: scoreParts.time.note });
  if (scoreParts.value.goal.matchedGoals.length) {
    reasons.push({
      icon: 'trend',
      title: '发展价值',
      text: `与你的「${scoreParts.value.goal.matchedGoals.slice(0, 2).join('、')}」方向一致，${scoreParts.value.note}`,
    });
  }
  return reasons.slice(0, 4);
}

export function detectCourseConflicts(courses = [], events = []) {
  const conflicts = [];
  for (const event of events) {
    if (!event?.date || !event?.start || !event?.end) continue;
    const parsed = new Date(`${event.date}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) continue;
    const weekday = ((parsed.getDay() + 6) % 7) + 1;
    for (const course of courses) {
      if (Number(course.day) !== weekday) continue;
      if (event.start < course.end && event.end > course.start) {
        const overlapStart = event.start > course.start ? event.start : course.start;
        const overlapEnd = event.end < course.end ? event.end : course.end;
        const [startH, startM] = overlapStart.split(':').map(Number);
        const [endH, endM] = overlapEnd.split(':').map(Number);
        const minutes = (endH * 60 + endM) - (startH * 60 + startM);
        conflicts.push({
          eventId: event.id,
          eventTitle: event.title,
          date: event.date,
          weekday,
          eventStart: event.start,
          eventEnd: event.end,
          courseName: course.name,
          courseStart: course.start,
          courseEnd: course.end,
          courseLocation: course.location,
          overlap: `${overlapStart}–${overlapEnd}`,
          minutes,
          suggestion:
            course.start >= event.start && course.end <= event.end
              ? '课程落在赛程内，建议提前申请调课或选择线上参赛方案。'
              : '存在时间重叠，建议与任课教师沟通并在赛前确认签到/参赛要求。',
        });
      }
    }
  }
  return conflicts.sort((a, b) => `${a.date}${a.eventStart}`.localeCompare(`${b.date}${b.eventStart}`));
}

export function getEventsForCompetition(userSchedules, compId) {
  return (userSchedules || []).filter((item) => item.compId === compId && item.type === 'competition');
}

export function evaluateCompetition(comp, profile, preferredMonths, userSchedules = []) {
  const events = getEventsForCompetition(userSchedules, comp.id);
  const major = evaluateMajor(comp, profile);
  const ability = evaluateAbility(comp, profile);
  const time = evaluateTime(comp, profile, preferredMonths, events);
  const qualification = evaluateQualification(comp, profile);
  const value = evaluateValue(comp, profile);
  const rawScores = {
    major: major.score,
    ability: ability.score,
    time: time.score,
    qualification: qualification.score,
    value: value.score,
  };
  const total = round(
    SCORE_WEIGHTS.reduce((sum, item) => sum + rawScores[item.key] * item.weight, 0),
  );
  const tracks = rankTracks(comp, profile);
  const scoreParts = { major, ability, time, qualification, value };
  const reasons = buildReasons(comp, scoreParts);
  const cautions = [];
  if (time.conflicts.length) {
    cautions.push(`${time.conflicts.length} 处课程与赛程时间重叠，需要提前协调`);
  }
  if (!qualification.eligible) cautions.push(qualification.note);
  if (ability.gaps.length) {
    cautions.push(`能力短板：${ability.gaps.slice(0, 2).map((gap) => gap.name).join('、')}`);
  }
  if (!events.length) {
    cautions.push('当前仅参考往届赛程，官网更新后需复核关键日期');
  }
  const matchLevel = total >= 88 ? '极高匹配' : total >= 78 ? '高度匹配' : total >= 68 ? '值得尝试' : '探索机会';
  const strategy =
    total >= 86
      ? { label: '冲刺主攻', tone: 'primary' }
      : total >= 76
        ? { label: '重点推荐', tone: 'success' }
        : total >= 66
          ? { label: '稳妥尝试', tone: 'warning' }
          : { label: '兴趣探索', tone: 'neutral' };
  return {
    ...comp,
    scores: rawScores,
    total,
    breakdown: SCORE_WEIGHTS.map((item) => ({
      ...item,
      score: rawScores[item.key],
      contribution: round(rawScores[item.key] * item.weight),
    })),
    scoreDetails: scoreParts,
    reasons,
    cautions,
    conflicts: time.conflicts,
    tracks,
    bestTrack: tracks[0] || null,
    matchLevel,
    strategy,
    events,
  };
}

export function rankCompetitions({
  profile,
  preferredMonths,
  keyword = '',
  userSchedules = [],
  limit = null,
} = {}) {
  const query = String(keyword || '').trim().toLowerCase();
  const evaluations = COMPETITIONS.map((comp) =>
    evaluateCompetition(comp, profile, preferredMonths, userSchedules),
  )
    .filter((item) => {
      if (!query) return true;
      const haystack = [item.name, item.short, item.categoryMeta.label, item.fieldsText, ...item.tags]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => b.total - a.total);
  const filtered = evaluations.filter((item) => item.total >= 45);
  const results = filtered.length >= 3 ? filtered : evaluations.slice(0, 12);
  return {
    all: evaluations,
    results: limit ? results.slice(0, limit) : results,
    counts: {
      total: COMPETITIONS.length,
      matched: results.length,
      strong: results.filter((item) => item.total >= 80).length,
      conflicts: results.filter((item) => item.conflicts.length).length,
    },
    profileCompletion: getProfileCompletion(profile),
  };
}

export function buildDashboardInsight(profile, topRecommendations = []) {
  if (!profile) return null;
  const top = topRecommendations[0];
  const skills = Object.entries(profile.skills || {})
    .map(([id, level]) => ({ id, level, name: SKILL_MAP[id]?.name }))
    .filter((item) => item.name)
    .sort((a, b) => b.level - a.level);
  const strongest = skills.slice(0, 3);
  if (!top) {
    return {
      headline: `你的「${profile.major}」画像已就绪`,
      body: '补充目标方向与希望参赛的时间，即可生成第一批个性化竞赛推荐。',
      strongest,
    };
  }
  return {
    headline: `你的 ${strongest[0]?.name || '专业'} 优势，在「${top.short}」中可直接转化`,
    body: `综合推荐指数 ${top.total}，${top.scoreDetails.major.note}。建议优先补齐${top.scoreDetails.ability.gaps[0]?.name || '赛项专项能力'}，并锁定${top.season.split(' · ')[0]}的报名窗口。`,
    strongest,
    top,
  };
}

export function getSkillLevelLabel(level) {
  return [...SKILL_LEVELS].reverse().find((item) => item.value <= level)?.label || '未填写';
}

export function getScheduleWarnings(userSchedules, profile) {
  const conflicts = detectCourseConflicts(profile?.courses || [], userSchedules || []);
  const grouped = new Map();
  for (const conflict of conflicts) {
    const key = `${conflict.eventId}-${conflict.courseName}`;
    grouped.set(key, conflict);
  }
  return [...grouped.values()];
}
