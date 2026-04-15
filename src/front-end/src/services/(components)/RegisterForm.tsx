"use client";

import { CreateUserFormData, createUserSchema } from "@/types/Schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useForm } from "react-hook-form";
import { PersonalStep } from "./PersonalStep";
import { AddressStep } from "./AddressStep";
import { CompanyStep } from "./CompanyStep";
import { ApiError } from "@/types/Error";
import { createUser } from "@/services/user.service";
import { useAuth } from "@hooks/useAuth";
import { useFlashMessage } from "@contexts/FlashMessageContext";
import { MultiStepForm } from "@components/MultStepForm/MultStepForm";
import { CompanyImageStep } from "./ImageStep";

export function RegisterForm() {
  const methods = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    mode: "onChange",
  });

  const { showMessage } = useFlashMessage();
  const { trigger } = methods;
  const { login } = useAuth();

  const handleRegistration = async (data: CreateUserFormData) => {
    const valid = await trigger(["socialName", "instagram"]);
    
    if (!valid) return;

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

  const formSteps = [PersonalStep, AddressStep, CompanyStep, CompanyImageStep];

  return (
    <MultiStepForm
      methods={methods}
      onSubmit={handleRegistration}
      steps={formSteps}
    />
  );
}
