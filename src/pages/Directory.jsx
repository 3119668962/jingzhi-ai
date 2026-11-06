import React, { useMemo, useState } from 'react';
import { Library, Search, Star } from 'lucide-react';
import { EmptyState, SourceNotice } from '../components/ui';
import { DirectoryCard } from '../components/CompetitionCard';
import { COMPETITION_CATEGORIES } from '../data/competitions';

export default function Directory({ evaluations, favorites, onToggleFavorite, onOpenCompetition }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const evaluationMap = useMemo(
    () => Object.fromEntries(evaluations.map((item) => [item.id, item])),
    [evaluations],
  );

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return evaluations.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (favoritesOnly && !favorites.includes(item.id)) return false;
      if (!text) return true;
      return [item.name, item.short, item.organizer, item.intro, item.fieldsText, ...item.tags]
        .join(' ')
        .toLowerCase()
        .includes(text);
    });
  }, [evaluations, query, category, favoritesOnly, favorites]);

  return (
    <div className="page directory-page">
      <section className="directory-hero">
        <div className="directory-hero-copy">
          <span className="section-eyebrow">COMPETITION LIBRARY · 2025</span>
          <h2>84 项赛事，一张完整的竞赛地图</h2>
          <p>
            覆盖教育部认可的全国大学生学科竞赛目录，按类别、专业与兴趣自由探索。每一项都可查看赛事信息、匹配依据与备赛路线。
          </p>
          <div className="directory-hero-stats">
            <div><strong>84</strong><span>目录赛事</span></div>
            <div><strong>10</strong><span>赛事类别</span></div>
            <div><strong>{favorites.length}</strong><span>我的收藏</span></div>
          </div>
        </div>
        <div className="directory-hero-art" aria-hidden="true">
          <span className="shelf shelf-a" />
          <span className="shelf shelf-b" />
          <span className="shelf shelf-c" />
          <div className="hero-library-icon"><Library size={54} strokeWidth={1.4} /></div>
          <span className="orbit-label label-a">计算机与 AI</span>
          <span className="orbit-label label-b">工程制造</span>
          <span className="orbit-label label-c">设计创意</span>
        </div>
      </section>

      <div className="directory-controls panel">
        <div className="directory-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索赛事名称、主办方或能力关键词"
          />
          {query && (
            <button type="button" className="search-clear" onClick={() => setQuery('')}>
              清除
            </button>
          )}
        </div>
        <button
          type="button"
          className={`favorites-filter ${favoritesOnly ? 'is-active' : ''}`}
          onClick={() => setFavoritesOnly((value) => !value)}
        >
          <Star size={15} fill={favoritesOnly ? 'currentColor' : 'none'} />
          只看收藏
          <span>{favorites.length}</span>
        </button>
        <span className="directory-count">共 {filtered.length} 项</span>
      </div>

      <div className="category-filter-row">
        <button
          type="button"
          className={`category-filter ${category === 'all' ? 'is-active' : ''}`}
          onClick={() => setCategory('all')}
        >
          全部类别
          <span>{evaluations.length}</span>
        </button>
        {COMPETITION_CATEGORIES.map((meta) => {
          const count = evaluations.filter((item) => item.category === meta.id).length;
          return (
            <button
              type="button"
              key={meta.id}
              className={`category-filter ${category === meta.id ? 'is-active' : ''}`}
              onClick={() => setCategory(meta.id)}
              style={category === meta.id ? { color: meta.accent, borderColor: meta.accent, background: meta.soft } : undefined}
            >
              <span className="category-filter-dot" style={{ background: meta.accent }} />
              {meta.label}
              <span>{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length ? (
        <div className="directory-grid">
          {filtered.map((item) => (
            <DirectoryCard
              key={item.id}
              item={item}
              evaluation={evaluationMap[item.id]}
              onOpen={onOpenCompetition}
              favorite={favorites.includes(item.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="panel">
          <EmptyState
            icon={favoritesOnly ? Star : Search}
            title={favoritesOnly ? '收藏夹还是空的' : '没有找到匹配的赛事'}
            description={
              favoritesOnly
                ? '在赛事卡片上点击星标，把感兴趣的竞赛集中到这里。'
                : '尝试更换关键词，或切换到其他赛事类别。'
            }
            action={
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                  setFavoritesOnly(false);
                }}
              >
                重置筛选
              </button>
            }
          />
        </div>
      )}

      <SourceNotice />
    </div>
  );
}
