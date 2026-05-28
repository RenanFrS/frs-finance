/* FrS Finance — dashboard preview component */
const { useState } = React;

const dashStyles = {
  shell: {
    border: '1px solid var(--rule)',
    background: 'var(--paper)',
    boxShadow: 'var(--shadow-vintage)',
    borderRadius: 24,
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    minHeight: 720,
    fontFamily: "'Newsreader', serif",
    color: 'var(--ink)',
    overflow: 'hidden',
  },
  side: {
    background: 'var(--paper-2)',
    borderRight: '1px solid var(--rule)',
    padding: '24px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
    paddingBottom: 20, borderBottom: '1px solid var(--rule)',
  },
  brandMark: {
    width: 28, height: 20,
    WebkitMask: 'url(assets/logo.svg) center/contain no-repeat',
    mask: 'url(assets/logo.svg) center/contain no-repeat',
    background: 'var(--ink)',
  },
  brandWord: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 600, fontSize: 15, letterSpacing: '0.01em',
  },
  sectionLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
    color: 'var(--ink-3)', marginBottom: 8,
  },
  navItem: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '9px 12px', borderRadius: 10,
    fontFamily: "'Newsreader', serif", fontSize: 14,
    color: 'var(--ink-2)', cursor: 'pointer',
  },
  navItemActive: {
    background: 'var(--primary-soft)',
    color: 'var(--primary)',
    fontWeight: 500,
  },
  navCount: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-3)',
  },
  main: { padding: '24px 28px 32px', display: 'grid', gap: 22 },
  topbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    paddingBottom: 18, borderBottom: '1px dashed var(--rule)',
  },
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700, fontSize: 28, letterSpacing: '-0.01em', lineHeight: 1.1,
    margin: 0,
  },
  pageSub: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
    letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)',
    marginTop: 4,
  },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: 10,
    border: '1px solid var(--rule)', borderRadius: 999,
    padding: '7px 14px', minWidth: 260, background: 'var(--paper-2)',
    fontFamily: "'Newsreader', serif", fontSize: 13, color: 'var(--ink-3)',
  },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 },
  kpi: {
    border: '1px solid var(--rule)',
    background: 'var(--paper-2)',
    borderRadius: 18,
    padding: 18, display: 'grid', gap: 8,
  },
  kpiLabel: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
    letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-3)',
  },
  kpiValue: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 500,
    color: 'var(--ink)', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums',
  },
  kpiTrend: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6,
  },
  twoCol: { display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18 },
  panel: {
    border: '1px solid var(--rule)', background: 'var(--paper-2)',
    borderRadius: 20,
    padding: 20, display: 'grid', gap: 14,
  },
  panelHead: {
    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    paddingBottom: 10, borderBottom: '1px solid var(--rule)',
  },
  panelTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 18, fontWeight: 600, margin: 0,
  },
  tabs: { display: 'flex', gap: 4 },
  tab: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
    letterSpacing: '0.18em', textTransform: 'uppercase',
    padding: '5px 10px', borderRadius: 999, cursor: 'pointer',
    color: 'var(--ink-3)',
  },
  tabActive: { background: 'var(--ink)', color: 'var(--paper)' },
  chartWrap: { padding: '8px 0 0' },
  tableRow: {
    display: 'grid', gridTemplateColumns: '24px 1fr 90px 110px 90px',
    gap: 12, padding: '11px 0', borderBottom: '1px dashed var(--rule)',
    alignItems: 'center', fontFamily: "'Newsreader', serif", fontSize: 14,
  },
  tableHead: {
    display: 'grid', gridTemplateColumns: '24px 1fr 90px 110px 90px',
    gap: 12, padding: '8px 0', borderBottom: '1px solid var(--ink)',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
    letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-3)',
  },
  cat: {
    width: 22, height: 22, borderRadius: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Playfair Display', serif", fontSize: 11, fontWeight: 600,
  },
  num: { fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  wa: {
    display: 'grid', gap: 10,
    padding: '4px 0',
  },
  waItem: {
    display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 12,
    padding: '10px 0', borderBottom: '1px dashed var(--rule)',
  },
  waAvatar: {
    width: 32, height: 32, borderRadius: 50,
    background: 'var(--primary-soft)', color: 'var(--primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500,
  },
  waMsg: { fontFamily: "'Newsreader', serif", fontSize: 14, color: 'var(--ink)' },
  waMeta: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.15em', color: 'var(--ink-3)', textTransform: 'uppercase', marginTop: 2 },
  waValue: { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: 'var(--ink)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  banks: { display: 'grid', gap: 10 },
  bankRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px', border: '1px solid var(--rule)',
    borderRadius: 14,
    background: 'var(--paper)',
  },
  bankL: { display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'Newsreader', serif", fontSize: 14 },
  bankDot: { width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 12 },
};

function Sparkline({ data, color, fill, width = 480, height = 130 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 12) - 6;
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="fillg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.35" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[0.25, 0.5, 0.75].map(p => (
        <line key={p} x1="0" x2={width} y1={height * p} y2={height * p} stroke="var(--rule)" strokeDasharray="2 4" />
      ))}
      <path d={area} fill="url(#fillg)" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
      {pts.filter((_, i) => i % 4 === 0).map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2" fill={color} />
      ))}
    </svg>
  );
}

