/**
 * Los dos altos del chrome del deck, en píxeles.
 *
 * ⚠️ **Este módulo no importa CSS a propósito, y no puede empezar a hacerlo.**
 * El arnés de QA los lee con `tsx --eval` —el mismo patrón que
 * `scripts/verify-deck-model.test.mjs` usa con `deck.ts`— y `tsx` no sabe
 * cargar un `*.module.css`: si estas constantes viven en un componente, el
 * import revienta con `SyntaxError: Unexpected token '.'` sobre la primera
 * regla del módulo de estilos. El contrato quedaba cumplido a la letra y roto
 * en la práctica.
 *
 * `TopBar.tsx` y `ProgressRail.tsx` los reexportan para quien ya los importe
 * de ahí.
 *
 * Fuente única de los dos números: `PresentationDeck` los baja al riel como
 * `--deck-barra-superior` y `--deck-barra-inferior`, y con esas variables —no
 * con literales repetidos— fija el CSS el alto de cada barra y el hueco que la
 * lámina les reserva.
 */
export const ALTO_BARRA_SUPERIOR = 70;
export const ALTO_BARRA_INFERIOR = 60;
