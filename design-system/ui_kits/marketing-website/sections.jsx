/* INPLUX marketing website — UI kit sections.
   Recreation of inplux.co (Editorial White System v3).
   Composes DS primitives from the compiled bundle. Exports to window. */

const DS = window.INPLUXDesignSystem_318bee;
const { Button, Badge, Pill, Stat, Card, Eyebrow, Logo, OrbitGraphic, Input, Field } = DS;
const ASSETS = "../../assets";

/* ---------- Nav ---------- */
function Nav({ onContact, menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const root = document.getElementById("site");
    const onScroll = () => setScrolled((root ? root.scrollTop : window.scrollY) > 12);
    const t = root || window;
    t.addEventListener("scroll", onScroll);
    return () => t.removeEventListener("scroll", onScroll);
  }, []);
  const links = ["Nosotros", "Ecosistema", "Sector público", "Blog"];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 30,
      background: "var(--nav-bg)", backdropFilter: "var(--blur-nav)", WebkitBackdropFilter: "var(--blur-nav)",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      boxShadow: scrolled ? "var(--shadow-xs)" : "none",
      transition: "border-color .3s, box-shadow .3s",
    }}>
      <div style={{ maxWidth: "var(--container-lg)", margin: "0 auto", padding: "0 var(--gutter)", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
        <Logo variant="horizontal" height={24} basePath={ASSETS + "/logos"} />
        <nav style={{ display: "flex", gap: "30px", alignItems: "center" }} className="ipx-navlinks">
          {links.map((l) => (
            <a key={l} href="#" onClick={(e) => e.preventDefault()} style={{
              fontSize: "14px", fontWeight: 500, color: "var(--text-body)", textDecoration: "none",
              transition: "color .2s",
            }} onMouseEnter={(e) => (e.target.style.color = "var(--teal)")} onMouseLeave={(e) => (e.target.style.color = "var(--text-body)")}>{l}</a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button variant="primary" size="sm" onClick={onContact} className="ipx-nav-cta">Hablemos</Button>
          <button aria-label="Menú" onClick={() => setMenuOpen(!menuOpen)} className="ipx-burger" style={{
            display: "none", width: "40px", height: "40px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
            background: "var(--white)", cursor: "pointer", flexDirection: "column", gap: "4px", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ width: "16px", height: "1.5px", background: "var(--ink)" }}></span>
            <span style={{ width: "16px", height: "1.5px", background: "var(--ink)" }}></span>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="ipx-mobile-menu" style={{ borderTop: "1px solid var(--border)", padding: "12px var(--gutter) 20px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {links.map((l) => (
            <a key={l} href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }} style={{ padding: "12px 0", fontSize: "16px", color: "var(--text-strong)", textDecoration: "none", borderBottom: "1px solid var(--border-light)" }}>{l}</a>
          ))}
        </div>
      )}
    </header>
  );
}

/* ---------- Hero (dark ink) ---------- */
function Hero({ onContact }) {
  return (
    <section style={{ position: "relative", background: "var(--ink)", color: "var(--text-on-ink)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "var(--glow-teal)", pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "22px 22px", opacity: 0.6, pointerEvents: "none" }}></div>
      <div style={{ position: "relative", maxWidth: "var(--container-lg)", margin: "0 auto", padding: "var(--section-y) var(--gutter)", display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: "48px", alignItems: "center" }} className="ipx-hero-grid">
        <div>
          <Eyebrow onDark items={["Agentes de IA", "Cerebro legal", "Fábrica de software"]} />
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "var(--fs-display)", lineHeight: "var(--leading-display)", letterSpacing: "var(--tracking-display)", margin: "20px 0 0" }}>
            La norma la conocemos.<br />La tecnología la <em style={{ fontStyle: "italic", color: "var(--teal-bright)" }}>construimos.</em>
          </h1>
          <p style={{ fontSize: "var(--fs-lead)", color: "var(--text-on-ink-muted)", lineHeight: "var(--leading-snug)", maxWidth: "46ch", margin: "26px 0 0" }}>
            25 años entre estatutos, NIC/NIIF y hacienda pública — hoy convertidos en agentes de IA que aprenden y se mejoran solos.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "32px", flexWrap: "wrap" }}>
            <Button variant="teal" onClick={onContact}>Hablemos</Button>
            <Button variant="secondary" onClick={onContact} style={{ color: "var(--white)", borderColor: "rgba(255,255,255,0.22)", background: "transparent" }}>Ver ecosistema</Button>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "32px", flexWrap: "wrap" }}>
            <Pill figure="+25" label="años" onDark />
            <Pill figure="+50" label="municipios" onDark />
            <Pill figure="+100" label="proyectos" onDark />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }} className="ipx-hero-orbit">
          <OrbitGraphic size={380} />
        </div>
      </div>
    </section>
  );
}

