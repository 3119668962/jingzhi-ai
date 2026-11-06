import React from 'react';
import {
  CalendarDays,
  ChevronRight,
  Home,
  Library,
  Route,
  Settings,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { Brand } from './ui';

const NAV_ITEMS = [
  { id: 'dashboard', label: '工作台', icon: Home, section: '发现' },
  { id: 'discover', label: '智能推荐', icon: Sparkles, section: '发现', ai: true },
  { id: 'directory', label: '竞赛库', icon: Library, section: '发现' },
  { id: 'schedule', label: '时间冲突', icon: CalendarDays, section: '规划' },
  { id: 'plan', label: '备赛计划', icon: Route, section: '规划' },
  { id: 'profile', label: '我的画像', icon: UserRound, section: '我的' },
];

const PAGE_META = {
  dashboard: { title: '工作台', subtitle: '你的竞赛成长，从这里开始' },
  discover: { title: '智能推荐', subtitle: '用多维画像找到真正适合你的竞赛' },
  directory: { title: '竞赛库', subtitle: '2025 年教育部认可的 84 项全国大学生学科竞赛' },
  schedule: { title: '时间冲突', subtitle: '让课程、备赛与竞赛日程在一个视图里协同' },
  plan: { title: '备赛计划', subtitle: '把推荐变成一条可执行的备赛路径' },
  profile: { title: '我的画像', subtitle: '画像越完整，推荐越贴近你' },
  detail: { title: '赛事匹配报告', subtitle: '拆解推荐依据，明确赛道与备赛路径' },
};

function getInitials(name) {
  const text = String(name || '同学').trim();
  return text.slice(-2);
}

function formatToday() {
  const now = new Date();
  const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][now.getDay()];
  return `${now.getMonth() + 1}月${now.getDate()}日 ${weekday}`;
}

export function Sidebar({ active, onNavigate, conflictCount, onOpenSettings, engineLabel }) {
  const sections = ['发现', '规划', '我的'];
  return (
    <aside className="sidebar">
      <div className="sidebar-brand drag-region">
        <Brand />
      </div>
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div className="nav-section" key={section}>
            <div className="nav-section-label">{section}</div>
            {NAV_ITEMS.filter((item) => item.section === section).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.id}
                  className={`nav-item ${active === item.id ? 'is-active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <span className="nav-icon">
                    <Icon size={19} strokeWidth={1.9} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                  {item.ai && <span className="nav-ai-chip">AI</span>}
                  {item.id === 'schedule' && conflictCount > 0 && (
                    <span className="nav-count">{conflictCount}</span>
                  )}
                  {active === item.id && <span className="nav-active-dot" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button type="button" className="engine-card" onClick={onOpenSettings}>
          <div className="engine-top">
            <span className="engine-icon">
              <Sparkles size={16} />
            </span>
            <span className="engine-live">
              <i />
              引擎就绪
            </span>
          </div>
          <strong>{engineLabel || '端侧智能匹配引擎'}</strong>
          <p>84 项赛事已就绪 · 点击配置 AI 增强</p>
          <ChevronRight size={16} className="engine-arrow" />
        </button>
        <div className="sidebar-footer">
          <button type="button" className="nav-item nav-item-footer" onClick={onOpenSettings}>
            <span className="nav-icon">
              <Settings size={19} strokeWidth={1.9} />
            </span>
            <span className="nav-label">设置</span>
          </button>
          <span className="version-label">v1.0</span>
        </div>
      </div>
    </aside>
  );
}

export function Topbar({ active, profile, onProfile, onNavigate, aiEnabled, conflictCount }) {
  const meta = PAGE_META[active] || PAGE_META.dashboard;
  return (
    <header className="topbar drag-region">
      <div className="topbar-heading">
        <h1>{meta.title}</h1>
        <p>{meta.subtitle}</p>
      </div>
      <div className="topbar-actions no-drag">
        <span className="topbar-date">{formatToday()}</span>
        <div className="ai-status-pill">
          <span className={`status-dot ${aiEnabled ? 'is-live' : ''}`} />
          {aiEnabled ? '大模型增强' : '端侧 AI'}
        </div>
        {conflictCount > 0 && (
          <button
            type="button"
            className="conflict-quick"
            onClick={() => onNavigate('schedule')}
            title="查看时间冲突"
          >
            <CalendarDays size={16} />
            {conflictCount} 项冲突
          </button>
        )}
        <button type="button" className="profile-trigger" onClick={onProfile} aria-label="打开我的画像">
          <span className="avatar">{getInitials(profile?.name)}</span>
          <span className="profile-trigger-copy">
            <strong>{profile?.name || '同学'}</strong>
            <em>{profile?.major || '完善画像'}</em>
          </span>
        </button>
      </div>
    </header>
  );
}
