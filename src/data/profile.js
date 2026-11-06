export const SKILLS = [
  { id: 'programming', name: '编程开发', short: '编程', group: '技术基础' },
  { id: 'algorithms', name: '算法与建模', short: '算法', group: '技术基础' },
  { id: 'ai', name: 'AI与数据', short: 'AI数据', group: '技术基础' },
  { id: 'security', name: '网络与安全', short: '安全', group: '技术基础' },
  { id: 'networking', name: '计算机网络', short: '网络', group: '技术基础' },
  { id: 'systems', name: '系统与嵌入式', short: '嵌入式', group: '技术基础' },
  { id: 'engineering', name: '工程实践', short: '工程', group: '工程能力' },
  { id: 'research', name: '科研与实验', short: '科研', group: '工程能力' },
  { id: 'math', name: '数理基础', short: '数理', group: '工程能力' },
  { id: 'design', name: '设计与创意', short: '设计', group: '创意表达' },
  { id: 'media', name: '数字内容', short: '数字内容', group: '创意表达' },
  { id: 'writing', name: '写作与表达', short: '写作', group: '创意表达' },
  { id: 'presentation', name: '演讲与答辩', short: '答辩', group: '创意表达' },
  { id: 'english', name: '英语沟通', short: '英语', group: '综合素养' },
  { id: 'business', name: '商业与管理', short: '商业', group: '综合素养' },
  { id: 'teamwork', name: '团队协作', short: '协作', group: '综合素养' },
  { id: 'execution', name: '项目执行力', short: '执行', group: '综合素养' },
];

export const SKILL_LEVELS = [
  { value: 1, label: '入门', hint: '了解基础概念' },
  { value: 2, label: '基础', hint: '能在指导下完成' },
  { value: 3, label: '熟练', hint: '独立完成常规任务' },
  { value: 4, label: '精通', hint: '能解决复杂问题' },
  { value: 5, label: '专家', hint: '有作品或竞赛成果' },
];

export const GOAL_DIRECTIONS = [
  { id: 'algorithms', name: '算法与人工智能', fields: ['cs', 'science'], skills: ['algorithms', 'programming', 'ai', 'math'] },
  { id: 'software', name: '软件开发', fields: ['cs', 'innovation'], skills: ['programming', 'systems', 'teamwork'] },
  { id: 'security', name: '网络安全', fields: ['cs', 'electronics'], skills: ['security', 'systems', 'programming'] },
  { id: 'hardware', name: '硬件与嵌入式', fields: ['electronics', 'engineering'], skills: ['systems', 'engineering', 'programming'] },
  { id: 'manufacturing', name: '智能制造', fields: ['engineering', 'electronics'], skills: ['engineering', 'systems', 'execution'] },
  { id: 'data', name: '数据分析', fields: ['cs', 'business', 'science'], skills: ['ai', 'math', 'research'] },
  { id: 'entrepreneur', name: '创新创业', fields: ['innovation', 'business'], skills: ['business', 'presentation', 'teamwork', 'execution'] },
  { id: 'finance', name: '商业与金融', fields: ['business'], skills: ['business', 'math', 'presentation'] },
  { id: 'design', name: '设计创意', fields: ['design'], skills: ['design', 'media', 'presentation'] },
  { id: 'media', name: '内容与传播', fields: ['humanities', 'design'], skills: ['media', 'writing', 'presentation'] },
  { id: 'language', name: '语言与人文', fields: ['humanities'], skills: ['english', 'writing', 'presentation'] },
  { id: 'health', name: '生命健康', fields: ['medicine', 'science'], skills: ['research', 'teamwork'] },
  { id: 'sustainability', name: '能源与环境', fields: ['engineering', 'science', 'agriculture'], skills: ['research', 'engineering'] },
  { id: 'research', name: '科研深造', fields: ['science', 'engineering', 'medicine'], skills: ['research', 'math', 'writing'] },
];

export const TARGET_LEVELS = ['校级/入门', '省级奖项', '国家级奖项', '国际舞台'];

