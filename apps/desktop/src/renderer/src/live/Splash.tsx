import logo from "../assets/Forever-CarsLogo.svg";
import Button from "../ui/Button";

// Écran d'attente (connexion, chargement du parc) ou d'erreur avec « Réessayer ».
export default function Splash({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <main className="grid h-full place-items-center px-6">
      <div className="grid max-w-md justify-items-center gap-7 text-center">
        <img src={logo} alt="ForeverCars" className="h-14 w-auto" />
        <p role={onRetry ? "alert" : "status"} className={onRetry ? "text-orange" : "text-silver"}>
          {message}
        </p>
        {onRetry && (
          <Button variant="ghost" onClick={onRetry}>
            Réessayer
          </Button>
        )}
      </div>
    </main>
  );
}
