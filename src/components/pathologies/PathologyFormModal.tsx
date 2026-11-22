import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  Tooltip,
} from "@heroui/react";
import {FormEvent, useEffect, useMemo, useState} from "react";
import {SectionTitle} from "@/src/components/DetailField.tsx";
import {SolutionChip} from "@/src/components/SolutionChip.tsx";
import {CloseIcon} from "@/src/components/icons.tsx";
import {APPROACH_KEYS, APPROACHES, ApproachIcon, knownApproach} from "@/src/components/approaches.tsx";
import {solutionColor} from "@/src/components/solutionColors.ts";
import {createDisease, updateDisease} from "@/src/database/diseaseRepository.ts";
import {getCuresForDisease, setCuresForDisease} from "@/src/database/cureRepository.ts";
import {
  findInteractingPairs,
  getAllInteractionPairs,
  getAllTreatments,
} from "@/src/database/treatmentRepository.ts";
import {InteractionWarning} from "@/src/components/InteractionWarning.tsx";
import {Disease} from "@/src/model/disease.ts";
import {Treatment} from "@/src/model/treatment.ts";
import {notifyError, notifySuccess} from "@/src/utils/notify.ts";

type PathologyFormModalProps = {
  /** null → création */
  disease: Disease | null;
  onClose: () => void;
  onSaved: () => void;
};

/** Un traitement associé à la pathologie dans le formulaire. */
type CureDraft = {
  treatmentId: number;
  treatmentName: string;
  typeName: string | null;
  typeIcon: string | null;
  typeColor: string | null;
  usage: string;
};

