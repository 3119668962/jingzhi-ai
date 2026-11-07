import React, { useEffect, useState } from 'react';
import { ChevronDown, Plus, Sparkles } from 'lucide-react';
import { Modal } from './ui';
import { COMPETITION_CATEGORIES } from '../data/competitions';
import { expandMonthRange } from '../lib/matcher';

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

const EMPTY_FORM = {
  name: '',
  organizer: '',
  category: 'innovation',
  website: '',
  regStart: 3,
  regEnd: 5,
  eventStart: 6,
  eventEnd: 8,
  team: '',
  format: '团队赛',
  mode: '',
  location: '',
  tags: '',
  intro: '',
  requirements: '',
};

function MonthRange({ label, start, end, onChange }) {
  return (
    <div className="field">
      <span>{label}</span>
      <div className="month-range compact">
        <div className="select-wrap">
          <select value={start} onChange={(event) => onChange(Number(event.target.value), end)}>
            {MONTHS.map((month) => <option value={month} key={month}>{month} 月</option>)}
          </select>
          <ChevronDown size={14} />
        </div>
        <span>至</span>
        <div className="select-wrap">
          <select value={end} onChange={(event) => onChange(start, Number(event.target.value))}>
            {MONTHS.map((month) => <option value={month} key={month}>{month} 月</option>)}
          </select>
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}

export default function AddCompetitionModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    setError('');
    setSaving(false);
  }, [open]);

  const setField = (patch) => {
    setForm((current) => ({ ...current, ...patch }));
    setError('');
  };

  const handleSubmit = () => {
    const name = form.name.trim();
    if (!name) {
      setError('请填写赛事名称。');
      return;
    }
    if (form.website.trim() && !/^https?:\/\/\S+$/i.test(form.website.trim())) {
      setError('官网链接需以 http:// 或 https:// 开头。');
      return;
    }
    if (form.tags.split(/[，,]/).filter((tag) => tag.trim()).length > 10) {
      setError('能力关键词最多填写 10 个。');
      return;
    }

    setSaving(true);
    const result = onAdd?.({
      ...form,
      name,
      website: form.website.trim(),
      tags: form.tags.split(/[，,]/).map((tag) => tag.trim()).filter(Boolean),
      regMonths: expandMonthRange(form.regStart, form.regEnd),
      eventMonths: expandMonthRange(form.eventStart, form.eventEnd),
      description: form.requirements.trim()
        ? `${form.intro.trim() || name}。参赛要求：${form.requirements.trim()}`
        : form.intro.trim(),
    });
    setSaving(false);
    if (!result?.ok) {
      setError(result?.error || '添加赛事失败，请重试。');
      return;
    }
    onClose?.();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="添加自定义赛事"
      subtitle="把你搜寻到的赛事加入本机竞赛库，并参与智能匹配"
      size="lg"
      footer={(
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>取消</button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            <Plus size={15} />
            {saving ? '添加中…' : '加入竞赛库'}
          </button>
        </>
      )}
    >
      {error && <div className="inline-error">{error}</div>}
      <div className="custom-competition-form">
        <div className="custom-comp-grid">
          <label className="field field-wide">
            <span>赛事名称 <em>*</em></span>
            <input
              autoFocus
              value={form.name}
              onChange={(event) => setField({ name: event.target.value })}
              placeholder="填写你找到的竞赛全称"
              maxLength={100}
            />
          </label>
          <label className="field">
            <span>赛事类别</span>
            <select value={form.category} onChange={(event) => setField({ category: event.target.value })}>
              {COMPETITION_CATEGORIES.map((item) => (
                <option value={item.id} key={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>主办方 <small>选填</small></span>
            <input
              value={form.organizer}
              onChange={(event) => setField({ organizer: event.target.value })}
              placeholder="如：中国计算机学会"
              maxLength={100}
            />
          </label>
          <label className="field field-wide">
            <span>赛事官网 <small>选填</small></span>
            <input
              type="url"
              value={form.website}
              onChange={(event) => setField({ website: event.target.value })}
              placeholder="https://"
              maxLength={500}
            />
          </label>
          <MonthRange
            label="预计报名月份"
            start={form.regStart}
            end={form.regEnd}
            onChange={(regStart, regEnd) => setField({ regStart, regEnd })}
          />
          <MonthRange
            label="预计比赛月份"
            start={form.eventStart}
            end={form.eventEnd}
            onChange={(eventStart, eventEnd) => setField({ eventStart, eventEnd })}
          />
          <label className="field">
            <span>参赛对象 / 资格要求 <small>选填</small></span>
            <input
              value={form.requirements}
              onChange={(event) => setField({ requirements: event.target.value })}
              placeholder="如：本科在校生，需学校推荐"
              maxLength={300}
            />
          </label>
          <label className="field">
            <span>组队人数 <small>选填</small></span>
            <input
              value={form.team}
              onChange={(event) => setField({ team: event.target.value })}
              placeholder="如：1–3 人"
              maxLength={40}
            />
          </label>
          <label className="field">
            <span>参赛形式</span>
            <select value={form.format} onChange={(event) => setField({ format: event.target.value })}>
              <option>团队赛</option>
              <option>个人赛</option>
              <option>个人 / 团队均可</option>
              <option>按赛道要求</option>
            </select>
          </label>
          <label className="field">
            <span>组织方式 <small>选填</small></span>
            <input
              value={form.mode}
              onChange={(event) => setField({ mode: event.target.value })}
              placeholder="如：校赛—省赛—全国赛"
              maxLength={100}
            />
          </label>
          <label className="field">
            <span>比赛地点 <small>选填</small></span>
            <input
              value={form.location}
              onChange={(event) => setField({ location: event.target.value })}
              placeholder="如：线上 / 承办高校"
              maxLength={100}
            />
          </label>
          <label className="field field-wide">
            <span>能力 / 方向关键词 <small>逗号分隔，最多 10 个</small></span>
            <input
              value={form.tags}
              onChange={(event) => setField({ tags: event.target.value })}
              placeholder="如：人工智能、数据分析、创新创业"
              maxLength={300}
            />
          </label>
          <label className="field field-wide">
            <span>赛事简介 <small>选填</small></span>
            <textarea
              value={form.intro}
              onChange={(event) => setField({ intro: event.target.value })}
              placeholder="记录赛事内容、赛道特点或报名信息，方便后续查看。"
              maxLength={600}
              rows={3}
            />
          </label>
        </div>
        <div className="custom-comp-notice">
          <Sparkles size={15} />
          <span>自定义赛事会使用所选类别和关键词参与推荐。系统不会核验你填写的内容，请以赛事官网通知为准。</span>
        </div>
      </div>
    </Modal>
  );
}
