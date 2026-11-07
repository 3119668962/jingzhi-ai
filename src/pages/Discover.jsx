import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  Database,
  ExternalLink,
  Globe2,
  GraduationCap,
  LoaderCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { EmptyState, ProgressBar, SourceNotice } from '../components/ui';
import { RecommendationCard } from '../components/CompetitionCard';
import { rankCompetitions } from '../lib/matcher';
import { ALL_MAJORS, GOAL_DIRECTIONS, SKILLS, SKILL_LEVELS } from '../data/profile';
import { api } from '../lib/bridge';

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

const MATCH_STEPS = [
  { label: '读取专业画像', detail: '识别专业族群与赛项方向', icon: GraduationCap },
  { label: '评估能力结构', detail: '对齐 17 维能力、证书与经历', icon: Target },
  { label: '核验时间窗口', detail: '比较期望月份、课程表与赛程', icon: CalendarDays },
  { label: '检查参赛资格', detail: '核查学历、专业与组队门槛', icon: ShieldCheck },
  { label: '计算发展价值', detail: '对齐个人目标与赛事认可度', icon: Sparkles },
];

const RESULT_FILTERS = [
  { id: 'all', label: '全部推荐' },
  { id: 'strong', label: '高度匹配' },
  { id: 'clear', label: '无课程冲突' },
  { id: 'scheduled', label: '已登记赛程' },
];

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

function directionNames(ids = []) {
  return ids
    .map((id) => GOAL_DIRECTIONS.find((direction) => direction.id === id)?.name)
    .filter(Boolean);
}