function Donut({ segments, size = 150 }) {
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--rule)" strokeWidth="14" />
      {segments.map((s, i) => {
        const len = (s.pct / 100) * c;
        const el = (
          <circle key={i}
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={s.color} strokeWidth="14"
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-off}
            transform={`rotate(-90 ${size/2} ${size/2})`}
          />
        );
        off += len;
        return el;
      })}
      <text x="50%" y="48%" textAnchor="middle" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fill: 'var(--ink-3)', letterSpacing: '0.15em' }}>GASTO</text>
      <text x="50%" y="62%" textAnchor="middle" style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, fill: 'var(--ink)' }}>R$ 4.812</text>
    </svg>
  );
}

function Segmented({ label, value, options, onChange }) {
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', background: 'var(--paper-2)', border: '1px solid var(--rule)', borderRadius: 999, padding: 3 }}>
        {options.map(o => (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            flex: 1, appearance: 'none', cursor: 'pointer',
            border: 0,
            background: value === o.value ? 'var(--ink)' : 'transparent',
            color: value === o.value ? 'var(--paper)' : 'var(--ink-3)',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
            padding: '6px 10px', borderRadius: 999,
            transition: 'all .15s ease',
            fontWeight: 500,
          }}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

function initialsOf(name) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0]?.[1] || '');
  return (first + last).toUpperCase();
}

