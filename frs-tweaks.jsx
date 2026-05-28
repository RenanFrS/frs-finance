/* FrS Finance — Tweaks panel binding */
(function(){
  const TWEAKS_DEFAULTS = window.FRS_TWEAK_DEFAULTS;

  function App(){
    const [t, setTweak] = useTweaks(TWEAKS_DEFAULTS);

    // Sync to DOM whenever tweaks change
    React.useEffect(() => {
      document.documentElement.setAttribute('data-theme', t.theme);
      document.documentElement.setAttribute('data-palette', t.palette);
      document.body.setAttribute('data-grain', String(!!t.grain));
      document.body.setAttribute('data-ornaments', String(!!t.ornaments));
      const lbl = document.getElementById('themeLabel');
      if (lbl) lbl.textContent = t.theme === 'dark' ? 'DARK' : 'LIGHT';
    }, [t.theme, t.palette, t.grain, t.ornaments]);

    return (
      <TweaksPanel>
        <TweakSection label="Paleta" />
        <TweakRadio label="Variação"
          value={t.palette}
          options={[
            { value: 'terracota', label: 'Terracota' },
            { value: 'bordo',     label: 'Bordô' },
            { value: 'verde',     label: 'Verde Cofre' },
          ]}
          onChange={(v) => setTweak('palette', v)}
        />
        <TweakRadio label="Tema"
          value={t.theme}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark',  label: 'Dark' },
          ]}
          onChange={(v) => setTweak('theme', v)}
        />
        <TweakSection label="Detalhes" />
        <TweakToggle label="Grain · papel"
          value={t.grain}
          onChange={(v) => setTweak('grain', v)}
        />
        <TweakToggle label="Ornamentos · cantos"
          value={t.ornaments}
          onChange={(v) => setTweak('ornaments', v)}
        />
      </TweaksPanel>
    );
  }

  const host = document.createElement('div');
  host.id = 'frs-tweaks-host';
  document.body.appendChild(host);
  ReactDOM.createRoot(host).render(<App />);
})();