export default function Discover({
  profile,
  settings,
  userSchedules,
  competitions,
  favorites,
  onToggleFavorite,
  onOpenCompetition,
  onUpdateCriteria,
  onOpenSettings,
  notify,
}) {
  const [draftMajor, setDraftMajor] = useState(profile.major);
  const [draftMonths, setDraftMonths] = useState(profile.goals?.months || [3, 6]);
  const [keyword, setKeyword] = useState('');
  const [applied, setApplied] = useState({
    major: profile.major,
    months: profile.goals?.months || [3, 6],
    keyword: '',
  });
  const [isMatching, setIsMatching] = useState(false);
  const [matchStep, setMatchStep] = useState(0);
  const [resultFilter, setResultFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const [network, setNetwork] = useState({ loading: false, enabled: null, results: [], ran: false });
  const [ai, setAi] = useState({ loading: false, notes: {}, summary: '', error: '', model: '', ran: false });
  const [search, setSearch] = useState({ loading: false, results: [], error: '', query: '', ran: false });
  const runToken = useRef(0);

  useEffect(() => () => {
    runToken.current += 1;
  }, []);

  const searchProfile = useMemo(() => ({ ...profile, major: applied.major }), [profile, applied.major]);

  const ranked = useMemo(
    () =>
      rankCompetitions({
        profile: searchProfile,
        preferredMonths: applied.months,
        keyword: applied.keyword,
        userSchedules,
        competitions,
      }),
    [searchProfile, applied, userSchedules, competitions],
  );

  const aiEnabled = Boolean(settings?.aiEnabled && settings?.hasAiKey);

  const displayResults = useMemo(
    () =>
      ranked.results.map((item) =>
        ai.notes[item.id] ? { ...item, aiEnhance: ai.notes[item.id] } : item,
      ),
    [ranked.results, ai.notes],
  );

  const filterCounts = useMemo(
    () => ({
      all: displayResults.length,
      strong: displayResults.filter((item) => item.total >= 80).length,
      clear: displayResults.filter((item) => !item.conflicts.length).length,
      scheduled: displayResults.filter((item) => item.events.length > 0).length,
    }),
    [displayResults],
  );

  const filteredResults = useMemo(() => {
    if (resultFilter === 'strong') return displayResults.filter((item) => item.total >= 80);
    if (resultFilter === 'clear') return displayResults.filter((item) => !item.conflicts.length);
    if (resultFilter === 'scheduled') return displayResults.filter((item) => item.events.length > 0);
    return displayResults;
  }, [displayResults, resultFilter]);

  const visibleResults = filteredResults.slice(0, visibleCount);

  const runNetworkCheck = async (items) => {
    const targets = items.filter((item) => item.website).slice(0, 5);
    if (!targets.length) {
      setNetwork({ loading: false, enabled: false, results: [], ran: true });
      return;
    }
    setNetwork({ loading: true, enabled: true, results: [], ran: true });
    try {
      const result = await api.verifyWebsites(
        targets.map((item) => ({ id: item.id, website: item.website, name: item.short })),
      );
      setNetwork({
        loading: false,
        enabled: result?.enabled !== false,
        results: result?.results || [],
        ran: true,
      });
    } catch (error) {
      setNetwork({ loading: false, enabled: true, results: [], ran: true, error: error.message });
    }
  };

  const runAiEnhance = async (items) => {
    if (!aiEnabled) return;
    setAi((current) => ({ ...current, loading: true, error: '', ran: true }));
    try {
      const payload = {
        profile: {
          major: searchProfile.major,
          school: profile.school,
          degree: profile.degree,
          grade: profile.grade,
          skills: SKILLS.map((skill) => ({
            name: skill.name,
            level: Number(profile.skills?.[skill.id] || 0),
            label: SKILL_LEVELS.find((level) => level.value === Number(profile.skills?.[skill.id]))?.label || '未填写',
          })),
          certificates: (profile.certificates || []).map((cert) => `${cert.name}${cert.level ? ` ${cert.level}` : ''}`),
          experiences: (profile.experiences || []).map(
            (experience) => `${experience.name}${experience.award ? ` ${experience.award}` : ''}`,
          ),
          directions: directionNames(profile.goals?.directions),
          targetLevel: profile.goals?.targetLevel,
          months: applied.months,
          weeklyHours: profile.goals?.weeklyHours,
          motivation: profile.goals?.motivation,
        },
        candidates: items.slice(0, 6).map((item) => ({
          id: item.id,
          name: item.name,
          short: item.short,
          total: item.total,
          level: item.matchLevel,
          scores: item.scores,
          season: item.season,
          team: item.team,
          majorNote: item.scoreDetails.major.note,
          abilityNote: item.scoreDetails.ability.note,
          timeNote: item.scoreDetails.time.note,
          valueNote: item.scoreDetails.value.note,
          strengths: item.scoreDetails.ability.matched.slice(0, 3).map((skill) => skill.name),
          gaps: item.scoreDetails.ability.gaps.slice(0, 3).map((skill) => skill.name),
          tracks: item.tracks.slice(0, 2).map((track) => track.name),
          cautions: item.cautions.slice(0, 2),
        })),
      };
      const result = await api.enhanceRecommendations(payload);
      if (!result?.ok) {
        setAi((current) => ({ ...current, loading: false, error: result?.reason || '大模型增强暂不可用' }));
        return;
      }
      const notes = {};
      for (const recommendation of result.data?.recommendations || []) {
        if (recommendation?.id) {
          notes[recommendation.id] = {
            reason: recommendation.reason || '',
            track: recommendation.track || '',
            caution: recommendation.caution || '',
          };
        }
      }
      setAi({
        loading: false,
        notes,
        summary: result.data?.summary || '',
        error: '',
        model: result.model || '',
        ran: true,
      });
    } catch (error) {
      setAi((current) => ({ ...current, loading: false, error: error.message || '大模型增强失败' }));
    }
  };

  const handleMatch = async () => {
    const nextMajor = draftMajor.trim() || profile.major;
    if (!nextMajor) {
      notify('请先填写专业', 'warning');
      return;
    }
    const token = runToken.current + 1;
    runToken.current = token;
    setIsMatching(true);
    setMatchStep(0);
    setAi({ loading: false, notes: {}, summary: '', error: '', model: '', ran: false });
    setNetwork({ loading: false, enabled: null, results: [], ran: false });
    setSearch({ loading: false, results: [], error: '', query: '', ran: false });
    for (let index = 1; index <= MATCH_STEPS.length; index += 1) {
      await wait(300);
      if (token !== runToken.current) return;
      setMatchStep(index);
    }
    await wait(240);
    if (token !== runToken.current) return;
    onUpdateCriteria({
      major: nextMajor,
      goals: { ...profile.goals, months: draftMonths },
    });
    setApplied({ major: nextMajor, months: [...draftMonths], keyword: keyword.trim() });
    setIsMatching(false);
    setVisibleCount(6);
    setResultFilter('all');
    const nextRanked = rankCompetitions({
      profile: { ...profile, major: nextMajor },
      preferredMonths: draftMonths,
      keyword: keyword.trim(),
      userSchedules,
      competitions,
    });
    notify(`匹配完成：${nextRanked.counts.matched} 项赛事进入推荐`, 'success');
    if (settings?.networkEnabled) runNetworkCheck(nextRanked.results);
    if (aiEnabled) runAiEnhance(nextRanked.results);
  };

  const handleSearch = async () => {
    const top = ranked.results[0];
    if (!top) return;
    setSearch((current) => ({ ...current, loading: true, error: '', ran: true }));
    try {
      const query = `${top.name} 报名时间 赛程 官网`;
      const result = await api.webSearch(query);
      if (result?.enabled === false) {
        setSearch({
          loading: false,
          results: [],
          error: '实时检索尚未启用，请先在设置中配置 Tavily。',
          query,
          ran: true,
        });
        return;
      }
      setSearch({
        loading: false,
        results: result?.results || [],
        error: result?.ok === false ? result?.error || '检索失败' : '',
        query,
        ran: true,
      });
    } catch (error) {
      setSearch({ loading: false, results: [], error: error.message || '检索失败', query: '', ran: true });
    }
  };

  const networkReady = network.results.filter((item) => item.ok).length;

  return (
    <div className="page discover-page">
      <section className="panel discover-control">
        <div className="discover-control-head">
          <div>
            <span className="section-eyebrow">MATCH ENGINE</span>
            <h2>定义这一次匹配</h2>
            <p>端侧引擎会从 84 项教育部认可赛事中，按统一权重重建你的候选清单。</p>
          </div>
          <div className="engine-status-row">
            <span className="engine-chip is-local"><Database size={13} /> 84 项本地数据库</span>
            <button
              type="button"
              className={`engine-chip ${settings?.networkEnabled ? 'is-live' : 'is-off'}`}
              onClick={onOpenSettings}
            >
              {settings?.networkEnabled ? <Wifi size={13} /> : <WifiOff size={13} />}
              {settings?.networkEnabled ? '官网核验已开启' : '联网核验已关闭'}
            </button>
            <button
              type="button"
              className={`engine-chip ${aiEnabled ? 'is-ai' : 'is-off'}`}
              onClick={onOpenSettings}
            >
              <Sparkles size={13} />
              {aiEnabled ? `大模型 · ${settings?.aiModel || '已配置'}` : '端侧 AI'}
            </button>
          </div>
        </div>

        <div className="match-criteria">
          <label className="field">
            <span>专业方向</span>
            <div className="input-with-icon">
              <GraduationCap size={16} />
              <input
                list="discover-major-options"
                value={draftMajor}
                onChange={(event) => setDraftMajor(event.target.value)}
                placeholder="输入或选择专业"
              />
              <datalist id="discover-major-options">
                {ALL_MAJORS.map((major) => <option value={major} key={major} />)}
              </datalist>
            </div>
          </label>
          <div className="field">
            <span>希望参赛时间</span>
            <div className="month-range compact">
              <div className="select-wrap">
                <select
                  value={draftMonths[0]}
                  onChange={(event) => setDraftMonths([Number(event.target.value), draftMonths[1]])}
                >
                  {MONTHS.map((month) => <option value={month} key={month}>{month} 月</option>)}
                </select>
                <ChevronDown size={14} />
              </div>
              <span>至</span>
              <div className="select-wrap">
                <select
                  value={draftMonths[1]}
                  onChange={(event) => setDraftMonths([draftMonths[0], Number(event.target.value)])}
                >
                  {MONTHS.map((month) => <option value={month} key={month}>{month} 月</option>)}
                </select>
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
          <label className="field">
            <span>方向关键词 <small>可选</small></span>
            <div className="input-with-icon">
              <Search size={16} />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="如：安全、算法、设计"
              />
            </div>
          </label>
          <button
            type="button"
            className="btn btn-primary match-run-button"
            onClick={handleMatch}
            disabled={isMatching}
          >
            {isMatching ? <LoaderCircle size={17} className="spin" /> : <Sparkles size={17} />}
            {isMatching ? '正在匹配…' : '开始智能匹配'}
          </button>
        </div>

        <div className="criteria-foot">
          <span>
            <ShieldCheck size={13} />
            评分权重：专业 30% · 能力 30% · 时间 20% · 资格 10% · 发展 10%
          </span>
          <span>目标：{directionNames(profile.goals?.directions).slice(0, 3).join(' / ') || '尚未设置方向'}</span>
        </div>

        {isMatching && (
          <div className="match-progress">
            <div className="match-progress-head">
              <div>
                <strong>AI 正在重构你的候选清单</strong>
                <span>匹配过程完全在端侧完成，不上传个人画像。</span>
              </div>
              <em>{matchStep} / {MATCH_STEPS.length}</em>
            </div>
            <ProgressBar value={(matchStep / MATCH_STEPS.length) * 100} height={5} accent="#13B6C8" soft="#e5f3f4" />
            <div className="match-step-list">
              {MATCH_STEPS.map((step, index) => {
                const Icon = step.icon;
                const done = index < matchStep;
                const active = index === matchStep;
                return (
                  <div className={`match-step ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`} key={step.label}>
                    <span className="match-step-icon">
                      {done ? <Check size={14} strokeWidth={3} /> : active ? <LoaderCircle size={14} className="spin" /> : <Icon size={14} />}
                    </span>
                    <div>
                      <strong>{step.label}</strong>
                      <em>{step.detail}</em>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <div className="discover-results-layout">
        <div className="discover-results-main">
          <div className="results-head">
            <div>
              <span className="section-eyebrow">MATCH REPORT</span>
              <h2>为你筛出的机会</h2>
              <p>
                从 {ranked.counts.total} 项中筛出 {ranked.counts.matched} 项 · {ranked.counts.strong} 项高度匹配 ·{' '}
                {ranked.counts.conflicts} 项存在课程冲突
              </p>
            </div>
            <div className="result-filter-row">
              {RESULT_FILTERS.map((filter) => (
                <button
                  type="button"
                  key={filter.id}
                  className={`filter-chip ${resultFilter === filter.id ? 'is-active' : ''}`}
                  onClick={() => {
                    setResultFilter(filter.id);
                    setVisibleCount(6);
                  }}
                >
                  {filter.label}
                  <span>{filterCounts[filter.id]}</span>
                </button>
              ))}
            </div>
          </div>

          {ai.summary && (
            <div className="ai-summary-strip">
              <span className="ai-summary-icon"><Sparkles size={16} /></span>
              <div>
                <strong>大模型策略摘要</strong>
                <p>{ai.summary}</p>
              </div>
              {ai.model && <em>{ai.model}</em>}
            </div>
          )}
          {ai.loading && (
            <div className="inline-loading-strip">
              <LoaderCircle size={15} className="spin" />
              正在请求大模型润色推荐理由，端侧评分不受影响…
            </div>
          )}

          <div className="result-card-list">
            {visibleResults.map((item, index) => (
              <RecommendationCard
                key={item.id}
                item={item}
                index={index}
                onOpen={onOpenCompetition}
                favorite={favorites.includes(item.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
            {!filteredResults.length && (
              <EmptyState
                icon={Search}
                title="没有符合当前筛选的赛事"
                description="尝试切换筛选条件，或放宽希望参赛的时间范围后重新匹配。"
                action={
                  <button type="button" className="btn btn-outline btn-small" onClick={() => setResultFilter('all')}>
                    查看全部推荐
                  </button>
                }
              />
            )}
          </div>

          {visibleCount < filteredResults.length && (
            <button
              type="button"
              className="load-more-button"
              onClick={() => setVisibleCount((count) => count + 6)}
            >
              继续查看 {Math.min(6, filteredResults.length - visibleCount)} 项
              <ChevronDown size={16} />
            </button>
          )}
        </div>

        <aside className="discover-side">
          <section className={`panel report-card ${aiEnabled ? 'is-ai' : ''}`}>
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">AI ENHANCEMENT</span>
                <h3>推荐理由</h3>
              </div>
              <span className={`report-state ${aiEnabled ? 'is-live' : ''}`}>
                {aiEnabled ? '大模型增强' : '端侧生成'}
              </span>
            </div>
            {!aiEnabled && (
              <>
                <p className="report-copy">
                  当前由端侧规则引擎生成推荐理由，不联网也能完整使用。配置兼容 OpenAI 的接口后，可获得更具体的赛道与风险提示。
                </p>
                <button type="button" className="btn btn-outline btn-small btn-block" onClick={onOpenSettings}>
                  <Sparkles size={14} />
                  配置大模型增强
                </button>
              </>
            )}
            {aiEnabled && ai.loading && (
              <div className="report-loading">
                <LoaderCircle size={18} className="spin" />
                <span>正在为前 6 项推荐生成个性化理由…</span>
              </div>
            )}
            {aiEnabled && !ai.loading && ai.error && (
              <div className="report-error">
                <CircleAlert size={15} />
                <p>{ai.error}</p>
                <button type="button" className="text-link" onClick={() => runAiEnhance(ranked.results)}>
                  重新尝试
                </button>
              </div>
            )}
            {aiEnabled && !ai.loading && !ai.error && !ai.ran && (
              <p className="report-copy">点击「开始智能匹配」后，大模型会为前 6 项推荐补充个性化判断与风险提醒。</p>
            )}
            {aiEnabled && ai.ran && !ai.loading && !ai.error && (
              <div className="report-done">
                <span><Check size={14} /></span>
                <p>已为 {Object.keys(ai.notes).length} 项推荐生成增强理由，卡片中标记为「大模型增强」。</p>
              </div>
            )}
          </section>

          <section className="panel report-card">
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">OFFICIAL WEBSITE</span>
                <h3>官网联网核验</h3>
              </div>
              {network.ran && !network.loading && (
                <span className={`report-state ${networkReady ? 'is-live' : ''}`}>
                  {networkReady}/{network.results.length} 可访问
                </span>
              )}
            </div>
            {network.loading && (
              <div className="report-loading">
                <LoaderCircle size={18} className="spin" />
                <span>正在连接赛事官网…</span>
              </div>
            )}
            {!network.loading && !network.ran && (
              <>
                <p className="report-copy">匹配后自动核验前几项推荐的官网连通性，帮助你判断信息是否可追溯。</p>
                <button
                  type="button"
                  className="btn btn-outline btn-small btn-block"
                  onClick={() => (settings?.networkEnabled ? runNetworkCheck(ranked.results) : onOpenSettings())}
                >
                  <Globe2 size={14} />
                  {settings?.networkEnabled ? '立即核验官网' : '开启联网核验'}
                </button>
              </>
            )}
            {!network.loading && network.ran && (
              <div className="verify-list">
                {!network.enabled && (
                  <p className="report-copy">联网核验已关闭，以下结果仅基于本地数据库。</p>
                )}
                {network.results.map((result) => {
                  const target = ranked.results.find((item) => item.id === result.id);
                  return (
                    <div className="verify-row" key={result.id}>
                      <span className={`verify-dot ${result.ok ? 'is-ok' : 'is-fail'}`} />
                      <div>
                        <strong>{target?.short || result.id}</strong>
                        <span>{result.ok ? `HTTP ${result.status}` : result.error || '暂无法访问'}</span>
                      </div>
                      {target?.website && (
                        <button
                          type="button"
                          className="icon-button subtle"
                          onClick={() => api.openExternal(target.website)}
                          aria-label="打开官网"
                        >
                          <ExternalLink size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
                {!network.results.length && <p className="report-copy">暂无可核验的官网地址。</p>}
              </div>
            )}
          </section>

          <section className="panel report-card">
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">LIVE SEARCH</span>
                <h3>实时情报检索</h3>
              </div>
              <span className={`report-state ${settings?.tavilyEnabled ? 'is-live' : ''}`}>
                {settings?.tavilyEnabled ? 'Tavily 已启用' : '未启用'}
              </span>
            </div>
            <p className="report-copy">
              检索当年报名通知与赛程变化，结果仅作线索，关键日期仍需回到官网确认。
            </p>
            <button
              type="button"
              className="btn btn-outline btn-small btn-block"
              onClick={settings?.tavilyEnabled ? handleSearch : onOpenSettings}
              disabled={search.loading}
            >
              {search.loading ? <LoaderCircle size={14} className="spin" /> : <Search size={14} />}
              {search.loading ? '正在检索…' : settings?.tavilyEnabled ? '检索首推赛事最新动态' : '配置 Tavily 检索'}
            </button>
            {search.error && (
              <div className="report-error">
                <CircleAlert size={14} />
                <p>{search.error}</p>
              </div>
            )}
            {search.results.length > 0 && (
              <div className="search-result-list">
                {search.results.slice(0, 4).map((result) => (
                  <button
                    type="button"
                    className="search-result-row"
                    key={result.url}
                    onClick={() => api.openExternal(result.url)}
                  >
                    <strong>{result.title}</strong>
                    <span>{result.content}</span>
                    <em>{result.url.replace(/^https?:\/\//, '').split('/')[0]}</em>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="panel report-card source-card">
            <div className="compact-head">
              <div>
                <span className="section-eyebrow">DATA BASIS</span>
                <h3>本次匹配依据</h3>
              </div>
              <Database size={17} />
            </div>
            <div className="source-metric-grid">
              <div><strong>84</strong><span>目录赛事</span></div>
              <div><strong>{ranked.counts.matched}</strong><span>进入推荐</span></div>
              <div><strong>{ranked.counts.conflicts}</strong><span>存在冲突</span></div>
            </div>
            <SourceNotice compact />
            <button type="button" className="text-link" onClick={onOpenSettings}>
              调整 AI 与联网设置
              <ArrowRight size={14} />
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
