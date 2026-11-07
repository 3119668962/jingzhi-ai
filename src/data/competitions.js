import { SKILLS } from './profile';

export const CATEGORY_META = {
  innovation: { label: '综合创新', accent: '#2C6BED', soft: '#EAF1FF', short: '创新' },
  computer: { label: '计算机与AI', accent: '#0E9F8F', soft: '#E7F8F5', short: '计算机' },
  engineering: { label: '工程制造', accent: '#DD8525', soft: '#FFF3E5', short: '工程' },
  science: { label: '数理化工', accent: '#7C5CE6', soft: '#F0EDFF', short: '理科' },
  design: { label: '设计创意', accent: '#D75B87', soft: '#FDECF2', short: '设计' },
  business: { label: '经管商科', accent: '#2D8BBF', soft: '#EAF5FB', short: '商科' },
  medicine: { label: '生命医学', accent: '#18A878', soft: '#E8F8F1', short: '医学' },
  humanities: { label: '语言人文', accent: '#8664E8', soft: '#F1EDFF', short: '人文' },
  agriculture: { label: '农林水利', accent: '#6B9B37', soft: '#F0F7E7', short: '农林' },
  vocational: { label: '职业技能', accent: '#59677D', soft: '#EFF2F6', short: '职教' },
};

export const FIELD_LABELS = {
  all: '专业不限',
  innovation: '跨学科创新',
  cs: '计算机与人工智能',
  electronics: '电子信息与通信',
  engineering: '工程与制造',
  science: '数学与自然科学',
  design: '设计与艺术',
  business: '经济与管理',
  medicine: '医学与生命健康',
  humanities: '人文与社会科学',
  agriculture: '农林与食品',
  vocational: '职业教育',
};

const CATEGORY_DEFAULTS = {
  innovation: {
    regMonths: [3, 4, 5],
    eventMonths: [6, 7, 8, 9, 10],
    prepWeeks: 10,
    difficulty: 3.6,
    development: 95,
    team: '3–15 人',
    mode: '校赛—省赛—全国赛',
    location: '分赛区 / 全国总决赛（地点以通知为准）',
  },
  computer: {
    regMonths: [3, 4, 5],
    eventMonths: [5, 6, 7, 8],
    prepWeeks: 8,
    difficulty: 3.8,
    development: 90,
    team: '1–5 人',
    mode: '线上初赛 + 线下决赛',
    location: '线上赛场 / 承办高校',
  },
  engineering: {
    regMonths: [3, 4, 5],
    eventMonths: [7, 8],
    prepWeeks: 10,
    difficulty: 4.1,
    development: 89,
    team: '2–5 人',
    mode: '作品提交 + 现场评审',
    location: '承办高校 / 分赛区',
  },
  science: {
    regMonths: [3, 4, 5],
    eventMonths: [5, 6, 7],
    prepWeeks: 8,
    difficulty: 3.8,
    development: 88,
    team: '1–4 人',
    mode: '线上测评 + 线下答辩',
    location: '承办高校 / 分赛区',
  },
  design: {
    regMonths: [3, 4, 5],
    eventMonths: [6, 7, 8],
    prepWeeks: 8,
    difficulty: 3.2,
    development: 85,
    team: '1–4 人',
    mode: '作品评审 + 现场展示',
    location: '线上提交 / 承办高校',
  },
  business: {
    regMonths: [3, 4, 5],
    eventMonths: [6, 7, 8],
    prepWeeks: 8,
    difficulty: 3.4,
    development: 89,
    team: '2–5 人',
    mode: '方案提交 + 路演答辩',
    location: '线上初赛 / 全国总决赛',
  },
  medicine: {
    regMonths: [3, 4],
    eventMonths: [6, 7],
    prepWeeks: 10,
    difficulty: 4,
    development: 89,
    team: '2–5 人',
    mode: '作品评审 + 现场答辩',
    location: '承办高校',
  },
  humanities: {
    regMonths: [4, 5, 6],
    eventMonths: [9, 10, 11],
    prepWeeks: 8,
    difficulty: 3.1,
    development: 83,
    team: '1–5 人',
    mode: '线上初赛 + 线下决赛',
    location: '线上 / 承办高校',
  },
  agriculture: {
    regMonths: [3, 4, 5],
    eventMonths: [6, 7, 8],
    prepWeeks: 9,
    difficulty: 3.5,
    development: 85,
    team: '3–5 人',
    mode: '方案评审 + 实物展示',
    location: '承办高校 / 实践基地',
  },
  vocational: {
    regMonths: [3, 4, 5],
    eventMonths: [8, 9, 10],
    prepWeeks: 10,
    difficulty: 3.5,
    development: 82,
    team: '1–5 人',
    mode: '技能实操 + 现场评审',
    location: '国内赛区 / 国际赛场',
  },
};

const DEFAULT_TRACKS = {
  innovation: [
    { name: '创新项目主赛道', desc: '适合同时具备专业技术、商业分析与路演能力的学生。', skills: ['business', 'presentation', 'execution'] },
    { name: '产业命题应用线', desc: '围绕企业真实命题，用技术方案解决行业问题。', skills: ['engineering', 'programming', 'teamwork'] },
    { name: '社会价值探索线', desc: '强调社会议题洞察、调研与可持续影响力。', skills: ['writing', 'research', 'presentation'] },
  ],
  computer: [
    { name: '算法与开发主线', desc: '发挥编程、数据结构与算法能力，以做题和系统实现取胜。', skills: ['programming', 'algorithms'] },
    { name: '网络与安全方向', desc: '围绕网络协议、攻防实践与系统加固展开。', skills: ['security', 'networking', 'systems'] },
    { name: 'AI与数据应用线', desc: '用机器学习或数据分析完成真实场景作品。', skills: ['ai', 'algorithms', 'research'] },
  ],
  engineering: [
    { name: '实物创新主线', desc: '从结构设计到原型制作，突出工程实现与可靠性。', skills: ['engineering', 'systems', 'execution'] },
    { name: '建模仿真方向', desc: '侧重计算、建模、优化与实验验证。', skills: ['math', 'engineering', 'research'] },
    { name: '智能系统交叉线', desc: '将传感、控制、软件算法集成到工程系统。', skills: ['systems', 'programming', 'engineering'] },
  ],
  science: [
    { name: '理论建模主线', desc: '突出数学推导、模型建立与结果解释。', skills: ['math', 'algorithms', 'research'] },
    { name: '实验研究路线', desc: '围绕实验设计、数据处理与论文表达展开。', skills: ['research', 'writing', 'teamwork'] },
    { name: '交叉应用方向', desc: '将数理方法迁移到工程、医学或社会场景。', skills: ['math', 'programming', 'innovation'] },
  ],
  design: [
    { name: '视觉与产品设计线', desc: '用视觉语言和产品思维完成完整设计作品。', skills: ['design', 'execution', 'presentation'] },
    { name: '数字媒体方向', desc: '侧重动态影像、交互体验或数字内容表达。', skills: ['media', 'design', 'ai'] },
    { name: '设计研究路线', desc: '强调用户洞察、调研方法与设计论证。', skills: ['research', 'writing', 'design'] },
  ],
  business: [
    { name: '商业策划主线', desc: '发挥调研、商业分析和方案设计能力。', skills: ['business', 'writing', 'presentation'] },
    { name: '数据分析方向', desc: '用数据洞察支撑业务判断和决策建议。', skills: ['ai', 'math', 'business'] },
    { name: '实战运营路线', desc: '聚焦真实企业经营、模拟决策与团队协作。', skills: ['execution', 'teamwork', 'business'] },
  ],
  medicine: [
    { name: '科研创新主线', desc: '围绕科学问题、实验设计与结果分析展开。', skills: ['research', 'writing', 'teamwork'] },
    { name: '临床技能方向', desc: '突出临床思维、规范操作与团队配合。', skills: ['execution', 'teamwork', 'presentation'] },
    { name: '交叉应用路线', desc: '结合工程、数据技术解决医学场景问题。', skills: ['research', 'programming', 'ai'] },
  ],
  humanities: [
    { name: '语言表达主线', desc: '突出语言功底、跨文化理解与临场表达。', skills: ['english', 'presentation', 'writing'] },
    { name: '内容创作方向', desc: '围绕文化主题完成写作、讲述或创意表达。', skills: ['writing', 'media', 'design'] },
    { name: '研究阐释路线', desc: '通过资料研究、论证与演讲呈现观点。', skills: ['research', 'writing', 'presentation'] },
  ],
  agriculture: [
    { name: '技术创新主线', desc: '面向真实农业场景构建可验证的技术方案。', skills: ['engineering', 'research', 'execution'] },
    { name: '应用推广方向', desc: '重视成果落地、用户反馈和推广价值。', skills: ['teamwork', 'business', 'execution'] },
    { name: '交叉研究路线', desc: '结合生物、环境与数据方法开展研究。', skills: ['research', 'science', 'ai'] },
  ],
  vocational: [
    { name: '技能实操主线', desc: '以规范操作、速度与完成质量为核心。', skills: ['execution', 'systems', 'engineering'] },
    { name: '综合应用方向', desc: '将多项职业技能组合解决完整任务。', skills: ['teamwork', 'programming', 'execution'] },
    { name: '创新展示路线', desc: '在技能基础上突出改进方案与现场表达。', skills: ['innovation', 'presentation', 'design'] },
  ],
};

