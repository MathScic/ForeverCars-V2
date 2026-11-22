import { useCallback, useRef, useState } from "react";
import { ArrayOfObjectsInputProps, insert } from "sanity";
import { useClient } from "sanity";
import { Button, Stack, Flex, Text, Box, Card, Spinner } from "@sanity/ui";
import { UploadIcon } from "@sanity/icons";

export function MultiImageUpload(props: ArrayOfObjectsInputProps) {
  const { onChange, renderDefault } = props;
  const client = useClient({ apiVersion: "2026-02-10" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const handleFiles = useCallback(
    async (files: FileList) => {
      if (!files.length) return;

      const fileArray = Array.from(files);
      setUploading(true);
      setProgress({ done: 0, total: fileArray.length });

      const newItems: object[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        try {
          const asset = await client.assets.upload("image", file, {
            filename: file.name,
          });
          newItems.push({
            _type: "image",
            _key: `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          });
          setProgress({ done: i + 1, total: fileArray.length });
        } catch (err) {
          console.error(`Échec de l'upload de ${file.name}:`, err);
        }
      }

      if (newItems.length > 0) {
        onChange(insert(newItems, "after", [-1]));
      }

      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    },
    [client, onChange]
  );

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} tone={uploading ? "caution" : "default"} border>
        <Flex gap={3} align="center">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <Button
            icon={uploading ? undefined : UploadIcon}
            text={
              uploading
                ? `Upload en cours... (${progress.done}/${progress.total})`
                : "Ajouter plusieurs photos"
            }
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            tone="primary"
            mode={uploading ? "default" : "ghost"}
          />
          {uploading && (
            <Flex gap={2} align="center">
              <Spinner muted />
              <Text size={1} muted>
                {progress.done} photo{progress.done > 1 ? "s" : ""} uploadée
                {progress.done > 1 ? "s" : ""} sur {progress.total}
              </Text>
            </Flex>
          )}
        </Flex>
      </Card>
      <Box>{renderDefault(props)}</Box>
    </Stack>
  );
}
