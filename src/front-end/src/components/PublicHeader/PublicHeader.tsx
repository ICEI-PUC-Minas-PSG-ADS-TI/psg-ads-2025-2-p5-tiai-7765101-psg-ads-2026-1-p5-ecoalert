"use client";

import { Button } from "@/components/Button/Button";

import { useTheme } from "@/hooks/useTheme";

import { ButtonsContainer, Container } from "./style";
import { useLocation, useNavigate } from "react-router-dom";

export function PublicHeader() {
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isDark = theme === "dark";

  return (
    <Container>
      <ButtonsContainer>
        <Button
          variant="text"
          color="primary"
          shape="rounded"
          size="medium"
          icon={isDark ? "moon" : "sun"}
          onClick={toggleTheme}
        />
        <Button onClick={() => navigate(pathname === "/login" ? "/cadastro" : "/login")} shape="square">
          {pathname === "/login" ? "Cadastre-se" : "Entrar"}
        </Button>
      </ButtonsContainer>
    </Container>
  );
}
