const STORAGE_KEY = 'jingzhi-workspace-v1';
const SETTINGS_KEY = 'jingzhi-settings-v1';

const isDesktop = typeof window !== 'undefined' && Boolean(window.jingzhi?.isDesktop);

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const fallbackSettings = {
  aiEnabled: false,
  aiBaseUrl: 'https://api.openai.com/v1',
  aiModel: 'gpt-4.1-mini',
  hasAiKey: false,
  aiKeyLast4: '',
  networkEnabled: true,
  tavilyEnabled: false,
  hasTavilyKey: false,
  tavilyKeyLast4: '',
};

export const api = {
  isDesktop,

  async loadState() {
    if (isDesktop) return window.jingzhi.loadState();
    return readLocal(STORAGE_KEY, {
      profile: null,
      userSchedules: [],
      planProgress: {},
      favorites: [],
      userCompetitions: [],
    });
  },

  async saveState(state) {
    if (isDesktop) return window.jingzhi.saveState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  },

  async getSettings() {
    if (isDesktop) return window.jingzhi.getSettings();
    return readLocal(SETTINGS_KEY, fallbackSettings);
  },

  async saveSettings(payload) {
    if (isDesktop) return window.jingzhi.saveSettings(payload);
    const current = readLocal(SETTINGS_KEY, fallbackSettings);
    let hasAiKey = current.hasAiKey;
    let hasTavilyKey = current.hasTavilyKey;
    if (payload.aiApiKey) hasAiKey = true;
    if (payload.clearAiKey) hasAiKey = false;
    if (payload.tavilyApiKey) hasTavilyKey = true;
    if (payload.clearTavilyKey) hasTavilyKey = false;
    const next = {
      ...current,
      aiEnabled: !!payload.aiEnabled,
      aiBaseUrl: payload.aiBaseUrl || current.aiBaseUrl,
      aiModel: payload.aiModel || current.aiModel,
      networkEnabled: payload.networkEnabled !== false,
      tavilyEnabled: !!payload.tavilyEnabled,
      hasAiKey,
      hasTavilyKey,
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    return { ok: true, settings: next };
  },

  async verifyWebsites(items) {
    if (isDesktop) return window.jingzhi.verifyWebsites(items);
    return { enabled: false, results: [] };
  },

  async webSearch(query) {
    if (isDesktop) return window.jingzhi.webSearch(query);
    return { enabled: false, results: [] };
  },

  async enhanceRecommendations(payload) {
    if (isDesktop) return window.jingzhi.enhanceRecommendations(payload);
    return { ok: false, reason: '浏览器预览模式未连接桌面端大模型服务' };
  },

  async openExternal(url) {
    if (!url) return;
    if (isDesktop) {
      await window.jingzhi.openExternal(url);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  },

  async openDataFolder() {
    if (isDesktop) return window.jingzhi.openDataFolder();
    return { ok: false, dir: '' };
  },

  async getAppInfo() {
    if (isDesktop) return window.jingzhi.getAppInfo();
    return { version: '1.0.0', dataDir: '浏览器预览', platform: navigator.platform };
  },
};
