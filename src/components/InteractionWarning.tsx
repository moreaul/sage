import {WarningIcon} from "@/src/components/icons.tsx";

type InteractionWarningProps = {
  /** paires de traitements en interaction */
  pairs: [number, number][];
  /** nom d'un traitement à partir de son id */
  nameOf: (id: number) => string;
};

/** Encadré d'alerte listant les traitements d'une même pathologie qui interagissent entre eux. */
export function InteractionWarning({pairs, nameOf}: InteractionWarningProps) {
  if (pairs.length === 0) return null;
  return (
    <div role="alert" className="flex gap-3 rounded-xl border border-danger/40 bg-danger/10 p-3">
      <WarningIcon className="mt-0.5 shrink-0 text-danger" />
      <div className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-danger">
          {pairs.length > 1 ? "Interactions entre traitements" : "Interaction entre traitements"}
        </span>
        <ul className="flex flex-col gap-0.5 text-foreground/80">
          {pairs.map(([a, b]) => (
            <li key={`${a}-${b}`}>
              <span className="font-medium">{nameOf(a)}</span> et <span className="font-medium">{nameOf(b)}</span>{" "}
              ne doivent pas être associés.
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