/* ---------- Logo strip ---------- */
function Allies() {
  const allies = ["Vegachí", "Cisneros", "CIS", "Parque Arví", "Think IT", "Alianza IT", "Navarro Ospina"];
  return (
    <section style={{ background: "var(--off-white)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "var(--container-lg)", margin: "0 auto", padding: "28px var(--gutter)", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--text-faint)", fontWeight: 600, marginRight: "8px" }}>Confían en nosotros</span>
        {allies.map((a) => (
          <span key={a} style={{ fontFamily: "var(--font-serif)", fontSize: "19px", color: "var(--gray-400)" }}>{a}</span>
        ))}
      </div>
    </section>
  );
}

/* ---------- Ecosystem ---------- */
const PRODUCTS = [
  { name: "Tribai.co", tag: "Producto estrella", desc: "Inteligencia tributaria y financiera con IA que aprende.", star: true },
  { name: "Gobia", tag: "Gobernanza", desc: "Plataforma de gobernanza municipal y gestión pública." },
  { name: "Fourier", tag: "Cloud", desc: "Arquitectura de software e infraestructura en la nube." },
  { name: "Sistemas Aries", tag: "ERP · +31 años", desc: "ERP financiera modular para la operación contable." },
  { name: "Think IT", tag: "Ingeniería", desc: "Ingeniería de software y consultoría tecnológica." },
  { name: "Observatorio", tag: "Datos", desc: "Datos y analítica para la toma de decisiones." },
];
function Ecosystem() {
  return (
    <section id="ecosistema" style={{ background: "var(--white)" }}>
      <div style={{ maxWidth: "var(--container-lg)", margin: "0 auto", padding: "var(--section-y) var(--gutter)" }}>
        <div style={{ maxWidth: "620px" }}>
          <Eyebrow>Ecosistema</Eyebrow>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "var(--fs-h2)", lineHeight: "var(--leading-heading)", letterSpacing: "var(--tracking-display)", margin: "16px 0 0" }}>
            Un hub, varios productos que <em style={{ fontStyle: "italic", color: "var(--teal)" }}>conversan.</em>
          </h2>
          <p style={{ fontSize: "var(--fs-body)", color: "var(--text-body)", lineHeight: "var(--leading-body)", margin: "16px 0 0" }}>
            Consultoría, tecnología e inteligencia artificial integradas en una sola propuesta de valor.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", marginTop: "44px" }} className="ipx-eco-grid">
          {PRODUCTS.map((p) => (
            <Card key={p.name} padding="1.75rem">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <Logo variant="mark-teal" height={26} basePath={ASSETS + "/logos"} />
                {p.star
                  ? <Badge variant="soft">{p.tag}</Badge>
                  : <Badge variant="outline" uppercase>{p.tag}</Badge>}
              </div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "24px", margin: "0 0 6px" }}>{p.name}</h3>
              <p style={{ fontSize: "14.5px", color: "var(--text-body)", lineHeight: "var(--leading-snug)", margin: 0 }}>{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Pillars ---------- */
const PILLARS = [
  { n: "01", t: "Primero la norma, después el código", d: "El conocimiento regulatorio guía la tecnología, no al revés." },
  { n: "02", t: "Entregamos productos, no horas", d: "Entrega orientada a producto: algo que funciona y se queda." },
  { n: "03", t: "Medimos impacto, no cobramos por estar", d: "Enfoque en resultados medibles, no en la facturación de tiempo." },
];
function Pillars() {
  return (
    <section style={{ background: "var(--off-white)" }}>
      <div style={{ maxWidth: "var(--container-lg)", margin: "0 auto", padding: "var(--section-y) var(--gutter)" }}>
        <Eyebrow>Filosofía</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px", marginTop: "32px" }} className="ipx-pillars">
          {PILLARS.map((p) => (
            <div key={p.n}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "40px", color: "var(--teal)", lineHeight: 1 }}>{p.n}</div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "23px", lineHeight: "var(--leading-heading)", margin: "16px 0 8px" }}>{p.t}</h3>
              <p style={{ fontSize: "15px", color: "var(--text-body)", lineHeight: "var(--leading-body)", margin: 0 }}>{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Stats band (dark) ---------- */
function StatsBand() {
  return (
    <section style={{ background: "var(--ink)", color: "var(--text-on-ink)" }}>
      <div style={{ maxWidth: "var(--container-lg)", margin: "0 auto", padding: "calc(var(--section-y) * 0.7) var(--gutter)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }} className="ipx-stats">
        <Stat value="2000" label="Desde" onDark />
        <Stat value="+25" label="Años" onDark accent />
        <Stat value="+50" label="Municipios" onDark />
        <Stat value="+100" label="Proyectos" onDark accent />
      </div>
    </section>
  );
}

/* ---------- CTA + Contact ---------- */
function CTA({ contactRef, sent, setSent }) {
  return (
    <section ref={contactRef} style={{ background: "var(--white)" }}>
      <div style={{ maxWidth: "var(--container-md)", margin: "0 auto", padding: "var(--section-y) var(--gutter)", textAlign: "center" }}>
        <Eyebrow>Hablemos</Eyebrow>
        <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "var(--fs-h2)", lineHeight: "var(--leading-heading)", letterSpacing: "var(--tracking-display)", margin: "16px 0 0" }}>
          Cuéntenos su reto. <em style={{ fontStyle: "italic", color: "var(--teal)" }}>Le respondemos.</em>
        </h2>
        <p style={{ fontSize: "var(--fs-body)", color: "var(--text-body)", margin: "16px auto 0", maxWidth: "44ch" }}>
          Tributaristas y financieros que escriben código. Escríbanos y le contamos qué ya hemos hecho.
        </p>
        {sent ? (
          <div style={{ marginTop: "32px", display: "inline-flex", alignItems: "center", gap: "10px", padding: "16px 24px", background: "var(--teal-soft)", color: "var(--teal)", borderRadius: "var(--radius-lg)", fontWeight: 600 }}>
            Gracias — le escribiremos pronto.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "14px", maxWidth: "420px", margin: "32px auto 0", textAlign: "left" }}>
            <Field label="Nombre" htmlFor="n"><Input id="n" required placeholder="Su nombre" /></Field>
            <Field label="Correo" htmlFor="c"><Input id="c" type="email" required placeholder="usted@empresa.co" /></Field>
            <Button type="submit" variant="primary" style={{ width: "100%", marginTop: "4px" }}>Hablemos</Button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer style={{ background: "var(--gray-950)", color: "var(--text-on-ink-muted)" }}>
      <div style={{ maxWidth: "var(--container-lg)", margin: "0 auto", padding: "56px var(--gutter) 40px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: "40px" }} className="ipx-footer">
        <div>
          <Logo variant="horizontal-inverse" height={24} basePath={ASSETS + "/logos"} />
          <p style={{ fontSize: "14px", lineHeight: "var(--leading-body)", margin: "16px 0 0", maxWidth: "32ch" }}>
            Tributaristas que construyen tecnología. Medellín, Colombia — desde 2000.
          </p>
        </div>
        <div>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--white)", fontWeight: 600, marginBottom: "14px" }}>Ecosistema</div>
          {["Tribai.co", "Gobia", "Fourier", "Sistemas Aries"].map((x) => (
            <a key={x} href="#" onClick={(e) => e.preventDefault()} style={{ display: "block", color: "var(--text-on-ink-muted)", textDecoration: "none", fontSize: "14px", padding: "5px 0" }}>{x}</a>
          ))}
        </div>
        <div>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--white)", fontWeight: 600, marginBottom: "14px" }}>Contacto</div>
          <p style={{ fontSize: "14px", margin: "0 0 6px" }}>gerencia@inplux.co</p>
          <p style={{ fontSize: "14px", margin: "0 0 6px" }}>(+57) 313 889 36 15</p>
          <p style={{ fontSize: "14px", margin: 0 }}>Calle 23 # 43 A 66, Medellín</p>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: "var(--container-lg)", margin: "0 auto", padding: "20px var(--gutter)", display: "flex", justifyContent: "space-between", fontSize: "12.5px", color: "var(--gray-400)" }}>
          <span>© 2026 INPLUX S.A.S.</span>
          <span>inplux.co</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Hero, Allies, Ecosystem, Pillars, StatsBand, CTA, Footer });