const SKILL_NAME_MAP = Object.fromEntries(SKILLS.map((skill) => [skill.id, skill.name]));

function pad(no) {
  return String(no).padStart(2, '0');
}

const SKILL_ALIASES = {
  electronics: 'systems',
  innovation: 'execution',
  science: 'research',
};

function monthsText(months) {
  if (!months?.length) return '以官网通知为准';
  const sorted = [...new Set(months)].sort((a, b) => a - b);
  const compact = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let index = 1; index <= sorted.length; index += 1) {
    const current = sorted[index];
    if (current === prev + 1) {
      prev = current;
      continue;
    }
    compact.push(start === prev ? `${start}月` : `${start}–${prev}月`);
    start = current;
    prev = current;
  }
  return compact.join('、');
}

function parseSkills(list) {
  const parsed = list
    .flatMap((entry) => String(entry).split(/,\s*/))
    .map((entry, index) => {
      const [rawId, rawLevel] = entry.split(':');
      const level = Number(rawLevel);
      return {
        skill: SKILL_ALIASES[rawId] || rawId,
        level: Number.isFinite(level) ? level : index < 2 ? 3 : 2,
        weight: index < 2 ? 3 : 2,
      };
    });
  const demands = new Map();
  for (const demand of parsed) {
    const current = demands.get(demand.skill);
    if (!current) {
      demands.set(demand.skill, demand);
    } else {
      current.level = Math.max(current.level, demand.level);
      current.weight = Math.max(current.weight, demand.weight);
    }
  }
  return [...demands.values()];
}

function defaultCertHints(skillIds) {
  const hints = [];
  if (skillIds.some((id) => ['security', 'networking', 'systems'].includes(id))) {
    hints.push('HCIA', 'HCIP', 'CISP', '计算机等级', '软考');
  }
  if (skillIds.includes('programming') || skillIds.includes('algorithms')) {
    hints.push('计算机等级', '软考', '蓝桥杯');
  }
  if (skillIds.includes('english')) hints.push('CET-4', 'CET-6', '雅思', '托福', '专业四级', '专业八级');
  if (skillIds.includes('business')) hints.push('ACCA', 'CPA', '初级会计', '证券从业');
  if (skillIds.includes('design')) hints.push('Adobe', '设计类');
  return [...new Set(hints)];
}

function make(no, name, short, category, fields, skillList, options = {}) {
  const defaults = CATEGORY_DEFAULTS[category];
  const skillDemand = parseSkills(skillList);
  const skillIds = skillDemand.map((item) => item.skill);
  const tags = [...new Set([...(options.tags || []), ...skillIds.slice(0, 3).map((id) => SKILL_NAME_MAP[id])])];
  const fieldsList = Array.isArray(fields) ? fields : [fields];
  const isOpen = fieldsList.includes('all');
  const tracks =
    options.tracks ||
    (DEFAULT_TRACKS[category] || []).map((track) => ({
      ...track,
      skills: track.skills.filter((skill) => skill !== 'innovation'),
    }));
  return {
    id: `ec-${pad(no)}`,
    no,
    name,
    short,
    category,
    categoryMeta: CATEGORY_META[category],
    fields: fieldsList,
    fieldsText: isOpen ? '专业不限' : fieldsList.map((field) => FIELD_LABELS[field]).join(' / '),
    open: isOpen,
    website: options.website || '',
    organizer: options.organizer || '教育部 / 相关专业教学指导委员会',
    intro:
      options.intro ||
      `${name}是2025年教育部认可的全国大学生学科竞赛目录内赛事，面向高校学生开展，强调${tags.slice(0, 3).join('、')}等能力的综合运用。`,
    description:
      options.description ||
      `${short}采用“${options.mode || defaults.mode}”的组织方式。学生需根据当年通知完成报名、资格审核与作品/赛项提交，具体赛制、组别与评审规则以官方发布为准。`,
    tags,
    skills: skillDemand,
    certHints: options.certHints || defaultCertHints(skillIds),
    regMonths: options.regMonths || defaults.regMonths,
    eventMonths: options.eventMonths || defaults.eventMonths,
    registration: options.registration || `${monthsText(options.regMonths || defaults.regMonths)}（往年节奏）`,
    season: options.season || `${monthsText(options.regMonths || defaults.regMonths)}报名 · ${monthsText(options.eventMonths || defaults.eventMonths)}比赛`,
    prepWeeks: options.prepWeeks || defaults.prepWeeks,
    difficulty: options.difficulty ?? defaults.difficulty,
    development: options.development ?? defaults.development,
    team: options.team || defaults.team,
    format: options.format || '团队赛',
    mode: options.mode || defaults.mode,
    location: options.location || defaults.location,
    degrees: options.degrees || ['本科', '硕士', '博士'],
    restrictedFields: options.restrictedFields || [],
    eligibility:
      options.eligibility ||
      `${options.degrees?.includes('专科（高职）') ? '高校在校生' : '全日制在校本科生、研究生'}，${options.team || defaults.team}组队，需符合当年赛项与专业要求。`,
    requirements:
      options.requirements ||
      '具备赛项所需的基础能力与团队协作条件；部分赛项需通过校赛、省赛选拔或学校推荐，提交材料与作品须原创合规。',
    tracks,
    trainingFocus:
      options.trainingFocus || ['研读当年赛项规程', '补齐核心能力短板', '完成 2–3 次全真模拟', '打磨作品与答辩材料', '完成报名与材料复核'],
    highlights:
      options.highlights || [
        '教育部认可国家级学科竞赛',
        `${tags.slice(0, 2).join(' · ')}能力实战`,
        '可作为综测、保研与求职作品材料',
      ],
    timeNote: '赛程按往届月份梳理，仅用于规划参考，请以官网最新通知为准。',
    source: '2025 年教育部认可的全国大学生学科竞赛目录',
    dataYear: 2025,
    ...(options.extra || {}),
  };
}