const affinity = (overrides) => ({
  innovation: 0.35,
  cs: 0.2,
  electronics: 0.2,
  engineering: 0.2,
  science: 0.2,
  design: 0.2,
  business: 0.2,
  medicine: 0.1,
  humanities: 0.2,
  agriculture: 0.1,
  vocational: 0.2,
  all: 0.45,
  ...overrides,
});

export const MAJOR_GROUPS = [
  {
    id: 'cs',
    label: '计算机与人工智能',
    keywords: ['计算机', '软件', '网络工程', '信息安全', '网络空间安全', '人工智能', '数据科学', '大数据', '物联网', '智能科学', '信息技术', '数字媒体技术'],
    majors: ['计算机科学与技术', '软件工程', '网络工程', '信息安全', '网络空间安全', '人工智能', '数据科学与大数据技术', '物联网工程', '智能科学与技术', '数字媒体技术'],
    affinity: affinity({ cs: 1, innovation: 0.9, electronics: 0.55, engineering: 0.35, science: 0.35, business: 0.4, design: 0.3, humanities: 0.2, vocational: 0.45 }),
  },
  {
    id: 'electronics',
    label: '电子信息与通信',
    keywords: ['电子', '通信', '微电子', '集成电路', '光电', '自动化', '信息工程'],
    majors: ['电子信息工程', '通信工程', '微电子科学与工程', '集成电路设计与集成系统', '光电信息科学与工程', '自动化', '信息工程'],
    affinity: affinity({ electronics: 1, innovation: 0.8, cs: 0.65, engineering: 0.65, science: 0.4, design: 0.2, business: 0.3, vocational: 0.5 }),
  },
  {
    id: 'engineering',
    label: '工程与制造',
    keywords: ['机械', '车辆', '土木', '建筑', '水利', '能源', '动力', '材料', '测绘', '地质', '航空', '航天', '船舶', '交通', '工业工程', '安全工程'],
    majors: ['机械设计制造及其自动化', '机械工程', '车辆工程', '土木工程', '建筑学', '水利水电工程', '能源与动力工程', '新能源科学与工程', '材料科学与工程', '测绘工程', '地质工程', '航空航天工程', '船舶与海洋工程', '交通运输', '工业工程', '安全工程'],
    affinity: affinity({ engineering: 1, innovation: 0.8, electronics: 0.6, cs: 0.45, science: 0.4, design: 0.35, business: 0.3, agriculture: 0.35, vocational: 0.55 }),
  },
  {
    id: 'design',
    label: '设计与艺术',
    keywords: ['设计', '美术', '视觉传达', '环境艺术', '产品设计', '工业设计', '动画', '绘画', '雕塑', '服装'],
    majors: ['工业设计', '产品设计', '视觉传达设计', '环境设计', '数字媒体艺术', '动画', '美术学', '绘画', '服装与服饰设计', '艺术设计学'],
    affinity: affinity({ design: 1, innovation: 0.85, humanities: 0.5, business: 0.5, cs: 0.4, engineering: 0.3, vocational: 0.4 }),
  },
  {
    id: 'business',
    label: '经济与管理',
    keywords: ['经济', '金融', '会计', '工商管理', '市场营销', '电子商务', '物流', '管理科学', '财务管理', '国际贸易', '人力资源', '审计', '税收', '信息管理'],
    majors: ['经济学', '金融学', '会计学', '财务管理', '工商管理', '市场营销', '电子商务', '物流管理', '管理科学', '国际经济与贸易', '人力资源管理', '审计学', '税收学', '信息管理与信息系统'],
    affinity: affinity({ business: 1, innovation: 0.95, humanities: 0.5, cs: 0.4, design: 0.4, engineering: 0.25, science: 0.25, vocational: 0.5 }),
  },
  {
    id: 'science',
    label: '数学与自然科学',
    keywords: ['数学', '统计', '物理', '化学', '生物科学', '生物技术', '地理', '天文学', '大气'],
    majors: ['数学与应用数学', '信息与计算科学', '统计学', '应用统计学', '物理学', '应用物理学', '化学', '应用化学', '生物科学', '生物技术', '地理科学', '天文学'],
    affinity: affinity({ science: 1, innovation: 0.7, cs: 0.45, engineering: 0.45, medicine: 0.5, agriculture: 0.5, business: 0.25 }),
  },
  {
    id: 'medicine',
    label: '医学与生命健康',
    keywords: ['临床医学', '护理', '药学', '医学', '口腔', '预防医学', '生物医学', '康复', '中医'],
    majors: ['临床医学', '口腔医学', '预防医学', '护理学', '药学', '中药学', '生物医学工程', '康复治疗学', '中医学', '医学影像学'],
    affinity: affinity({ medicine: 1, science: 0.55, innovation: 0.6, agriculture: 0.2, cs: 0.2, engineering: 0.15, business: 0.25 }),
  },
  {
    id: 'humanities',
    label: '人文与社会科学',
    keywords: ['文学', '英语', '翻译', '新闻', '传播', '广告', '法学', '社会学', '教育', '历史', '哲学', '汉语言', '外语', '政治'],
    majors: ['汉语言文学', '英语', '翻译', '商务英语', '新闻学', '传播学', '广告学', '法学', '社会学', '教育学', '小学教育', '历史学', '哲学', '国际政治'],
    affinity: affinity({ humanities: 1, innovation: 0.8, business: 0.6, design: 0.5, science: 0.2, cs: 0.25, vocational: 0.4 }),
  },
  {
    id: 'agriculture',
    label: '农林与食品',
    keywords: ['农业', '农学', '园艺', '林学', '食品', '动物', '水产', '植物', '生物工程'],
    majors: ['农学', '园艺', '林学', '食品科学与工程', '食品质量与安全', '动物医学', '动物科学', '水产养殖学', '植物保护', '生物工程'],
    affinity: affinity({ agriculture: 1, innovation: 0.7, science: 0.6, engineering: 0.5, medicine: 0.3, business: 0.3, vocational: 0.4 }),
  },
  {
    id: 'general',
    label: '其他专业',
    keywords: [],
    majors: ['体育教育', '音乐学', '舞蹈学', '播音与主持艺术', '戏剧影视文学', '公共事业管理', '社会工作', '旅游管理'],
    affinity: affinity({ all: 0.65, innovation: 0.65, business: 0.45, humanities: 0.55, design: 0.4 }),
  },
];

