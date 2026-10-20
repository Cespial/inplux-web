import registry from "./partners.json";

/**
 * Partners tecnológicos: los modelos, la infraestructura y las plataformas
 * sobre las que construimos. La lista vive en `partners.json` —y no aquí—
 * porque `scripts/partners-gate.mjs` la audita sin compilar TypeScript: cada
 * marca necesita archivo en `public/brand/partners/`, un permiso con fuente
 * oficial y una fecha de verificación vigente. Sin eso, el build para.
 */
export type PartnerRelation = "modelos" | "infraestructura" | "plataforma";

export type PartnerPermission =
  | {
      kind: "brand-guidelines" | "program-badge" | "written-consent";
      /** Guía de marca, programa de partners o acta del consentimiento. */
      source: `https://${string}`;
      grantedAt: string;
      verifiedAt: string;
    }
  | {
      /** La dirección declara el permiso; el soporte queda por archivar. */
      kind: "declared-by-owner";
      declaredBy: `${string}@inplux.co`;
      note: string;
      grantedAt: string;
      verifiedAt: string;
    };

export type Partner = {
  id: string;
  name: string;
  file: `/brand/partners/${string}`;
  width: number;
  height: number;
  relation: PartnerRelation;
  /** De dónde salió el archivo, tal cual, sin redibujar ni recolorear. */
  origin: `https://${string}`;
  permission: PartnerPermission;
};

export const partners = registry.partners as readonly Partner[];