export const COMPETITIONS = [
  make(1, '中国国际大学生创新大赛', '国创赛', 'innovation', ['all'], ['business:4', 'presentation:3', 'teamwork:3', 'execution:4'], {
    website: 'https://cy.ncss.cn/',
    organizer: '教育部等十二部委',
    tags: ['创新创业', '商业计划书', '项目路演'],
    regMonths: [3, 4, 5, 6],
    eventMonths: [6, 7, 8, 9, 10],
    prepWeeks: 12,
    difficulty: 4.2,
    development: 99,
    team: '3–15 人',
    tracks: [
      { name: '高教主赛道', desc: '面向高校主赛道项目，考察创新性、商业价值与团队执行力。', skills: ['business', 'innovation', 'presentation'] },
      { name: '产业命题赛道', desc: '解决企业真实命题，适合有技术落地能力与行业理解的团队。', skills: ['engineering', 'programming', 'execution'] },
      { name: '青年红色筑梦之旅赛道', desc: '聚焦社会价值与乡村振兴，强调调研深度和可持续影响。', skills: ['research', 'writing', 'presentation'] },
    ],
    intro: '国内覆盖面最广、影响力最大的大学生创新创业赛事之一，适合把课程项目、科研成果或创业想法打磨为完整项目。',
    description: '赛事分为校级初赛、省级复赛与全国总决赛，按赛道与组别评审项目计划书、路演表现和项目实际进展。适合有完整团队、可持续打磨项目的学生。',
    requirements: '项目须真实、合法、原创，团队结构合理；不同赛道对项目类型、注册实体与成员身份有具体要求，以当年通知为准。',
    location: '校赛—省赛—全国总决赛（承办高校轮换）',
    trainingFocus: ['梳理项目核心价值与差异化', '完成商业计划书与财务测算', '用数据验证用户需求', '多轮路演与答辩模拟'],
  }),
  make(2, '“挑战杯”全国大学生课外学术科技作品竞赛', '挑战杯·学术', 'innovation', ['all'], ['research:4', 'writing:3', 'presentation:3', 'innovation:4'], {
    website: 'http://www.tiaozhanbei.net/',
    organizer: '共青团中央、教育部等',
    tags: ['学术科技', '科研作品', '社会调查'],
    regMonths: [3, 4, 5],
    eventMonths: [5, 6, 7, 8, 9, 10, 11],
    prepWeeks: 14,
    difficulty: 4.3,
    development: 98,
    team: '1–8 人',
    tracks: [
      { name: '自然科学类学术论文', desc: '适合有实验数据、算法结果或工程研究成果的学生。', skills: ['research', 'writing', 'math'] },
      { name: '哲学社会科学类调查报告', desc: '通过田野调查、数据分析形成有现实意义的研究结论。', skills: ['research', 'writing', 'presentation'] },
      { name: '科技发明制作', desc: '展示实物、系统或原型的技术创新与工程价值。', skills: ['engineering', 'systems', 'execution'] },
    ],
    intro: '“挑战杯”课赛强调学术科技作品与社会调查的原创价值，是保研、科研训练和综合测评中含金量极高的赛事。',
    requirements: '申报作品须为在校期间完成的原创成果，需经学校选拔推荐；涉及跨学科合作时需明确成员贡献。',
    trainingFocus: ['确定问题与研究价值', '完成实验/调研和数据闭环', '打磨论文或作品说明书', '准备展板与答辩证据链'],
  }),
  make(3, '“挑战杯”中国大学生创业计划大赛', '挑战杯·创业', 'innovation', ['all'], ['business:4', 'presentation:4', 'teamwork:3', 'execution:3'], {
    website: 'http://www.tiaozhanbei.net/',
    organizer: '共青团中央、教育部等',
    tags: ['创业计划', '商业模式', '路演'],
    regMonths: [3, 4, 5, 6],
    eventMonths: [6, 7, 8, 9, 10, 11],
    prepWeeks: 12,
    difficulty: 4,
    development: 96,
    team: '3–10 人',
    tracks: [
      { name: '创业计划竞赛', desc: '突出商业逻辑、市场验证与团队分工。', skills: ['business', 'presentation', 'execution'] },
      { name: '创业实践挑战赛', desc: '已有真实运营实体的项目可展示经营数据与成长性。', skills: ['business', 'execution', 'teamwork'] },
      { name: '公益创业赛', desc: '面向社会问题，强调公益模式与可持续运营。', skills: ['research', 'presentation', 'business'] },
    ],
    requirements: '需提交创业计划书或项目运营材料，并由学校推荐；鼓励跨专业组队。',
  }),
  make(4, 'ACM-ICPC 国际大学生程序设计竞赛', 'ACM-ICPC', 'computer', ['cs'], ['algorithms:5', 'programming:5', 'math:4', 'teamwork:3'], {
    website: 'https://icpc.global/',
    organizer: 'ICPC Foundation',
    tags: ['程序设计', '算法竞赛', '国际赛事'],
    regMonths: [8, 9, 10],
    eventMonths: [10, 11, 12],
    prepWeeks: 16,
    difficulty: 4.9,
    development: 98,
    team: '3 人',
    format: '团队赛（3 人 1 机）',
    mode: '线下区域赛 + 全球总决赛',
    location: '亚洲区域赛各赛点 / 全球总决赛',
    tracks: [
      { name: '竞赛算法主攻', desc: '适合图论、动态规划、数据结构基础扎实的选手。', skills: ['algorithms', 'programming', 'math'] },
      { name: '几何与数学专项', desc: '负责计算几何、数论等高难度题型。', skills: ['math', 'algorithms', 'programming'] },
      { name: '策略与实现协同', desc: '负责题型分工、代码复核与赛场决策。', skills: ['teamwork', 'programming', 'execution'] },
    ],
    intro: '最具国际影响力的程序设计竞赛，强调算法设计、代码实现与三人团队协作，适合以算法岗或深造为目标的学生。',
    requirements: '通常要求本科在校生，队伍由 3 名正式队员组成；需通过校内选拔或赛点报名，具体资格以赛区规则为准。',
    trainingFocus: ['高频算法专题训练', '三人分工与代码规范', '每周 5 小时组队训练', 'VP 全真赛复盘'],
  }),
  make(5, '全国大学生数学建模竞赛', '国赛数模', 'science', ['all', 'science'], ['math:4', 'algorithms:4', 'programming:3', 'writing:4'], {
    website: 'http://www.mcm.edu.cn/',
    organizer: '中国工业与应用数学学会',
    tags: ['数学建模', '数据分析', '论文写作'],
    regMonths: [5, 6, 7, 8],
    eventMonths: [9],
    prepWeeks: 8,
    difficulty: 4.2,
    development: 96,
    team: '3 人',
    format: '团队赛（3 人）',
    location: '线上开赛 / 各校组织',
    tracks: [
      { name: '建模与论文主线', desc: '负责模型构建、论文架构与结果解释。', skills: ['math', 'writing', 'algorithms'] },
      { name: '编程求解方向', desc: '用 Python/MATLAB 完成数据处理、求解与可视化。', skills: ['programming', 'algorithms', 'ai'] },
      { name: '综合协作路线', desc: '负责资料检索、模型复核、英文摘要与整体统稿。', skills: ['research', 'teamwork', 'writing'] },
    ],
    intro: '面向实际问题的高强度三人建模赛事，强调从问题抽象、模型构建到论文呈现的完整闭环。',
    requirements: '一般面向全日制本科生，3 人组队，同一学校参赛；禁止跨校组队，具体要求以当年通知为准。',
    trainingFocus: ['掌握常见模型与求解工具', '真题限时训练', '论文模板与摘要训练', '三人协作衔接演练'],
  }),
  make(6, '全国大学生电子设计竞赛', '电赛', 'engineering', ['electronics', 'engineering'], ['systems:4', 'electronics:4', 'programming:3', 'engineering:4'], {
    website: 'http://www.nuedcchina.com/',
    organizer: '教育部高等教育司、工业和信息化部人事教育司',
    tags: ['电子设计', '硬件开发', '系统联调'],
    regMonths: [4, 5, 6, 7],
    eventMonths: [8],
    prepWeeks: 14,
    difficulty: 4.5,
    development: 95,
    team: '3 人',
    format: '团队赛（3 人）',
    location: '各赛区集中测评 / 全国评审',
    tracks: [
      { name: '控制与仪器类', desc: '涉及单片机、控制算法、传感器与仪器设计。', skills: ['systems', 'programming', 'electronics'] },
      { name: '通信与信号类', desc: '聚焦通信链路、信号处理与射频实现。', skills: ['electronics', 'math', 'systems'] },
      { name: '电源与系统类', desc: '强调电力电子、系统稳定性与工程实现。', skills: ['engineering', 'electronics', 'execution'] },
    ],
    intro: '电赛以封闭式命题、限时设计与实物测评著称，是电子信息类学生最具含金量的工程实践赛事之一。',
    requirements: '一般面向本科生，3 人组队；国赛通常隔年举办并区分本专科组，需通过学校报名与选拔。',
    trainingFocus: ['常用电路模块储备', '单片机/控制算法训练', '往届赛题复现', '限时联调与故障排查'],
  }),
  make(7, '中国大学生医学技术技能大赛', '医学技能大赛', 'medicine', ['medicine'], ['research:3', 'execution:4', 'teamwork:4', 'presentation:2'], {
    website: 'https://medu.bjmu.edu.cn/cms/show.action?code=publish_4af037e16e264f60016eaa7dea950ef4&siteid=100001',
    organizer: '教育部、国家卫生健康委员会',
    tags: ['医学技能', '临床实践', '团队协作'],
    degrees: ['本科'],
    restrictedFields: ['medicine'],
    eligibility: '主要面向医学类专业本科生，通常需通过院校选拔与培训。',
    requirements: '以医学类专业学生为主，需具备临床思维与规范操作基础；具体专业与年级要求以当年通知为准。',
    team: '团队（人数以通知为准）',
  }),
  make(8, '全国大学生机械创新设计大赛', '机械创新', 'engineering', ['engineering'], ['engineering:4', 'design:3', 'systems:3', 'teamwork:3'], {
    website: 'http://umic.ckcest.cn/',
    organizer: '教育部高等学校机械基础课程教学指导委员会',
    tags: ['机械创新', '原型制作', '方案设计'],
    team: '2–5 人',
    trainingFocus: ['拆解赛题并完成需求分析', '机构方案对比与仿真', '原型加工与可靠性测试', '作品视频与答辩准备'],
  }),
  make(9, '全国大学生结构设计竞赛', '结构设计', 'engineering', ['engineering'], ['engineering:4', 'math:2', 'execution:4', 'design:3'], {
    website: 'http://www.structurecontest.com/',
    organizer: '中国高等教育学会工程教育专业委员会等',
    tags: ['结构设计', '力学分析', '模型制作'],
    team: '3 人',
    trainingFocus: ['结构方案与受力分析', '模型制作工艺', '加载试验与优化', '限时制作训练'],
  }),
  make(10, '全国大学生广告艺术大赛', '大广赛', 'design', ['design', 'humanities'], ['design:4', 'media:3', 'writing:3', 'presentation:2'], {
    website: 'https://www.sun-ada.net/',
    organizer: '全国大学生广告艺术大赛组委会',
    tags: ['广告创意', '品牌传播', '视觉内容'],
    team: '1–5 人',
    tracks: [
      { name: '平面设计方向', desc: '用海报、品牌视觉与图形语言完成命题创作。', skills: ['design', 'writing', 'presentation'] },
      { name: '视频与动画方向', desc: '适合具备影视拍摄、剪辑或动画能力的学生。', skills: ['media', 'design', 'execution'] },
      { name: '策划案方向', desc: '从消费者洞察出发完成整合营销传播方案。', skills: ['writing', 'business', 'presentation'] },
    ],
    trainingFocus: ['拆解品牌命题', '完成创意概念发散', '打磨成稿与系列一致性', '准备作品说明与展示'],
  }),
  make(11, '全国大学生智能汽车竞赛', '智能汽车', 'engineering', ['electronics', 'engineering', 'cs'], ['systems:4', 'programming:4', 'electronics:4', 'engineering:4'], {
    website: 'http://www.eepw.com.cn/event/action/freescale_car2012/',
    organizer: '中国自动化学会',
    tags: ['智能车', '控制算法', '嵌入式'],
    team: '3–5 人',
    mode: '分区赛 + 全国总决赛',
    eventMonths: [7, 8],
    regMonths: [11, 12, 1],
    tracks: [
      { name: '控制算法主线', desc: '负责循迹、控制策略、参数整定与稳定性优化。', skills: ['systems', 'programming', 'math'] },
      { name: '硬件与电路方向', desc: '负责驱动、传感器、电源和整车硬件可靠性。', skills: ['electronics', 'engineering', 'execution'] },
      { name: '软硬协同集成', desc: '承担系统联调、赛道测试与现场排障。', skills: ['systems', 'teamwork', 'execution'] },
    ],
    trainingFocus: ['平台搭建与传感器标定', '控制算法迭代', '赛道实测与参数调优', '整车可靠性验证'],
  }),
  make(12, '全国大学生电子商务“创新、创意及创业”挑战赛', '三创赛', 'business', ['business', 'innovation'], ['business:4', 'presentation:3', 'design:2', 'execution:3'], {
    website: 'http://www.3chuang.net/',
    organizer: '全国电子商务产教融合创新联盟等',
    tags: ['电子商务', '创业实战', '商业模式'],
    tracks: [
      { name: '常规赛', desc: '围绕电商项目创意、商业模式与运营计划进行评审。', skills: ['business', 'presentation', 'design'] },
      { name: '实战赛', desc: '基于真实平台或企业命题开展运营，关注增长与转化数据。', skills: ['business', 'execution', 'ai'] },
      { name: '跨境/乡村振兴赛道', desc: '聚焦跨境业务或助农场景，强调市场洞察与落地成效。', skills: ['business', 'research', 'teamwork'] },
    ],
  }),
  make(13, '中国大学生工程实践与创新能力大赛', '工创大赛', 'engineering', ['engineering', 'electronics'], ['engineering:4', 'systems:4', 'programming:3', 'execution:4'], {
    website: 'http://www.gcxl.edu.cn/new/index.html',
    organizer: '教育部高等教育司',
    tags: ['工程训练', '智能制造', '综合实践'],
    team: '3–4 人',
    trainingFocus: ['理解工程命题', '结构/控制方案设计', '加工装配与联调', '成本与工程规范复核'],
  }),
  make(14, '全国大学生物流设计大赛', '物流设计', 'business', ['business', 'engineering'], ['business:3', 'algorithms:3', 'research:3', 'presentation:3'], {
    website: 'http://www.clpp.org.cn/',
    organizer: '中国物流与采购联合会',
    tags: ['物流系统', '运筹优化', '企业案例'],
    team: '3–5 人',
  }),
  make(15, '“外研社·国才杯”“理解当代中国”全国大学生外语能力大赛', '外研社·国才杯', 'humanities', ['humanities', 'all'], ['english:4', 'writing:4', 'presentation:4', 'research:2'], {
    website: 'http://uchallenge.unipus.cn/',
    organizer: '外语教学与研究出版社',
    tags: ['英语演讲', '写作', '跨文化'],
    eventMonths: [10, 11, 12],
    regMonths: [4, 5, 6, 7, 8, 9],
    degrees: ['本科', '硕士'],
    tracks: [
      { name: '英语演讲', desc: '强调观点组织、语言质量、临场应变与感染力。', skills: ['english', 'presentation', 'writing'] },
      { name: '英语写作', desc: '考察议论文/说明文写作、逻辑论证与语言准确度。', skills: ['english', 'writing', 'research'] },
      { name: '阅读/翻译方向', desc: '强调高阶阅读理解、跨文化理解与表达能力。', skills: ['english', 'research', 'writing'] },
    ],
    trainingFocus: ['高频主题论点积累', '即兴演讲录音复盘', '限时写作训练', '跨文化案例准备'],
  }),
  make(16, '两岸新锐设计竞赛·华灿奖', '华灿奖', 'design', ['design', 'humanities'], ['design:4', 'media:3', 'presentation:2', 'innovation:3'], {
    website: 'http://www.huacanjiang.com/home',
    organizer: '中国高等教育学会等',
    tags: ['设计竞赛', '两岸交流', '创意作品'],
    team: '1–5 人',
  }),
  make(17, '全国大学生创新创业训练计划年会展示', '大创年会', 'innovation', ['all', 'innovation'], ['research:3', 'innovation:3', 'presentation:3', 'execution:3'], {
    website: 'http://gjcxcy.bjtu.edu.cn/Index.aspx',
    organizer: '教育部高等教育司',
    tags: ['大创项目', '成果展示', '学术交流'],
    degrees: ['本科'],
    eligibility: '通常面向已立项的国家级/省级大学生创新创业训练计划项目团队，需学校推荐。',
    requirements: '以已立项大创项目为基础，经学校遴选推荐参加展示；具体申报资格以当年通知为准。',
  }),
  make(18, '全国大学生化工设计竞赛', '化工设计', 'engineering', ['engineering', 'science'], ['engineering:4', 'science:3', 'math:3', 'teamwork:4'], {
    website: 'http://iche.zju.edu.cn/',
    organizer: '中国化工学会',
    tags: ['化工设计', '流程模拟', '工程图纸'],
    team: '3–5 人',
    trainingFocus: ['化工流程与工艺选择', 'Aspen 等流程模拟', '设备与图纸设计', '工程经济与答辩'],
  }),
  make(19, '全国大学生机器人大赛', 'ROBOCON', 'engineering', ['engineering', 'electronics', 'cs'], ['systems:4', 'programming:4', 'engineering:4', 'teamwork:4'], {
    website: 'https://www.cnrobocon.net/',
    organizer: '共青团中央、全国学联',
    tags: ['机器人', '机械结构', '自动控制'],
    team: '5–15 人',
    trainingFocus: ['规则拆解与机器人方案', '机械/电控/算法联调', '场地测试与对抗演练', '备件与现场维护'],
    development: 92,
  }),
  make(20, '全国大学生市场调查与分析大赛', '市调大赛', 'business', ['business', 'all'], ['business:3', 'research:4', 'math:3', 'presentation:4'], {
    website: 'http://www.china-cssc.org/list-56-1.html',
    organizer: '中国商业统计学会',
    tags: ['市场调查', '统计分析', '报告答辩'],
    team: '3–5 人',
    regMonths: [10, 11, 12, 1, 2, 3],
    eventMonths: [4, 5],
    tracks: [
      { name: '自主命题调研', desc: '自选真实市场问题，完成抽样、分析与报告撰写。', skills: ['research', 'math', 'presentation'] },
      { name: '企业命题方向', desc: '针对企业真实业务问题提交洞察与策略建议。', skills: ['business', 'ai', 'presentation'] },
      { name: '数据可视化路线', desc: '强化统计建模、可视化和结论表达。', skills: ['math', 'ai', 'design'] },
    ],
  }),
  make(21, '全国大学生先进成图技术与产品信息建模创新大赛', '成图大赛', 'engineering', ['engineering'], ['engineering:4', 'design:3', 'systems:3', 'execution:4'], {
    website: 'http://www.chengtudasai.com/',
    organizer: '教育部高等学校工程图学课程教学指导分委员会',
    tags: ['工程制图', '三维建模', 'BIM'],
    team: '1–5 人',
  }),
  make(22, '全国三维数字化创新设计大赛', '3D大赛', 'design', ['design', 'engineering'], ['design:4', 'engineering:3', 'media:3', 'systems:3'], {
    website: 'https://3dds.3ddl.net/',
    organizer: '全国三维数字化创新设计大赛组委会',
    tags: ['三维建模', '数字孪生', '创新设计'],
    team: '2–5 人',
  }),
  make(23, '“西门子杯”中国智能制造挑战赛', '西门子杯', 'engineering', ['engineering', 'electronics'], ['engineering:4', 'systems:4', 'programming:3', 'teamwork:3'], {
    website: 'http://www.siemenscup-cimc.org.cn/',
    organizer: '教育部高等学校自动化类专业教学指导委员会等',
    tags: ['智能制造', '工业自动化', 'PLC'],
    team: '2–3 人',
  }),
  make(24, '中国大学生服务外包创新创业大赛', '服务外包大赛', 'computer', ['cs', 'business'], ['programming:4', 'business:3', 'teamwork:3', 'presentation:3'], {
    website: 'http://www.fwwb.org.cn/',
    organizer: '教育部、商务部等',
    tags: ['软件外包', '企业命题', '创新创业'],
    team: '3–5 人',
  }),
  make(25, '中国大学生计算机设计大赛', '计算机设计', 'computer', ['cs', 'design'], ['programming:4', 'design:3', 'media:3', 'ai:3'], {
    website: 'http://jsjds.blcu.edu.cn/',
    organizer: '中国大学生计算机设计大赛组委会',
    tags: ['软件应用', '数字媒体', '人工智能'],
    team: '2–5 人',
    tracks: [
      { name: '软件应用与开发', desc: '完成 Web/移动应用、系统工具或行业软件作品。', skills: ['programming', 'systems', 'execution'] },
      { name: '人工智能应用', desc: '用机器学习、视觉或大模型技术解决具体问题。', skills: ['ai', 'algorithms', 'programming'] },
      { name: '数媒与交互设计', desc: '围绕视觉内容、动画、游戏或交互体验创作。', skills: ['design', 'media', 'programming'] },
    ],
    trainingFocus: ['确定赛项与作品边界', '完成可演示原型', '补充技术文档与视频', '赛前演示与答辩演练'],
  }),
  make(26, '中国高校计算机大赛', '高校计算机大赛', 'computer', ['cs'], ['programming:4', 'algorithms:4', 'ai:3', 'teamwork:3'], {
    website: 'http://www.c4best.cn/',
    organizer: '教育部高等学校计算机类专业教学指导委员会等',
    tags: ['计算机系统', 'AI应用', '移动应用'],
    team: '1–4 人',
    tracks: [
      { name: '团体程序设计天梯赛', desc: '以团队编程做题为主，强调基础算法与代码稳定性。', skills: ['programming', 'algorithms', 'teamwork'] },
      { name: '人工智能创意赛', desc: '围绕 AI 技术完成创新应用与演示。', skills: ['ai', 'programming', 'design'] },
      { name: '移动应用创新方向', desc: '完成移动端产品设计、开发与用户体验打磨。', skills: ['programming', 'design', 'execution'] },
    ],
  }),
  make(27, '蓝桥杯全国软件和信息技术专业人才大赛', '蓝桥杯', 'computer', ['cs', 'electronics'], ['programming:4', 'algorithms:4', 'networking:3', 'security:3'], {
    website: 'http://dasai.lanqiao.cn/',
    organizer: '工业和信息化部人才交流中心',
    tags: ['程序设计', '软件赛', '电子赛'],
    regMonths: [10, 11, 12],
    eventMonths: [3, 4, 5, 6],
    prepWeeks: 10,
    difficulty: 3.5,
    development: 88,
    mode: '线上/线下省赛 + 全国总决赛',
    location: '各省赛点 / 全国总决赛承办校',
    format: '个人赛',
    team: '1 人',
    tracks: [
      { name: 'C/C++ 程序设计', desc: '适合 C/C++ 基础扎实、准备算法与系统类岗位的学生。', skills: ['programming', 'algorithms', 'systems'] },
      { name: 'Python 程序设计', desc: '适合 Python 熟练、希望快速积累竞赛成果的学生。', skills: ['programming', 'algorithms', 'ai'] },
      { name: '网络安全赛道', desc: '围绕网络协议、安全基础与实战题进行竞赛。', skills: ['security', 'networking', 'programming'] },
      { name: '嵌入式设计与开发', desc: '涉及单片机、硬件调试与嵌入式程序开发。', skills: ['systems', 'electronics', 'programming'] },
    ],
    intro: '蓝桥杯考察真实编程与工程实践能力，赛制清晰、备赛路径明确，适合作为大二学生的第一项国家级赛事成果。',
    description: '大赛包含软件赛、电子赛、视觉艺术设计等方向，通常采用校赛/省赛到全国总决赛的晋级机制。软件赛以限时编程和客观题为主，重视基础、算法与代码实现效率。',
    requirements: '高校在校生可报名，组别与科目按本科/研究生等身份划分；部分院校组织校内选拔，建议关注学校通知。',
    trainingFocus: ['近五年真题分类训练', '限时编程与调试速度', '易错知识点专题复盘', '模拟赛场压力测试'],
    certHints: ['蓝桥杯', '计算机等级', '软考', 'CET-4', 'CET-6'],
  }),
  make(28, '米兰设计周--中国高校设计学科师生优秀作品展', '米兰设计周', 'design', ['design', 'humanities'], ['design:4', 'media:4', 'presentation:3', 'research:2'], {
    website: 'http://www.dandad.cn/',
    organizer: '中国教育国际交流协会等',
    tags: ['设计作品', '国际交流', '视觉表达'],
    team: '1–3 人',
  }),
  make(29, '全国大学生地质技能竞赛', '地质技能', 'science', ['science', 'engineering'], ['research:4', 'engineering:3', 'teamwork:3', 'execution:3'], {
    website: 'https://yuanxi.cugb.edu.cn/competition/',
    organizer: '中国地质学会等',
    tags: ['地质技能', '野外实践', '专业竞赛'],
    restrictedFields: ['science'],
  }),
  make(30, '全国大学生光电设计竞赛', '光电设计', 'science', ['electronics', 'science'], ['electronics:4', 'engineering:4', 'systems:3', 'research:3'], {
    website: 'http://gd.p.moocollege.com/',
    organizer: '中国光学学会',
    tags: ['光电设计', '硬件系统', '创新实践'],
    team: '2–3 人',
  }),
  make(31, '全国大学生集成电路创新创业大赛', '集创赛', 'computer', ['electronics', 'cs'], ['electronics:4', 'systems:4', 'programming:3', 'engineering:3'], {
    website: 'http://univ.ciciec.com/',
    organizer: '工业和信息化部人才交流中心',
    tags: ['集成电路', '芯片设计', 'EDA'],
    team: '2–3 人',
  }),
  make(32, '全国大学生金相技能大赛', '金相大赛', 'science', ['science', 'engineering'], ['research:4', 'engineering:4', 'execution:4', 'teamwork:2'], {
    website: 'http://www.jxds.tech/',
    organizer: '教育部高等学校材料类专业教学指导委员会',
    tags: ['材料科学', '金相制样', '实验技能'],
    team: '1–3 人',
    restrictedFields: ['science', 'engineering'],
  }),
  make(33, '全国大学生信息安全竞赛', '信安大赛', 'computer', ['cs'], ['security:5', 'networking:4', 'programming:4', 'teamwork:3'], {
    website: 'http://www.ciscn.cn/',
    organizer: '教育部高等学校网络空间安全专业教学指导委员会',
    tags: ['网络安全', 'CTF', '作品赛'],
    eventMonths: [5, 6, 7, 8],
    prepWeeks: 12,
    difficulty: 4.4,
    development: 93,
    team: '1–4 人',
    tracks: [
      { name: '创新实践能力赛', desc: '以 CTF 解题与攻防对抗为主，考察逆向、Web、密码学等综合能力。', skills: ['security', 'networking', 'programming'] },
      { name: '作品赛', desc: '围绕安全系统、协议分析或安全工具完成创新作品。', skills: ['security', 'programming', 'research'] },
      { name: '安全运营方向', desc: '关注流量分析、应急响应与安全加固实践。', skills: ['security', 'networking', 'execution'] },
    ],
    intro: '网络空间安全领域最具认可度的国家级赛事之一，适合有 CTF 基础、想系统提升攻防与安全工程能力的学生。',
    requirements: '面向高校在校生，通常需通过校内选拔或指定平台报名；不同赛道对队伍人数与作品原创性要求不同。',
    location: '线上初赛 / 线下决赛承办高校',
    trainingFocus: ['Web/逆向/密码/杂项专项训练', '团队解题分工与靶场练习', '往届真题复现', '现场攻防节奏模拟'],
    certHints: ['CISP', 'NISP', 'HCIA', 'CET-4', 'CET-6'],
  }),
  make(34, '未来设计师·全国高校数字艺术设计大赛', 'NCDA', 'design', ['design', 'cs'], ['design:4', 'media:4', 'ai:2', 'presentation:2'], {
    website: 'https://www.ncda.org.cn/',
    organizer: '工业和信息化部人才交流中心等',
    tags: ['数字艺术', '视觉设计', '交互设计'],
    team: '1–3 人',
  }),
  make(35, '全国周培源大学生力学竞赛', '力学竞赛', 'science', ['science', 'engineering'], ['math:4', 'research:3', 'engineering:3', 'algorithms:2'], {
    website: 'http://zpy.cstam.org.cn/index.aspx',
    organizer: '中国力学学会等',
    tags: ['力学', '理论分析', '竞赛解题'],
    format: '个人赛',
    team: '1 人',
  }),
  make(36, '中国大学生机械工程创新创意大赛', '机械工程创新创意', 'engineering', ['engineering'], ['engineering:4', 'design:3', 'systems:3', 'execution:4'], {
    website: 'http://www.gczbds.org',
    organizer: '中国机械工程学会等',
    tags: ['机械工程', '创新设计', '工程实践'],
    team: '2–5 人',
  }),
  make(37, '中国机器人大赛暨RoboCup机器人世界杯中国赛', '中国机器人大赛', 'engineering', ['engineering', 'electronics', 'cs'], ['systems:5', 'programming:4', 'engineering:4', 'teamwork:4'], {
    website: 'http://crc.drct-caa.org.cn/',
    organizer: '中国自动化学会',
    tags: ['机器人', '具身智能', '系统集成'],
    team: '3–8 人',
  }),
  make(38, '“中国软件杯”大学生软件设计大赛', '中国软件杯', 'computer', ['cs', 'business'], ['programming:4', 'systems:3', 'teamwork:3', 'execution:3'], {
    website: 'http://www.cnsoftbei.com/',
    organizer: '工业和信息化部、教育部等',
    tags: ['软件设计', '企业命题', '系统开发'],
    team: '1–4 人',
  }),
  make(39, '中美青年创客大赛', '中美创客', 'innovation', ['all', 'innovation'], ['innovation:4', 'business:3', 'design:3', 'execution:3'], {
    website: 'https://chinaus-maker.cscse.edu.cn/',
    organizer: '教育部留学服务中心等',
    tags: ['创客', '原型开发', '国际交流'],
    team: '2–5 人',
  }),
  make(40, '睿抗机器人开发者大赛（RAICOM）', '睿抗RAICOM', 'engineering', ['engineering', 'electronics', 'cs'], ['systems:4', 'programming:4', 'engineering:4', 'teamwork:3'], {
    website: 'https://www.robocom.com.cn/',
    organizer: '工业和信息化部人才交流中心等',
    tags: ['机器人开发', '算法应用', '工程实践'],
    team: '2–5 人',
  }),
  make(41, '“大唐杯”全国大学生新一代信息通信技术大赛', '大唐杯', 'computer', ['electronics', 'cs'], ['networking:4', 'systems:4', 'programming:3', 'engineering:3'], {
    website: 'https://dtcup.dtxiaotangren.com',
    organizer: '工业和信息化部人才交流中心等',
    tags: ['5G通信', '网络工程', '工程实践'],
    regMonths: [9, 10, 11, 12],
    eventMonths: [3, 4, 5, 6],
    team: '2 人',
    tracks: [
      { name: '工程实践赛', desc: '围绕 5G 网络规划、部署与优化完成实操任务。', skills: ['networking', 'systems', 'execution'] },
      { name: '仿真实践赛', desc: '通过仿真平台完成通信系统配置与问题排查。', skills: ['networking', 'systems', 'programming'] },
      { name: '创新应用方向', desc: '将 5G/物联网能力应用到垂直行业场景。', skills: ['systems', 'programming', 'design'] },
    ],
    trainingFocus: ['5G 网络架构与协议', '仿真平台操作', '网络优化案例', '双人协作与限时实操'],
  }),
  make(42, '华为ICT大赛', '华为ICT', 'computer', ['electronics', 'cs'], ['networking:4', 'systems:4', 'ai:3', 'security:3'], {
    website: 'https://e.huawei.com/cn/talent/ict-academy/#/ict-contest?compId=85131973',
    organizer: '华为技术有限公司',
    tags: ['华为认证', 'ICT', '网络与云'],
    regMonths: [9, 10, 11],
    eventMonths: [11, 12, 1, 2, 3, 4, 5],
    prepWeeks: 12,
    difficulty: 3.8,
    development: 91,
    team: '3 人',
    tracks: [
      { name: '网络赛道', desc: '围绕数据通信、路由交换与网络规划优化展开。', skills: ['networking', 'systems', 'execution'] },
      { name: '云赛道', desc: '涉及云计算、云服务与基础架构部署。', skills: ['systems', 'networking', 'programming'] },
      { name: '计算赛道', desc: '关注操作系统、数据库、AI 计算基础与工程能力。', skills: ['systems', 'programming', 'ai'] },
    ],
    intro: '华为ICT大赛与产业认证体系衔接紧密，网络、云与计算方向认可度高，适合网络工程、通信与计算机专业学生。',
    requirements: '面向高校在校生，一般 3 人组队，分实践赛与创新赛等类别；具体赛道与晋级规则以官网为准。',
    trainingFocus: ['Datacom/云服务知识体系', 'eNSP 等实验环境训练', '历年真题与模拟赛', '三人分工与现场协作'],
    certHints: ['HCIA', 'HCIP', 'HCIE'],
  }),
  make(43, '全国大学生嵌入式芯片与系统设计竞赛', '嵌入式竞赛', 'computer', ['electronics', 'cs'], ['systems:5', 'electronics:4', 'programming:4', 'engineering:3'], {
    website: 'http://www.socchina.net/',
    organizer: '教育部高等学校电子信息类专业教学指导委员会等',
    tags: ['嵌入式', '芯片应用', '系统设计'],
    team: '2–3 人',
  }),
  make(44, '全国大学生生命科学竞赛（CULSC）', '生命科学竞赛', 'medicine', ['science', 'medicine'], ['research:5', 'writing:3', 'teamwork:3', 'presentation:3'], {
    website: 'https://www.culsc.cn/#/',
    organizer: '教育部高等学校生物科学类专业教学指导委员会等',
    tags: ['生命科学', '科研探究', '实验设计'],
    team: '1–5 人',
  }),
  make(45, '全国大学生物理实验竞赛', '物理实验竞赛', 'science', ['science'], ['research:4', 'math:3', 'engineering:3', 'presentation:3'], {
    website: 'http://wlsycx.moocollege.com/',
    organizer: '国家级实验教学示范中心联席会等',
    tags: ['物理实验', '实验创新', '科研表达'],
    team: '1–4 人',
  }),
  make(46, '国际高校BIM毕业设计创新大赛', 'BIM大赛', 'engineering', ['engineering'], ['engineering:4', 'design:3', 'systems:3, teamwork:3'], {
    website: 'http://gxbsxs.glodonedu.com/',
    organizer: '中国建设教育协会等',
    tags: ['BIM', '建筑信息模型', '毕业设计'],
    team: '2–5 人',
  }),
  make(47, '全国高校商业精英挑战赛', '商业精英挑战赛', 'business', ['business'], ['business:4', 'presentation:4', 'teamwork:3', 'research:3'], {
    website: 'http://cubec.org.cn/',
    organizer: '中国国际商会商业行业商会等',
    tags: ['商业案例', '会展策划', '经营模拟'],
    team: '3–5 人',
  }),
  make(48, '“学创杯”全国大学生创业综合模拟大赛', '学创杯', 'business', ['business', 'all'], ['business:4', 'execution:4', 'teamwork:4', 'math:2'], {
    website: 'http://www.bster.cn/cyds/index',
    organizer: '高等学校国家级实验教学示范中心联席会',
    tags: ['创业模拟', '经营决策', '沙盘'],
    team: '3 人',
  }),
  make(49, '中国高校智能机器人创意大赛', '智能机器人创意', 'engineering', ['engineering', 'cs', 'design'], ['systems:4', 'programming:3', 'design:4', 'innovation:4'], {
    website: 'http://www.robotcontest.cn/',
    organizer: '中国高等教育学会等',
    tags: ['智能机器人', '创意设计', '系统实现'],
    team: '2–5 人',
  }),
  make(50, '中国好创意暨全国数字艺术设计大赛', '中国好创意', 'design', ['design', 'cs'], ['design:4', 'media:4', 'writing:2', 'presentation:2'], {
    website: 'https://www.cdec.org.cn/',
    organizer: '中国好创意暨全国数字艺术设计大赛组委会',
    tags: ['数字艺术', '创意设计', '作品征集'],
    team: '1–4 人',
  }),
  make(51, '中国机器人及人工智能大赛', '机器人及AI大赛', 'engineering', ['engineering', 'cs', 'electronics'], ['systems:4', 'ai:4', 'programming:4', 'engineering:4'], {
    website: 'https://developer.apollo.auto/devcenter/gameOperations_cn.html?target=3',
    organizer: '中国自动化学会等',
    tags: ['机器人', '人工智能', '自动驾驶'],
    team: '2–5 人',
  }),
  make(52, '全国大学生节能减排社会实践与科技竞赛', '节能减排竞赛', 'science', ['engineering', 'science', 'all'], ['research:3', 'engineering:4', 'innovation:4', 'writing:3'], {
    website: 'http://www.jienengjianpai.org/',
    organizer: '教育部高等教育司等',
    tags: ['节能减排', '绿色技术', '社会实践'],
    team: '3–7 人',
  }),
  make(53, '“21世纪杯”全国英语演讲比赛', '21世纪杯', 'humanities', ['humanities', 'all'], ['english:5', 'presentation:5', 'writing:3', 'research:2'], {
    website: 'https://contest.i21st.cn/',
    organizer: '中国日报社',
    tags: ['英语演讲', '国际表达', '即兴演讲'],
    regMonths: [9, 10, 11, 12],
    eventMonths: [1, 2, 3, 4],
    format: '个人赛',
    team: '1 人',
  }),
  make(54, 'iCAN大学生创新创业大赛', 'iCAN', 'innovation', ['all', 'innovation'], ['innovation:4', 'engineering:3', 'presentation:3, teamwork:3'], {
    website: 'http://www.g-ican.com/home/index',
    organizer: 'iCAN 国际创新创业大赛组委会',
    tags: ['创新创业', '智能硬件', '项目路演'],
    team: '2–5 人',
  }),
  make(55, '“工行杯”全国大学生金融科技创新大赛', '工行杯', 'business', ['business', 'cs'], ['business:4', 'ai:3', 'programming:3, presentation:3'], {
    website: 'http://www.gonghangbei.com',
    organizer: '中国工商银行',
    tags: ['金融科技', '场景创新', '数据应用'],
    team: '1–5 人',
  }),
  make(56, '中华经典诵写讲大赛', '诵写讲大赛', 'humanities', ['humanities', 'all'], ['writing:4', 'presentation:4', 'research:3, media:3'], {
    website: 'https://jdsxj.eduyun.cn/',
    organizer: '教育部、国家语委',
    tags: ['经典诵读', '书法篆刻', '文化传承'],
    team: '1–5 人',
  }),
  make(57, '“外教社杯”全国高校学生跨文化能力大赛', '跨文化能力大赛', 'humanities', ['humanities', 'all'], ['english:4', 'presentation:4', 'research:3, teamwork:3'], {
    website: 'https://ict.sflep.com/index.php?m=content&c=index&a=lists&catid=15',
    organizer: '上海外语教育出版社等',
    tags: ['跨文化交际', '英语表达', '案例展示'],
    team: '3 人',
  }),
  make(58, '百度之星程序设计大赛', '百度之星', 'computer', ['cs'], ['algorithms:5', 'programming:5', 'math:3, teamwork:2'], {
    website: 'https://star.baidu.com/#/',
    organizer: '百度',
    tags: ['算法竞赛', '程序设计', '企业赛事'],
    eventMonths: [9, 10],
    regMonths: [8, 9],
    format: '个人赛',
    team: '1 人',
  }),
  make(59, '全国大学生工业设计大赛', '工业设计大赛', 'design', ['design'], ['design:4', 'research:3', 'presentation:3, media:2'], {
    website: 'https://www.cuidc.net/#/',
    organizer: '全国工业设计一流专业建设协同创新平台等',
    tags: ['工业设计', '产品创新', '用户研究'],
    team: '1–4 人',
  }),
  make(60, '全国大学生水利创新设计大赛', '水利创新', 'agriculture', ['engineering', 'agriculture'], ['engineering:4', 'research:3', 'design:3, teamwork:3'], {
    website: 'https://sljzw.hhu.edu.cn/fenhui/2023/0411/c12009a259306/page.htm',
    organizer: '中国水利教育协会等',
    tags: ['水利工程', '创新设计', '工程实践'],
    team: '3–5 人',
  }),
  make(61, '全国大学生化工实验大赛', '化工实验大赛', 'science', ['science', 'engineering'], ['research:4', 'engineering:3', 'execution:3, teamwork:3'], {
    website: 'http://www.cteic.com/higherEducation-199.html',
    organizer: '教育部高等学校化工类专业教学指导委员会等',
    tags: ['化工实验', '实验操作', '安全规范'],
    team: '3 人',
  }),
  make(62, '全国大学生化学实验创新设计大赛', '化学实验创新', 'science', ['science'], ['research:4', 'innovation:3', 'writing:3, presentation:3'], {
    website: 'https://cid.nju.edu.cn/',
    organizer: '教育部高等学校化学类专业教学指导委员会',
    tags: ['化学实验', '创新设计', '科研表达'],
    team: '3 人',
  }),
  make(63, '全国大学生计算机系统能力大赛', '系统能力大赛', 'computer', ['cs'], ['systems:5', 'programming:5', 'engineering:3, teamwork:3'], {
    website: 'https://compiler.educg.net/#/',
    organizer: '全国高等学校计算机教育研究会',
    tags: ['编译系统', '操作系统', '系统能力'],
    team: '1–4 人',
  }),
  make(64, '全国大学生花园设计建造竞赛', '花园设计建造', 'design', ['design', 'agriculture', 'engineering'], ['design:4', 'engineering:3', 'teamwork:4, execution:4'], {
    website: 'http://www.lalavision.com/hysjjzjs',
    organizer: '中国风景园林学会等',
    tags: ['花园建造', '景观设计', '实景搭建'],
    team: '3–6 人',
  }),
  make(65, '全国大学生物联网设计竞赛', '物联网设计竞赛', 'computer', ['cs', 'electronics'], ['systems:4', 'programming:4', 'networking:3, innovation:3'], {
    website: 'https://developer.huaweicloud.com/college/wulianwang.html',
    organizer: '教育部高等学校计算机类专业教学指导委员会',
    tags: ['物联网', '鸿蒙', '华为云'],
    team: '2–3 人',
  }),
  make(66, '全国大学生信息安全与对抗技术竞赛', '信息对抗竞赛', 'computer', ['cs'], ['security:4', 'networking:4', 'programming:3, execution:3'], {
    website: 'http://www.isclab.org.cn',
    organizer: '中国兵工学会等',
    tags: ['信息安全', '对抗技术', '攻防实践'],
    regMonths: [9, 10, 11, 12],
    eventMonths: [3, 4, 5],
    team: '1–3 人',
  }),
  make(67, '全国大学生测绘学科创新创业智能大赛', '测绘智能大赛', 'engineering', ['engineering', 'science'], ['engineering:4', 'research:3', 'programming:3, teamwork:3'], {
    website: 'http://smt.whu.edu.cn/index.htm',
    organizer: '教育部高等学校测绘类专业教学指导委员会等',
    tags: ['测绘', '地理信息', '智能应用'],
    team: '3–5 人',
  }),
  make(68, '全国大学生统计建模大赛', '统计建模', 'science', ['science', 'business', 'all'], ['math:4', 'ai:4', 'research:3, writing:4'], {
    website: 'http://tjjmds.ai-learning.net',
    organizer: '中国统计教育学会',
    tags: ['统计建模', '数据分析', '论文写作'],
    team: '3 人',
  }),
  make(69, '全国大学生能源经济学术创意大赛', '能源经济', 'business', ['business', 'science', 'all'], ['research:4', 'writing:4', 'math:3, presentation:3'], {
    website: 'http://energy.qibebt.ac.cn/eneco/contribution/index.html',
    organizer: '中国优选法统筹法与经济数学研究会等',
    tags: ['能源经济', '学术论文', '政策研究'],
    team: '1–4 人',
  }),
  make(70, '全国大学生基础医学创新研究暨实验设计论坛', '基础医学创新', 'medicine', ['medicine', 'science'], ['research:5', 'writing:3', 'presentation:3, teamwork:3'], {
    website: 'http://www.jcyxds.com/',
    organizer: '教育部高等学校基础医学类专业教学指导委员会等',
    tags: ['基础医学', '实验设计', '科研展示'],
    restrictedFields: ['medicine', 'science'],
  }),
  make(71, '全国大学生数字媒体科技作品及创意竞赛', '数字媒体竞赛', 'design', ['design', 'cs'], ['design:4', 'media:4', 'ai:3, programming:3'], {
    website: 'http://mit.caai.cn/',
    organizer: '中国人工智能学会等',
    tags: ['数字媒体', 'AIGC', '交互创意'],
    team: '1–5 人',
  }),
  make(72, '全国本科院校税收风险管控案例大赛', '税收风控案例', 'business', ['business'], ['business:4', 'research:3', 'writing:3, presentation:3'], {
    website: '',
    organizer: '中国注册税务师协会等',
    tags: ['税收风险', '案例分析', '财税实务'],
    team: '3 人',
    extra: { contact: '微信公众号：全国本科院校税收风控案例大赛' },
  }),
  make(73, '全国企业模拟竞赛大赛', '企业模拟竞赛', 'business', ['business'], ['business:4', 'execution:4', 'teamwork:4, math:3'], {
    website: 'http://www.ibizsim.cn/',
    organizer: '中国管理现代化研究会等',
    tags: ['企业模拟', '经营决策', '团队博弈'],
    team: '3 人',
  }),
  make(74, '全国高等院校数智化企业经营沙盘大赛', '数智化沙盘', 'business', ['business'], ['business:4', 'execution:4', 'teamwork:4, ai:2'], {
    website: '',
    organizer: '中国商业联合会',
    tags: ['经营沙盘', '数智化', '决策模拟'],
    team: '3–4 人',
    extra: { contact: '报名与赛程以中国商业联合会及学校通知为准' },
  }),
  make(75, '全国数字建筑创新应用大赛', '数字建筑', 'engineering', ['engineering', 'design'], ['engineering:4', 'design:3', 'systems:3, teamwork:3'], {
    website: 'http://bisai.ccen.com.cn',
    organizer: '中国建设教育协会等',
    tags: ['数字建筑', 'BIM', '智能建造'],
    team: '2–5 人',
  }),
  make(76, '全球校园人工智能算法精英大赛', 'AI算法精英赛', 'computer', ['cs', 'all'], ['ai:5', 'algorithms:5', 'programming:4, research:3'], {
    website: 'https://developer.huawei.com/consumer/cn/activity/digixActivity/digixdetail/101655281685926449',
    organizer: '华为等',
    tags: ['人工智能', '算法竞赛', '产业命题'],
    team: '1–5 人',
  }),
  make(77, '国际大学生智能农业装备创新大赛', '智能农业装备', 'agriculture', ['agriculture', 'engineering', 'electronics'], ['engineering:4', 'systems:4', 'research:3, teamwork:3'], {
    website: 'http://uiaec.ujs.edu.cn',
    organizer: '中国农业机械学会等',
    tags: ['农业装备', '智能控制', '跨学科'],
    team: '3–5 人',
  }),
  make(78, '“科云杯”全国大学生财会职业能力大赛', '科云杯', 'business', ['business'], ['business:4', 'execution:4', 'teamwork:3, math:3'], {
    website: 'http://match.xmkeyun.com.cn/',
    organizer: '中国商业会计学会',
    tags: ['财会', '职业能力', '实务操作'],
    team: '3 人',
  }),
  make(79, '世界职业院校技能大赛', '世界职业院校大赛', 'vocational', ['vocational', 'engineering'], ['execution:5', 'teamwork:3', 'engineering:3, presentation:2'], {
    website: 'https://www.vcsc.org.cn/',
    organizer: '教育部等',
    tags: ['职业技能', '国际赛事', '实操能力'],
    degrees: ['专科（高职）'],
    restrictedFields: ['vocational'],
    eligibility: '面向职业院校学生与相关组别，本科普通专业通常不符合参赛身份要求。',
    team: '团队（以赛项通知为准）',
  }),
  make(80, '全国大学生机器人大赛-RoboTac', 'RoboTac', 'engineering', ['engineering', 'electronics', 'cs'], ['systems:4', 'programming:3', 'engineering:4, teamwork:4'], {
    website: 'http://www.robotac.cn',
    organizer: '共青团中央等',
    tags: ['机器人对抗', '机械设计', '团队协作'],
    team: '5–12 人',
  }),
  make(81, '世界技能大赛', '世界技能大赛', 'vocational', ['vocational', 'engineering'], ['execution:5', 'engineering:4', 'systems:3, teamwork:2'], {
    website: 'https://worldskills.org/',
    organizer: 'WorldSkills International',
    tags: ['世界技能', '职业技能', '国际赛场'],
    degrees: ['专科（高职）', '本科'],
    requirements: '通常存在年龄、职业身份和成员国选拔要求，需通过中国集训队/选拔体系参赛。',
    team: '个人或团队（按项目）',
    difficulty: 4.8,
    development: 93,
    eventMonths: [9, 10, 11],
    regMonths: [1, 2, 3],
  }),
  make(82, '世界技能大赛中国选拔赛', '世赛中国选拔', 'vocational', ['vocational', 'engineering'], ['execution:5', 'engineering:4', 'systems:3, teamwork:2'], {
    website: 'http://worldskillschina.mohrss.gov.cn/',
    organizer: '人力资源和社会保障部',
    tags: ['世界技能', '国家队选拔', '技能实操'],
    degrees: ['专科（高职）', '本科'],
    requirements: '需符合世界技能大赛项目年龄与身份要求，并通过省级、行业选拔逐级晋级。',
    team: '个人或团队（按项目）',
    eventMonths: [3, 4, 5, 6],
    regMonths: [11, 12, 1],
  }),
  make(83, '一带一路暨金砖国家技能发展与技术创新大赛', '金砖技能大赛', 'vocational', ['vocational', 'all', 'engineering'], ['execution:4', 'engineering:3', 'teamwork:3, presentation:3'], {
    website: 'http://www.brskills.com/#/index',
    organizer: '金砖国家工商理事会等',
    tags: ['国际交流', '技能创新', '职业教育'],
    degrees: ['专科（高职）', '本科'],
    team: '1–5 人',
  }),
  make(84, '码蹄杯全国职业院校程序设计大赛', '码蹄杯', 'computer', ['cs', 'vocational'], ['programming:4', 'algorithms:4', 'systems:2, execution:3'], {
    website: 'https://matiji.net/matibei',
    organizer: '全国工业和信息化职业教育教学指导委员会等',
    tags: ['程序设计', '职业教育', '算法竞技'],
    degrees: ['专科（高职）'],
    restrictedFields: ['vocational'],
    eligibility: '面向职业院校学生，普通本科在校生通常不符合参赛组别要求。',
    format: '个人赛',
    team: '1 人',
  }),
];

