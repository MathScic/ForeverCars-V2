// Contrat entre le renderer (window.api) et le preload. Aucune dépendance Electron ici.
import type { ActivityEntry, Photo, Profile, Role, TeamMember, Vehicle, VehicleAct } from "./model";

export interface Api {
  app: {
    /** Version de l'application (package.json). */
    version(): Promise<string>;
    /** « demo » : données fictives (tests, présentation) ; « live » : branchée sur Supabase. */
    mode(): Promise<"demo" | "live">;
    /** Copie un texte (mot de passe provisoire) dans le presse-papiers de Windows. */
    copy(text: string): Promise<void>;
  };
  auth: {
    /** La personne déjà connectée sur ce poste, ou null. */
    session(): Promise<Profile | null>;
    signIn(email: string, password: string): Promise<Profile>;
    signOut(): Promise<void>;
    changePassword(password: string): Promise<void>;
  };
  /** Écran Équipe (admin) : passe par l'Edge Function « team », qui vérifie le rôle. */
  team: {
    list(): Promise<TeamMember[]>;
    /** Le mot de passe provisoire n'est donné qu'une fois, à transmettre à la personne. */
    invite(email: string, name: string, role: Role): Promise<{ password: string; members: TeamMember[] }>;
    setRole(id: string, role: Role): Promise<TeamMember[]>;
    resetPassword(id: string): Promise<string>;
    setAccess(id: string, enabled: boolean): Promise<TeamMember[]>;
  };
  vehicles: {
    list(): Promise<Vehicle[]>;
    /** Prend la main sur un véhicule venu de Sanity (la synchro ne l'écrase plus) et le renvoie à jour. */
    claim(id: string): Promise<Vehicle>;
    save(vehicle: Vehicle): Promise<Vehicle>;
    /** null : le véhicule a été supprimé. */
    act(id: string, act: VehicleAct): Promise<Vehicle | null>;
  };
  photos: {
    /** Traite la photo sur ce PC (redressée, 3 tailles, filigrane) puis l'envoie. */
    add(vehicleId: string, file: File): Promise<Photo>;
    /** Enregistre l'ordre voulu ; les photos absentes de la liste sont retirées. */
    order(vehicleId: string, ids: string[]): Promise<void>;
  };
  activity: {
    list(): Promise<ActivityEntry[]>;
  };
  /** Pièces du dossier (espace privé) : chaque action renvoie le véhicule à jour. */
  documents: {
    add(vehicleId: string, docId: string, file: File): Promise<Vehicle>;
    remove(vehicleId: string, docId: string): Promise<Vehicle>;
    open(vehicleId: string, docId: string): Promise<void>;
  };
}

/** Liste blanche des canaux IPC. Tout autre canal est refusé. */
export const IPC_CHANNELS = {
  appVersion: "app:version",
  appMode: "app:mode",
  appCopy: "app:copy",
  authSession: "auth:session",
  authSignIn: "auth:sign-in",
  authSignOut: "auth:sign-out",
  authChangePassword: "auth:change-password",
  teamList: "team:list",
  teamInvite: "team:invite",
  teamSetRole: "team:set-role",
  teamResetPassword: "team:reset-password",
  teamSetAccess: "team:set-access",
  vehiclesList: "vehicles:list",
  vehiclesClaim: "vehicles:claim",
  vehiclesSave: "vehicles:save",
  vehiclesAct: "vehicles:act",
  photosAdd: "photos:add",
  photosOrder: "photos:order",
  activityList: "activity:list",
  documentsAdd: "documents:add",
  documentsRemove: "documents:remove",
  documentsOpen: "documents:open",
} as const;
