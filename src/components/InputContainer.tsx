import {Button, Input} from "@heroui/react";
import {PlusIcon, SearchIcon} from "@/src/components/icons.tsx";

type InputContainerProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onNew: () => void;
  searchPlaceholder?: string;
};

/** Barre au-dessus de chaque liste : bouton « Nouveau » + champ de recherche. */
export default function InputContainer({search, onSearchChange, onNew, searchPlaceholder = "Rechercher"}: InputContainerProps) {
  return (
    <div className="flex items-center gap-3">
      {/* même style translucide (« flat ») que les boutons Voir / Modifier des lignes */}
      <Button
        color="primary"
        variant="flat"
        radius="lg"
        className="h-11 font-semibold px-5 shrink-0"
        startContent={<PlusIcon />}
        onPress={onNew}
      >
        Nouveau
      </Button>

      <Input
        fullWidth
        isClearable
        radius="md"
        variant="bordered"
        placeholder={searchPlaceholder}
        value={search}
        onValueChange={onSearchChange}
        onClear={() => onSearchChange("")}
        startContent={<SearchIcon className="text-foreground/50" />}
        classNames={{
          inputWrapper: [
            "h-11 bg-content4 border-2 border-divider",
            "data-[hover=true]:border-default-700",
            "group-data-[focus=true]:border-primary",
          ].join(" "),
          input: "text-sm",
        }}
      />
    </div>
  );
}
