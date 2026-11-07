const { app, BrowserWindow, ipcMain, shell, safeStorage } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

const isDev = process.argv.includes('--dev') || !!process.env.VITE_DEV_SERVER_URL;
let mainWindow = null;

app.setAppUserModelId('ai.jingzhi.desktop');

function getDataDir() {
  if (app.isPackaged) {
    const portableDir = process.env.PORTABLE_EXECUTABLE_DIR;
    return path.join(portableDir || path.dirname(app.getPath('exe')), 'data');
  }
  return path.join(__dirname, '..', 'data');
}

function ensureDataDir() {
  const dir = getDataDir();
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function statePath() {
  return path.join(ensureDataDir(), 'workspace.json');
}

function settingsPath() {
  return path.join(ensureDataDir(), 'settings.json');
}

const DEFAULT_SETTINGS = {
  aiEnabled: false,
  aiBaseUrl: 'https://api.openai.com/v1',
  aiModel: 'gpt-4.1-mini',
  networkEnabled: true,
  tavilyEnabled: false,
};

function readSettingsRaw() {
  return { ...DEFAULT_SETTINGS, ...readJson(settingsPath(), {}) };
}

function encryptSecret(value) {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('当前系统安全存储不可用，无法安全保存密钥。');
  }
  return safeStorage.encryptString(value).toString('base64');
}

function decryptSecret(value) {
  if (!value || !safeStorage.isEncryptionAvailable()) return '';
  try {
    return safeStorage.decryptString(Buffer.from(value, 'base64'));
  } catch {
    return '';
  }
}

function publicSettings() {
  const settings = readSettingsRaw();
  const aiKey = decryptSecret(settings.aiApiKeyEncrypted);
  const tavilyKey = decryptSecret(settings.tavilyApiKeyEncrypted);
  return {
    aiEnabled: !!settings.aiEnabled,
    aiBaseUrl: settings.aiBaseUrl,
    aiModel: settings.aiModel,
    hasAiKey: !!aiKey,
    aiKeyLast4: aiKey ? aiKey.slice(-4) : '',
    networkEnabled: settings.networkEnabled !== false,
    tavilyEnabled: !!settings.tavilyEnabled,
    hasTavilyKey: !!tavilyKey,
    tavilyKeyLast4: tavilyKey ? tavilyKey.slice(-4) : '',
  };
}