export const COMPETITION_CATEGORIES = Object.entries(CATEGORY_META).map(([id, meta]) => ({
  id,
  ...meta,
  count: COMPETITIONS.filter((item) => item.category === id).length,
}));

const CUSTOM_CATEGORY_FIELDS = {
  innovation: ['innovation'],
  computer: ['cs'],
  engineering: ['engineering'],
  science: ['science'],
  design: ['design'],
  business: ['business'],
  medicine: ['medicine'],
  humanities: ['humanities'],
  agriculture: ['agriculture'],
  vocational: ['vocational'],
};

const CUSTOM_CATEGORY_SKILLS = {
  innovation: ['business', 'presentation', 'teamwork', 'execution'],
  computer: ['programming', 'algorithms', 'ai', 'teamwork'],
  engineering: ['engineering', 'systems', 'programming', 'execution'],
  science: ['research', 'math', 'writing', 'teamwork'],
  design: ['design', 'media', 'presentation', 'execution'],
  business: ['business', 'writing', 'presentation', 'teamwork'],
  medicine: ['research', 'teamwork', 'writing', 'presentation'],
  humanities: ['writing', 'english', 'presentation', 'research'],
  agriculture: ['research', 'engineering', 'teamwork', 'execution'],
  vocational: ['engineering', 'execution', 'teamwork', 'programming'],
};