export function PathologyFormModal({disease, onClose, onSaved}: PathologyFormModalProps) {
  const [name, setName] = useState(disease?.name ?? "");
  const [description, setDescription] = useState(disease?.description ?? "");
  /** clé de l'approche ; une clé inconnue (sauvegarde d'une version plus récente) est conservée */
  const [approach, setApproach] = useState<string | null>(disease?.approach ?? null);
  const [cures, setCures] = useState<CureDraft[]>([]);
  const [allTreatments, setAllTreatments] = useState<Treatment[]>([]);
  const [interactionPairs, setInteractionPairs] = useState<[number, number][]>([]);
  /**
   * Change à chaque ajout pour réinitialiser le champ de recherche de traitement.
   * Combinée à la taille de la liste proposée (voir key de l'Autocomplete), elle force
   * aussi le rafraîchissement de `defaultItems` quand on retire un traitement.
   */
  const [pickerKey, setPickerKey] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [treatments, existing, pairs] = await Promise.all([
          getAllTreatments(),
          disease ? getCuresForDisease(disease.id) : Promise.resolve([]),
          getAllInteractionPairs(),
        ]);
        setAllTreatments(treatments);
        setInteractionPairs(pairs);
        setCures(
          existing.map((c) => ({
            treatmentId: c.treatmentId,
            treatmentName: c.treatmentName,
            typeName: c.typeName,
            typeIcon: c.typeIcon,
            typeColor: c.typeColor,
            usage: c.usage ?? "",
          })),
        );
      } catch (e) {
        notifyError("Impossible de charger le formulaire", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [disease]);

  /** Traitements pas encore associés, proposés dans le champ d'ajout. */
  const available = useMemo(
    () => allTreatments.filter((t) => !cures.some((c) => c.treatmentId === t.id)),
    [allTreatments, cures],
  );

  /** Traitements associés qui interagissent entre eux : alerte mise à jour à chaque ajout/retrait. */
  const conflicts = useMemo(
    () => findInteractingPairs(cures.map((c) => c.treatmentId), interactionPairs),
    [cures, interactionPairs],
  );
  const nameOf = (id: number) => cures.find((c) => c.treatmentId === id)?.treatmentName ?? "?";

  const addCure = (treatmentId: number) => {
    const t = allTreatments.find((x) => x.id === treatmentId);
    if (!t) return;
    setCures((list) => [...list, {treatmentId: t.id, treatmentName: t.name, typeName: t.typeName, typeIcon: t.typeIcon, typeColor: t.typeColor, usage: ""}]);
    setPickerKey((k) => k + 1);
  };

  const updateUsage = (treatmentId: number, usage: string) =>
    setCures((list) => list.map((c) => (c.treatmentId === treatmentId ? {...c, usage} : c)));

  /** approche affichée dans le champ (une clé inconnue n'y apparaît pas, mais reste enregistrée si on n'y touche pas) */
  const selectedApproach = knownApproach(approach);

  const removeCure = (treatmentId: number) =>
    setCures((list) => list.filter((c) => c.treatmentId !== treatmentId));

  const nameInvalid = submitted && !name.trim();

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const input = {name, description, approach};
      const id = disease ? disease.id : await createDisease(input);
      if (disease) await updateDisease(id, input);
      await setCuresForDisease(id, cures);
      notifySuccess(`« ${name.trim()} » enregistrée`);
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
          <ModalHeader>{disease ? "Modifier la pathologie" : "Nouvelle pathologie"}</ModalHeader>
          <ModalBody className="gap-4">
            {isLoading ? (
              <Spinner className="py-8" />
            ) : (
              <>
                {/* Même disposition que le formulaire de traitement (nom + solution) */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Input
                    autoFocus
                    label="Nom"
                    placeholder="Ex. Acné"
                    variant="bordered"
                    value={name}
                    onValueChange={setName}
                    isRequired
                    isInvalid={nameInvalid}
                    errorMessage="Le nom est obligatoire"
                  />
                  {/* Facultative : la croix du champ la retire. */}
                  <Autocomplete
                    label="Approche"
                    placeholder="Rechercher une approche…"
                    variant="bordered"
                    defaultItems={APPROACH_KEYS.map((key) => ({key, ...APPROACHES[key]}))}
                    selectedKey={selectedApproach}
                    onSelectionChange={(key) => setApproach(key != null ? String(key) : null)}
                    startContent={
                      selectedApproach && (
                        <ApproachIcon
                          approach={selectedApproach}
                          size={18}
                          className={`shrink-0 ${solutionColor(APPROACHES[selectedApproach].color).text}`}
                        />
                      )
                    }
                    listboxProps={{emptyContent: "Aucune approche ne correspond."}}
                  >
                    {(a) => (
                      <AutocompleteItem
                        key={a.key}
                        textValue={a.label}
                        startContent={<ApproachIcon approach={a.key} size={18} className={solutionColor(a.color).text} />}
                      >
                        {a.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>

                <Textarea
                  label="Description"
                  placeholder="Symptômes, causes, remarques…"
                  variant="bordered"
                  minRows={3}
                  value={description}
                  onValueChange={setDescription}
                />

                <SectionTitle>Traitements qui la soignent</SectionTitle>

                <InteractionWarning pairs={conflicts} nameOf={nameOf} />

                {cures.length === 0 && (
                  <p className="text-sm text-foreground/60">Aucun traitement associé pour l'instant.</p>
                )}

                <ul className="flex flex-col gap-3">
                  {cures.map((c) => (
                    <li key={c.treatmentId} className="flex flex-col gap-2 rounded-xl bg-content2 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{c.treatmentName}</span>
                          {c.typeName && (
                            <SolutionChip name={c.typeName} icon={c.typeIcon} color={c.typeColor} />
                          )}
                        </div>
                        <Tooltip content="Retirer" delay={400} closeDelay={0}>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            aria-label={`Retirer ${c.treatmentName}`}
                            onPress={() => removeCure(c.treatmentId)}
                          >
                            <CloseIcon />
                          </Button>
                        </Tooltip>
                      </div>
                      <Textarea
                        label="Mode d'utilisation"
                        labelPlacement="outside"
                        placeholder={`Comment utiliser ${c.treatmentName} pour cette pathologie (ex. 2 gouttes sur le bouton matin et soir)`}
                        variant="bordered"
                        minRows={2}
                        value={c.usage}
                        onValueChange={(v) => updateUsage(c.treatmentId, v)}
                      />
                    </li>
                  ))}
                </ul>

                <Autocomplete
                  key={`${pickerKey}-${available.length}`}
                  label="Ajouter un traitement"
                  placeholder={
                    allTreatments.length === 0
                      ? "Crée d'abord des traitements dans l'onglet « Traitements »"
                      : "Rechercher un traitement…"
                  }
                  variant="bordered"
                  isDisabled={available.length === 0}
                  defaultItems={available}
                  onSelectionChange={(key) => {
                    if (key != null) addCure(Number(key));
                  }}
                >
                  {(t) => (
                    <AutocompleteItem key={t.id} textValue={t.name}>
                      {t.name}
                      {t.typeName && <span className="ml-2 text-xs text-foreground/50">{t.typeName}</span>}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
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
