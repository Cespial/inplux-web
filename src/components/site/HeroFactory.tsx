const stages = ["Entender", "Definir", "Construir y probar", "Evolucionar"];

export function HeroFactory() {
  return (
    <div className="factory-surface">
      <div className="factory-topline">
        <div>
          <p className="factory-label">Así funciona la fábrica</p>
          <p className="factory-case-name">Un sistema coordinado de entrega</p>
        </div>
        <span className="factory-human-badge">IA aplicada · dirección humana</span>
      </div>

      <div className="factory-case-panel">
        <div className="factory-story">
          <div className="factory-story-block factory-challenge">
            <p className="factory-label">Entrada</p>
            <p>Contexto, personas, reglas y un problema que necesita cambiar.</p>
          </div>
          <div className="factory-story-divider" aria-hidden="true" />
          <div className="factory-story-block factory-built">
            <p className="factory-label">Salida</p>
            <p>Un producto probado, documentado y listo para operar y evolucionar.</p>
          </div>
        </div>

        <div
          className="factory-product factory-workboard"
          role="group"
          aria-label="Del problema al software"
        >
          <p className="factory-label">Del contexto al producto</p>
          <div className="factory-shift">
            <span>Problema real</span>
            <span aria-hidden="true">→</span>
            <strong>Software útil</strong>
          </div>
          <div
            className="factory-workboard-list"
            role="group"
            aria-label="Entregables coordinados"
          >
            <span>Producto</span>
            <span>Código</span>
            <span>Pruebas</span>
          </div>
          <p className="factory-workboard-note">
            El equipo conserva el criterio, la validación y la responsabilidad.
          </p>
        </div>
      </div>

      <ol
        className="factory-pipeline"
        aria-label="Entender, definir, construir y probar, lanzar y evolucionar"
      >
        {stages.map((stage, index) => (
          <li className="factory-stage" key={stage}>
            <span className="factory-stage-number">0{index + 1}</span>
            <span>{stage}</span>
          </li>
        ))}
      </ol>

      <div className="factory-result">
        <div>
          <span className="factory-status is-process">Trabajo coordinado</span>
          <p>Una forma coordinada de avanzar sin delegar la responsabilidad.</p>
        </div>
        <a href="#proyectos">
          Ver un resultado real <span aria-hidden="true">↓</span>
        </a>
      </div>
    </div>
  );
}
