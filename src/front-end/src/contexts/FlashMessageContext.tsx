"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { FlashMessage } from "@/components/FlashMessage/FlashMessage";

export type FlashMessageSeverity = "success" | "error" | "warning" | "info";

interface FlashMessageProps {
  showMessage: (message: string, severity?: FlashMessageSeverity) => void;
}

interface FlashMessageState {
  open: boolean;
  message: string;
  severity?: FlashMessageSeverity;
}

const FlashMessageContext = createContext<FlashMessageProps>(
  {} as FlashMessageProps
);

export function FlashMessageProvider({ children }: { children: ReactNode }) {
  const [flashMessage, setFlashMessage] = useState<FlashMessageState>({
    open: false,
    message: "",
    severity: undefined,
  });

  function showMessage(message: string, severity: FlashMessageSeverity = "info") {
    setFlashMessage({
      open: true,
      message,
      severity,
    });
  }

  function handleClose() {
    setFlashMessage((prev) => ({ ...prev, open: false }));
  }

  return (
    <FlashMessageContext.Provider value={{ showMessage }}>
      {children}

      <FlashMessage
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={flashMessage.open}
        message={flashMessage.message}
        alertProps={{severity: flashMessage.severity}}
        onClose={handleClose}
        autoHideDuration={3000}
      />
    </FlashMessageContext.Provider>
  );
}

export function useFlashMessage() {
  return useContext(FlashMessageContext);
}