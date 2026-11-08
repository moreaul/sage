import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@heroui/react";
import {FormEvent, useEffect, useState} from "react";
import {
  createTreatment,
  getAllTreatments,
  getInteractions,
  setInteractions,
  updateTreatment,
} from "@/src/database/treatmentRepository.ts";
import {getAllTreatmentTypes} from "@/src/database/treatmentTypeRepository.ts";
import {SolutionIcon} from "@/src/components/solutionIcons.tsx";
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
                  <Select
                    label="Solution"
                    placeholder={solutions.length ? "Choisir…" : "Aucune solution"}
                    variant="bordered"
                    isRequired
                    selectedKeys={form.typeId ? [String(form.typeId)] : []}
                    onSelectionChange={(keys) => {
                      const key = keys === "all" ? undefined : [...keys][0];
                      set("typeId")(key ? Number(key) : 0);
                    }}
                    isInvalid={typeInvalid}
                    errorMessage="Choisis une solution"
                    description={
                      solutions.length === 0
                        ? "Crée d'abord une solution dans l'onglet « Solutions »."
                        : undefined
                    }
                  >
                    {solutions.map((s) => (
                      <SelectItem key={String(s.id)} startContent={<SolutionIcon icon={s.icon} size={18} className="text-primary" />}>{s.name}</SelectItem>
                    ))}
                  </Select>
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

                <Select
                  label="Interactions"
                  placeholder={otherTreatments.length ? "Traitements à ne pas associer" : "Aucun autre traitement"}
                  description="Traitements incompatibles avec celui-ci (la relation vaut dans les deux sens)."
                  variant="bordered"
                  selectionMode="multiple"
                  isMultiline
                  isDisabled={otherTreatments.length === 0}
                  selectedKeys={interactionIds}
                  onSelectionChange={(keys) =>
                    setInteractionIds(
                      keys === "all"
                        ? new Set(otherTreatments.map((t) => String(t.id)))
                        : new Set([...keys].map(String)),
                    )
                  }
                  renderValue={(items) => (
                    <div className="flex flex-wrap gap-1 py-1">
                      {items.map((item) => (
                        <Chip key={item.key} size="sm" variant="flat" color="warning">
                          {item.textValue}
                        </Chip>
                      ))}
                    </div>
                  )}
                >
                  {otherTreatments.map((t) => (
                    <SelectItem key={String(t.id)} textValue={t.name}>
                      {t.name}
                      {t.typeName && <span className="ml-2 text-xs text-foreground/50">{t.typeName}</span>}
                    </SelectItem>
                  ))}
                </Select>
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
