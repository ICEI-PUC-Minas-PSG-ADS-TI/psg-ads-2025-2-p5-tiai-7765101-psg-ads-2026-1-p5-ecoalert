"use client";

import { FormEvent, useState } from "react";
import { Box } from "@mui/material";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/types/Error";
import { Text } from "@/components/Text/Text";
import { useFlashMessage } from "@/contexts/FlashMessageContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [defaultError, setDefaultError] = useState("");

  
  const navigate = useNavigate();
  const { login, loadingAuth } = useAuth();
  const { showMessage } = useFlashMessage();


  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      const newErrors: typeof errors = {};

      if (!email) {
        newErrors.email = "Informe seu e-mail";
      }

      if (!password) {
        newErrors.password = "Informe sua senha";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        await login(email, password);
      }

    showMessage("Bem vindo ao EcoAlert!", "success")
    console.log("Login ok! Tentando redirecionar...");
    navigate('/home')

    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setDefaultError(error.message || "Credenciais inválidas");
          showMessage(
            "Credenciais inválidas. Por favor, tente novamente.",
            "error",
          );
        }

        if (error.status === 404) {
          setErrors({ email: "Este e-mail não está cadastrado" });
          showMessage(
            "Este e-mail não está cadastrado. Por favor, verifique e tente novamente.",
            "error",
          );
        }
      }
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: "600px",
        width: "100%",
      }}
    >
      <Input
        label="E-mail"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        endIcon="mail"
      />

      <Input
        label="Senha"
        type={showPassword ? "text" : "password"}
        secure={showPassword}
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        endIcon={showPassword ? "eye-off" : "eye"}
        onEndIconClick={() => setShowPassword(!showPassword)}
      />

      <Text variant="body2" color="error.main">
        {defaultError}
      </Text>

      <Button
        type="submit"
        variant="filled"
        color="primary"
        fullWidth
        shape="rounded"
        icon="arrow-right"
        loading={loadingAuth}
      >
        Entrar
      </Button>
    </Box>
  );
}