export const ALL_MAJORS = [...new Set(MAJOR_GROUPS.flatMap((group) => group.majors))].sort((a, b) =>
  a.localeCompare(b, 'zh-CN'),
);

export function getMajorGroup(major = '') {
  const text = String(major).trim();
  if (!text) return MAJOR_GROUPS[MAJOR_GROUPS.length - 1];
  const direct = MAJOR_GROUPS.find((group) => group.majors.includes(text));
  if (direct) return direct;
  const matched = MAJOR_GROUPS.find((group) =>
    group.keywords.some((keyword) => text.includes(keyword)),
  );
  return matched || MAJOR_GROUPS[MAJOR_GROUPS.length - 1];
}

export const DEGREES = ['本科', '专科（高职）', '硕士', '博士'];
export const GRADE_OPTIONS = ['大一', '大二', '大三', '大四', '研一', '研二', '研三'];

export const DEFAULT_SKILLS = Object.fromEntries(SKILLS.map((skill) => [skill.id, 2]));

function singleCourse(name, day, start, end, location, type = '专业必修') {
  return {
    id: `course-${day}-${start.replace(':', '')}-${name}`,
    name,
    day,
    start,
    end,
    weeks: '1-16',
    location,
    type,
  };
}

export const DEMO_PROFILE = {
  id: 'demo-lin-zhixia',
  name: '林知夏',
  school: '江南理工大学',
  degree: '本科',
  major: '网络工程',
  grade: '大二',
  className: '网络工程 2302 班',
  skills: {
    programming: 4,
    algorithms: 3,
    ai: 2,
    security: 4,
    networking: 4,
    systems: 3,
    engineering: 2,
    research: 2,
    math: 3,
    design: 2,
    media: 2,
    writing: 3,
    presentation: 3,
    english: 4,
    business: 2,
    teamwork: 4,
    execution: 4,
  },
  certificates: [
    { id: 'cert-demo-1', name: 'CET-6', issuer: '全国大学英语四、六级考试委员会', date: '2026-06', level: '525 分' },
    { id: 'cert-demo-2', name: '华为 HCIA-Datacom', issuer: '华为技术有限公司', date: '2026-04', level: '认证通过' },
    { id: 'cert-demo-3', name: '全国计算机等级考试二级', issuer: '教育部教育考试院', date: '2025-09', level: 'Python' },
  ],
  experiences: [
    { id: 'exp-demo-1', name: '蓝桥杯全国软件和信息技术专业人才大赛', award: '省赛二等奖', year: '2026', track: 'Python 程序设计' },
    { id: 'exp-demo-2', name: '校级网络安全 CTF 挑战赛', award: '三等奖', year: '2025', track: 'Web 安全' },
  ],
  courses: [
    singleCourse('计算机网络', 1, '08:00', '09:40', '博学楼 A302'),
    singleCourse('数据库原理', 1, '14:00', '15:40', '博学楼 B205'),
    singleCourse('网络攻防技术', 2, '10:00', '11:40', '实验楼 401', '专业选修'),
    singleCourse('体育（羽毛球）', 2, '14:00', '16:00', '东区体育馆', '公共必修'),
    singleCourse('操作系统', 3, '08:00', '09:40', '博学楼 A201'),
    singleCourse('网络安全技术', 3, '14:00', '16:00', '实验楼 305', '专业必修'),
    singleCourse('高等数学（下）', 4, '08:00', '09:40', '明理楼 102', '公共必修'),
    singleCourse('Python 程序设计', 4, '10:00', '11:40', '实验楼 206', '专业必修'),
    singleCourse('大学英语', 4, '14:00', '15:40', '文心楼 304', '公共必修'),
    singleCourse('数据结构', 5, '08:00', '09:40', '博学楼 A305'),
    singleCourse('网络工程实验', 5, '14:00', '16:00', '实验楼 402', '专业必修'),
  ],
  goals: {
    directions: ['security', 'software', 'data'],
    targetLevel: '省级奖项',
    months: [3, 6],
    weeklyHours: 12,
    motivation: '希望在网络安全方向积累真实项目与竞赛成果，为保研和实习做准备。',
    avoidWeekends: false,
  },
  profileComplete: true,
  isDemo: true,
  updatedAt: '2026-10-29T08:00:00.000Z',
};

