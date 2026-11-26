import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Vehicle } from "../../../shared/model";
import { errorText, useStore } from "../data/store";
import { generateDescription } from "../services/description";
import { nextFileNumber } from "../services/fileNumber";
import { emptyVehicle, finalize, validateStep, type Errors, type StepIndex } from "./draft";

// Tant que la description n'a pas été retouchée à la main, elle suit la fiche.
const withAutoDescription = (v: Vehicle): Vehicle => (v.descriptionIsAuto ? { ...v, description: generateDescription(v) } : v);

/** État de l'assistant : brouillon enregistré à chaque étape, publication à la fin. */
export function useWizard(id?: string) {
  const store = useStore();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(() => {
    if (id) return null; // fiche existante : chargée (et prise en main) ci-dessous
    const now = new Date().toISOString();
    const fileNumber = nextFileNumber(store.state.vehicles.map((v) => v.fileNumber), new Date(now).getFullYear());
    return emptyVehicle(crypto.randomUUID(), now, fileNumber);
  });
  const [loadError, setLoadError] = useState<string | null>(null);
  const [step, setStep] = useState<StepIndex>(0);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { claimVehicle } = store;
  useEffect(() => {
    if (!id) return;
    let alive = true;
    claimVehicle(id).then(
      (v) => alive && setVehicle(v),
      (e: unknown) => alive && setLoadError(errorText(e)),
    );
    return () => {
      alive = false;
    };
    // Une seule prise en main à l'ouverture de la fiche, pas à chaque mise à jour du parc.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const goTo = (s: StepIndex) => {
    setStep(s);
    document.querySelector("main")?.scrollTo({ top: 0 });
  };
  const onChange = (patch: Partial<Vehicle>) => setVehicle((v) => v && withAutoDescription({ ...v, ...patch }));

  /** Enregistre la fiche ; renvoie la version enregistrée, ou null (message affiché) en cas d'échec. */
  const save = async (): Promise<Vehicle | null> => {
    if (!vehicle || busy) return null;
    setBusy(true);
    setSaveError(null);
    try {
      const saved = await store.saveVehicle(finalize(vehicle));
      // N° de dossier et adresse définitifs donnés par la base, version pour le prochain enregistrement.
      setVehicle((v) => v && { ...v, fileNumber: saved.fileNumber, slug: saved.slug, revision: saved.revision, publishedAt: saved.publishedAt });
      return saved;
    } catch (e) {
      setSaveError(errorText(e));
      return null;
    } finally {
      setBusy(false);
    }
  };

  const next = async () => {
    if (!vehicle) return;
    const found = validateStep(step, vehicle);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    if (await save()) goTo(Math.min(3, step + 1) as StepIndex);
  };

  const publish = async () => {
    const saved = await save();
    if (!saved) return;
    if (saved.status === "draft") {
      try {
        await store.act(saved.id, "publish");
      } catch (e) {
        setSaveError(errorText(e));
        return;
      }
    }
    navigate(`/succes/${saved.id}`);
  };

  const saveDraft = async () => {
    if (await save()) navigate("/");
  };

  return { vehicle, loadError, step, errors, busy, saveError, goTo, onChange, next, publish, saveDraft };
}
