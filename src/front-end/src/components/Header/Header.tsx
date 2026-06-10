"use client";

import { useTheme } from "@/hooks/useTheme";
import { Badge, Tooltip } from "@mui/material";

import {
  BrandContainer,
  BrandName,
  ButtonsContainer,
  Container,
  HeaderIconButton,
  LogoMark,
  MenuButton,
  UserAvatar,
} from "./style";
import { useAuth } from "@/hooks/useAuth";
import { FlashMessage } from "@/components/FlashMessage/FlashMessage";
import { useState } from "react";
import { IFlashMessage } from "@/types/Interfaces";
import { Icon } from "@/components/Icon/Icon";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const [snackBar, setSnackBar] = useState<IFlashMessage>({
    open: false,
    message: "",
    severity: undefined,
  });

  const { logout, user } = useAuth();

  const { toggleTheme, theme } = useTheme();

  const isDark = theme === "dark";
  const initials =
    `${user?.name?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() ||
    "JD";

  async function handleLogout() {
    try {
      await logout();
      setSnackBar({
        open: true,
        message: "Logout realizado com sucesso!",
        severity: "success",
      });
    } catch (error) {
      setSnackBar({
        open: true,
        message: "Erro ao deslogar",
        severity: "error",
      });
    }
  }

  return (
    <Container>
      <FlashMessage
        message={snackBar.message}
        open={snackBar.open}
        onClose={() => setSnackBar((prev) => ({ ...prev, open: false }))}
      />
      <BrandContainer>
        <MenuButton aria-label="Abrir menu" onClick={onOpenSidebar}>
          <Icon size={18} name={"menu"} />
        </MenuButton>
        <LogoMark>
          <Icon size={24} name={"cloud-rain"} />
        </LogoMark>
        <BrandName>Nimbly</BrandName>
      </BrandContainer>
      <ButtonsContainer>
        <Tooltip title={isDark ? "Tema claro" : "Tema escuro"}>
          <HeaderIconButton aria-label="Alternar tema" onClick={toggleTheme}>
            <Icon size={17} name={isDark ? "moon-star" : "sun"} />
          </HeaderIconButton>
        </Tooltip>
        <Tooltip title="Notificações">
          <HeaderIconButton aria-label="Notificações">
            <Badge
              variant="dot"
              color="error"
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Icon size={17} name={"bell"} />
            </Badge>
          </HeaderIconButton>
        </Tooltip>
        <Tooltip title="Conta">
          <HeaderIconButton aria-label="Conta">
            <Icon size={24} name={"user"} />
          </HeaderIconButton>
        </Tooltip>
        <Tooltip title="Sair">
          <HeaderIconButton aria-label="Sair" onClick={handleLogout}>
            <Icon size={24} name={"log-out"} />
          </HeaderIconButton>
        </Tooltip>
      </ButtonsContainer>
    </Container>
  );
}