async function fetchText(url, timeout = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/json;q=0.8,*/*;q=0.5',
      },
    });
    const contentType = res.headers.get('content-type') || '';
    let text = '';
    if (contentType.includes('text') || contentType.includes('json')) {
      text = (await res.text()).slice(0, 200000);
    }
    return { res, text };
  } finally {
    clearTimeout(timer);
  }
}

function extractTitle(html) {
  if (!html) return '';
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i);
  if (og) return og[1].trim();
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return title ? title[1].replace(/\s+/g, ' ').trim().slice(0, 120) : '';
}

async function verifyWebsite(item) {
  if (!item.website || !/^https?:\/\//i.test(item.website)) {
    return { id: item.id, ok: false, status: 0, error: '官网地址缺失' };
  }
  try {
    const { res, text } = await fetchText(item.website, 7000);
    return {
      id: item.id,
      ok: res.status < 500,
      status: res.status,
      title: extractTitle(text),
      finalUrl: res.url,
    };
  } catch (error) {
    return {
      id: item.id,
      ok: false,
      status: 0,
      error: error.name === 'AbortError' ? '官网响应超时' : '暂时无法连接官网',
    };
  }
}

async function tavilySearch(query) {
  const settings = readSettingsRaw();
  const key = decryptSecret(settings.tavilyApiKeyEncrypted);
  if (!settings.tavilyEnabled || !key) {
    return { enabled: false, results: [] };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        query,
        search_depth: 'basic',
        max_results: 6,
        include_answer: false,
      }),
    });
    if (!res.ok) {
      throw new Error(`联网检索服务返回 ${res.status}`);
    }
    const data = await res.json();
    return {
      enabled: true,
      query,
      results: (data.results || []).map((item) => ({
        title: item.title,
        url: item.url,
        content: (item.content || '').slice(0, 260),
      })),
    };
  } finally {
    clearTimeout(timer);
  }
}

function cleanJsonText(text) {
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last === -1) return null;
  try {
    return JSON.parse(text.slice(first, last + 1));
  } catch {
    return null;
  }
}

async function enhanceWithModel(payload) {
  const settings = readSettingsRaw();
  const key = decryptSecret(settings.aiApiKeyEncrypted);
  if (!settings.aiEnabled || !key) {
    return { ok: false, reason: '未启用大模型增强' };
  }
  const base = String(settings.aiBaseUrl || '').replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(base)) {
    return { ok: false, reason: '大模型接口地址无效' };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    const system = [
      '你是「竞智AI」的竞赛决策顾问，服务对象是中国大学生。',
      '你会收到学生画像、候选竞赛和系统已经计算好的推荐分数。',
      '你必须忠于已有事实：不得新增竞赛名称、官网、日期或资格要求，不得改动任何推荐分数。',
      '推荐理由要具体、克制、有依据，点明专业/能力/时间/发展中的一个或两个关键抓手，并给出一个风险提醒。',
      '只输出合法 JSON，不使用 Markdown。JSON 结构：',
      '{"summary":"一句话总结本批推荐策略","recommendations":[{"id":"候选id","reason":"60-110字个性化推荐理由","track":"建议赛道或方向","caution":"一句风险提醒"}]}',
    ].join('\n');
    const user = JSON.stringify(payload).slice(0, 30000);
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: settings.aiModel || 'gpt-4.1-mini',
        temperature: 0.35,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`模型服务返回 ${res.status}: ${body.slice(0, 160)}`);
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('模型返回内容为空');
    const parsed = cleanJsonText(content);
    if (!parsed) throw new Error('模型返回格式无法解析');
    return { ok: true, data: parsed, model: settings.aiModel };
  } catch (error) {
    return {
      ok: false,
      reason: error.name === 'AbortError' ? '大模型响应超时' : error.message,
    };
  } finally {
    clearTimeout(timer);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1512,
    height: 982,
    minWidth: 1180,
    minHeight: 720,
    show: false,
    backgroundColor: '#f4f7fc',
    title: '竞智AI',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#f4f7fc',
      symbolColor: '#42516a',
      height: 44,
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false,
    },
  });

  mainWindow.setMenu(null);
  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

ipcMain.handle('state:load', () => {
  return readJson(statePath(), {
    profile: null,
    userSchedules: [],
    planProgress: {},
    favorites: [],
    userCompetitions: [],
  });
});

ipcMain.handle('state:save', (_event, state) => {
  if (!state || typeof state !== 'object') return { ok: false, error: '状态格式无效' };
  writeJson(statePath(), state);
  return { ok: true };
});

ipcMain.handle('settings:get', () => publicSettings());

ipcMain.handle('settings:save', (_event, payload) => {
  try {
    const current = readSettingsRaw();
    const next = {
      ...current,
      aiEnabled: !!payload.aiEnabled,
      aiBaseUrl: String(payload.aiBaseUrl || DEFAULT_SETTINGS.aiBaseUrl).trim(),
      aiModel: String(payload.aiModel || DEFAULT_SETTINGS.aiModel).trim(),
      networkEnabled: payload.networkEnabled !== false,
      tavilyEnabled: !!payload.tavilyEnabled,
    };
    if (payload.aiApiKey && String(payload.aiApiKey).trim()) {
      next.aiApiKeyEncrypted = encryptSecret(String(payload.aiApiKey).trim());
    }
    if (payload.clearAiKey) delete next.aiApiKeyEncrypted;
    if (payload.tavilyApiKey && String(payload.tavilyApiKey).trim()) {
      next.tavilyApiKeyEncrypted = encryptSecret(String(payload.tavilyApiKey).trim());
    }
    if (payload.clearTavilyKey) delete next.tavilyApiKeyEncrypted;
    writeJson(settingsPath(), next);
    return { ok: true, settings: publicSettings() };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

ipcMain.handle('network:verify', async (_event, items) => {
  const settings = readSettingsRaw();
  if (!settings.networkEnabled) return { enabled: false, results: [] };
  const list = Array.isArray(items) ? items.slice(0, 8) : [];
  const results = await Promise.all(list.map((item) => verifyWebsite(item)));
  return { enabled: true, results };
});

ipcMain.handle('network:search', async (_event, query) => {
  try {
    return { ok: true, ...(await tavilySearch(String(query || '').slice(0, 300))) };
  } catch (error) {
    return { ok: false, enabled: true, error: error.message, results: [] };
  }
});

ipcMain.handle('ai:enhance', async (_event, payload) => {
  return enhanceWithModel(payload);
});

ipcMain.handle('shell:openExternal', async (_event, url) => {
  if (!/^https?:\/\//i.test(url)) return { ok: false };
  await shell.openExternal(url);
  return { ok: true };
});

ipcMain.handle('app:openDataFolder', async () => {
  const dir = ensureDataDir();
  await shell.openPath(dir);
  return { ok: true, dir };
});

ipcMain.handle('app:getInfo', () => ({
  version: app.getVersion(),
  dataDir: getDataDir(),
  platform: process.platform,
}));

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
