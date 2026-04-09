"use client";

import { IconName } from "lucide-react/dynamic";
import { StyledTextField } from "./style";
import { IconButton, InputAdornment } from "@mui/material";
import { Icon } from "@/components/Icon/Icon";

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  type?: string;
  disabled?: boolean;
  name?: string;
  secure?: boolean;
  endIcon?: IconName;
  onEndIconClick?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function Input({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error = false,
  helperText,
  type = "text",
  disabled = false,
  name,
  endIcon,
  onEndIconClick,
  secure = false,
}: InputProps) {
  return (
    <StyledTextField
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      type={type}
      disabled={disabled}
      name={name}
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      fullWidth={secure}
      InputProps={{
        endAdornment: endIcon ? (
          <InputAdornment position="end">
            <IconButton
              onClick={onEndIconClick}
              edge="end"
              disabled={disabled}
            >
              <Icon name={endIcon} size={16} />
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
    />
  );
}