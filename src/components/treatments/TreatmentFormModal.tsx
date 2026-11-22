import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
} from "@heroui/react";
import {FormEvent, useEffect, useMemo, useState} from "react";
import {
  createTreatment,
  getAllTreatments,
  getInteractions,
  setInteractions,
  updateTreatment,
} from "@/src/database/treatmentRepository.ts";
import {getAllTreatmentTypes} from "@/src/database/treatmentTypeRepository.ts";
import {SolutionIcon} from "@/src/components/solutionIcons.tsx";
import {solutionColor} from "@/src/components/solutionColors.ts";
import {Treatment, TreatmentInput} from "@/src/model/treatment.ts";
import {TreatmentType} from "@/src/model/treatmentType.ts";
import {notifyError, notifySuccess} from "@/src/utils/notify.ts";

type TreatmentFormModalProps = {
  /** null → création */
  treatment: Treatment | null;
  onClose: () => void;
  onSaved: () => void;
};

export function TreatmentFormModal({treatment, onClose, onSaved}: TreatmentFormModalProps) {
  const [form, setForm] = useState<TreatmentInput>({
    name: treatment?.name ?? "",
    typeId: treatment?.typeId ?? 0,
    primaryProperty: treatment?.primaryProperty ?? "",
    secondaryProperty: treatment?.secondaryProperty ?? "",
    contraindication: treatment?.contraindication ?? "",
    description: treatment?.description ?? "",
  });
  const [interactionIds, setInteractionIds] = useState<Set<string>>(new Set());

  const [solutions, setSolutions] = useState<TreatmentType[]>([]);
  const [otherTreatments, setOtherTreatments] = useState<Treatment[]>([]);
  /** incrémenté après chaque ajout d'interaction pour vider le champ de recherche */
  const [pickerKey, setPickerKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [types, all, interactions] = await Promise.all([
          getAllTreatmentTypes(),
          getAllTreatments(),
          treatment ? getInteractions(treatment.id) : Promise.resolve([]),
        ]);
        setSolutions(types);
        setOtherTreatments(all.filter((t) => t.id !== treatment?.id));
        setInteractionIds(new Set(interactions.map((t) => String(t.id))));
      } catch (e) {
        notifyError("Impossible de charger le formulaire", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [treatment]);

  const set = <K extends keyof TreatmentInput>(key: K) => (value: TreatmentInput[K]) =>
    setForm((f) => ({...f, [key]: value}));

  const selectedSolution = solutions.find((s) => s.id === form.typeId) ?? null;
  const interactionList = otherTreatments.filter((t) => interactionIds.has(String(t.id)));
  /** Traitements pas encore marqués en interaction, proposés dans le champ d'ajout. */
  const availableInteractions = useMemo(
    () => otherTreatments.filter((t) => !interactionIds.has(String(t.id))),
    [otherTreatments, interactionIds],
  );

  const addInteraction = (id: number) => {
    setInteractionIds((ids) => new Set(ids).add(String(id)));
    setPickerKey((k) => k + 1);
  };
  const removeInteraction = (id: number) =>
    setInteractionIds((ids) => {
      const next = new Set(ids);
      next.delete(String(id));
      return next;
    });

  const nameInvalid = submitted && !form.name.trim();
  const typeInvalid = submitted && !form.typeId;

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!form.name.trim() || !form.typeId) return;

    setIsSaving(true);
    try {
      const id = treatment ? treatment.id : await createTreatment(form);
      if (treatment) await updateTreatment(id, form);
      await setInteractions(id, [...interactionIds].map(Number));
      notifySuccess(`« ${form.name.trim()} » enregistré`);
      onSaved();
    } catch (err) {
      notifyError("Enregistrement impossible", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} isDismissable={!isSaving} size="2xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        <form onSubmit={save} className="flex flex-col min-h-0">
          <ModalHeader>{treatment ? "Modifier le traitement" : "Nouveau traitement"}</ModalHeader>
          <ModalBody className="gap-4">
            {isLoading ? (
              <Spinner className="py-8" />
            ) : (
              <>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Input
                    autoFocus
                    label="Nom"
                    placeholder="Ex. Tea tree"
                    variant="bordered"
                    value={form.name}
                    onValueChange={set("name")}
                    isRequired
                    isInvalid={nameInvalid}
                    errorMessage="Le nom est obligatoire"
                  />
                  <Autocomplete
                    label="Solution"
                    placeholder={solutions.length ? "Rechercher une solution…" : "Aucune solution"}
                    variant="bordered"
                    isRequired
                    defaultItems={solutions}
                    selectedKey={form.typeId ? String(form.typeId) : null}
                    onSelectionChange={(key) => set("typeId")(key != null ? Number(key) : 0)}
                    startContent={
                      selectedSolution && (
                        <SolutionIcon
                          icon={selectedSolution.icon}
                          size={18}
                          className={`shrink-0 ${solutionColor(selectedSolution.color).text}`}
                        />
                      )
                    }
                    listboxProps={{emptyContent: "Aucune solution ne correspond."}}
                    isInvalid={typeInvalid}
                    errorMessage="Choisis une solution"
                    description={
                      solutions.length === 0
                        ? "Crée d'abord une solution dans l'onglet « Solutions »."
                        : undefined
                    }
                  >
                    {(s) => (
                      <AutocompleteItem
                        key={String(s.id)}
                        textValue={s.name}
                        startContent={<SolutionIcon icon={s.icon} size={18} className={solutionColor(s.color).text} />}
                      >
                        {s.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>

                <Textarea
                  label="Propriété principale"
                  variant="bordered"
                  minRows={1}
                  value={form.primaryProperty}
                  onValueChange={set("primaryProperty")}
                />
                <Textarea
                  label="Propriété secondaire"
                  variant="bordered"
                  minRows={1}
                  value={form.secondaryProperty}
                  onValueChange={set("secondaryProperty")}
                />
                <Textarea
                  label="Contre-indications"
                  variant="bordered"
                  minRows={1}
                  value={form.contraindication}
                  onValueChange={set("contraindication")}
                />
                <Textarea
                  label="Description"
                  variant="bordered"
                  minRows={2}
                  value={form.description}
                  onValueChange={set("description")}
                />

                <div className="flex flex-col gap-2">
                  <span className="text-sm text-foreground/80">Interactions</span>
                  {interactionList.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {interactionList.map((t) => (
                        <Chip
                          key={t.id}
                          size="sm"
                          variant="flat"
                          color="warning"
                          onClose={() => removeInteraction(t.id)}
                        >
                          {t.name}
                        </Chip>
                      ))}
                    </div>
                  )}
                  <Autocomplete
                    key={`${pickerKey}-${availableInteractions.length}`}
                    aria-label="Ajouter une interaction"
                    placeholder={
                      otherTreatments.length === 0
                        ? "Aucun autre traitement"
                        : "Rechercher un traitement à ne pas associer…"
                    }
                    description="Traitements incompatibles avec celui-ci (la relation vaut dans les deux sens)."
                    variant="bordered"
                    isDisabled={availableInteractions.length === 0}
                    defaultItems={availableInteractions}
                    listboxProps={{emptyContent: "Aucun traitement ne correspond."}}
                    onSelectionChange={(key) => {
                      if (key != null) addInteraction(Number(key));
                    }}
                  >
                    {(t) => (
                      <AutocompleteItem key={String(t.id)} textValue={t.name}>
                        {t.name}
                        {t.typeName && <span className="ml-2 text-xs text-foreground/50">{t.typeName}</span>}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} isDisabled={isSaving}>Annuler</Button>
            <Button color="primary" type="submit" isLoading={isSaving} isDisabled={isLoading}>
              Enregistrer
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