export function createCustomCompetition(input, no) {
  const category = CATEGORY_META[input.category] ? input.category : 'innovation';
  const defaults = CATEGORY_DEFAULTS[category];
  const fields = CUSTOM_CATEGORY_FIELDS[category];
  const tags = [...new Set((input.tags || []).map((tag) => tag.trim()).filter(Boolean))].slice(0, 10);
  const short = String(input.name || '').trim().slice(0, 18);
  const regMonths = input.regMonths?.length ? input.regMonths : defaults.regMonths;
  const eventMonths = input.eventMonths?.length ? input.eventMonths : defaults.eventMonths;
  const skills = parseSkills(CUSTOM_CATEGORY_SKILLS[category].map((skill) => `${skill}:3`));
  const tracks = (DEFAULT_TRACKS[category] || []).map((track) => ({
    ...track,
    skills: track.skills.filter((skill) => SKILLS.some((item) => item.id === skill)),
  }));
  const registration = `${monthsText(regMonths)}（用户录入）`;
  const season = `${monthsText(regMonths)}报名 · ${monthsText(eventMonths)}比赛（用户录入）`;
  const requirements = String(input.requirements || '').trim() || '参赛对象及资格要求尚未核实，请以赛事官方通知为准。';

  return {
    id: input.id,
    no,
    name: String(input.name || '').trim(),
    short,
    category,
    categoryMeta: CATEGORY_META[category],
    fields,
    fieldsText: fields.map((field) => FIELD_LABELS[field]).join(' / '),
    open: false,
    website: String(input.website || '').trim(),
    organizer: String(input.organizer || '').trim() || '用户补充，待核实',
    intro: String(input.intro || '').trim() || `${short}由用户添加，赛事信息请以官方通知为准。`,
    description: String(input.description || '').trim() || `${short}的赛事信息由用户整理，具体赛制、报名方式及地点请以赛事官网当年发布为准。`,
    tags,
    skills,
    certHints: [],
    regMonths,
    eventMonths,
    registration,
    season,
    prepWeeks: defaults.prepWeeks,
    difficulty: defaults.difficulty,
    development: defaults.development,
    team: String(input.team || '').trim() || defaults.team,
    format: String(input.format || '').trim() || '团队赛',
    mode: String(input.mode || '').trim() || defaults.mode,
    location: String(input.location || '').trim() || defaults.location,
    degrees: ['专科（高职）', '本科', '硕士', '博士'],
    restrictedFields: [],
    eligibility: requirements,
    requirements,
    highlights: ['赛事信息由用户添加，尚未经过官方核验', '报名时间与比赛安排仅供参考'],
    timeNote: '用户录入的赛程月份仅供规划参考，请以赛事官网当年通知为准。',
    contact: '',
    tracks,
    trainingFocus: ['核对赛事官网及报名资格', '补齐赛项核心能力', '制定分阶段训练目标', '按当年规则完成报名与材料复核'],
    cautions: ['此赛事由用户添加，关键信息尚未经过官方核验'],
    source: '用户添加 · 赛事信息待核实',
    dataYear: null,
    isCustom: true,
  };
}

export function getCompetitionById(id) {
  return COMPETITIONS.find((item) => item.id === id) || null;
}

export function formatMonths(months) {
  return monthsText(months);
}
