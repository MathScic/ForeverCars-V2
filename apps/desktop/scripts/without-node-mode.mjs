// Lance une commande sans ELECTRON_RUN_AS_NODE.
// Le terminal intégré de VS Code définit cette variable, ce qui fait démarrer
// Electron comme un simple Node : la fenêtre ne s'ouvrirait jamais.
import { spawn } from "node:child_process";

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;
const [command, ...args] = process.argv.slice(2);

const child = spawn(command, args, { stdio: "inherit", env, shell: true });
child.on("exit", (code) => process.exit(code ?? 0));
