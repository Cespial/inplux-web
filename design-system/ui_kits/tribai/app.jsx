/* Tribai.co — product app UI kit.
   Inteligencia tributaria y financiera con IA que aprende.
   Warm editorial system: dark ink rail + white workspace, teal accent.
   Icons: Lucide (CDN) — documented substitute for the pending INPLUX icon set. */

const TDS = window.INPLUXDesignSystem_318bee;
const { Button, Badge, Input, Logo } = TDS;
const MarkAnimated = TDS.MarkAnimated || (({ size = 24 }) =>
  React.createElement(Logo, { variant: "mark-teal", height: typeof size === "number" ? size : 24, basePath: TASSETS + "/logos" }));
const TASSETS = "../../assets";

function Icon({ name, size = 18, color = "currentColor", strokeWidth = 1.75, style = {} }) {
  // Renders a Lucide icon; lucide.createIcons() is invoked after each render in App.
  return <i data-lucide={name} style={{ width: size, height: size, color, display: "inline-flex", strokeWidth, ...style }}></i>;
}

/* ---------------- Login ---------------- */
function Login({ onEnter }) {
  return (
    <div style={{ height: "100%", display: "grid", gridTemplateColumns: "1.1fr 0.9fr" }} className="tb-login">
      <div style={{ background: "var(--ink)", color: "var(--white)", position: "relative", overflow: "hidden", padding: "56px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ position: "absolute", inset: 0, background: "var(--glow-teal)" }}></div>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "22px 22px", opacity: 0.6 }}></div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
          <Logo variant="mark-white" height={26} basePath={TASSETS + "/logos"} />
          <span style={{ fontWeight: 700, letterSpacing: "0.14em", fontSize: "15px" }}>TRIBAI</span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--text-on-ink-muted)", fontWeight: 600, marginBottom: "18px" }}>Producto · INPLUX</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "44px", lineHeight: 1.05, letterSpacing: "var(--tracking-display)", margin: 0 }}>
            Inteligencia tributaria que <em style={{ fontStyle: "italic", color: "var(--teal-bright)" }}>aprende.</em>
          </h1>
          <p style={{ color: "var(--text-on-ink-muted)", fontSize: "16px", lineHeight: 1.5, margin: "20px 0 0", maxWidth: "40ch" }}>
            25 años de gestión tributaria convertidos en un agente que cita la norma viva.
          </p>
        </div>
        <div style={{ position: "relative", fontSize: "12.5px", color: "var(--gray-400)" }}>tribai.co</div>
      </div>
      <div style={{ background: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        <form onSubmit={(e) => { e.preventDefault(); onEnter(); }} style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "30px", margin: "0 0 6px" }}>Entrar</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>Acceda a su espacio de consultas.</p>
          </div>
          <label style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--text-muted)" }}>Correo</span>
            <Input type="email" defaultValue="laura@municipio.gov.co" />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--text-muted)" }}>Contraseña</span>
            <Input type="password" defaultValue="••••••••" />
          </label>
          <Button type="submit" variant="primary" style={{ width: "100%", marginTop: "4px" }}>Entrar</Button>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", textDecoration: "none" }}>¿Olvidó su contraseña?</a>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Sidebar ---------------- */
function Sidebar({ active, setActive, onLogout, threads }) {
  const nav = [
    { id: "chat", icon: "messages-square", label: "Consultas" },
    { id: "norms", icon: "scale", label: "Estatuto vivo" },
    { id: "docs", icon: "file-text", label: "Documentos" },
    { id: "data", icon: "bar-chart-3", label: "Observatorio" },
  ];
  return (
    <aside style={{ width: "260px", flex: "none", background: "var(--ink)", color: "var(--text-on-ink)", display: "flex", flexDirection: "column", padding: "18px 14px" }} className="tb-sidebar">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 6px 16px" }}>
        <Logo variant="mark-teal" height={22} basePath={TASSETS + "/logos"} />
        <span style={{ fontWeight: 700, letterSpacing: "0.14em", fontSize: "14px" }}>TRIBAI</span>
      </div>
      <Button variant="teal" size="sm" style={{ width: "100%", justifyContent: "flex-start", gap: "8px", marginBottom: "16px" }}>
        <Icon name="plus" size={16} color="#fff" /> Nueva consulta
      </Button>
      <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {nav.map((n) => {
          const on = active === n.id;
          return (
            <button key={n.id} onClick={() => setActive(n.id)} style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", border: "none",
              borderRadius: "var(--radius-sm)", cursor: "pointer", textAlign: "left", fontSize: "14px", fontWeight: 500,
              fontFamily: "var(--font-body)",
              background: on ? "rgba(255,255,255,0.07)" : "transparent",
              color: on ? "var(--white)" : "var(--text-on-ink-muted)",
            }}>
              <Icon name={n.icon} size={17} color={on ? "var(--teal-bright)" : "currentColor"} />
              {n.label}
            </button>
          );
        })}
      </nav>
      <div style={{ marginTop: "20px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--gray-500)", fontWeight: 600, padding: "0 10px 8px" }}>Recientes</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1px", overflowY: "auto", flex: 1 }}>
        {threads.map((t, i) => (
          <button key={i} style={{
            display: "block", textAlign: "left", padding: "8px 10px", border: "none", background: "transparent",
            color: "var(--text-on-ink-muted)", fontSize: "13px", fontFamily: "var(--font-body)", cursor: "pointer",
            borderRadius: "var(--radius-sm)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{t}</button>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px", marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "var(--radius-pill)", background: "var(--teal)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>LR</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--white)" }}>Laura Restrepo</div>
          <div style={{ fontSize: "11px", color: "var(--gray-400)" }}>Hacienda · Cisneros</div>
        </div>
        <button onClick={onLogout} aria-label="Salir" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}>
          <Icon name="log-out" size={16} />
        </button>
      </div>
    </aside>
  );
}

/* ---------------- Chat thread ---------------- */
function AgentMessage({ msg }) {
  return (
    <div style={{ display: "flex", gap: "14px", maxWidth: "760px" }}>
      <div style={{ width: "30px", height: "30px", flex: "none", borderRadius: "var(--radius-sm)", background: "var(--teal-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Logo variant="mark-teal" height={15} basePath={TASSETS + "/logos"} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>Tribai</div>
        <div style={{ fontSize: "15px", lineHeight: 1.65, color: "var(--text-strong)" }} dangerouslySetInnerHTML={{ __html: msg.html }}></div>
        {msg.citation && (
          <div style={{ marginTop: "14px", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "14px 16px", background: "var(--off-white)", maxWidth: "520px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <Icon name="scale" size={15} color="var(--teal)" />
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--teal)" }}>{msg.citation.tag}</span>
              <Badge variant="outline" style={{ marginLeft: "auto", fontSize: "10px" }}>Estatuto vivo</Badge>
            </div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-strong)", marginBottom: "2px" }}>{msg.citation.title}</div>
            <div style={{ fontSize: "13px", color: "var(--text-body)", lineHeight: 1.5 }}>{msg.citation.body}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function UserMessage({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{ background: "var(--ink)", color: "var(--white)", padding: "12px 18px", borderRadius: "var(--radius-lg)", fontSize: "15px", lineHeight: 1.5, maxWidth: "70%" }}>{text}</div>
    </div>
  );
}

function Welcome({ onPick }) {
  const prompts = [
    "¿Cómo calculo la sobretasa bomberil 2026?",
    "Diferencia entre NIC 12 y el impuesto diferido local",
    "Genera el borrador de acuerdo de exención de predial",
  ];
  return (
    <div style={{ maxWidth: "640px", margin: "auto", textAlign: "center", padding: "40px 0" }}>
      <div style={{ display: "inline-flex", padding: "14px", borderRadius: "var(--radius-lg)", background: "var(--teal-soft)", marginBottom: "20px" }}>
        <MarkAnimated size={32} mode="enter" />
      </div>
      <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "34px", margin: "0 0 10px" }}>
        ¿Qué consultamos <em style={{ fontStyle: "italic", color: "var(--teal)" }}>hoy?</em>
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "15px", margin: "0 0 28px" }}>
        Pregunte sobre normativa, NIC/NIIF o hacienda pública. Citamos la norma viva.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "480px", margin: "0 auto" }}>
        {prompts.map((p) => (
          <button key={p} onClick={() => onPick(p)} style={{
            display: "flex", alignItems: "center", gap: "10px", textAlign: "left", padding: "13px 16px",
            border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--white)",
            cursor: "pointer", fontSize: "14px", color: "var(--text-body)", fontFamily: "var(--font-body)",
            transition: "border-color .2s, box-shadow .2s",
          }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gray-200)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
             onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}>
            <Icon name="sparkles" size={16} color="var(--teal)" /> {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function Chat({ messages, onSend, thinking }) {
  const [val, setVal] = React.useState("");
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);
  const send = (text) => { const t = (text ?? val).trim(); if (!t) return; onSend(t); setVal(""); };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--white)", minWidth: 0 }}>
      <div style={{ height: "60px", flex: "none", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "19px" }}>Consulta tributaria</span>
          <Badge variant="soft">IA · Estatuto vivo</Badge>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button variant="ghost" size="sm"><Icon name="share-2" size={15} /></Button>
          <Button variant="secondary" size="sm"><Icon name="download" size={15} style={{ marginRight: 6 }} /> Exportar</Button>
        </div>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
        {messages.length === 0 ? (
          <Welcome onPick={(p) => send(p)} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "26px", maxWidth: "820px", margin: "0 auto" }}>
            {messages.map((m, i) => (m.role === "user" ? <UserMessage key={i} text={m.text} /> : <AgentMessage key={i} msg={m} />))}
            {thinking && (
              <div style={{ display: "flex", gap: "14px", alignItems: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "var(--radius-sm)", background: "var(--teal-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MarkAnimated size={20} mode="loading" />
                </div>
                <span className="tb-pulse">Consultando la norma…</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ flex: "none", padding: "16px 28px 22px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto", display: "flex", gap: "10px", alignItems: "flex-end" }}>
          <textarea value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Pregunte sobre normativa, NIC/NIIF, hacienda…" rows={1} style={{
              flex: 1, resize: "none", fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text-strong)",
              background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
              padding: "13px 16px", minHeight: "48px", maxHeight: "120px", outline: "none", lineHeight: 1.5,
            }} />
          <Button variant="primary" onClick={() => send()} style={{ height: "48px", padding: "0 18px" }}>
            <Icon name="arrow-up" size={18} color="#fff" />
          </Button>
        </div>
        <div style={{ maxWidth: "820px", margin: "8px auto 0", fontSize: "11px", color: "var(--text-faint)", textAlign: "center" }}>
          Tribai cita la norma vigente. Verifique siempre antes de decisiones oficiales.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TbIcon: Icon, Login, Sidebar, Chat });
