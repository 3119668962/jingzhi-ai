import React from 'react';
import {
  ArrowRight,
  CalendarDays,
  CircleAlert,
  MapPin,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { CategoryBadge, CategoryIcon, ScoreRing } from './ui';

function MetaItem({ icon: Icon, children }) {
  return (
    <span className="meta-item">
      <Icon size={14} strokeWidth={1.9} />
      {children}
    </span>
  );
}

export function RecommendationCard({
  item,
  index = 0,
  onOpen,
  favorite = false,
  onToggleFavorite,
}) {
  const accent = item.categoryMeta.accent;
  return (
    <article
      className="recommendation-card"
      tabIndex={0}
      role="button"
      onClick={() => onOpen?.(item)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onOpen?.(item);
      }}
      style={{ '--card-accent': accent, '--card-soft': item.categoryMeta.soft }}
    >
      <div className="recommendation-main">
        <div className="recommendation-top">
          <div className="competition-identity">
            <div className="competition-icon">
              <CategoryIcon category={item.category} size={22} />
            </div>
            <div>
              <div className="title-badges">
                <CategoryBadge meta={item.categoryMeta} small />
                <span className={`strategy-pill strategy-${item.strategy?.tone || 'neutral'}`}>
                  {item.strategy?.label}
                </span>
                {item.conflicts?.length > 0 && (
                  <span className="soft-danger-pill">
                    <CircleAlert size={12} />
                    时间冲突
                  </span>
                )}
              </div>
              <h3>{item.name}</h3>
              <p className="competition-abbr">{item.abbr || item.short} · 第 {String(item.no).padStart(2, '0')} 项</p>
            </div>
          </div>
          <div className="recommendation-score">
            <ScoreRing value={item.total} size={82} strokeWidth={7} label={item.matchLevel} />
          </div>
        </div>

        <div className="recommendation-meta">
          <MetaItem icon={CalendarDays}>{item.season}</MetaItem>
          <MetaItem icon={Users}>{item.team} · {item.format}</MetaItem>
          <MetaItem icon={MapPin}>{item.mode}</MetaItem>
        </div>

        <div className="tag-row">
          {item.tags.slice(0, 4).map((tag) => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
          <span className="tag tag-ghost">{item.fieldsText}</span>
        </div>

        <div className="ai-reason-strip">
          <span className="reason-icon">
            <Sparkles size={15} />
          </span>
          <p>
            <strong>
              AI 判断
              {item.aiEnhance && <span className="ai-model-chip">大模型增强</span>}
            </strong>
            {item.aiEnhance?.reason || item.reasons[0]?.text}
          </p>
        </div>
        {item.aiEnhance?.caution && (
          <div className="ai-caution-line">
            <CircleAlert size={13} />
            {item.aiEnhance.caution}
          </div>
        )}

        <div className="recommendation-footer">
          <div className="track-hint">
            <span>推荐赛道</span>
            <strong>{item.aiEnhance?.track || item.bestTrack?.name || '综合主赛道'}</strong>
          </div>
          <button type="button" className="text-link" onClick={() => onOpen?.(item)}>
            查看匹配报告
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
      {onToggleFavorite && (
        <button
          type="button"
          className={`favorite-button ${favorite ? 'is-favorite' : ''}`}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(item.id);
          }}
          aria-label={favorite ? '取消收藏' : '收藏竞赛'}
        >
          <Star size={17} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      )}
      <span className="card-rank">{String(index + 1).padStart(2, '0')}</span>
    </article>
  );
}

export function DirectoryCard({ item, evaluation, onOpen, favorite, onToggleFavorite }) {
  return (
    <article
      className="directory-card"
      tabIndex={0}
      role="button"
      onClick={() => onOpen?.(item)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onOpen?.(item);
      }}
      style={{ '--card-accent': item.categoryMeta.accent, '--card-soft': item.categoryMeta.soft }}
    >
      <div className="directory-top">
        <div className="competition-icon is-small">
          <CategoryIcon category={item.category} size={20} />
        </div>
        <div className="directory-badges">
          <CategoryBadge meta={item.categoryMeta} small />
          <span className="catalog-no">#{String(item.no).padStart(2, '0')}</span>
        </div>
        {onToggleFavorite && (
          <button
            type="button"
            className={`favorite-button is-inline ${favorite ? 'is-favorite' : ''}`}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(item.id);
            }}
            aria-label={favorite ? '取消收藏' : '收藏竞赛'}
          >
            <Star size={16} fill={favorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      <h3>{item.name}</h3>
      <p className="directory-desc">{item.intro}</p>
      <div className="tag-row">
        {item.tags.slice(0, 3).map((tag) => (
          <span className="tag tag-small" key={tag}>{tag}</span>
        ))}
      </div>
      <div className="directory-footer">
        <div>
          <span className="mini-label">面向</span>
          <strong>{item.team}</strong>
        </div>
        <div>
          <span className="mini-label">参考窗口</span>
          <strong>{item.registration.replace('（往年节奏）', '')}</strong>
        </div>
        {evaluation && (
          <span className="directory-score">
            R <strong>{Math.round(evaluation.total)}</strong>
          </span>
        )}
      </div>
      <div className="directory-hover-line">
        <span>查看赛事详情</span>
        <ArrowRight size={15} />
      </div>
    </article>
  );
}