export const DEMO_SCHEDULES = [
  {
    id: 'demo-event-1',
    compId: 'ec-27',
    title: '蓝桥杯校内选拔赛',
    date: '2027-03-10',
    start: '15:00',
    end: '17:00',
    location: '线上 · 学校机房',
    type: 'competition',
    note: '示例赛程：用于演示与《网络安全技术》课程的冲突检测，实际时间以学校通知为准。',
  },
  {
    id: 'demo-event-2',
    compId: 'ec-42',
    title: '华为ICT大赛线上初赛',
    date: '2027-03-06',
    start: '09:00',
    end: '11:00',
    location: '线上',
    type: 'competition',
    note: '示例赛程：具体时间与赛制以官网通知为准。',
  },
  {
    id: 'demo-event-3',
    compId: 'ec-33',
    title: '全国大学生信息安全竞赛校内初赛',
    date: '2027-04-17',
    start: '10:00',
    end: '12:00',
    location: '实验楼 401',
    type: 'competition',
    note: '示例赛程：具体时间以官网和校内通知为准。',
  },
];

export const EMPTY_PROFILE = {
  id: '',
  name: '',
  school: '',
  degree: '本科',
  major: '',
  grade: '大二',
  className: '',
  skills: { ...DEFAULT_SKILLS },
  certificates: [],
  experiences: [],
  courses: [],
  goals: {
    directions: [],
    targetLevel: '省级奖项',
    months: [3, 6],
    weeklyHours: 10,
    motivation: '',
    avoidWeekends: false,
  },
  profileComplete: false,
  isDemo: false,
  updatedAt: '',
};

