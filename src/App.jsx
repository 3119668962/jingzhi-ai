import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Sidebar, Topbar } from './components/Shell';
import { Logo } from './components/ui';
import { api } from './lib/bridge';
import { rankCompetitions, getScheduleWarnings } from './lib/matcher';
import { COMPETITIONS, createCustomCompetition } from './data/competitions';
import { DEMO_PROFILE, DEMO_SCHEDULES } from './data/profile';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import Directory from './pages/Directory';
import Schedule from './pages/Schedule';
import Plan from './pages/Plan';
import Profile from './pages/Profile';
import CompetitionDetail from './pages/CompetitionDetail';
import SettingsModal from './components/SettingsModal';

const EMPTY_WORKSPACE = {
  profile: null,
  userSchedules: [],
  planProgress: {},
  favorites: [],
  userCompetitions: [],
};

export default function App() {
  const [workspace, setWorkspace] = useState(EMPTY_WORKSPACE);
  const [settings, setSettings] = useState(null);
  const [appInfo, setAppInfo] = useState(null);
  const [ready, setReady] = useState(false);
  const [bootError, setBootError] = useState('');
  const [view, setView] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);
  const [detailOrigin, setDetailOrigin] = useState('dashboard');
  const [editingProfile, setEditingProfile] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [planTargetId, setPlanTargetId] = useState('');
  const [toast, setToast] = useState(null);
  const hydrated = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [state, currentSettings, info] = await Promise.all([
          api.loadState(),
          api.getSettings(),
          api.getAppInfo(),
        ]);
        if (cancelled) return;
        const safeState = state && typeof state === 'object' ? state : {};
        setWorkspace({
          ...EMPTY_WORKSPACE,
          ...safeState,
          profile: safeState.profile || null,
          userSchedules: Array.isArray(safeState.userSchedules) ? safeState.userSchedules : [],
          favorites: Array.isArray(safeState.favorites) ? safeState.favorites : [],
          planProgress: safeState.planProgress || {},
          userCompetitions: Array.isArray(safeState.userCompetitions) ? safeState.userCompetitions : [],
        });
        setSettings(currentSettings);
        setAppInfo(info);
      } catch (error) {
        if (cancelled) return;
        setBootError(error?.message || '本机数据读取失败');
      } finally {
        if (!cancelled) {
          hydrated.current = true;
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated.current || !workspace.profile) return undefined;
    const timer = window.setTimeout(() => {
      api.saveState({
        profile: workspace.profile,
        userSchedules: workspace.userSchedules,
        planProgress: workspace.planProgress,
        favorites: workspace.favorites,
        userCompetitions: workspace.userCompetitions,
      });
    }, 360);
    return () => window.clearTimeout(timer);
  }, [workspace]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const profile = workspace.profile;
  const competitions = useMemo(
    () => [...COMPETITIONS, ...workspace.userCompetitions],
    [workspace.userCompetitions],
  );

  const ranked = useMemo(() => {
    if (!profile) return null;
    return rankCompetitions({
      profile,
      preferredMonths: profile.goals?.months,
      userSchedules: workspace.userSchedules,
      competitions,
    });
  }, [profile, workspace.userSchedules, competitions]);

  const conflicts = useMemo(() => {
    if (!profile) return [];
    return getScheduleWarnings(workspace.userSchedules, profile);
  }, [workspace.userSchedules, profile]);

  const selectedEvaluation = useMemo(() => {
    if (!selectedId || !ranked) return null;
    return ranked.all.find((item) => item.id === selectedId) || null;
  }, [selectedId, ranked]);

  const notify = (message, tone = 'success') => setToast({ message, tone, id: Date.now() });

  const navigate = (nextView) => {
    setView(nextView);
    setSelectedId(null);
    setEditingProfile(false);
  };

  const openCompetition = (itemOrId) => {
    const id = typeof itemOrId === 'string' ? itemOrId : itemOrId?.id;
    if (!id) return;
    setDetailOrigin(view === 'detail' ? detailOrigin : view);
    setSelectedId(id);
  };

  const closeDetail = () => {
    setSelectedId(null);
    setView(detailOrigin);
  };

  const handleOnboardingComplete = (nextProfile) => {
    setWorkspace((current) => ({
      ...current,
      profile: nextProfile,
      userSchedules: nextProfile.isDemo ? DEMO_SCHEDULES : current.userSchedules,
      favorites: nextProfile.isDemo ? [] : current.favorites,
      planProgress: nextProfile.isDemo ? {} : current.planProgress,
    }));
    setEditingProfile(false);
    setSelectedId(null);
    setView('dashboard');
    notify('画像已生成，已为你完成首轮匹配');
  };

  const handleLoadDemo = () => {
    setWorkspace({
      profile: { ...DEMO_PROFILE, updatedAt: new Date().toISOString() },
      userSchedules: DEMO_SCHEDULES,
      planProgress: {},
      favorites: [],
      userCompetitions: [],
    });
    setEditingProfile(false);
    setSelectedId(null);
    setView('dashboard');
    notify('已载入示例画像，可直接体验完整流程');
  };

  const handleProfileEditComplete = (nextProfile) => {
    setWorkspace((current) => ({
      ...current,
      profile: { ...nextProfile, profileComplete: true, updatedAt: new Date().toISOString() },
    }));
    setEditingProfile(false);
    setSelectedId(null);
    setView('profile');
    notify('画像已更新，推荐结果同步刷新');
  };

  const updateProfile = (patch) => {
    setWorkspace((current) => {
      if (!current.profile) return current;
      const nextGoals = patch.goals
        ? { ...current.profile.goals, ...patch.goals }
        : current.profile.goals;
      return {
        ...current,
        profile: { ...current.profile, ...patch, goals: nextGoals, updatedAt: new Date().toISOString() },
      };
    });
  };

  const toggleFavorite = (id) => {
    setWorkspace((current) => {
      const exists = current.favorites.includes(id);
      return {
        ...current,
        favorites: exists ? current.favorites.filter((item) => item !== id) : [...current.favorites, id],
      };
    });
  };

  const addCustomCompetition = (details) => {
    const name = String(details.name || '').trim();
    const duplicate = competitions.some((item) => item.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase());
    if (duplicate) return { ok: false, error: '竞赛库中已存在同名赛事，请检查赛事名称。' };
    const item = createCustomCompetition(
      { ...details, id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
      competitions.length + 1,
    );
    setWorkspace((current) => ({
      ...current,
      userCompetitions: [...current.userCompetitions, item],
    }));
    notify('自定义赛事已加入竞赛库，并参与智能匹配');
    return { ok: true, item };
  };

  const addSchedule = (event) => {
    setWorkspace((current) => ({
      ...current,
      userSchedules: [...current.userSchedules, event],
    }));
    notify('赛程已加入时间表');
  };

  const removeSchedule = (id) => {
    setWorkspace((current) => ({
      ...current,
      userSchedules: current.userSchedules.filter((item) => item.id !== id),
    }));
    notify('赛程已移除', 'neutral');
  };

  const togglePlanTask = (compId, taskKey) => {
    setWorkspace((current) => {
      const currentProgress = current.planProgress[compId] || {};
      const next = { ...currentProgress };
      if (next[taskKey]) delete next[taskKey];
      else next[taskKey] = true;
      return {
        ...current,
        planProgress: { ...current.planProgress, [compId]: next },
      };
    });
  };

  const openPlan = (compId) => {
    setPlanTargetId(compId || '');
    setSelectedId(null);
    setView('plan');
  };

  const handleSaveSettings = async (payload) => {
    const result = await api.saveSettings(payload);
    if (!result?.ok) return result;
    setSettings(result.settings || (await api.getSettings()));
    notify('设置已保存');
    return result;
  };

  const handleResetData = async () => {
    await api.saveState(EMPTY_WORKSPACE);
    setWorkspace(EMPTY_WORKSPACE);
    setSelectedId(null);
    setView('dashboard');
    setSettingsOpen(false);
    notify('本机画像与日程数据已清空', 'neutral');
  };

  if (!ready) {
    return (
      <div className="boot-screen">
        <Logo size={58} />
        <div className="boot-copy">
          <strong>竞智AI</strong>
          <span>正在加载本机画像与赛事数据</span>
        </div>
        <LoaderCircle size={22} className="spin" />
        {bootError && <p className="boot-error">{bootError}，已进入离线可用模式</p>}
      </div>
    );
  }

  if (!profile?.profileComplete || editingProfile) {
    return (
      <>
        <Onboarding
          initialProfile={profile}
          isEditing={editingProfile}
          onComplete={editingProfile ? handleProfileEditComplete : handleOnboardingComplete}
          onLoadDemo={editingProfile ? null : handleLoadDemo}
        />
        {toast && (
          <div className={`toast toast-${toast.tone}`} key={toast.id}>
            <span className="toast-dot" />
            {toast.message}
          </div>
        )}
      </>
    );
  }

  const activeNav = selectedId ? detailOrigin : view;
  const planTarget =
    ranked?.all.find((item) => item.id === planTargetId) ||
    ranked?.results[0] ||
    ranked?.all[0] ||
    null;

  return (
    <div className={`app-shell ${api.isDesktop ? 'is-desktop' : ''}`}>
      <Sidebar
        active={activeNav}
        onNavigate={navigate}
        conflictCount={conflicts.length}
        onOpenSettings={() => setSettingsOpen(true)}
        engineLabel={settings?.aiEnabled && settings?.hasAiKey ? '大模型增强引擎' : '端侧智能匹配引擎'}
      />
      <div className="app-main">
        <Topbar
          active={selectedId ? 'detail' : view}
          profile={profile}
          onProfile={() => setEditingProfile(true)}
          onNavigate={navigate}
          aiEnabled={Boolean(settings?.aiEnabled && settings?.hasAiKey)}
          conflictCount={conflicts.length}
        />
        <main className="app-content">
          {selectedId && selectedEvaluation ? (
            <CompetitionDetail
              item={selectedEvaluation}
              profile={profile}
              favorite={workspace.favorites.includes(selectedEvaluation.id)}
              onToggleFavorite={toggleFavorite}
              onBack={closeDetail}
              onOpenPlan={openPlan}
              onOpenSchedule={() => navigate('schedule')}
              onOpenExternal={api.openExternal}
              planProgress={workspace.planProgress[selectedEvaluation.id] || {}}
            />
          ) : (
            <>
              {view === 'dashboard' && ranked && (
                <Dashboard
                  profile={profile}
                  ranked={ranked}
                  topRecommendations={ranked.results.slice(0, 3)}
                  conflicts={conflicts}
                  favorites={workspace.favorites}
                  onToggleFavorite={toggleFavorite}
                  onOpenCompetition={openCompetition}
                  onNavigate={navigate}
                  onOpenPlan={openPlan}
                  onLoadDemo={handleLoadDemo}
                />
              )}
              {view === 'discover' && ranked && (
                <Discover
                  profile={profile}
                  settings={settings}
                  userSchedules={workspace.userSchedules}
                  competitions={competitions}
                  favorites={workspace.favorites}
                  onToggleFavorite={toggleFavorite}
                  onOpenCompetition={openCompetition}
                  onUpdateCriteria={updateProfile}
                  onOpenSettings={() => setSettingsOpen(true)}
                  notify={notify}
                />
              )}
              {view === 'directory' && ranked && (
                <Directory
                  evaluations={ranked.all}
                  favorites={workspace.favorites}
                  onToggleFavorite={toggleFavorite}
                  onOpenCompetition={openCompetition}
                  onAddCompetition={addCustomCompetition}
                  customCount={workspace.userCompetitions.length}
                />
              )}
              {view === 'schedule' && (
                <Schedule
                  profile={profile}
                  events={workspace.userSchedules}
                  competitions={competitions}
                  onAddSchedule={addSchedule}
                  onRemoveSchedule={removeSchedule}
                  onOpenCompetition={openCompetition}
                  notify={notify}
                />
              )}
              {view === 'plan' && ranked && (
                <Plan
                  evaluations={ranked.all}
                  recommendations={ranked.results}
                  selectedId={planTarget?.id || ''}
                  profile={profile}
                  planProgress={workspace.planProgress}
                  onSelect={setPlanTargetId}
                  onToggleTask={togglePlanTask}
                  onOpenCompetition={openCompetition}
                />
              )}
              {view === 'profile' && (
                <Profile
                  profile={profile}
                  settings={settings}
                  ranked={ranked}
                  favorites={workspace.favorites}
                  events={workspace.userSchedules}
                  appInfo={appInfo}
                  onEdit={() => setEditingProfile(true)}
                  onNavigate={navigate}
                  onOpenSettings={() => setSettingsOpen(true)}
                />
              )}
            </>
          )}
        </main>
      </div>
      <SettingsModal
        open={settingsOpen}
        settings={settings}
        appInfo={appInfo}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
        onResetData={handleResetData}
        onOpenDataFolder={api.openDataFolder}
      />
      {toast && (
        <div className={`toast toast-${toast.tone}`} key={toast.id}>
          <span className="toast-dot" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