function Avatar({ name, photoUrl, tenant, size = 38 }) {
  const [open, setOpen] = React.useState(false);
  const [theme, setTheme] = React.useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  const [palette, setPalette] = React.useState(() => document.documentElement.getAttribute('data-palette') || 'terracota');

  // Listen to external changes (tweaks panel, theme toggle in header)
  React.useEffect(() => {
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'light');
      setPalette(document.documentElement.getAttribute('data-palette') || 'terracota');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-palette'] });
    return () => obs.disconnect();
  }, []);

  const applyTheme = (v) => {
    document.documentElement.setAttribute('data-theme', v);
    setTheme(v);
    const lbl = document.getElementById('themeLabel'); if (lbl) lbl.textContent = v === 'dark' ? 'DARK' : 'LIGHT';
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { theme: v } }, '*');
  };
  const applyPalette = (v) => {
    document.documentElement.setAttribute('data-palette', v);
    setPalette(v);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { palette: v } }, '*');
  };

  const initials = initialsOf(name);
  const avatarStyle = {
    width: size, height: size, borderRadius: '50%',
    background: photoUrl ? `center/cover url(${photoUrl})` : 'var(--ink)',
    color: 'var(--paper)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Playfair Display', serif",
    fontSize: size * 0.36, fontWeight: 600,
    letterSpacing: '0.02em',
    border: '1px solid var(--rule)',
    cursor: 'pointer',
    boxShadow: '0 0 0 3px var(--paper), 0 0 0 4px var(--rule)',
    position: 'relative',
  };
  return (
    <div style={{ position: 'relative' }}>
      <div style={avatarStyle} onClick={() => setOpen(o => !o)} title={`${name} · ${tenant}`}>
        {!photoUrl && initials}
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: size + 12, right: 0, width: 280,
          background: 'var(--paper)', border: '1px solid var(--rule)',
          borderRadius: 18,
          padding: '14px 16px', boxShadow: 'var(--shadow-vintage)',
          zIndex: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px dashed var(--rule)' }}>
            <div style={{ ...avatarStyle, width: 40, height: 40, fontSize: 14, boxShadow: 'none', cursor: 'default' }}>
              {!photoUrl && initials}
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{name}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'var(--ink-3)', textTransform: 'uppercase', marginTop: 2 }}>joao@frs.finance</div>
            </div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: 'var(--ink-3)', textTransform: 'uppercase', marginTop: 12, marginBottom: 6 }}>Tenant ativo</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--primary-soft)', border: '1px solid color-mix(in oklch, var(--primary) 30%, transparent)', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: 50, background: 'var(--primary)' }}></span>
              <span style={{ fontFamily: "'Newsreader', serif", fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>{tenant}</span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--primary)', letterSpacing: '0.18em' }}>OWNER</span>
          </div>

          {/* Appearance — theme + palette */}
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: 'var(--ink-3)', textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }}>Aparência</div>

          <div style={{ display: 'grid', gap: 8 }}>
            <Segmented label="Tema" value={theme} onChange={applyTheme} options={[
              { value: 'light', label: 'Light' },
              { value: 'dark',  label: 'Dark' },
            ]} />
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 6 }}>Paleta</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {[
                  { value: 'terracota', label: 'Terracota', sw: 'oklch(0.48 0.135 45)' },
                  { value: 'bordo',     label: 'Bordô',     sw: 'oklch(0.40 0.115 22)' },
                  { value: 'verde',     label: 'Verde',     sw: 'oklch(0.36 0.05 165)' },
                ].map(o => (
                  <button key={o.value} onClick={() => applyPalette(o.value)} style={{
                    appearance: 'none', cursor: 'pointer',
                    border: '1px solid ' + (palette === o.value ? 'var(--ink)' : 'var(--rule)'),
                    background: palette === o.value ? 'var(--paper-2)' : 'var(--paper)',
                    borderRadius: 10, padding: '8px 6px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    transition: 'all .15s ease',
                  }}>
                    <span style={{ width: 22, height: 22, borderRadius: 50, background: o.sw, boxShadow: 'inset 0 0 0 2px var(--paper)' }}></span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.1em', color: palette === o.value ? 'var(--ink)' : 'var(--ink-3)', textTransform: 'uppercase', fontWeight: palette === o.value ? 600 : 400 }}>{o.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 2, marginTop: 12, fontFamily: "'Newsreader', serif", fontSize: 13 }}>
            <div style={{ padding: '8px 12px', color: 'var(--ink-2)', cursor: 'pointer', borderRadius: 10 }}>Perfil &amp; foto</div>
            <div style={{ padding: '8px 12px', color: 'var(--ink-2)', cursor: 'pointer', borderRadius: 10 }}>Trocar tenant</div>
            <div style={{ padding: '8px 12px', color: 'var(--ink-2)', cursor: 'pointer', borderRadius: 10 }}>Cobrança &amp; plano</div>
            <div style={{ padding: '8px 12px', color: 'var(--negative)', cursor: 'pointer', borderRadius: 10, borderTop: '1px dashed var(--rule)', marginTop: 6, paddingTop: 12 }}>Sair</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = React.useState('30d');
  const [nav, setNav] = React.useState('Visão geral');

  const sparkData = {
    '30d': [120, 132, 128, 145, 142, 158, 161, 155, 168, 172, 165, 178, 182, 175, 188, 184, 192, 188, 198, 195, 205, 201, 212, 208, 218, 215, 224, 220, 228, 232],
    '90d': [98, 102, 110, 108, 115, 118, 125, 120, 130, 135, 132, 145, 142, 150, 148, 158, 155, 165, 162, 170, 168, 175, 172, 180, 178, 186, 184, 192, 190, 198, 200, 205, 208, 215, 220, 225, 232],
    '12m': [80, 92, 105, 110, 115, 130, 142, 155, 168, 185, 198, 232],
  }[tab];

  const navItems = [
    { group: 'PRINCIPAL', items: [
      { name: 'Visão geral', count: '' },
      { name: 'Contas', count: '3' },
      { name: 'Investimentos', count: '12' },
      { name: 'Crédito', count: '2' },
    ]},
    { group: 'REGISTROS', items: [
      { name: 'Movimentos', count: '184' },
      { name: 'Categorias', count: '24' },
      { name: 'WhatsApp', count: '14' },
    ]},
    { group: 'CONFIGURAÇÃO', items: [
      { name: 'Conexões', count: '' },
      { name: 'Preferências', count: '' },
    ]},
  ];

  const movements = [
    { cat: 'M', catColor: 'var(--primary-soft)', catFg: 'var(--primary)', name: 'Mercado Pão de Açúcar', meta: 'Alimentação · Crédito · Itaú', date: '27 Mai', value: '−R$ 384,90', sign: 'neg' },
    { cat: 'I', catColor: 'oklch(0.92 0.04 145 / 0.5)', catFg: 'var(--positive)', name: 'Dividendos · ITSA4', meta: 'Investimento · XP', date: '27 Mai', value: '+R$ 1.240,00', sign: 'pos' },
    { cat: 'T', catColor: 'var(--paper-3)', catFg: 'var(--ink-2)', name: 'Uber · Av. Paulista', meta: 'Transporte · Débito · Nubank', date: '26 Mai', value: '−R$ 38,40', sign: 'neg' },
    { cat: 'P', catColor: 'var(--primary-soft)', catFg: 'var(--primary)', name: 'PIX · Maria Helena', meta: 'Transferência · Inter', date: '26 Mai', value: '+R$ 2.500,00', sign: 'pos' },
    { cat: 'S', catColor: 'var(--paper-3)', catFg: 'var(--ink-2)', name: 'Spotify Premium', meta: 'Assinatura · Crédito · Itaú', date: '25 Mai', value: '−R$ 21,90', sign: 'neg' },
    { cat: 'C', catColor: 'oklch(0.92 0.04 80 / 0.6)', catFg: 'var(--gold)', name: 'Salário · Acme S.A.', meta: 'Receita · Itaú', date: '25 Mai', value: '+R$ 14.200,00', sign: 'pos' },
  ];

  const waItems = [
    { initials: 'JP', msg: '/gasto 84,30 farmácia drogaria', time: '14:22 · Hoje' },
    { initials: 'JP', msg: '/investi 1500 tesouro selic', time: '12:08 · Hoje' },
    { initials: 'JP', msg: 'fui no mercado, gastei 384', time: '20:45 · Ontem' },
    { initials: 'JP', msg: '/receita 2500 freelance design', time: '18:11 · Ontem' },
  ];

  return (
    <div style={dashStyles.shell}>
      <aside style={dashStyles.side}>
        <div style={dashStyles.brand}>
          <div style={dashStyles.brandMark}></div>
          <div style={dashStyles.brandWord}>FrS<span style={{ color: 'var(--ink-3)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', marginLeft: 6 }}>FINANCE</span></div>
        </div>

        {/* Tenant switcher */}
        <div style={{ padding: '10px 12px', border: '1px solid var(--rule)', background: 'var(--paper)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, background: 'var(--primary)', color: 'var(--primary-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 12, borderRadius: 8 }}>AC</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Newsreader', serif", fontSize: 13, color: 'var(--ink)', fontWeight: 500, lineHeight: 1.2 }}>ACME</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'var(--ink-3)', textTransform: 'uppercase', marginTop: 2 }}>tenant pessoal</div>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-3)' }}>⇅</span>
        </div>
        {navItems.map(group => (
          <div key={group.group}>
            <div style={dashStyles.sectionLabel}>{group.group}</div>
            <div style={{ display: 'grid', gap: 1 }}>
              {group.items.map(item => (
                <div key={item.name}
                  onClick={() => setNav(item.name)}
                  style={{ ...dashStyles.navItem, ...(nav === item.name ? dashStyles.navItemActive : {}) }}>
                  <span>{item.name}</span>
                  {item.count && <span style={{ ...dashStyles.navCount, color: nav === item.name ? 'var(--primary)' : 'var(--ink-3)' }}>{item.count}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 'auto', padding: 14, border: '1px solid var(--rule)', background: 'var(--paper)', borderRadius: 14 }}>
          <div style={dashStyles.sectionLabel}>WHATSAPP · ATIVO</div>
          <div style={{ fontFamily: "'Newsreader', serif", fontSize: 13, color: 'var(--ink-2)', marginTop: 4, fontStyle: 'italic' }}>
            14 registros hoje<br /><span style={{ color: 'var(--ink-3)', fontSize: 11 }}>+55 11 9·xxxx·4421</span>
          </div>
        </div>
      </aside>

      <div style={dashStyles.main}>
        {/* Topbar */}
        <div style={dashStyles.topbar}>
          <div>
            <div style={dashStyles.pageSub}>Boa tarde, João · 27 Maio MMXXVI</div>
            <h2 style={dashStyles.pageTitle}>Visão consolidada do <em style={{ fontWeight: 400, color: 'var(--primary)' }}>patrimônio</em></h2>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={dashStyles.searchBox}>
              <span style={{ color: 'var(--ink-3)' }}>⌕</span>
              <span>Buscar movimento, conta...</span>
              <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-3)', border: '1px solid var(--rule)', padding: '2px 8px', borderRadius: 6 }}>⌘K</span>
            </div>
            <button className="btn primary sm">+ registrar</button>
            <Avatar name="João Pessoa" tenant="ACME" />
          </div>
        </div>

        {/* KPIs */}
        <div style={dashStyles.kpiGrid}>
          <div style={dashStyles.kpi}>
            <span style={dashStyles.kpiLabel}>Saldo total</span>
            <span style={dashStyles.kpiValue}>R$ 184.327<span style={{ fontSize: 16, color: 'var(--ink-3)' }}>,42</span></span>
            <span style={{ ...dashStyles.kpiTrend, color: 'var(--positive)' }}>↗ +1,8 % · 30d</span>
          </div>
          <div style={dashStyles.kpi}>
            <span style={dashStyles.kpiLabel}>Investimentos</span>
            <span style={dashStyles.kpiValue}>R$ 142.840<span style={{ fontSize: 16, color: 'var(--ink-3)' }}>,11</span></span>
            <span style={{ ...dashStyles.kpiTrend, color: 'var(--positive)' }}>↗ +R$ 3.214 mensal</span>
          </div>
          <div style={dashStyles.kpi}>
            <span style={dashStyles.kpiLabel}>Crédito disponível</span>
            <span style={dashStyles.kpiValue}>R$ 12.188<span style={{ fontSize: 16, color: 'var(--ink-3)' }}>,00</span></span>
            <span style={{ ...dashStyles.kpiTrend, color: 'var(--ink-2)' }}>de R$ 17.000 · 28% usado</span>
          </div>
          <div style={dashStyles.kpi}>
            <span style={dashStyles.kpiLabel}>Gasto do mês</span>
            <span style={dashStyles.kpiValue}>R$ 4.812<span style={{ fontSize: 16, color: 'var(--ink-3)' }}>,00</span></span>
            <span style={{ ...dashStyles.kpiTrend, color: 'var(--negative)' }}>↘ −R$ 218 vs. abril</span>
          </div>
        </div>

        {/* Sparkline + Donut */}
        <div style={dashStyles.twoCol}>
          <div style={dashStyles.panel}>
            <div style={dashStyles.panelHead}>
              <h4 style={dashStyles.panelTitle}>Patrimônio · evolução</h4>
              <div style={dashStyles.tabs}>
                {['30d', '90d', '12m'].map(t => (
                  <span key={t} onClick={() => setTab(t)} style={{ ...dashStyles.tab, ...(tab === t ? dashStyles.tabActive : {}) }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={dashStyles.chartWrap}>
              <Sparkline data={sparkData} color="var(--primary)" fill="var(--primary)" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>
              <span>R$ 168.4k</span><span>R$ 175.2k</span><span>R$ 181.0k</span><span>R$ 184.3k</span>
            </div>
          </div>
          <div style={dashStyles.panel}>
            <div style={dashStyles.panelHead}>
              <h4 style={dashStyles.panelTitle}>Por categoria</h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink-3)', textTransform: 'uppercase' }}>Maio</span>
            </div>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              <Donut segments={[
                { pct: 38, color: 'var(--primary)' },
                { pct: 22, color: 'var(--gold)' },
                { pct: 18, color: 'var(--positive)' },
                { pct: 12, color: 'var(--negative)' },
                { pct: 10, color: 'var(--ink-2)' },
              ]} />
              <div style={{ display: 'grid', gap: 8, fontFamily: "'Newsreader', serif", fontSize: 13 }}>
                {[
                  { c: 'var(--primary)', n: 'Alimentação', v: '38%' },
                  { c: 'var(--gold)', n: 'Transporte', v: '22%' },
                  { c: 'var(--positive)', n: 'Moradia', v: '18%' },
                  { c: 'var(--negative)', n: 'Lazer', v: '12%' },
                  { c: 'var(--ink-2)', n: 'Outros', v: '10%' },
                ].map(s => (
                  <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 10, height: 10, background: s.c, borderRadius: 3 }}></span>
                    <span style={{ color: 'var(--ink-2)' }}>{s.n}</span>
                    <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink)' }}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Movements + WA + Banks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18 }}>
          <div style={dashStyles.panel}>
            <div style={dashStyles.panelHead}>
              <h4 style={dashStyles.panelTitle}>Movimentos recentes</h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>184 este mês</span>
            </div>
            <div style={dashStyles.tableHead}>
              <span></span><span>Descrição</span><span style={{ textAlign: 'right' }}>Data</span><span style={{ textAlign: 'right' }}>Valor</span><span style={{ textAlign: 'right' }}>Status</span>
            </div>
            {movements.map((m, i) => (
              <div key={i} style={dashStyles.tableRow}>
                <div style={{ ...dashStyles.cat, background: m.catColor, color: m.catFg }}>{m.cat}</div>
                <div>
                  <div style={{ color: 'var(--ink)' }}>{m.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{m.meta}</div>
                </div>
                <span style={{ ...dashStyles.num, color: 'var(--ink-3)', fontSize: 12 }}>{m.date}</span>
                <span style={{ ...dashStyles.num, color: m.sign === 'pos' ? 'var(--positive)' : 'var(--ink)' }}>{m.value}</span>
                <span style={{ textAlign: 'right' }}><span className="badge positive" style={{ fontSize: 9 }}>✓ conc.</span></span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 18 }}>
            <div style={dashStyles.panel}>
              <div style={dashStyles.panelHead}>
                <h4 style={dashStyles.panelTitle}>Via WhatsApp</h4>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--positive)', letterSpacing: '0.18em' }}>● AO VIVO</span>
              </div>
              <div style={dashStyles.wa}>
                {waItems.map((w, i) => (
                  <div key={i} style={dashStyles.waItem}>
                    <div style={dashStyles.waAvatar}>{w.initials}</div>
                    <div>
                      <div style={dashStyles.waMsg}>{w.msg}</div>
                      <div style={dashStyles.waMeta}>{w.time}</div>
                    </div>
                    <div></div>
                  </div>
                ))}
              </div>
            </div>

            <div style={dashStyles.panel}>
              <div style={dashStyles.panelHead}>
                <h4 style={dashStyles.panelTitle}>Conexões</h4>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>3 ativas</span>
              </div>
              <div style={dashStyles.banks}>
                <div style={dashStyles.bankRow}>
                  <div style={dashStyles.bankL}>
                    <div style={{ ...dashStyles.bankDot, background: '#8A05BE' }}>N</div>
                    <div>
                      <div>Nubank</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>R$ 4.812 disp.</div>
                    </div>
                  </div>
                  <span className="badge positive"><span className="dot"></span>sync</span>
                </div>
                <div style={dashStyles.bankRow}>
                  <div style={dashStyles.bankL}>
                    <div style={{ ...dashStyles.bankDot, background: '#EC7000' }}>I</div>
                    <div>
                      <div>Itaú</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>R$ 38.715 disp.</div>
                    </div>
                  </div>
                  <span className="badge positive"><span className="dot"></span>sync</span>
                </div>
                <div style={dashStyles.bankRow}>
                  <div style={dashStyles.bankL}>
                    <div style={{ ...dashStyles.bankDot, background: '#004D40' }}>X</div>
                    <div>
                      <div>XP Investimentos</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>R$ 142.840 alocados</div>
                    </div>
                  </div>
                  <span className="badge primary"><span className="dot"></span>14h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const dashRoot = document.getElementById('dashRoot');
if (dashRoot) ReactDOM.createRoot(dashRoot).render(<Dashboard />);