const WEEKDAY_MAP = {
  1: 1, 一: 1, 周一: 1, 星期一: 1, monday: 1, mon: 1,
  2: 2, 二: 2, 周二: 2, 星期二: 2, tuesday: 2, tue: 2,
  3: 3, 三: 3, 周三: 3, 星期三: 3, wednesday: 3, wed: 3,
  4: 4, 四: 4, 周四: 4, 星期四: 4, thursday: 4, thu: 4,
  5: 5, 五: 5, 周五: 5, 星期五: 5, friday: 5, fri: 5,
  6: 6, 六: 6, 周六: 6, 星期六: 6, saturday: 6, sat: 6,
  7: 7, 日: 7, 天: 7, 周日: 7, 周天: 7, 星期日: 7, 星期天: 7, sunday: 7, sun: 7,
};

export const WEEKDAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

function parseDay(value) {
  const text = String(value || '').trim().toLowerCase().replace(/\s+/g, '');
  return WEEKDAY_MAP[text] || WEEKDAY_MAP[text.replace('礼拜', '周')] || 0;
}

function parseTime(value) {
  const text = String(value || '').trim().replace('：', ':').replace(/\s/g, '');
  const colon = text.match(/^(\d{1,2}):(\d{2})/);
  if (colon) return `${String(Math.min(23, Number(colon[1]))).padStart(2, '0')}:${colon[2]}`;
  if (/^\d{3,4}$/.test(text)) {
    const normalized = text.padStart(4, '0');
    return `${normalized.slice(0, 2)}:${normalized.slice(2)}`;
  }
  return '';
}

export function parseTimetableCsv(content) {
  const text = String(content || '').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return { courses: [], error: '文件中没有可读取的内容。' };
  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const rows = lines.map((line) => line.split(delimiter).map((cell) => cell.trim().replace(/^"|"$/g, '')));
  const startIndex = rows[0].some((cell) => /课程|名称|星期|开始/.test(cell)) ? 1 : 0;
  const courses = [];
  const errors = [];
  for (let index = startIndex; index < rows.length; index += 1) {
    const row = rows[index];
    if (row.length < 4) {
      errors.push(`第 ${index + 1} 行字段不足`);
      continue;
    }
    const [rawName, rawDay, rawStart, rawEnd, weeks = '1-16', location = ''] = row;
    const name = rawName || '未命名课程';
    const day = parseDay(rawDay);
    const start = parseTime(rawStart);
    const end = parseTime(rawEnd);
    if (!name || !day || !start || !end) {
      errors.push(`第 ${index + 1} 行时间或星期格式不正确`);
      continue;
    }
    if (end <= start) {
      errors.push(`第 ${index + 1} 行结束时间需晚于开始时间`);
      continue;
    }
    courses.push({
      id: `course-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      day,
      start,
      end,
      weeks: weeks || '1-16',
      location,
      type: '导入课程',
    });
  }
  return {
    courses,
    error: errors.length ? `${errors.slice(0, 3).join('；')}${errors.length > 3 ? '等' : ''}` : '',
  };
}

export const TIMETABLE_TEMPLATE = `课程名称,星期,开始时间,结束时间,周次,地点
计算机网络,周一,08:00,09:40,1-16,博学楼 A302
数据库原理,周一,14:00,15:40,1-16,博学楼 B205
网络安全技术,周三,14:00,16:00,1-16,实验楼 305`;

export function getProfileCompletion(profile) {
  if (!profile) return 0;
  let score = 0;
  if (profile.name) score += 10;
  if (profile.school) score += 8;
  if (profile.major) score += 12;
  if (profile.degree) score += 5;
  if (profile.grade) score += 5;
  const filledSkills = Object.values(profile.skills || {}).filter((level) => level > 0).length;
  score += Math.min(20, Math.round((filledSkills / SKILLS.length) * 20));
  if (profile.certificates?.length) score += 8;
  if (profile.experiences?.length) score += 7;
  if (profile.courses?.length) score += 12;
  if (profile.goals?.directions?.length) score += 8;
  if (profile.goals?.motivation) score += 5;
  return Math.min(100, score);
}
