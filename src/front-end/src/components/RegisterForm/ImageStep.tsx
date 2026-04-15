// components/CompanyImageStep/CompanyImageStep.tsx
"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import { Button } from "@components/Button/Button";
import { Fab } from "@components/Fab/Fab";
import { Text } from "@components/Text/Text";
import { LoadingSpinner } from "@components/LoadingSpinner/LoadingSpinner";
import { ButtonContainer } from "./style";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useFormContext } from "react-hook-form";

export function CompanyImageStep({
  onBack,
}: {
  onBack: () => void;
}) {
  const { formState } = useFormContext();
  const { imageUri, uploading, error, inputRef, openFilePicker, handleFileChange } =
    useImageUpload("logo");

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <Box
        sx={{
          width: "100%",
          height: 200,
          border: "2px dashed",
          borderColor: imageUri ? "primary.main" : "grey.400",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {uploading ? (
          <LoadingSpinner size={32} />
        ) : imageUri ? (
          <Image
            src={imageUri}
            alt="Preview da logo"
            fill
            style={{ objectFit: "contain" }}
          />
        ) : (
          <Text variant="body2" color="text.secondary">
            Nenhuma imagem selecionada
          </Text>
        )}
      </Box>

      {error && (
        <Text variant="caption" color="error">
          {error}
        </Text>
      )}

      <Button
        type="button"
        fullWidth
        icon="image"
        onClick={openFilePicker}
        disabled={uploading}
      >
        {imageUri ? "Trocar Logo" : "Adicionar Logo"}
      </Button>

      <ButtonContainer>
        <Fab icon="arrow-left" onClick={onBack} type="button" />
      </ButtonContainer>

      <Button
        type="submit"
        fullWidth
        loading={formState.isSubmitting}
        icon="check"
        style={{ marginTop: 8 }}
      >
        Cadastrar
      </Button>
    </Box>
  );
}