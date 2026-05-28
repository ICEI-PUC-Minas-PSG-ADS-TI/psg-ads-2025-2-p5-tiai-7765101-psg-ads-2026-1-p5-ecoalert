"use client";

import { Button } from "@/components/Button/Button";

import { useTheme } from "@/hooks/useTheme";
import { Icon } from "@/components/Icon/Icon";
import { Text } from "@/components/Text/Text";

import {
  BrandContainer,
  ButtonsContainer,
  Container,
  HeaderLink,
  LogoMark,
  NavLinks,
} from "./style";
import { useLocation, useNavigate } from "react-router-dom";

export function PublicHeader() {
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isDark = theme === "dark";
  const isLogin = pathname === "/login";
  const isCadastro = pathname === "/cadastro";

  return (
    <Container>
      <BrandContainer onClick={() => navigate("/")}>
        <LogoMark>
          <Icon name="cloud-rain" size={24} />
        </LogoMark>
        <Text variant="h6" weight={800} sx={{ lineHeight: 1 }}>
          Nimbly
        </Text>
      </BrandContainer>

      <NavLinks>
        <HeaderLink href="/#recursos">Recursos</HeaderLink>
        <HeaderLink href="/#impacto">Impacto</HeaderLink>
      </NavLinks>

      <ButtonsContainer>
        <Button
          variant="text"
          color="primary"
          shape="rounded"
          size="medium"
          icon={isDark ? "moon" : "sun"}
          onClick={toggleTheme}
        />
        {!isLogin && !isCadastro && (
          <Button
            onClick={() => navigate("/login")}
            shape="rounded"
            variant={pathname === "/" ? "outline" : "filled"}
          >
            Entrar
          </Button>
        )}
        <Button
          onClick={() =>
            navigate(isLogin ? "/cadastro" : isCadastro ? "/login" : "/cadastro")
          }
          shape="rounded"
        >
          {isLogin ? "Cadastre-se" : isCadastro ? "Entrar" : "Criar conta"}
        </Button>
      </ButtonsContainer>
    </Container>
  );
}
