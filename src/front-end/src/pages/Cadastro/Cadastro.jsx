import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/Button/Button";
import { RegisterForm } from "@/components/RegisterForm/RegisterForm";
import { Text } from "@/components/Text/Text";

export default function Cadastro() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "calc(100dvh - 72px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 4,
      }}
    >
      <Box
        sx={{
          width: "80%",
          maxWidth: 720,
        }}
      >
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Text
            variant="h4"
            color="primary"
            fontWeight={700}
            sx={{ mb: 1 }}
          >
            Crie sua conta
          </Text>

          <Text
            variant="body1"
            color="textSecondary"
            sx={{ maxWidth: 520, mx: "auto" }}
          >
            Informe seus dados para acompanhar alertas e acessar seu painel de
            monitoramento.
          </Text>
        </Box>

        <RegisterForm />

        <Box sx={{ mt: 3 }}>
          <Button
            type="button"
            variant="text"
            color="primary"
            fullWidth
            icon="arrow-right"
            onClick={() => navigate("/login")}
          >
            Já tem uma conta? Faça login
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
