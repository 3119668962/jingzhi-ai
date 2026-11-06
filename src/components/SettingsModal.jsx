import React, { useEffect, useState } from 'react';
import {
  Database,
  FolderOpen,
  Globe2,
  KeyRound,
  LockKeyhole,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Wifi,
} from 'lucide-react';
import { Modal, Toggle } from './ui';

const DEFAULTS = {
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

export default function SettingsModal({
  open,
  settings,
  appInfo,
  onClose,
  onSave,
  onResetData,
  onOpenDataFolder,
}) {
  const [form, setForm] = useState({ ...DEFAULTS, ...(settings || {}) });
  const [aiKey, setAiKey] = useState('');
  const [tavilyKey, setTavilyKey] = useState('');
  const [clearAiKey, setClearAiKey] = useState(false);
  const [clearTavilyKey, setClearTavilyKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({ ...DEFAULTS, ...(settings || {}) });
    setAiKey('');
    setTavilyKey('');
    setClearAiKey(false);
    setClearTavilyKey(false);
    setError('');
    setConfirmReset(false);
  }, [open, settings]);

  const setField = (patch) => {
    setForm((current) => ({ ...current, ...patch }));
    setError('');
  };

  const handleSave = async () => {
    if (form.aiEnabled && !form.hasAiKey && !aiKey.trim() && !clearAiKey) {
      setError('已开启大模型增强，请填写 API Key，或先关闭该功能。');
      return;
    }
    if (form.tavilyEnabled && !form.hasTavilyKey && !tavilyKey.trim() && !clearTavilyKey) {
      setError('已开启实时情报检索，请填写 Tavily API Key。');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const result = await onSave({
        aiEnabled: form.aiEnabled,
        aiBaseUrl: form.aiBaseUrl,
        aiModel: form.aiModel,
        aiApiKey: aiKey.trim() || undefined,
        clearAiKey: clearAiKey && !aiKey.trim(),
        networkEnabled: form.networkEnabled,
        tavilyEnabled: form.tavilyEnabled,
        tavilyApiKey: tavilyKey.trim() || undefined,
        clearTavilyKey: clearTavilyKey && !tavilyKey.trim(),
      });
      if (!result?.ok) {
        setError(result?.error || '设置保存失败');
      } else {
        onClose?.();
      }
    } catch (saveError) {
      setError(saveError?.message || '设置保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    await onResetData?.();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="设置"
      subtitle="AI 能力、联网核验与本机数据都由你掌控"
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            取消
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={16} />
            {saving ? '保存中…' : '保存设置'}
          </button>
        </>
      }
    >
      {error && <div className="inline-error">{error}</div>}

      <section className="settings-section">
        <div className="settings-section-head">
          <span className="settings-icon is-blue"><Sparkles size={18} /></span>
          <div>
            <h3>大模型增强</h3>
            <p>使用 OpenAI 兼容接口润色推荐理由与赛道建议，不改变端侧评分。</p>
          </div>
          <Toggle
            checked={form.aiEnabled}
            onChange={(value) => setField({ aiEnabled: value })}
            label="启用大模型增强"
          />
        </div>
        <div className={`settings-fields ${form.aiEnabled ? '' : 'is-muted'}`}>
          <label className="field">
            <span>接口地址</span>
            <input
              value={form.aiBaseUrl}
              onChange={(event) => setField({ aiBaseUrl: event.target.value })}
              placeholder="https://api.openai.com/v1"
              disabled={!form.aiEnabled}
            />
          </label>
          <label className="field">
            <span>模型名称</span>
            <input
              value={form.aiModel}
              onChange={(event) => setField({ aiModel: event.target.value })}
              placeholder="gpt-4.1-mini"
              disabled={!form.aiEnabled}
            />
          </label>
          <label className="field settings-field-wide">
            <span>
              API Key
              {form.hasAiKey && !clearAiKey && !aiKey && (
                <em className="settings-key-status"><ShieldCheck size={12} /> 已加密保存 ····{form.aiKeyLast4}</em>
              )}
            </span>
            <div className="secret-field">
              <KeyRound size={16} />
              <input
                type="password"
                value={aiKey}
                onChange={(event) => {
                  setAiKey(event.target.value);
                  if (event.target.value) setClearAiKey(false);
                }}
                placeholder={form.hasAiKey && !clearAiKey ? '留空表示沿用已保存密钥' : '输入 API Key'}
                disabled={!form.aiEnabled}
                autoComplete="off"
              />
            </div>
          </label>
          {form.hasAiKey && (
            <label className="inline-check settings-field-wide">
              <input
                type="checkbox"
                checked={clearAiKey}
                onChange={(event) => setClearAiKey(event.target.checked)}
                disabled={!form.aiEnabled}
              />
              清除已保存的大模型密钥
            </label>
          )}
        </div>
        <p className="settings-note">
          <LockKeyhole size={13} />
          密钥通过 Windows 系统安全存储加密，仅主进程可读取，界面不会获得明文。
        </p>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <span className="settings-icon is-teal"><Globe2 size={18} /></span>
          <div>
            <h3>联网与实时情报</h3>
            <p>官网核验会访问赛事的官方网址；实时检索需要 Tavily 服务。</p>
          </div>
          <Toggle
            checked={form.networkEnabled}
            onChange={(value) => setField({ networkEnabled: value })}
            label="启用官网联网核验"
          />
        </div>
        <div className="settings-switch-list">
          <div className="settings-switch-row">
            <span className="settings-switch-icon"><Wifi size={16} /></span>
            <div>
              <strong>官网联网核验</strong>
              <p>匹配完成后检查前几项赛事官网的可访问状态，仅发起 GET 请求。</p>
            </div>
            <Toggle
              checked={form.networkEnabled}
              onChange={(value) => setField({ networkEnabled: value })}
              label="官网联网核验"
            />
          </div>
          <div className="settings-switch-row">
            <span className="settings-switch-icon is-teal"><Globe2 size={16} /></span>
            <div>
              <strong>实时情报检索（Tavily）</strong>
              <p>用于补充当年通知、报名节点等公开变化，结果需回到官网复核。</p>
            </div>
            <Toggle
              checked={form.tavilyEnabled}
              onChange={(value) => setField({ tavilyEnabled: value })}
              label="启用 Tavily 检索"
            />
          </div>
        </div>
        <div className={`settings-fields ${form.tavilyEnabled ? '' : 'is-muted'}`}>
          <label className="field settings-field-wide">
            <span>
              Tavily API Key
              {form.hasTavilyKey && !clearTavilyKey && !tavilyKey && (
                <em className="settings-key-status"><ShieldCheck size={12} /> 已加密保存 ····{form.tavilyKeyLast4}</em>
              )}
            </span>
            <div className="secret-field">
              <KeyRound size={16} />
              <input
                type="password"
                value={tavilyKey}
                onChange={(event) => {
                  setTavilyKey(event.target.value);
                  if (event.target.value) setClearTavilyKey(false);
                }}
                placeholder={form.hasTavilyKey && !clearTavilyKey ? '留空表示沿用已保存密钥' : 'tvly-…'}
                disabled={!form.tavilyEnabled}
                autoComplete="off"
              />
            </div>
          </label>
          {form.hasTavilyKey && (
            <label className="inline-check settings-field-wide">
              <input
                type="checkbox"
                checked={clearTavilyKey}
                onChange={(event) => setClearTavilyKey(event.target.checked)}
                disabled={!form.tavilyEnabled}
              />
              清除已保存的 Tavily 密钥
            </label>
          )}
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <span className="settings-icon is-navy"><Database size={18} /></span>
          <div>
            <h3>本机数据</h3>
            <p>画像、课程表、赛程与备赛进度均以 JSON 保存在本机。</p>
          </div>
        </div>
        <div className="data-path-row">
          <div>
            <span>数据目录</span>
            <strong>{appInfo?.dataDir || '首次保存后创建'}</strong>
          </div>
          <button type="button" className="btn btn-outline btn-small" onClick={() => onOpenDataFolder?.()}>
            <FolderOpen size={15} />
            打开目录
          </button>
        </div>
        <div className="settings-about">
          <span>竞智AI v{appInfo?.version || '1.0.0'} · 端侧智能匹配</span>
          <span>{appInfo?.platform === 'win32' || !appInfo?.platform ? 'Windows 桌面客户端' : appInfo.platform}</span>
        </div>
        <div className={`reset-zone ${confirmReset ? 'is-confirming' : ''}`}>
          <div>
            <strong>{confirmReset ? '确定清空全部本机数据？' : '重新开始'}</strong>
            <p>
              {confirmReset
                ? '画像、课程表、赛事日程与备赛进度将被删除，此操作不可撤销。设置中的密钥会保留。'
                : '清空画像与日程，重新走一次首次画像流程。'}
            </p>
          </div>
          <button type="button" className="btn btn-danger-outline btn-small" onClick={handleReset}>
            <RotateCcw size={15} />
            {confirmReset ? '确认清空' : '清空数据'}
          </button>
        </div>
      </section>
    </Modal>
  );
}
