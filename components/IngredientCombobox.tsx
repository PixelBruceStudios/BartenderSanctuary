'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

export interface IngredientComboboxProps {
  allItems: string[];
  selected: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder?: string;
  label?: string;
  allowCustom?: boolean;
  emptyMessage?: string;
}

type MatchTier = 'exact' | 'starts' | 'includes';

interface ScoredItem {
  item: string;
  tier: MatchTier;
  score: number;
}

function scoreItem(item: string, query: string): ScoredItem | null {
  const normalizedItem = item.toLowerCase();
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return { item, tier: 'includes', score: 0 };
  }

  if (normalizedItem === normalizedQuery) {
    return { item, tier: 'exact', score: 0 };
  }

  if (normalizedItem.startsWith(normalizedQuery)) {
    return { item, tier: 'starts', score: 1 };
  }

  if (normalizedItem.includes(normalizedQuery)) {
    return { item, tier: 'includes', score: 2 + normalizedItem.split(normalizedQuery).length - 1 };
  }

  return null;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text: string, query: string) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return text;

  const escaped = escapeRegex(normalizedQuery);
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <strong key={index} style={{ color: 'var(--color-accent)' }}>
        {part}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}

export default function IngredientCombobox({
  allItems,
  selected,
  onAdd,
  onRemove,
  placeholder = 'Search ingredients…',
  label = 'Ingredients',
  allowCustom = true,
  emptyMessage,
}: IngredientComboboxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useMemo(() => `ingredient-listbox-${label.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`, [label]);

  const normalizedQuery = query.trim().toLowerCase();

  const selectedLower = useMemo(
    () => new Set(selected.map((s) => s.toLowerCase())),
    [selected]
  );

  const suggestions = useMemo(() => {
    const scored: ScoredItem[] = [];

    for (const item of allItems) {
      if (selectedLower.has(item.toLowerCase())) continue;

      const scoredItem = scoreItem(item, query);
      if (!scoredItem) continue;

      scored.push(scoredItem);
    }

    scored.sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return a.item.localeCompare(b.item);
    });

    return scored.slice(0, 14).map((s) => s.item);
  }, [allItems, query, selectedLower]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [normalizedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleFocusIn = () => {
      if (containerRef.current?.contains(document.activeElement as Node)) {
        setIsOpen(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  const addItem = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const normalized = trimmed.toLowerCase();
    if (selectedLower.has(normalized)) {
      setQuery('');
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
      return;
    }
    onAdd(trimmed);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        addItem(suggestions[highlightedIndex]);
      } else if (allowCustom && normalizedQuery) {
        addItem(normalizedQuery);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Backspace' && !query && selected.length > 0) {
      onRemove(selected[selected.length - 1]);
    }
  };

  const showEmptyState = isOpen && !query && suggestions.length === 0 && allItems.length > 0;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {label && (
        <span
          style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-accent)',
            marginBottom: '0.5rem',
          }}
        >
          {label}
        </span>
      )}

      {selected.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            marginBottom: '0.6rem',
          }}
        >
          {selected.map((item) => (
            <span
              key={item}
              className="tag"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'default',
              }}
            >
              {item}
              <button
                onClick={() => onRemove(item)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  lineHeight: 1,
                  padding: 0,
                }}
                aria-label={`Remove ${item}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            const related = document.activeElement as HTMLElement | null;
            if (related && containerRef.current?.contains(related)) {
              return;
            }
            setIsOpen(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '0.7rem 2.2rem 0.7rem 0.8rem',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
            width: '16px',
            height: '16px',
            pointerEvents: 'none',
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>

        {isOpen && suggestions.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              maxHeight: '240px',
              overflowY: 'auto',
              zIndex: 50,
              boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
              listStyle: 'none',
              padding: '0.35rem 0',
              margin: '4px 0 0 0',
            }}
          >
            {suggestions.map((item, index) => (
              <li
                key={item}
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addItem(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
                style={{
                  padding: '0.55rem 0.9rem',
                  border: 'none',
                  background: index === highlightedIndex ? 'var(--color-surface-hover)' : 'transparent',
                  color: 'var(--color-text)',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.12s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {highlightText(item, query)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {showEmptyState && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              padding: '0.7rem 0.8rem',
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              zIndex: 50,
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            }}
          >
            {emptyMessage || 'All items selected'}
          </div>
        )}
      </div>
    </div>
  );
}
