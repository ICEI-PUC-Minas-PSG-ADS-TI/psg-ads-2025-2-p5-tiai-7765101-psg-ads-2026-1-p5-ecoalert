"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/Input/Input";
import { Container } from "./style";

interface RHFInputProps {
  name: string;
  label?: string;
  type?: string;
  mask?: (value: string) => string;
  secure?: boolean;
  endIcon?: any;
  onEndIconClick?: () => void;
  onBlur?: (value: string) => void | Promise<void>;
}

function getFieldError(errors: any, name: string) {
  return name
    .split(".")
    .reduce((current, key) => current?.[key], errors);
}

export function RHFInput({
  name,
  label,
  type,
  mask,
  secure,
  endIcon,
  onEndIconClick,
  onBlur
}: RHFInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = getFieldError(errors, name);

  return (
    <Container>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label={label}
            type={type}
            secure={secure}
            endIcon={endIcon}
            onEndIconClick={onEndIconClick}
            onBlur={async e => {
              field.onBlur();
              if (onBlur) {
                const value = mask
                  ? mask(e.target.value).replace(/\D/g, "")
                  : e.target.value;

                await onBlur(value);
              }
            }}
            value={mask ? mask(field.value ?? "") : field.value ?? ""}
            onChange={e => {
              const value = mask
                ? mask(e.target.value).replace(/\D/g, "")
                : e.target.value;

              field.onChange(value);
            }}
            error={!!fieldError}
            helperText={fieldError?.message}
          />
        )}
      />
    </Container>
  );
}
