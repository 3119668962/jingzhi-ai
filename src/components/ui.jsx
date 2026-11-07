import React, { useId } from 'react';
import {
  Award,
  Briefcase,
  Check,
  Code2,
  Cpu,
  FlaskConical,
  Languages,
  Palette,
  Rocket,
  Sigma,
  Trophy,
  X,
} from 'lucide-react';

export function Logo({ size = 42, inverted = false }) {
  const gradientId = `logo-gradient-${useId().replace(/:/g, '')}`;
  return (
    <div className={`brand-mark ${inverted ? 'is-inverted' : ''}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2C6BED" />
            <stop offset="0.58" stopColor="#207FE5" />
            <stop offset="1" stopColor="#12BFC8" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="14" fill={`url(#${gradientId})`} />
        <path
          d="M11.5 32.8L20.6 23.6L26.4 29.3L37 18.6"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="36.8" cy="18.7" r="3.2" fill="#B8FFFC" />
        <path d="M11.8 17.4H18.8M15.3 13.9V20.9" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.72" />
        <circle cx="12" cy="35.6" r="1.5" fill="white" opacity="0.78" />
      </svg>
    </div>
  );
}

export function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <Logo size={compact ? 34 : 42} />
      <div className="brand-copy">
        <div className="brand-name">竞智<span>AI</span></div>
        {!compact && <div className="brand-tagline">竞赛决策与成长规划</div>}
      </div>
    </div>
  );
}

export function CategoryIcon({ category, size = 20 }) {
  const map = {
    innovation: Rocket,
    computer: Code2,
    engineering: Cpu,
    science: Sigma,
    design: Palette,
    business: Briefcase,
    medicine: FlaskConical,
    humanities: Languages,
    agriculture: Trophy,
    vocational: Award,
  };
  const Icon = map[category] || Trophy;
  return <Icon size={size} strokeWidth={1.9} />;
}

export function CategoryBadge({ meta, small = false }) {
  if (!meta) return null;
  return (
    <span
      className={`category-badge ${small ? 'category-badge-sm' : ''}`}
      style={{ color: meta.accent, background: meta.soft }}
    >
      <span className="badge-dot" style={{ background: meta.accent }} />
      {meta.label}
    </span>
  );
}

export function ScoreRing({
  value,
  size = 112,
  strokeWidth = 8,
  label = '综合指数',
  tone = 'blue',
  showLabel = true,
}) {
  const uid = useId().replace(/:/g, '');
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  const colors = {
    blue: ['#2C6BED', '#13B6C8'],
    teal: ['#0E9F8F', '#51D7B6'],
    amber: ['#DD8525', '#F4BA5B'],
    navy: ['#1C386C', '#2C6BED'],
    red: ['#D95454', '#F09A74'],
  }[tone] || ['#2C6BED', '#13B6C8'];
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={`ring-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={colors[0]} />
            <stop offset="1" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EAF0F8"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#ring-${uid})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="score-ring-value"
        />
      </svg>
      <div className="score-ring-copy" style={{ width: size }}>
        <strong style={{ fontSize: size * 0.27 }}>{Number.isFinite(value) ? Math.round(value) : '--'}</strong>
        {showLabel && <span style={{ fontSize: Math.max(10, size * 0.088) }}>{label}</span>}
      </div>
    </div>
  );
}

export function ProgressBar({ value, accent = '#2C6BED', height = 6, soft = '#EBF0F8' }) {
  return (
    <div className="progress-track" style={{ height, background: soft }}>
      <div
        className="progress-fill"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: accent }}
      />
    </div>
  );
}

export function ScoreBars({ breakdown, compact = false }) {
  return (
    <div className={`score-bars ${compact ? 'is-compact' : ''}`}>
      {breakdown.map((item, index) => {
        const colors = ['#2C6BED', '#0E9F8F', '#DD8525', '#8664E8', '#18A878'];
        return (
          <div className="score-bar-row" key={item.key}>
            <div className="score-bar-label">
              <span>{item.label}</span>
              {!compact && <em>{Math.round(item.weight * 100)}%</em>}
            </div>
            <ProgressBar value={item.score} height={compact ? 5 : 7} accent={colors[index % colors.length]} />
            <strong>{Math.round(item.score)}</strong>
          </div>
        );
      })}
    </div>
  );
}

export function RadarChart({ values = [], size = 260, accent = '#2C6BED' }) {
  const uid = useId().replace(/:/g, '');
  const view = 300;
  const center = view / 2;
  const radius = 88;
  const count = values.length || 1;
  const points = values.map((item, index) => {
    const angle = -Math.PI / 2 + (index / count) * Math.PI * 2;
    const ratio = Math.max(0.08, Math.min(1, item.value / 5));
    return {
      x: center + Math.cos(angle) * radius * ratio,
      y: center + Math.sin(angle) * radius * ratio,
      axisX: center + Math.cos(angle) * radius,
      axisY: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * (radius + 34),
      labelY: center + Math.sin(angle) * (radius + 34),
      ...item,
    };
  });
  const polygon = points.map((point) => `${point.x},${point.y}`).join(' ');
  return (
    <svg
      className="radar-chart"
      viewBox={`0 0 ${view} ${view}`}
      width={size}
      height={size}
      role="img"
      aria-label="能力雷达图"
    >
      <defs>
        <linearGradient id={`radar-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={accent} stopOpacity="0.32" />
          <stop offset="1" stopColor="#13B6C8" stopOpacity="0.14" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <circle
          key={ratio}
          cx={center}
          cy={center}
          r={radius * ratio}
          fill="none"
          stroke="#E7EDF6"
          strokeWidth="1"
        />
      ))}
      {points.map((point, index) => (
        <line
          key={values[index]?.name || index}
          x1={center}
          y1={center}
          x2={point.axisX}
          y2={point.axisY}
          stroke="#E7EDF6"
          strokeWidth="1"
        />
      ))}
      <polygon points={polygon} fill={`url(#radar-${uid})`} stroke={accent} strokeWidth="2" />
      {points.map((point, index) => (
        <g key={`point-${values[index]?.name || index}`}>
          <circle cx={point.x} cy={point.y} r="3.2" fill="white" stroke={accent} strokeWidth="2" />
          <text
            x={point.labelX}
            y={point.labelY}
            textAnchor={Math.abs(point.labelX - center) < 18 ? 'middle' : point.labelX > center ? 'start' : 'end'}
            dominantBaseline="middle"
            className="radar-label"
          >
            {point.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Toggle({ checked, onChange, disabled = false, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`toggle ${checked ? 'is-on' : ''}`}
      onClick={() => onChange?.(!checked)}
    >
      <span />
    </button>
  );
}

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <div className={`modal-panel modal-${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="icon-button subtle" onClick={onClose} aria-label="关闭">
            <X size={19} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon = Trophy, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={24} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function CheckItem({ checked, onClick, children }) {
  return (
    <button type="button" className={`check-item ${checked ? 'is-checked' : ''}`} onClick={onClick}>
      <span className="check-box">{checked && <Check size={12} strokeWidth={3} />}</span>
      <span>{children}</span>
    </button>
  );
}

export function SourceNotice({ compact = false, custom = false }) {
  return (
    <p className={`source-notice ${compact ? 'is-compact' : ''}`}>
      {custom
        ? '该赛事由用户补充，赛事时间、参赛资格及其他信息尚未核验，请以赛事官方通知为准。'
        : '数据基础：2025 年教育部认可的全国大学生学科竞赛目录（84 项）。赛程为往届节奏参考，报名与资格要求请以赛事官网当年通知为准。'}
    </p>
  );
}
