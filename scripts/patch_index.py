import re
from pathlib import Path

p = Path('/home/skicmi/bartender-sanctuary-app/pages/index.tsx')
text = p.read_text()

# Update imports: drop CocktailCard, keep type-only Cocktail
text = text.replace("import CocktailCard from '@/components/CocktailCard';\n", '')

# State: unified selectedIngredients, no custom/accordion state
text = text.replace("const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);", "const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);")

# Derived: keep categorized/allBases/allMods/allIngredients but remove openAccordions-dependent helpers
text = text.replace('  const allBases = useMemo(\n    () => [...new Set(cocktails.flatMap((c) => c.base))].sort(),\n    [cocktails]\n  );\n  const allMods = useMemo(\n    () => [...new Set(cocktails.flatMap((c) => c.modifiers))].sort(),\n    [cocktails]\n  );\n  const categorized = useMemo(() => getCategorizedIngredients(cocktails), [cocktails]);\n  const allIngredients = useMemo(\n    () =>\n      [...new Set(cocktails.flatMap((c) => c.ingredients.map((i) => i.item)))].sort(),\n    [cocktails]\n  );', '  const categorized = useMemo(() => getCategorizedIngredients(cocktails), [cocktails]);\n  const allIngredients = useMemo(\n    () =>\n      [...new Set(cocktails.flatMap((c) => c.ingredients.map((i) => i.item)))].sort(),\n    [cocktails]\n  );')

# matches / suggestions
text = text.replace('  const matches = useMemo(\n    () => matchCocktails(cocktails, selectedBases, selectedMods, selectedCustom),\n    [selectedBases, selectedMods, selectedCustom, cocktails]\n  );\n\n  const suggestions = useMemo(\n    () => techniqueSuggestions(selectedBases, selectedMods),\n    [selectedBases, selectedMods]\n  );', '  const matches = useMemo(\n    () => matchCocktails(cocktails, selectedIngredients, selectedIngredients, selectedIngredients),\n    [selectedIngredients, cocktails]\n  );\n\n  const suggestions = useMemo(() => techniqueSuggestions(selectedIngredients, selectedIngredients), [selectedIngredients]);')

# Remove old helpers referencing removed state
text = text.replace('  const toggleAccordion = (key: string) => {\n    setOpenAccordions((prev) => {\n      const next = new Set(prev);\n      if (next.has(key)) next.delete(key);\n      else next.add(key);\n      return next;\n    });\n  };\n\n', '')
text = text.replace('  const toggleIngredient = (category: \'base\' | \'mod\', value: string) => {\n    const setter = category === \'base\' ? setSelectedBases : setSelectedMods;\n    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));\n  };\n\n', '')
text = text.replace('  const addCustomIngredient = () => {\n    const trimmed = customInput.trim();\n    if (!trimmed) return;\n    if (!selectedCustom.includes(trimmed)) {\n      setSelectedCustom((prev) => [...prev, trimmed]);\n    }\n    setCustomInput(\'\');\n  };\n\n  const removeCustomIngredient = (value: string) => {\n    setSelectedCustom((prev) => prev.filter((v) => v !== value));\n  };\n\n  const clearCustomIngredients = () => {\n    setSelectedCustom([]);\n    setCustomInput(\'\');\n  };\n\n', '')

# Update handleCocktailClick / handleSurpriseMe
text = text.replace('  const handleCocktailClick = (cocktail: Cocktail) => {\n    setActiveTab(\'tool\');\n    setSelectedBases(cocktail.base);\n    setSelectedMods(cocktail.modifiers);\n    const existing = new Set([...cocktail.base, ...cocktail.modifiers].map((i) => i.toLowerCase()));\n    const extras = (cocktail.ingredients || [])\n      .map((i) => i.item)\n      .filter((item) => !existing.has(item.toLowerCase()));\n    if (extras.length) {\n      setSelectedCustom((prev) => {\n        const merged = new Set([...prev, ...extras]);\n        return [...merged];\n      });\n    }\n  };\n\n  const handleSurpriseMe = () => {\n    if (!cocktails.length) return;\n    const random = cocktails[Math.floor(Math.random() * cocktails.length)];\n    setActiveTab(\'tool\');\n    setSelectedBases(random.base);\n    setSelectedMods(random.modifiers);\n  };', '  const handleCocktailClick = (cocktail: Cocktail) => {\n    setActiveTab(\'tool\');\n    setSelectedIngredients((prev) => {\n      const base = new Set((cocktail.base || []).map((i) => i.toLowerCase()));\n      const extras = (cocktail.ingredients || [])\n        .map((i) => (typeof i === \'string\' ? i : i?.item))\n        .filter((item) => item && !base.has(item.toLowerCase()));\n      return [...new Set([...prev, ...(cocktail.base || []), ...extras])];\n    });\n  };\n\n  const handleSurpriseMe = () => {\n    if (!cocktails.length) return;\n    const random = cocktails[Math.floor(Math.random() * cocktails.length)];\n    const extras = (random.ingredients || [])\n      .map((i) => (typeof i === \'string\' ? i : i?.item))\n      .filter(Boolean);\n    setSelectedIngredients((prev) => [...new Set([...prev, ...extras])]);\n  };')

