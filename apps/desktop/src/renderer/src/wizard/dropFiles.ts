// Récupère les images d'un glisser-déposer, y compris d'un dossier entier
// (et de ses sous-dossiers), grâce à l'API « entries » de Chromium.

const isImage = (file: File) => file.type.startsWith("image/") || /\.(jpe?g|png|webp|heic|avif)$/i.test(file.name);

function readEntries(reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> {
  return new Promise((resolve, reject) => reader.readEntries(resolve, reject));
}

async function collect(entry: FileSystemEntry): Promise<File[]> {
  if (entry.isFile) {
    const file = await new Promise<File>((resolve, reject) => (entry as FileSystemFileEntry).file(resolve, reject));
    return [file];
  }
  if (!entry.isDirectory) return [];
  const reader = (entry as FileSystemDirectoryEntry).createReader();
  const files: File[] = [];
  // readEntries renvoie les fichiers par paquets : on boucle jusqu'à un paquet vide.
  for (let batch = await readEntries(reader); batch.length > 0; batch = await readEntries(reader)) {
    for (const child of batch) files.push(...(await collect(child)));
  }
  return files;
}

export async function filesFromDrop(data: DataTransfer): Promise<File[]> {
  const entries = Array.from(data.items)
    .map((item) => item.webkitGetAsEntry())
    .filter((e): e is FileSystemEntry => e !== null);
  const files = entries.length > 0 ? (await Promise.all(entries.map(collect))).flat() : Array.from(data.files);
  return files.filter(isImage).sort((a, b) => a.name.localeCompare(b.name, "fr", { numeric: true }));
}

/** Le glisser-déposer contient-il des fichiers (et pas une photo qu'on réordonne) ? */
export const hasFiles = (data: DataTransfer) => Array.from(data.types).includes("Files");
