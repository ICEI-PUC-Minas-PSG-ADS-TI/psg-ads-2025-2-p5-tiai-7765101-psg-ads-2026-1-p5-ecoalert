"use client";

import LoginForm from "./LoginForm";
import { Container } from "./style";
import { Button } from "@/components/Button/Button";
import { Text } from "@/components/Text/Text";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFlashMessage } from "@/contexts/FlashMessageContext";

export default function Login() {
  const {showMessage} = useFlashMessage();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("logout") === "true") {
      showMessage("Logout realizado com sucesso!", "success");
    }
  }, []);

  return (
    <Container>
      <Box sx={{ width: "80%", maxWidth: 600 }}>
        <Text variant="h4" color="primary" fontWeight={600} sx={{ marginBottom: 4 }} align="center">
          Bem-vindo de volta.
        </Text>
        
        <Text variant="body1" color="textSecondary" mb={4} sx={{ marginBottom: 4 }} align="center">
          Faça login para acessar seu painel de controle.
        </Text>
        <LoginForm />

        <Box sx={{ mt: 3 }}>
          <Button
            type="button"
            variant="text"
            color="primary"
            fullWidth
            icon="arrow-right"
            onClick={() => navigate("/cadastro")}
          >
            Não tem uma conta? Cadastre-se
          </Button>
        </Box>
      </Box>
      
    </Container>
  );
}
