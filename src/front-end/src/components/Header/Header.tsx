"use client";

import { useTheme } from "@/hooks/useTheme";

import {
  AvatarContainer,
  ButtonsContainer,
  Container,
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

  const { logout } = useAuth();

  const { toggleTheme, theme } = useTheme();

  const isDark = theme === "dark";

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
      <AvatarContainer>
        <Icon size={16} name={"menu"} onClick={onOpenSidebar} />
      </AvatarContainer>
      <ButtonsContainer>
        <Icon
          size="16"
          name={isDark ? "moon-star" : "sun"}
          onClick={toggleTheme}
        />
        <Icon size="16" name={"log-out"} onClick={handleLogout} />
      </ButtonsContainer>
    </Container>
  );
}
