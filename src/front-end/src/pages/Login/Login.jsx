"use client";

import LoginForm from "./LoginForm";
import { Container } from "./style";
import { Text } from "@/components/Text/Text";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useFlashMessage } from "@/contexts/FlashMessageContext";

export default function Login() {
  const {showMessage} = useFlashMessage();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("logout") === "true") {
      showMessage("Logout realizado com sucesso!", "success");
    }
  }, []);

  return (
    <Container>
      <Box>
        <Text variant="h4" color="primary" fontWeight={600} sx={{ marginBottom: 4 }} align="center">
          Bem-vindo de volta.
        </Text>
        
        <Text variant="body1" color="textSecondary" mb={4} sx={{ marginBottom: 4 }}>
          Faça login para acessar seu painel de controle.
        </Text>
        <LoginForm />
      </Box>
      
    </Container>
  );
}
