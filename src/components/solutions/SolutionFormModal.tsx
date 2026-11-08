import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip} from "@heroui/react";
import {FormEvent, useState} from "react";
import {
  DEFAULT_SOLUTION_ICON,
  isSolutionIconKey,
  SOLUTION_ICON_KEYS,
  SOLUTION_ICONS,
  SolutionIcon,
  SolutionIconKey,
  suggestSolutionIcon,
} from "@/src/components/solutionIcons.tsx";
import {createTreatmentType, updateTreatmentType} from "@/src/database/treatmentTypeRepository.ts";
import {TreatmentType} from "@/src/model/treatmentType.ts";
import {notifyError, notifySuccess} from "@/src/utils/notify.ts";

type SolutionFormModalProps = {
  /** null → création */
  solution: TreatmentType | null;
  onClose: () => void;
  onSaved: () => void;
};

export function SolutionFormModal({solution, onClose, onSaved}: SolutionFormModalProps) {
  const [name, setName] = useState(solution?.name ?? "");
  const [icon, setIcon] = useState<SolutionIconKey>(
    isSolutionIconKey(solution?.icon) ? solution.icon : DEFAULT_SOLUTION_ICON,
  );
  /**
   * Tant que l'utilisateur n'a pas choisi d'icône lui-même, on la propose d'après le nom
   * (seulement à la création : on ne change pas l'icône d'une solution existante).
   */
  const [iconChosen, setIconChosen] = useState(solution != null);
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nameInvalid = submitted && !name.trim();

  const changeName = (value: string) => {
    setName(value);
    if (!iconChosen) setIcon(suggestSolutionIcon(value) ?? DEFAULT_SOLUTION_ICON);
  };

  const chooseIcon = (key: SolutionIconKey) => {
    setIcon(key);
    setIconChosen(true);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const input = {name, icon};
      if (solution) {
        await updateTreatmentType(solution.id, input);
      } else {
        await createTreatmentType(input);
      }
      notifySuccess(`« ${name.trim()} » enregistrée`);
      onSaved();
    } catch (err) {
      notifyError("Enregistrement impossible", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} isDismissable={!isSaving} size="lg" backdrop="blur">
      <ModalContent>
        <form onSubmit={save}>
          <ModalHeader>{solution ? "Modifier la solution" : "Nouvelle solution"}</ModalHeader>
          <ModalBody className="gap-4">
            <div className="flex items-start gap-3">
              {/* aperçu de l'icône choisie */}
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <SolutionIcon icon={icon} size={30} />
              </div>
              <Input
                autoFocus
                label="Nom"
                placeholder="Ex. Huile essentielle"
                variant="bordered"
                value={name}
                onValueChange={changeName}
                isRequired
                isInvalid={nameInvalid}
                errorMessage="Le nom est obligatoire"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-foreground/80">Icône</span>
              <div role="radiogroup" aria-label="Icône" className="grid grid-cols-6 gap-2">
                {SOLUTION_ICON_KEYS.map((key) => {
                  const selected = key === icon;
                  return (
                    <Tooltip key={key} content={SOLUTION_ICONS[key].label} delay={300} closeDelay={0}>
                      <Button
                        isIconOnly
                        radius="lg"
                        role="radio"
                        aria-checked={selected}
                        aria-label={SOLUTION_ICONS[key].label}
                        variant={selected ? "solid" : "flat"}
                        color={selected ? "primary" : "default"}
                        className="h-12 w-full"
                        onPress={() => chooseIcon(key)}
                      >
                        <SolutionIcon icon={key} size={24} />
                      </Button>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} isDisabled={isSaving}>Annuler</Button>
            <Button color="primary" type="submit" isLoading={isSaving}>Enregistrer</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
