"use client";

import { CreateUserFormData, createUserSchema } from "@/types/Schemes";
import { useForm } from "react-hook-form";
import { PersonalStep } from "./PersonalStep";
import { AddressStep } from "./AddressStep";
import { ApiError } from "@/types/Error";
import { createUser } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";
import { useFlashMessage } from "@/contexts/FlashMessageContext";
import { MultiStepForm } from "@/components/MultStepForm/MultStepForm";

export function RegisterForm() {
  const methods = useForm<CreateUserFormData>({
    mode: "onChange",
  });

  const { showMessage } = useFlashMessage();
  const { login } = useAuth();

  const handleRegistration = async (data: CreateUserFormData) => {
    try {
      const response = await createUser(data);
      if (response.status === 201) {
        showMessage("Usuário criado com sucesso!", "success");
        await login(data.email, data.password);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        showMessage(`Erro ao criar usuário: ${error.message}`, "error");
      }
    }
  };

  const formSteps = [PersonalStep, AddressStep];

  return (
    <MultiStepForm
      methods={methods}
      onSubmit={handleRegistration}
      steps={formSteps}
    />
  );
}
