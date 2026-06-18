import { RHFInput } from "@/components/RHFInput/RHFInput";
import { useFormContext } from "react-hook-form";
import { ButtonContainer, FieldRow } from "./style";
import { useState } from "react";
import { Fab } from "@/components/Fab/Fab";
import { maskCpf, maskDdd, maskPhoneNumber } from "@/utils/formatter";

export function PersonalStep({ onNext }: { onNext: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const { trigger } = useFormContext();

  async function handleNext() {
    const valid = await trigger([
      "name",
      "lastName",
      "email",
      "cpf",
      "phone.ddd",
      "phone.number",
      "password",
    ]);

    if (valid) onNext();
  }

  return (
    <>
      <RHFInput name="name" label="Nome" />
      <RHFInput name="lastName" label="Sobrenome" />
      <RHFInput name="email" label="E-mail" type="email" />
      <RHFInput name="cpf" label="CPF" mask={maskCpf} />
      <FieldRow>
        <RHFInput name="phone.ddd" label="DDD" mask={maskDdd} />
        <RHFInput name="phone.number" label="Telefone" mask={maskPhoneNumber} />
      </FieldRow>
      <RHFInput
        name="password"
        label="Senha"
        type={showPassword ? "text" : "password"}
        secure
        endIcon={showPassword ? "eye-off" : "eye"}
        onEndIconClick={() => setShowPassword(!showPassword)}
      />

      <ButtonContainer>
        <Fab icon="arrow-right" onClick={handleNext} />
      </ButtonContainer>
    </>
  );
}