# Replace old base accordion content block
old = '''              <div className={`accordion ${openAccordions.has('base') ? 'open' : ''}`}>
                <div
                  className="accordion-header"
                  onClick={() => toggleAccordion('base')}
                >
                  <span>{t('baseSpirits')}</span>
                  <svg
                    className="accordion-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="accordion-body">
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: '0.6rem'
                    }}
                  >
                    {categorized.base.map((base) => (
                      <label
                        key={base}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem',
                          background: 'var(--color-surface)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-surface)')}
                      >
                        <input
                          type="checkbox"
                          checked={selectedBases.includes(base)}
                          onChange={() => toggleIngredient('base', base)}
                        />
                        {base}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`accordion ${openAccordions.has('mod') ? 'open' : ''}`}>
                <div
                  className="accordion-header"
                  onClick={() => toggleAccordion('mod')}
                >
                  <span>{t('modifiers')}</span>
                  <svg
                    className="accordion-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="accordion-body">
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: '0.6rem'
                    }}
                  >
                    {categorized.mod.map((mod) => (
                      <label
                        key={mod}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem',
                          background: 'var(--color-surface)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-surface)')}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMods.includes(mod)}
                          onChange={() => toggleIngredient('mod', mod)}
                        />
                        {mod}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginTop: '0.75rem',
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--color-accent)'
                    }}
                  >
                    My Pantry
                  </span>
                  {selectedCustom.length > 0 && (
                    <button
                      onClick={clearCustomIngredients}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {selectedCustom.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                      marginBottom: '0.75rem'
                    }}
                  >
                    {selectedCustom.map((item) => (
                      <span
                        key={item}
                        className="tag"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          cursor: 'default'
                        }}
                      >
                        {item}
                        <button
                          onClick={() => removeCustomIngredient(item)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            lineHeight: 1,
                            padding: 0
                          }}
                          aria-label={`Remove ${item}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}
                >
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomIngredient();
                      }
                    }}
                    placeholder="Add spirit, liqueur, mixer, garnish…"
                    style={{
                      flex: 1,
                      padding: '0.55rem 0.7rem',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={addCustomIngredient}
                    className="btn-secondary"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Add to pantry
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <button className="btn-primary" onClick={() => setActiveTab('tool')}>
                  {t('btnFindMatches')}
                </button>
                <button className="btn-secondary" onClick={handleSurpriseMe}>
                  {t('btnSurpriseMe')}
                </button>
              </div>'''
new = '''              <div className={`accordion ${openAccordions.has('base') ? 'open' : ''}`}>
                <div
                  className="accordion-header"
                  onClick={() => toggleAccordion('base')}
                >
                  <span>{t('baseSpirits')} · {categorized.base.length}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedIngredients((prev) => prev.filter((s) => !categorized.base.some((b) => b.toLowerCase() === s.toLowerCase()))); }}
                    style={{ background:'none', border:'none', color:'var(--color-text-muted)', fontSize:'0.8rem', cursor:'pointer', textDecoration:'underline' }}
                  >
                    Clear
                  </button>
                </div>
                <div className="accordion-body">
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                    {categorized.base.map((base) => {
                      const active = selectedIngredients.some((s) => s.toLowerCase() === base.toLowerCase());
                      return (
                        <button
                          key={base}
                          onClick={() => setSelectedIngredients((prev) => active ? prev.filter((s) => s.toLowerCase() !== base.toLowerCase()) : [...prev, base])}
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '999px',
                            border: '1px solid ' + (active ? 'var(--color-accent)' : 'var(--color-border)'),
                            background: active ? 'rgba(99,102,241,0.15)' : 'var(--color-surface)',
                            color: active ? '#fff' : 'var(--color-text)',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {base}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={`accordion ${openAccordions.has('mod') ? 'open' : ''}`}>
                <div
                  className="accordion-header"
                  onClick={() => toggleAccordion('mod')}
                >
                  <span>{t('modifiers')} · {categorized.mod.length}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedIngredients((prev) => prev.filter((s) => !categorized.mod.some((m) => m.toLowerCase() === s.toLowerCase()))); }}
                    style={{ background:'none', border:'none', color:'var(--color-text-muted)', fontSize:'0.8rem', cursor:'pointer', textDecoration:'underline' }}
                  >
                    Clear
                  </button>
                </div>
                <div className="accordion-body">
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                    {categorized.mod.map((mod) => {
                      const active = selectedIngredients.some((s) => s.toLowerCase() === mod.toLowerCase());
                      return (
                        <button
                          key={mod}
                          onClick={() => setSelectedIngredients((prev) => active ? prev.filter((s) => s.toLowerCase() !== mod.toLowerCase()) : [...prev, mod])}
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '999px',
                            border: '1px solid ' + (active ? 'var(--color-accent)' : 'var(--color-border)'),
                            background: active ? 'rgba(99,102,241,0.15)' : 'var(--color-surface)',
                            color: active ? '#fff' : 'var(--color-text)',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {mod}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap', marginTop:'1rem' }}>
                <button className="btn-primary" onClick={() => setActiveTab('tool')}>
                  {t('btnFindMatches')}
                </button>
                <button className="btn-secondary" onClick={handleSurpriseMe}>
                  {t('btnSurpriseMe')}
                </button>
              </div>'''
if old not in text:
    raise SystemExit('tool block not found')
text = text.replace(old, new)

# Replace browse CocktailCard grid with simple inline cards
text = text.replace('import CocktailCard from \'@/components/CocktailCard\';\n', '')
text = text.replace('                    <CocktailCard cocktail={c} onClick={() => handleCocktailClick(c)} />', '                    <div\n                      onClick={() => handleCocktailClick(c)}\n                      style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: '10px', cursor: 'pointer' }}\n                    >\n                      <div style={{ fontWeight: 600 }}>{c.name}</div>\n                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{c.glass} glass</div>\n                    </div>')
text = text.replace('                  <div key={c.slug} className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>\n                    ', '                  <div key={c.slug}>\n                    ')

p.write_text(text)
print('rewrote tool + browse cards')
