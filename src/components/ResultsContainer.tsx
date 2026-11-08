import {Button, Spinner, Tooltip} from "@heroui/react";
import {ReactNode} from "react";
import InputContainer from "@/src/components/InputContainer.tsx";
import {EyeIcon, PencilIcon, TrashIcon} from "@/src/components/icons.tsx";

export type ResultItem = {
  id: number;
  title: string;
  /** grande icône à gauche de la ligne (ex. l'icône d'une solution) */
  leading?: ReactNode;
  /** petite étiquette à côté du titre (ex. la solution d'un traitement) */
  chip?: ReactNode;
  /** ligne secondaire en plus petit sous le titre */
  subtitle?: string | null;
};

type ResultsContainerProps = {
  items: ResultItem[];
  isLoading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onNew: () => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  /** message quand la liste est vide sans recherche */
  emptyMessage: ReactNode;
};

/** Contenu générique d'un onglet : barre de recherche + liste scrollable avec actions. */
export default function ResultsContainer({
  items,
  isLoading,
  search,
  onSearchChange,
  searchPlaceholder,
  onNew,
  onView,
  onEdit,
  onDelete,
  emptyMessage,
}: ResultsContainerProps) {
  return (
    <div className="flex flex-col gap-3 flex-1 h-full min-h-0">

      <InputContainer
        search={search}
        onSearchChange={onSearchChange}
        onNew={onNew}
        searchPlaceholder={searchPlaceholder}
      />

      {/* Liste scrollable */}
      <section className="flex-1 h-full min-h-0 p-3 bg-content2 rounded-xl overflow-hidden">
        <div className="space-y-3 h-full max-h-full overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner label="Chargement…" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-sm text-foreground/60">
              {search.trim() ? `Aucun résultat pour « ${search.trim()} »` : emptyMessage}
            </div>
          ) : (
            items.map((item) => (
              <ResultRow
                key={item.id}
                item={item}
                onView={() => onView(item.id)}
                onEdit={() => onEdit(item.id)}
                onDelete={() => onDelete(item.id)}
              />
            ))
          )}
        </div>
      </section>

    </div>
  );
}

type RowProps = {
  item: ResultItem;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function ResultRow({item, onView, onEdit, onDelete}: RowProps) {
  return (
    <div
      className="
        flex items-center justify-between gap-4
        bg-content1
        rounded-lg px-4 py-3
        hover:bg-content1/60
        transition-colors
        cursor-pointer
      "
      onClick={onView}
    >
      <div className="flex min-w-0 items-center gap-3">
        {item.leading && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            {item.leading}
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-foreground truncate">{item.title}</span>
            {item.chip}
          </div>
          {item.subtitle && (
            <span className="text-xs text-foreground/60 truncate">{item.subtitle}</span>
          )}
        </div>
      </div>

      {/* stopPropagation : un clic sur un bouton ne doit pas aussi ouvrir la fiche */}
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        <IconButton label="Voir" onPress={onView}><EyeIcon /></IconButton>
        <IconButton label="Modifier" onPress={onEdit}><PencilIcon /></IconButton>
        <IconButton label="Supprimer" onPress={onDelete} danger><TrashIcon /></IconButton>
      </div>
    </div>
  );
}

type IconButtonProps = {
  label: string;
  onPress: () => void;
  /** rouge au lieu de vert (suppression) */
  danger?: boolean;
  children: ReactNode;
};

/** Bouton d'action translucide (variant « flat ») : vert, ou rouge pour la suppression. */
function IconButton({label, onPress, danger, children}: IconButtonProps) {
  return (
    <Tooltip content={label} delay={400} closeDelay={0}>
      <Button
        isIconOnly
        radius="lg"
        variant="flat"
        color={danger ? "danger" : "primary"}
        aria-label={label}
        onPress={onPress}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
